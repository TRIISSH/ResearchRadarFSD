const express = require('express')
const Paper = require('../../Database/models/Paper')
const aiService = require('../../AI_Integration/aiService')
const router = express.Router()

// GET /api/papers
router.get('/', async (req, res) => {
  try {
    const { search, category, year } = req.query
    const query = {}
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } }
      ]
    }
    if (category) {
      query.category = category
    }
    if (year) {
      query.year = parseInt(year)
    }

    const papers = await Paper.find(query).sort({ createdAt: -1 })
    res.json(papers)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching papers', error: error.message })
  }
})

// GET /api/papers/:id
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
    if (!paper) return res.status(404).json({ message: 'Paper not found' })
    res.json(paper)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching paper', error: error.message })
  }
})

// POST /api/papers/:id/summarize
router.post('/:id/summarize', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
    if (!paper) return res.status(404).json({ message: 'Paper not found' })

    const text = await aiService.summarizePaper(paper)
    res.json({ summary: text })
  } catch (error) {
    console.error("Gemini Error:", error)
    res.status(500).json({ message: `Error generating summary: ${error.message}` })
  }
})

// POST /api/papers
router.post('/', async (req, res) => {
  try {
    const paper = new Paper(req.body)
    await paper.save()
    res.status(201).json(paper)
  } catch (error) {
    res.status(400).json({ message: 'Error creating paper', error: error.message })
  }
})

// PUT /api/papers/:id
router.put('/:id', async (req, res) => {
  try {
    const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!paper) return res.status(404).json({ message: 'Paper not found' })
    res.json(paper)
  } catch (error) {
    res.status(400).json({ message: 'Error updating paper', error: error.message })
  }
})

// DELETE /api/papers/:id
router.delete('/:id', async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id)
    if (!paper) return res.status(404).json({ message: 'Paper not found' })
    res.json({ message: 'Paper deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting paper', error: error.message })
  }
})

module.exports = router
