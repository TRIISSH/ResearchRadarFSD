const { GoogleGenAI } = require('@google/genai')

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MISSING_API_KEY'
})

exports.summarizePaper = async (paper) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.')
  }

  const prompt = `Please provide a concise, high-level summary of the following research paper. Focus on the core problem, the proposed solution, and the key results.
  
Title: ${paper.title}
Authors: ${paper.authors}
Category: ${paper.category}
Abstract: ${paper.abstract}`

  const interaction = await client.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt
  })
  
  return interaction.output_text
}
