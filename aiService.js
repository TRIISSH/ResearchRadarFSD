const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY')

exports.summarizePaper = async (paper) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.')
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" })
  
  const prompt = `Please provide a concise, high-level summary of the following research paper. Focus on the core problem, the proposed solution, and the key results.
  
Title: ${paper.title}
Authors: ${paper.authors}
Category: ${paper.category}
Abstract: ${paper.abstract}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}
