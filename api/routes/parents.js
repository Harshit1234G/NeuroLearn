const express = require('express');
const router = express.Router();
const { getAllParents, createParent, getParentById } = require('../controllers/parentController');

router.get('/', getAllParents);
router.post('/', createParent);
router.get('/:id', getParentById);

module.exports = router;
