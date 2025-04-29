const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Intern = require('../models/Intern');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().select('-__v');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .select('-__v')
      .populate('assignedInterns', 'name role department email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    // Ensure dates are valid
    if (req.body.startDate) {
      req.body.startDate = new Date(req.body.startDate);
    }
    
    if (req.body.endDate) {
      req.body.endDate = new Date(req.body.endDate);
    }
    
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    // Ensure dates are valid
    if (req.body.startDate) {
      req.body.startDate = new Date(req.body.startDate);
    }
    
    if (req.body.endDate) {
      req.body.endDate = new Date(req.body.endDate);
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // First, remove this project from any assigned interns
    if (project.assignedInterns && project.assignedInterns.length > 0) {
      await Intern.updateMany(
        { _id: { $in: project.assignedInterns } },
        { $pull: { assignedProjects: req.params.id } }
      );
    }
    
    // Then delete the project
    await Project.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

// Assign intern to project
router.post('/:id/assign/:internId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const intern = await Intern.findById(req.params.internId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    
    // Check if intern is already assigned to this project
    if (project.assignedInterns.includes(req.params.internId)) {
      return res.status(400).json({ message: 'Intern is already assigned to this project' });
    }
    
    // Update project with new intern
    await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedInterns: req.params.internId } }
    );
    
    // Update intern with new project
    await Intern.findByIdAndUpdate(
      req.params.internId,
      { $addToSet: { assignedProjects: req.params.id } }
    );
    
    res.status(200).json({ message: 'Intern assigned to project successfully' });
  } catch (error) {
    console.error('Error assigning intern to project:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Failed to assign intern to project', error: error.message });
  }
});

// Remove intern from project
router.delete('/:id/assign/:internId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const intern = await Intern.findById(req.params.internId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    
    // Check if intern is assigned to this project
    if (!project.assignedInterns.includes(req.params.internId)) {
      return res.status(400).json({ message: 'Intern is not assigned to this project' });
    }
    
    // Remove intern from project
    await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { assignedInterns: req.params.internId } }
    );
    
    // Remove project from intern
    await Intern.findByIdAndUpdate(
      req.params.internId,
      { $pull: { assignedProjects: req.params.id } }
    );
    
    res.status(200).json({ message: 'Intern removed from project successfully' });
  } catch (error) {
    console.error('Error removing intern from project:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Failed to remove intern from project', error: error.message });
  }
});

module.exports = router;