export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { tool } = req.query;

  if (!tool || !tool.trim()) {
    return res.status(400).json({ error: 'Missing required parameter: tool' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
  }

  const prompt = `You are an accessibility expert. Analyze the tool "${tool}" for non-technical everyday users.

Respond in this exact format:
Score: X/10. What works: [brief strengths]. Main barriers: [brief barriers]. Suggestion: [one concrete improvement].

Keep the total response under 100 words.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://agent-accessibility-analyzer.vercel.app',
        'X-Title': 'Agent Accessibility Analyzer'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', response.status, err);
      return res.status(502).json({ error: 'OpenRouter API error', detail: response.status });
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content?.trim() || 'Analysis unavailable';

    return res.status(200).json({ tool, analysis });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
