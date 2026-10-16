const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const totalUsers = await User.countDocuments();

    // Overall Average Rating
    const avgResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$ratings.overall' }
        }
      }
    ]);
    const overallAvgRating = avgResult.length > 0 ? Math.round(avgResult[0].avgRating * 10) / 10 : 0;

    // Rating Distribution (1 to 5 stars)
    const ratingDist = await Feedback.aggregate([
      {
        $group: {
          _id: '$ratings.overall',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ratingBreakdown = [1, 2, 3, 4, 5].map((star) => {
      const found = ratingDist.find((r) => r._id === star);
      return {
        stars: star,
        name: `${star} Star`,
        count: found ? found.count : 0
      };
    });

    // Category Distribution
    const categoryStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Status Distribution
    const statusStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Branch-wise Analytics
    const branchStats = await Student.aggregate([
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'studentId',
          as: 'feedbacks'
        }
      },
      {
        $group: {
          _id: '$branch',
          studentCount: { $sum: 1 },
          feedbackCount: { $sum: { $size: '$feedbacks' } },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { feedbackCount: -1 } }
    ]);

    // Recent Feedbacks
    const recentFeedbacks = await Feedback.find()
      .populate('studentId', 'name rollNumber branch avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFeedback,
        totalUsers,
        overallAvgRating,
        ratingBreakdown,
        categoryStats: categoryStats.map((c) => ({
          category: c._id || 'Uncategorized',
          count: c.count
        })),
        statusStats: statusStats.map((s) => ({
          status: s._id || 'Pending',
          count: s.count
        })),
        branchStats: branchStats.map((b) => ({
          branch: b._id,
          studentCount: b.studentCount,
          feedbackCount: b.feedbackCount,
          avgRating: Math.round((b.avgRating || 0) * 10) / 10
        })),
        recentFeedbacks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback with search, filter, pagination
// @route   GET /api/admin/feedback
// @access  Private/Admin
const getAllFeedback = async (req, res, next) => {
  try {
    const {
      search,
      status,
      category,
      rating,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (rating && rating !== 'all') {
      query['ratings.overall'] = Number(rating);
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { submitterName: searchRegex },
        { submitterEmail: searchRegex },
        { comments: searchRegex },
        { suggestions: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .populate('studentId', 'name rollNumber branch semester avatar')
      .populate('submittedBy', 'name email role')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      feedbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback (status, admin notes, comments)
// @route   PUT /api/admin/feedback/:id
// @access  Private/Admin
const updateFeedback = async (req, res, next) => {
  try {
    const { status, adminNotes, comments, ratings } = req.body;
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found'
      });
    }

    if (status) feedback.status = status;
    if (adminNotes !== undefined) feedback.adminNotes = adminNotes;
    if (comments) feedback.comments = comments;
    if (ratings && ratings.overall) {
      feedback.ratings = {
        ...feedback.ratings,
        ...ratings
      };
    }

    await feedback.save();

    const updated = await Feedback.findById(feedback._id)
      .populate('studentId', 'name rollNumber branch semester avatar')
      .populate('submittedBy', 'name email role');

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private/Admin
const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found'
      });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all feedback as CSV
// @route   GET /api/admin/export-csv
// @access  Private/Admin
const exportFeedbackCSV = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('studentId', 'name rollNumber branch semester')
      .sort({ createdAt: -1 });

    const headers = [
      'Feedback ID',
      'Target Student Name',
      'Roll Number',
      'Branch',
      'Semester',
      'Submitter Name',
      'Submitter Email',
      'Is Anonymous',
      'Overall Rating',
      'Academics Rating',
      'Collaboration Rating',
      'Communication Rating',
      'Punctuality Rating',
      'Category',
      'Comments',
      'Suggestions',
      'Status',
      'Admin Notes',
      'Submitted At'
    ];

    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = feedbacks.map((fb) => {
      const s = fb.studentId || {};
      const r = fb.ratings || {};
      return [
        escapeCSV(fb._id),
        escapeCSV(s.name || 'N/A'),
        escapeCSV(s.rollNumber || 'N/A'),
        escapeCSV(s.branch || 'N/A'),
        escapeCSV(s.semester || 'N/A'),
        escapeCSV(fb.isAnonymous ? 'Anonymous' : fb.submitterName),
        escapeCSV(fb.isAnonymous ? 'N/A' : fb.submitterEmail),
        escapeCSV(fb.isAnonymous ? 'Yes' : 'No'),
        escapeCSV(r.overall || 0),
        escapeCSV(r.academics || 0),
        escapeCSV(r.collaboration || 0),
        escapeCSV(r.communication || 0),
        escapeCSV(r.punctuality || 0),
        escapeCSV(fb.category || ''),
        escapeCSV(fb.comments || ''),
        escapeCSV(fb.suggestions || ''),
        escapeCSV(fb.status || 'Pending'),
        escapeCSV(fb.adminNotes || ''),
        escapeCSV(new Date(fb.createdAt).toLocaleString())
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="campusvoice_feedback_export_${Date.now()}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
  exportFeedbackCSV
};
