export default async function handler(req, res) {
  const { tool } = req.query;
  if (!tool) return res.json({ error: "No tool specified" });
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{
        role: "user",
        content: `Rate the accessibility of "${tool}" for non-technical users on a scale of 1-10. Give: 1) Score 2) What works well 3) Main barriers 4) One improvement. Be concise.`
      }]
    })
  });
  
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "Analysis failed";
  res.json({ tool, analysis: text });
}
