import Anthropic from '@anthropic-ai/sdk'
import { writeRunLog } from './run-log.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const RETRY_DELAYS = [1000, 2000, 4000]

export async function callAgent(
  agentName: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens = 4096,
): Promise<string> {
  console.log(`[${agentName}] Running...`)
  const start = Date.now()

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      })

      const text = response.content
        .filter(b => b.type === 'text')
        .map(b => (b as { type: 'text'; text: string }).text)
        .join('')

      const duration = Date.now() - start
      console.log(
        `[${agentName}] Done (${duration}ms, ${response.usage.input_tokens}in + ${response.usage.output_tokens}out tokens)`,
      )
      await writeRunLog({
        agent: agentName,
        success: true,
        duration,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      })
      return text
    } catch (err) {
      if (attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt]
        console.warn(`[${agentName}] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
        await new Promise(r => setTimeout(r, delay))
      } else {
        await writeRunLog({ agent: agentName, success: false, error: String(err) })
        throw err
      }
    }
  }

  throw new Error('unreachable')
}

export async function callAgentWithJsonRetry<T>(
  agentName: string,
  systemPrompt: string,
  userMessage: string,
  maxAttempts = 3,
  maxTokens = 4096,
): Promise<T> {
  let lastError = ''

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const message =
      attempt > 0
        ? `${userMessage}\n\nYour previous response failed JSON parsing: ${lastError}\nRespond with valid JSON only — no markdown fences, no prose.`
        : userMessage

    const raw = await callAgent(agentName, systemPrompt, message, maxTokens)
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

    try {
      return JSON.parse(cleaned) as T
    } catch (err) {
      lastError = `${String(err)} — got: ${cleaned.slice(0, 300)}`
      if (attempt < maxAttempts - 1) {
        console.warn(`[${agentName}] JSON parse failed (attempt ${attempt + 1}), retrying with error context...`)
      }
    }
  }

  throw new Error(`[${agentName}] Failed to get valid JSON after ${maxAttempts} attempts. Last error: ${lastError}`)
}
