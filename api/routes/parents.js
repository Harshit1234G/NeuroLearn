const express = require('express');
const router = express.Router();
const { getAllParents, createParent } = require('../controllers/parentController');

router.get('/', getAllParents);
router.post('/', createParent);

module.exports = router;
