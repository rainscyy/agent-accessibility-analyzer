export default async function handler(req, res) {
  const { tool } = req.query;
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.json({ error: "No API key found", tool });
  }
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Rate accessibility of "${tool}" for non-technical users in 3 sentences.` }] }]
      })
    }
  );
  
  const data = await response.json();
  return res.json({ 
    tool, 
    key_exists: !!apiKey,
    raw: data 
  });
}
