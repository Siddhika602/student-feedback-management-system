const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    rollNumber: {
      type: String,
      required: [true, 'Please provide roll number'],
      unique: true,
      trim: true,
      uppercase: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      lowercase: true
    },
    branch: {
      type: String,
      required: [true, 'Please specify branch/department'],
      trim: true
    },
    semester: {
      type: String,
      required: [true, 'Please specify semester'],
      trim: true
    },
    academicYear: {
      type: String,
      default: '2024-2025'
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0
    },
    avatar: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: ''
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active'
    },
    totalFeedbackCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual index for searching
studentSchema.index({ name: 'text', rollNumber: 'text', branch: 'text' });

module.exports = mongoose.model('Student', studentSchema);
