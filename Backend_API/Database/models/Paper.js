const mongoose = require('mongoose')

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: Number, required: true },
  publicationDate: { type: String },
  abstract: { type: String, required: true },
  keywords: [{ type: String }],
  journal: { type: String },
  conference: { type: String },
  doi: { type: String },
  publisher: { type: String },
  sourceUrl: { type: String },
  pdfUrl: { type: String },
  methodology: { type: String },
  findings: { type: String },
  limitations: { type: String },
  verificationStatus: { type: String, default: 'demo' }
}, {
  timestamps: true
})

module.exports = mongoose.model('Paper', paperSchema)
