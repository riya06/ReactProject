const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Route for creating a new category
router.post('/api/categories', controller.createCategory);
// Route for retrieving all categories
router.get('/api/categories', controller.getCategory);

router.post('/api/transactions', controller.createTransaction);
router.get('/api/transactions', controller.getTransaction);
router.delete('/api/transactions', controller.deleteTransaction);

router.get('/api/labels', controller.getLabels);


module.exports = router;
