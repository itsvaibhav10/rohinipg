const Master = require('../../models/master');

exports.getMasters = async (req, res, next) => {
  const master = await Master.findOne({}, { _id: false, __v: false }).lean();
  if (!master) {
    await Master.create({});
  }
  res.render('admin/masters', { pageTitle: 'Manage Masters', master: master });
};

exports.addMaster = async (req, res, next) => {
  const newMaster = req.body.newMaster;
  let master = await Master.findOne();
  console.log(master);
  master = { ...master, [newMaster]: [] }
  const result = await master.save();
  console.log(result);
  res.redirect('/admin/masters');
};

exports.getMaster = async (req, res, next) => {
  const category = req.query.category;
  const master = await Master.findOne().lean();
  res.render('admin/master', {
    pageTitle: category,
    master: master[category],
    category,
  });
};

exports.addMasterItem = async (req, res, next) => {
  const category = req.body.category;
  const master = await Master.findOne();
  const item = req.body.item;
  master[category].push(item);
  await master.save();
  res.redirect(`/admin/master?category=${category}`);
};

exports.delMasterItem = async (req, res, next) => {
  const category = req.query.category;
  const idx = req.query.idx;
  const master = await Master.findOne();
  master[category].splice(idx, 1);
  await master.save();
  res.redirect(`/admin/master?category=${category}`);
};
