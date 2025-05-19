const Review = require('../models/Review');
const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { book, rating, comment } = req.body;

  // Check if book exists
  const bookExists = await Book.findById(book);
  
  if (!bookExists) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if user already reviewed this book
  const alreadyReviewed = await Review.findOne({
    book,
    user: req.user._id
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }

  const review = await Review.create({
    book,
    user: req.user._id,
    rating,
    comment
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if the review belongs to the user
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;

  const updatedReview = await review.save();
  res.json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if the review belongs to the user
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  await review.remove();
  res.json({ message: 'Review removed' });
});

module.exports = {
  addReview,
  updateReview,
  deleteReview,
};