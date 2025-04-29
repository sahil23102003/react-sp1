const mongoose = require('mongoose');
const Intern = require('./models/Intern');
const Project = require('./models/Project');
require('dotenv').config();

// Initial data for interns
const interns = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer Intern",
    department: "Engineering",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    funFact: "Can solve a Rubik's cube in under a minute!",
    joinDate: new Date('2024-01-15'),
    endDate: new Date('2024-07-15'),
    status: "active",
    university: "Stanford University",
    degree: "Computer Science",
    techStacks: [
      "JavaScript",
      "React",
      "Node.js",
      "HTML/CSS"
    ],
    performance: {
      rating: "4.7",
      sprints: 6,
      projects: [
        {
          id: 1,
          name: "Company Website Redesign",
          description: "Helped implement responsive design components for the company website",
          status: "in-progress"
        },
        {
          id: 2,
          name: "Internal Dashboard",
          description: "Created data visualization components for the internal dashboard",
          status: "completed"
        }
      ],
      courses: [
        {
          id: 1,
          name: "Advanced React Patterns",
          status: "Completed"
        },
        {
          id: 2,
          name: "State Management with Redux",
          status: "In Progress"
        }
      ]
    }
  },
  {
    name: "Samantha Lee",
    role: "UI/UX Design Intern",
    department: "Design",
    email: "samantha.lee@example.com",
    phone: "+1 (555) 987-6543",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    funFact: "Speaks four languages fluently!",
    joinDate: new Date('2024-02-03'),
    endDate: new Date('2024-08-03'),
    status: "active",
    university: "Rhode Island School of Design",
    degree: "Graphic Design",
    techStacks: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "HTML/CSS"
    ],
    performance: {
      rating: "4.9",
      sprints: 5,
      projects: [
        {
          id: 1,
          name: "Mobile App UX Improvement",
          description: "Redesigned the user flow for the mobile application",
          status: "in-progress"
        },
        {
          id: 2,
          name: "Design System",
          description: "Contributed to the company-wide design system",
          status: "completed"
        }
      ],
      courses: [
        {
          id: 1,
          name: "User Research Methods",
          status: "Completed"
        },
        {
          id: 2,
          name: "UI Animation Fundamentals",
          status: "Completed"
        }
      ]
    }
  },
  {
    name: "Sahil Kumar",
    role: "Backend Developer",
    department: "Engineering",
    email: "sahil.22110647@viit.ac.in",
    phone: "8459495467",
    imageUrl: "https://randomuser.me/api/portraits/men/42.jpg",
    funFact: "National chess champion in college!",
    joinDate: new Date('2025-04-23'),
    endDate: new Date('2025-10-23'),
    techStacks: [
      "Spring Boot",
      "Java",
      "MongoDB"
    ],
    performance: {
      rating: "4.0",
      sprints: 1,
      projects: [],
      courses: []
    }
  }
];

// Initial data for projects
const projects = [
  {
    name: "GymManagement",
    description: "A comprehensive gym management system for tracking memberships, equipment, and classes.",
    startDate: new Date('2025-04-23'),
    endDate: new Date('2025-04-27'),
    requiredPeople: 1,
    techStacks: [
      "Spring Boot",
      "Flask"
    ]
  },
  {
    name: "Company Website Redesign",
    description: "Revamp the company website with modern design and improved responsiveness",
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-05-30'),
    requiredPeople: 3,
    techStacks: [
      "React",
      "Tailwind CSS",
      "Node.js"
    ]
  },
  {
    name: "Internal Analytics Dashboard",
    description: "Build an internal dashboard for analyzing company data and metrics",
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-07-15'),
    requiredPeople: 2,
    techStacks: [
      "React",
      "D3.js",
      "Express"
    ]
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing data
      await Intern.deleteMany({});
      await Project.deleteMany({});
      console.log('Cleared existing data');
      
      // Insert interns
      const createdInterns = await Intern.insertMany(interns);
      console.log(`${createdInterns.length} interns inserted`);
      
      // Get intern IDs for assignments
      const sahilId = createdInterns.find(intern => intern.email === 'sahil.22110647@viit.ac.in')._id;
      const alexId = createdInterns.find(intern => intern.email === 'alex.johnson@example.com')._id;
      
      // Add intern IDs to projects
      projects[0].assignedInterns = [sahilId]; // Assign Sahil to GymManagement
      projects[1].assignedInterns = [alexId]; // Assign Alex to Website Redesign
      
      // Insert projects
      const createdProjects = await Project.insertMany(projects);
      console.log(`${createdProjects.length} projects inserted`);
      
      // Get project IDs
      const gymProjectId = createdProjects.find(project => project.name === 'GymManagement')._id;
      const websiteProjectId = createdProjects.find(project => project.name === 'Company Website Redesign')._id;
      
      // Update interns with project assignments
      await Intern.findByIdAndUpdate(
        sahilId,
        { $set: { assignedProjects: [gymProjectId] } }
      );
      
      await Intern.findByIdAndUpdate(
        alexId,
        { $set: { assignedProjects: [websiteProjectId] } }
      );
      
      console.log('Projects and interns linked successfully');
      
      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });