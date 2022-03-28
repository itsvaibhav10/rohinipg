const Enquiry = require('../../models/enquiry');

exports.getEnquiries = async (req, res, next) => {
  const enquiries = await Enquiry.find()
    .lean()
    .populate({ path: 'userId', select: 'firstName lastName mobile' })
    .populate({ path: 'propId', select: 'title houseNo street pincode ' })
    .exec();
  res.render('admin/enquiries', { pageTitle: 'enquiries', enquiries });
};

exports.changeStatus = async (req, res, next) => {
  try {
    const enquiryId = req.params.enquiryId;
    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) throw new Error('Property Not Found');
    if (enquiry.status === false) enquiry.status = true;
    else enquiry.status = false;
    await enquiry.save();
    return res.redirect(`/admin/enquiries`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
