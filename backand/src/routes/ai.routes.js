const express = require('express');
const aiRoutes = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/authMiddleware');


aiRoutes.post('/generate-email',protect,aiController.generateEmail)
aiRoutes.get('/history',protect,aiController.getHistory)

module.exports =  aiRoutes;
