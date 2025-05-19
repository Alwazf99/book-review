const Book = require('../models/Book');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const authorFilter = req.query.author
    ? { author: { $regex: req.query.author, $options: 'i' } }
    : {};
    
  const genreFilter = req.query.genre
    ? { genre: { $regex: req.query.genre, $options: 'i' } }
    : {};

  const count = await Book.countDocuments({ ...keyword, ...authorFilter, ...genreFilter });
  const books = await Book.find({ ...keyword, ...authorFilter, ...genreFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('createdBy', 'name email');

  res.json({ books, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('createdBy', 'name email');
  
  if (book) {
    // Get reviews for the book with pagination
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    
    const count = await Review.countDocuments({ book: book._id });
    const reviews = await Review.find({ book: book._id })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('user', 'name');
    
    res.json({
      book,
      reviews,
      page,
      pages: Math.ceil(count / pageSize)
    });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = asyncHandler(async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;

  const book = await Book.create({
    title,
    author,
    genre,
    publishedYear,
    createdBy: req.user._id
  });

  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('Invalid book data');
  }
});

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Please provide a search query');
  }

  const books = await Book.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { author: { $regex: query, $options: 'i' } }
    ]
  }).limit(10);

  res.json(books);
});

module.exports = {
  getBooks,
  getBook,
  addBook,
  searchBooks,
};