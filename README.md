# Agent Accessibility Analyzer

A small API experiment that asks an LLM to describe how approachable a named tool might be for non-technical users.

The response contains a score, strengths, barriers, and one suggested improvement. **It is a model-generated opinion based on a tool name, not a website inspection, WCAG audit, or validated accessibility measure.**

## API

```http
GET /api/analyze?tool=Example%20Tool
```

Example response shape:

```json
{
  "tool": "Example Tool",
  "analysis": "Score: … What works: … Main barriers: … Suggestion: …"
}
```

`api/analyze.js` calls OpenAI's chat-completions endpoint with `gpt-4o-mini`. It does not fetch or inspect the named tool. Missing input returns `400`; missing server configuration returns `500`; an upstream API failure returns `502`.

## Local development

Use Node.js 22 LTS and the Vercel CLI. Set `OPENAI_API_KEY` in your local environment or private Vercel environment settings, then run `vercel dev` from this repository. Never commit a real key. Requests that reach the model may incur API charges.

## Scope and next steps

This repository contains a serverless function and deployment configuration, not a frontend. Before operating it as an unrestricted public service, add authentication, rate limiting, and stricter input validation. A substantive evaluation would also need actual interface evidence, a defined rubric, and human review.
