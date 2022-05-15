// ---------------   Module Imports  ---------------
const express = require('express');
const enquiry = require('../../controllers/admin/enquiry');
const { isAuth, isAdmin } = require('../../middleware/is-auth');

// Initializing Router
const router = express.Router();

// ----------  Get All Enquries  ----------
router.get('/enquiries', isAuth, isAdmin, enquiry.getEnquiries);

// ----------  Change Enquiry Status  ----------
router.get('/enquiry-status/:enquiryId', isAuth, isAdmin, enquiry.changeStatus);

module.exports = router;
