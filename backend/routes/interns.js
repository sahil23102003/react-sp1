const express = require('express');
const router = express.Router();
const Intern = require('../models/Intern');
const Project = require('../models/Project');

// Get all interns
router.get('/', async (req, res) => {
  try {
    const interns = await Intern.find().select('-__v');
    res.status(200).json(interns);
  } catch (error) {
    console.error('Error fetching interns:', error);
    res.status(500).json({ message: 'Failed to fetch interns', error: error.message });
  }
});

// Get intern by ID
router.get('/:id', async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('-__v');
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    
    res.status(200).json(intern);
  } catch (error) {
    console.error('Error fetching intern by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid intern ID format' });
    }
    res.status(500).json({ message: 'Failed to fetch intern', error: error.message });
  }
});

// Create new intern
router.post('/', async (req, res) => {
  try {
    // Ensure joinDate is a valid date
    if (req.body.joinDate) {
      req.body.joinDate = new Date(req.body.joinDate);
    }
    
    // Ensure endDate is a valid date if present
    if (req.body.endDate) {
      req.body.endDate = new Date(req.body.endDate);
    }
    
    const newIntern = new Intern(req.body);
    const savedIntern = await newIntern.save();
    
    res.status(201).json(savedIntern);
  } catch (error) {
    console.error('Error creating intern:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create intern', error: error.message });
  }
});

// Update intern
router.put('/:id', async (req, res) => {
  try {
    // Ensure joinDate is a valid date
    if (req.body.joinDate) {
      req.body.joinDate = new Date(req.body.joinDate);
    }
    
    // Ensure endDate is a valid date if present
    if (req.body.endDate) {
      req.body.endDate = new Date(req.body.endDate);
    }
    
    const intern = await Intern.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    
    res.status(200).json(intern);
  } catch (error) {
    console.error('Error updating intern:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid intern ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update intern', error: error.message });
  }
});

// Delete intern
router.delete('/:id', async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    
    // First, remove this intern from any assigned projects
    if (intern.assignedProjects && intern.assignedProjects.length > 0) {
      await Project.updateMany(
        { _id: { $in: intern.assignedProjects } },
        { $pull: { assignedInterns: req.params.id } }
      );
    }
    
    // Then delete the intern
    await Intern.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Intern deleted successfully' });
  } catch (error) {
    console.error('Error deleting intern:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid intern ID format' });
    }
    res.status(500).json({ message: 'Failed to delete intern', error: error.message });
  }
});

// Add tech stack to intern
router.post('/:id/techstacks', async (req, res) => {
  try {
    const { techStacks } = req.body;
    
    if (!techStacks || !Array.isArray(techStacks)) {
      return res.status(400).json({ message: 'Tech stacks must be an array' });
    }
    
    const intern = await Intern.findByIdAndUpdate(
      req.params.id,
      { $set: { techStacks: techStacks } },
      { new: true, runValidators: true }
    );
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    
    res.status(200).json(intern);
  } catch (error) {
    console.error('Error updating tech stacks:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid intern ID format' });
    }
    res.status(500).json({ message: 'Failed to update tech stacks', error: error.message });
  }
});

module.exports = router;