const mongoose = require('mongoose')
require('dotenv').config()
const Paper = require('../models/Paper')

const defaultPapers = [
  {
    title: 'Artificial Intelligence in Modern Healthcare',
    authors: 'John Smith, Sarah Johnson',
    category: 'Artificial Intelligence',
    year: 2026,
    abstract: 'This research explores the application of artificial intelligence in healthcare and its impact on modern medical systems.',
    verificationStatus: 'demo'
  },
  {
    title: 'Machine Learning for Predictive Analysis',
    authors: 'David Wilson, Emily Brown',
    category: 'Machine Learning',
    year: 2025,
    abstract: 'An overview of machine learning techniques used for predictive analysis and decision-making systems.',
    verificationStatus: 'demo'
  },
  {
    title: 'Phishing Detection Using Machine Learning',
    authors: 'Michael Lee, Anna Davis',
    category: 'Cybersecurity',
    year: 2024,
    abstract: 'A study of machine learning techniques for identifying phishing websites and malicious online activities.',
    verificationStatus: 'demo'
  }
]

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected for seeding')
    
    // Simple seed mechanism: check if they exist by title
    for (const paper of defaultPapers) {
      const exists = await Paper.findOne({ title: paper.title })
      if (!exists) {
        await Paper.create(paper)
        console.log(`Seeded: ${paper.title}`)
      } else {
        console.log(`Already exists: ${paper.title}`)
      }
    }
    
    console.log('Seeding complete')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
