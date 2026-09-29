 const express = require('express')
const User = require('../../Database/models/User')

const router = express.Router()

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please fill in all fields.'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists.'
      })
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password
    })

    await newUser.save()

    res.status(201).json({
      message: 'Account created successfully!'
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message })
  }
})

// Update user role
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'admin', 'root'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    // A check to prevent changing the role of a root user could go here
    // Or validating that the requester is a root admin (this is basic for now)
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password')

    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message })
  }
})

// Get user's bookmarks
router.get('/:id/bookmarks', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('bookmarks')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.bookmarks)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks', error: error.message })
  }
})

// Add bookmark
router.post('/:id/bookmarks', async (req, res) => {
  try {
    const { paperId } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    if (!user.bookmarks.includes(paperId)) {
      user.bookmarks.push(paperId)
      await user.save()
    }
    
    await user.populate('bookmarks')
    res.json(user.bookmarks)
  } catch (error) {
    res.status(500).json({ message: 'Error adding bookmark', error: error.message })
  }
})

// Remove bookmark
router.delete('/:id/bookmarks/:paperId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== req.params.paperId)
    await user.save()
    
    await user.populate('bookmarks')
    res.json(user.bookmarks)
  } catch (error) {
    res.status(500).json({ message: 'Error removing bookmark', error: error.message })
  }
})

module.exports = router