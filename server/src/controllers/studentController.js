const Student = require('../models/Student');
const Feedback = require('../models/Feedback');

// @desc    Get all students with search, filters, sorting & pagination
// @route   GET /api/students
// @access  Public or Protected
const getStudents = async (req, res, next) => {
  try {
    const {
      search,
      branch,
      semester,
      minRating,
      sort = 'averageRating',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search by name, roll number, or branch
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { rollNumber: searchRegex },
        { branch: searchRegex },
        { email: searchRegex }
      ];
    }

    // Branch filter
    if (branch && branch !== 'all') {
      query.branch = branch;
    }

    // Semester filter
    if (semester && semester !== 'all') {
      query.semester = semester;
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    // Sort order
    const sortField = sort === 'name' ? 'name' : sort === 'totalFeedbackCount' ? 'totalFeedbackCount' : 'averageRating';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get distinct branches & semesters for filter dropdowns
    const branches = await Student.distinct('branch');
    const semesters = await Student.distinct('semester');

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      branches,
      semesters,
      students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student details with feedback summary
// @route   GET /api/students/:id
// @access  Public or Protected
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Fetch feedbacks received by this student
    const feedbacks = await Feedback.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .limit(20);

    // Sanitize feedback if anonymous
    const sanitizedFeedbacks = feedbacks.map((fb) => {
      const fbObj = fb.toObject();
      if (fb.isAnonymous) {
        fbObj.submitterName = 'Anonymous Student';
        fbObj.submitterEmail = '';
      }
      return fbObj;
    });

    res.json({
      success: true,
      student,
      feedbacks: sanitizedFeedbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student (Admin only)
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res, next) => {
  try {
    const { name, rollNumber, email, branch, semester, cgpa, phone, bio, tags } = req.body;

    if (!name || !rollNumber || !email || !branch || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, rollNumber, email, branch, and semester'
      });
    }

    const existing = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists'
      });
    }

    const avatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`;

    const student = await Student.create({
      name,
      rollNumber: rollNumber.toUpperCase(),
      email: email.toLowerCase(),
      branch,
      semester,
      cgpa: cgpa || 8.0,
      avatar,
      phone: phone || '',
      bio: bio || '',
      tags: tags || ['Student']
    });

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student (Admin only)
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student (Admin only)
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete associated feedback
    await Feedback.deleteMany({ studentId: student._id });
    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student and associated feedback removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
