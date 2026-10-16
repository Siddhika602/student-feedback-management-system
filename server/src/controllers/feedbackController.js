const Feedback = require('../models/Feedback');
const Student = require('../models/Student');

// @desc    Submit feedback for a student
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const {
      studentId,
      ratings,
      category,
      comments,
      suggestions,
      isAnonymous = false,
      tags = []
    } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide target studentId'
      });
    }

    if (!ratings || !ratings.overall) {
      return res.status(400).json({
        success: false,
        message: 'Overall star rating is required'
      });
    }

    if (!comments || comments.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Comments must be at least 5 characters long'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Target student not found'
      });
    }

    const feedback = await Feedback.create({
      studentId,
      submittedBy: req.user._id,
      submitterName: isAnonymous ? 'Anonymous' : req.user.name,
      submitterEmail: isAnonymous ? '' : req.user.email,
      ratings: {
        overall: Number(ratings.overall),
        academics: Number(ratings.academics || ratings.overall),
        collaboration: Number(ratings.collaboration || ratings.overall),
        communication: Number(ratings.communication || ratings.overall),
        punctuality: Number(ratings.punctuality || ratings.overall)
      },
      category: category || 'General Feedback',
      comments: comments.trim(),
      suggestions: suggestions ? suggestions.trim() : '',
      isAnonymous: Boolean(isAnonymous),
      tags: Array.isArray(tags) ? tags : []
    });

    const populatedFeedback = await Feedback.findById(feedback._id).populate(
      'studentId',
      'name rollNumber branch semester avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for your contribution.',
      feedback: populatedFeedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedbacks submitted by current logged-in user
// @route   GET /api/feedback/my
// @access  Private
const getMyFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ submittedBy: req.user._id })
      .populate('studentId', 'name rollNumber branch semester avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback for a specific student
// @route   GET /api/feedback/student/:studentId
// @access  Public / Private
const getFeedbackForStudent = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 });

    const sanitized = feedbacks.map((fb) => {
      const obj = fb.toObject();
      if (obj.isAnonymous) {
        obj.submitterName = 'Anonymous Student';
        obj.submitterEmail = '';
      }
      return obj;
    });

    res.json({
      success: true,
      count: sanitized.length,
      feedbacks: sanitized
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getFeedbackForStudent
};
