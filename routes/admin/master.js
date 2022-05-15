// ---------------   Module Imports  ---------------
const express = require('express');
const master = require('../../controllers/admin/master');
const { isAuth, isAdmin } = require('../../middleware/is-auth');


// Initializing Router
const router = express.Router();

// ----------  Get All Masters  ----------
router.get('/masters/:type', isAuth, isAdmin, master.readMasters);

// ----------  Create Master  ----------
router.post('/add-master', isAuth, isAdmin, master.createMaster);

// ----------  Read Master  ----------
router.get('/master/:masterId', isAuth, isAdmin, master.readMaster);

// ----------  Update Master  ----------
router.post('/edit-master', isAuth, isAdmin, master.updateMaster);

// ----------  Delete Master  ----------
router.get('/del-master/:masterId', isAuth, isAdmin, master.delMaster);

// ----------  Add Master Item  ----------
router.post('/add-masterItem', isAuth, isAdmin, master.addMasterItem);

// ----------  Delete Master Item  ----------
router.get('/del-masterItem/:masterId', isAuth, isAdmin, master.delMasterItem);

module.exports = router;
