export default async function handler(req, res) {
  const { tool } = req.query;
  if (!tool) return res.json({ error: "No tool specified" });
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Rate the accessibility of "${tool}" for non-technical users on a scale of 1-10. Give: 1) Score 2) What it does well 3) Main barriers for ordinary users 4) One improvement suggestion. Be concise.` }]
        }]
      })
    }
  );
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis failed";
  res.json({ tool, analysis: text });
}
