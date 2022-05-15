const Master = require('../../models/master');

exports.readMasters = async (req, res) => {
  const type = req.params.type;
  const masters = await Master.find({ type }).lean();
  res.render('admin/masters', {
    pageTitle: `Manage ${type} Masters`,
    masters,
    type,
  });
};

exports.createMaster = async (req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  const master = await Master.create({ name, type });
  res.redirect(`/admin/master/${master._id}`);
};

exports.readMaster = async (req, res) => {
  const masterId = req.params.masterId;
  const master = await Master.findById(masterId);
  res.render('admin/master', {
    pageTitle: master.name,
    master: master,
  });
};

exports.updateMaster = async (req, res) => {
  const masterId = req.body.masterId;
  const name = req.body.name;
  const type = req.body.type;
  const master = await Master.findById(masterId);
  master.name = name;
  master.type = type;
  await master.save();
  res.redirect(`/admin/master/${masterId}`);
};

exports.delMaster = async (req, res) => {
  const masterId = req.params.masterId;
  await Master.deleteOne({ _id: masterId });
  res.redirect(`/admin/masters`);
};

exports.addMasterItem = async (req, res) => {
  const masterId = req.body.masterId;
  const item = req.body.item;
  const master = await Master.findById(masterId);
  master.items.push(item);
  await master.save();
  res.redirect(`/admin/master/${masterId}`);
};

exports.delMasterItem = async (req, res) => {
  const masterId = req.params.masterId;
  const idx = req.query.idx;
  const master = await Master.findById(masterId);
  master.items.splice(idx, 1);
  await master.save();
  res.redirect(`/admin/master/${masterId}`);
};
