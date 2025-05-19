const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.route('/')
  .get(bookController.getBooks)
  .post(protect, bookController.addBook);

router.route('/:id')
  .get(bookController.getBook);

router.route('/search')
  .get(bookController.searchBooks);

module.exports = router;