// routes/adherents.js
const express = require('express');
const Adherent = require('../models/Adherent');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all adherents (paginated)
router.get('/', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const adherents = await Adherent.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const count = await Adherent.countDocuments(query);

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      adherents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export to PDF route
router.get('/export', isAdmin, async (req, res) => {
  try {
    const adherents = await Adherent.find().select('-password');
    const pdf = require('../utils/pdfGenerator').generateAdherentsPDF(adherents);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=adherents.pdf');
    
    pdf.pipe(res);
    pdf.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
