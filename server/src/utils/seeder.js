const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Student = require('../models/Student');
const Feedback = require('../models/Feedback');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedInitialData = async () => {
  try {
    console.log('🌱 Checking seed data requirements...');

    // 1. Check or create Admin User
    let admin = await User.findOne({ email: 'admin@campusvoice.edu' });
    if (!admin) {
      admin = await User.create({
        name: 'Dr. Sophia Vance (Dean)',
        email: 'admin@campusvoice.edu',
        password: 'AdminPassword123!',
        role: 'admin',
        rollNumber: 'ADMIN-01',
        branch: 'Academic Administration',
        semester: 'Faculty / Administration',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      });
      console.log('✅ Admin user created: admin@campusvoice.edu / AdminPassword123!');
    }

    // 2. Check or create Demo Student User
    let demoStudent = await User.findOne({ email: 'student@campusvoice.edu' });
    if (!demoStudent) {
      demoStudent = await User.create({
        name: 'Alex Chen',
        email: 'student@campusvoice.edu',
        password: 'StudentPassword123!',
        role: 'student',
        rollNumber: 'CS2024-042',
        branch: 'Computer Science',
        semester: 'Semester 6',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      console.log('✅ Demo student created: student@campusvoice.edu / StudentPassword123!');
    }

    // 3. Check if students directory already populated
    const studentCount = await Student.countDocuments();
    if (studentCount > 0) {
      console.log(`ℹ️  Student directory already has ${studentCount} records.`);
      return;
    }

    console.log('🌱 Populating initial student directory & feedback records...');

    const sampleStudents = [
      {
        name: 'Alex Chen',
        rollNumber: 'CS2024-042',
        email: 'alex.chen@campusvoice.edu',
        branch: 'Computer Science',
        semester: 'Semester 6',
        cgpa: 9.2,
        academicYear: '2024-2025',
        phone: '+1 (555) 234-5678',
        bio: 'Full-stack enthusiast, Hackathon winner, and open-source contributor.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        tags: ['Hackathon Winner', 'Full Stack', 'Class Representative']
      },
      {
        name: 'Priya Sharma',
        rollNumber: 'CS2024-089',
        email: 'priya.sharma@campusvoice.edu',
        branch: 'Computer Science',
        semester: 'Semester 6',
        cgpa: 9.5,
        academicYear: '2024-2025',
        phone: '+1 (555) 345-6789',
        bio: 'AI researcher focusing on computer vision and neural architecture search.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        tags: ['Dean\'s List', 'AI Lead', 'Peer Tutor']
      },
      {
        name: 'Marcus Brody',
        rollNumber: 'IT2024-015',
        email: 'marcus.brody@campusvoice.edu',
        branch: 'Information Technology',
        semester: 'Semester 4',
        cgpa: 8.7,
        academicYear: '2024-2025',
        phone: '+1 (555) 456-7890',
        bio: 'Cloud architecture & DevOps specialist. AWS Certified Solutions Architect.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        tags: ['DevOps', 'AWS Certified', 'Robotics Club']
      },
      {
        name: 'Elena Rostova',
        rollNumber: 'DS2024-033',
        email: 'elena.rostova@campusvoice.edu',
        branch: 'Data Science & AI',
        semester: 'Semester 6',
        cgpa: 9.1,
        academicYear: '2024-2025',
        phone: '+1 (555) 567-8901',
        bio: 'Data visualization artist & machine learning practitioner. Kaggle Master.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        tags: ['Kaggle Master', 'DataViz', 'Math Olympiad']
      },
      {
        name: 'David Kim',
        rollNumber: 'EE2024-071',
        email: 'david.kim@campusvoice.edu',
        branch: 'Electrical Engineering',
        semester: 'Semester 8',
        cgpa: 8.9,
        academicYear: '2024-2025',
        phone: '+1 (555) 678-9012',
        bio: 'Embedded systems engineer working on IoT sensors and drone avionics.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        tags: ['Embedded Systems', 'IoT', 'Hardware Lab']
      },
      {
        name: 'Nina Gupta',
        rollNumber: 'EE2024-028',
        email: 'nina.gupta@campusvoice.edu',
        branch: 'Electrical Engineering',
        semester: 'Semester 4',
        cgpa: 8.6,
        academicYear: '2024-2025',
        phone: '+1 (555) 789-0123',
        bio: 'Power electronics & clean energy systems advocate. IEEE Student Chair.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        tags: ['IEEE Chair', 'Clean Energy', 'Circuit Design']
      },
      {
        name: 'Carlos Mendez',
        rollNumber: 'ME2024-102',
        email: 'carlos.mendez@campusvoice.edu',
        branch: 'Mechanical Engineering',
        semester: 'Semester 6',
        cgpa: 8.4,
        academicYear: '2024-2025',
        phone: '+1 (555) 890-1234',
        bio: 'CAD designer and Formula Student racing team chassis lead.',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        tags: ['Formula Student', 'CAD SolidWorks', 'Aerodynamics']
      },
      {
        name: 'Samantha Lee',
        rollNumber: 'DS2024-054',
        email: 'samantha.lee@campusvoice.edu',
        branch: 'Data Science & AI',
        semester: 'Semester 4',
        cgpa: 9.3,
        academicYear: '2024-2025',
        phone: '+1 (555) 901-2345',
        bio: 'NLP researcher working on multilingual models and ethical AI safety.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        tags: ['NLP Lead', 'AI Ethics', 'Research Scholar']
      },
      {
        name: 'Tariq Al-Mansoor',
        rollNumber: 'CE2024-019',
        email: 'tariq.almansoor@campusvoice.edu',
        branch: 'Civil Engineering',
        semester: 'Semester 8',
        cgpa: 8.5,
        academicYear: '2024-2025',
        phone: '+1 (555) 012-3456',
        bio: 'Sustainable architecture and smart urban transportation infrastructure.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        tags: ['Green Building', 'BIM Specialist', 'President ASCE']
      },
      {
        name: 'Aisha Patel',
        rollNumber: 'IT2024-067',
        email: 'aisha.patel@campusvoice.edu',
        branch: 'Information Technology',
        semester: 'Semester 6',
        cgpa: 9.0,
        academicYear: '2024-2025',
        phone: '+1 (555) 123-4567',
        bio: 'Cybersecurity analyst, CTF competitor, and ethical hacking enthusiast.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        tags: ['Cybersecurity', 'CTF Player', 'Women in Tech']
      }
    ];

    const insertedStudents = await Student.insertMany(sampleStudents);
    console.log(`✅ Inserted ${insertedStudents.length} student directory profiles.`);

    // 4. Create realistic initial feedback records
    const sampleFeedbacks = [
      {
        studentId: insertedStudents[0]._id, // Alex Chen
        submittedBy: demoStudent._id,
        submitterName: 'Priya Sharma',
        submitterEmail: 'priya.sharma@campusvoice.edu',
        ratings: {
          overall: 5,
          academics: 5,
          collaboration: 5,
          communication: 5,
          punctuality: 4
        },
        category: 'Project Collaboration',
        comments: 'Outstanding partner during our Distributed Systems capstone project. Alex delivered bulletproof backend microservices ahead of schedule and explained tricky concepts with great patience.',
        suggestions: 'Could consider documenting API contracts earlier in sprint cycles for faster front-end integration.',
        status: 'Reviewed',
        adminNotes: 'Verified peer contribution on GitHub repository.',
        isAnonymous: false,
        tags: ['Peer Review', 'Exceptional Code', 'Team Player']
      },
      {
        studentId: insertedStudents[0]._id, // Alex Chen
        submittedBy: demoStudent._id,
        submitterName: 'Anonymous',
        submitterEmail: '',
        ratings: {
          overall: 4,
          academics: 5,
          collaboration: 4,
          communication: 4,
          punctuality: 4
        },
        category: 'Leadership & Conduct',
        comments: 'Always supportive during lab sessions. Steps up to organize study groups before midterms.',
        suggestions: 'Keep hosting mock coding interview sessions for junior batches!',
        status: 'Action Taken',
        adminNotes: 'Acknowledged by student affairs committee.',
        isAnonymous: true,
        tags: ['Helpful', 'Mentor']
      },
      {
        studentId: insertedStudents[1]._id, // Priya Sharma
        submittedBy: demoStudent._id,
        submitterName: 'Alex Chen',
        submitterEmail: 'alex.chen@campusvoice.edu',
        ratings: {
          overall: 5,
          academics: 5,
          collaboration: 5,
          communication: 5,
          punctuality: 5
        },
        category: 'Academic Performance',
        comments: 'Priya’s presentation on Transformer architectures was one of the most lucid seminars given in our department. Super thorough bibliography and reproducible benchmarks.',
        suggestions: 'Publish the slide deck and PyTorch repository to our university portal.',
        status: 'Reviewed',
        adminNotes: 'Recommended for Best Seminar Presenter award.',
        isAnonymous: false,
        tags: ['Top Performer', 'AI Research']
      },
      {
        studentId: insertedStudents[2]._id, // Marcus Brody
        submittedBy: demoStudent._id,
        submitterName: 'David Kim',
        submitterEmail: 'david.kim@campusvoice.edu',
        ratings: {
          overall: 5,
          academics: 4,
          collaboration: 5,
          communication: 5,
          punctuality: 5
        },
        category: 'Project Collaboration',
        comments: 'Marcus helped configure the Kubernetes cluster for the inter-departmental sensor network. Zero downtime throughout the university showcase.',
        suggestions: 'Help conduct a workshop for underclassmen on CI/CD pipelines.',
        status: 'Pending',
        adminNotes: '',
        isAnonymous: false,
        tags: ['Cloud', 'Reliable']
      },
      {
        studentId: insertedStudents[3]._id, // Elena Rostova
        submittedBy: demoStudent._id,
        submitterName: 'Anonymous',
        submitterEmail: '',
        ratings: {
          overall: 5,
          academics: 5,
          collaboration: 4,
          communication: 5,
          punctuality: 5
        },
        category: 'Academic Performance',
        comments: 'Her Kaggle approach write-ups are gold standards for our data science cohort. Inspiring dedication and clarity.',
        suggestions: 'None, fantastic work.',
        status: 'Reviewed',
        adminNotes: '',
        isAnonymous: true,
        tags: ['Data Science', 'Inspiration']
      },
      {
        studentId: insertedStudents[4]._id, // David Kim
        submittedBy: demoStudent._id,
        submitterName: 'Elena Rostova',
        submitterEmail: 'elena.rostova@campusvoice.edu',
        ratings: {
          overall: 4,
          academics: 5,
          collaboration: 4,
          communication: 4,
          punctuality: 4
        },
        category: 'Project Collaboration',
        comments: 'Very skilled with PCB layout and microcontrollers. Debugged a complex signal noise problem in our sensor node.',
        suggestions: 'Share modular library code on the robotics Git organization.',
        status: 'Pending',
        adminNotes: '',
        isAnonymous: false,
        tags: ['Hardware', 'Problem Solver']
      },
      {
        studentId: insertedStudents[6]._id, // Carlos Mendez
        submittedBy: demoStudent._id,
        submitterName: 'Marcus Brody',
        submitterEmail: 'marcus.brody@campusvoice.edu',
        ratings: {
          overall: 5,
          academics: 4,
          collaboration: 5,
          communication: 5,
          punctuality: 5
        },
        category: 'Extracurricular Activities',
        comments: 'Outstanding leadership as Formula Student chassis lead. Led the team to podium finish at the regional collegiate championship.',
        suggestions: 'Coordinate with CS students on telemetry telemetry dashboard next season.',
        status: 'Reviewed',
        adminNotes: 'Featured on the college news bulletin.',
        isAnonymous: false,
        tags: ['Leadership', 'Racing Team']
      }
    ];

    for (const fb of sampleFeedbacks) {
      await Feedback.create(fb);
    }
    console.log(`✅ Seeded ${sampleFeedbacks.length} initial feedback records.`);

    // Recalculate average ratings for all students
    for (const student of insertedStudents) {
      await Feedback.calculateAverageRating(student._id);
    }
    console.log('✅ Student average ratings recalculated and synchronized.');
  } catch (error) {
    console.error('❌ Seeder error:', error);
  }
};

// Standalone runner
if (require.main === module) {
  const { connectDB, closeDB } = require('../config/db');
  (async () => {
    try {
      await connectDB();
      await seedInitialData();
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Failed to seed:', err);
      process.exit(1);
    }
  })();
}

module.exports = { seedInitialData };
