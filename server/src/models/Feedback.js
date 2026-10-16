const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    submitterName: {
      type: String,
      default: 'Anonymous'
    },
    submitterEmail: {
      type: String,
      default: ''
    },
    ratings: {
      overall: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: 1,
        max: 5
      },
      academics: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
      },
      collaboration: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
      },
      punctuality: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
      }
    },
    category: {
      type: String,
      enum: [
        'Academic Performance',
        'Project Collaboration',
        'Extracurricular Activities',
        'Leadership & Conduct',
        'General Feedback'
      ],
      default: 'General Feedback'
    },
    comments: {
      type: String,
      required: [true, 'Comments are required'],
      trim: true,
      minlength: [5, 'Comments must be at least 5 characters long']
    },
    suggestions: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Action Taken', 'Flagged'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      trim: true,
      default: ''
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Static helper to recalculate average ratings on the Student model
feedbackSchema.statics.calculateAverageRating = async function (studentId) {
  const stats = await this.aggregate([
    { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: '$studentId',
        averageRating: { $avg: '$ratings.overall' },
        totalCount: { $sum: 1 }
      }
    }
  ]);

  try {
    const Student = mongoose.model('Student');
    if (stats.length > 0) {
      await Student.findByIdAndUpdate(studentId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalFeedbackCount: stats[0].totalCount
      });
    } else {
      await Student.findByIdAndUpdate(studentId, {
        averageRating: 0,
        totalFeedbackCount: 0
      });
    }
  } catch (err) {
    console.error('Error updating student average rating:', err);
  }
};

// Post hooks to recalculate ratings automatically
feedbackSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.studentId);
});

feedbackSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.studentId);
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
