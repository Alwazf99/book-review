const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.route('/')
  .post(protect, reviewController.addReview);

router.route('/:id')
  .put(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

module.exports = router;