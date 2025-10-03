import Book from '../model/Book.model.js';
import Genre from '../model/Genre.model.js';
import cloudinary from '../utils/cloudinary.js';

/**
 * @route     GET /api/books
 * @access    Public
 * @summary   Get all books
 * @param     {number} req.query.page - Page number for pagination
 * @param     {number} req.query.limit - Number of books per page
 * @param     {string} req.query.genre - Filter by genre
 * @param     {string} req.query.search - Search term for book title or author
 * @param     {string} req.query.sort - Sort order (e.g., 'title', 'author', 'availableCopies')
 */
export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, search, sort } = req.query;
    const query = {};

    if (genre) {
      const genreDoc = await Genre.findOne({ name: genre });
      if (genreDoc) query.genre = genreDoc._id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sort === 'copies') sortOption.availableCopies = -1;
    else if (sort === 'year') sortOption.publishedYear = -1;

    const books = await Book.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('genre', 'name');

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      data: books,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Get all books error' });
  }
};

/**
 * @route     GET /api/books/all
 * @access    Public
 * @summary   Get all books without filters
 */
export const getAllBooksNoFilters = async (req, res) => {
  try {
    const books = await Book.find().populate('genre', 'name');
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Get all books error' });
  }
};

/**
 * @route     GET /api/books/:id
 * @access    Public
 * @summary   Get a single book by ID
 * @param     {string} req.params.id - Book ID
 */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('genre', 'name');
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Get book error' });
  }
};

/**
 * @route     GET /api/books/top-available
 * @access    Public
 * @summary   Get top 6 books with most available copies
 */
export const getTopAvailableBooks = async (req, res) => {
  try {
    const topBooks = await Book.find()
      .sort({ availableCopies: -1 })
      .limit(6)
      .populate('genre', 'name');

    res.status(200).json({
      success: true,
      data: topBooks,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching top books' });
  }
};

/**
 * @route     POST /api/books
 * @access    Admin
 * @summary   Create a new book
 * @param     {string} req.body.title - Book title
 * @param     {string} req.body.author - Book author
 * @param     {string} req.body.description - Book description
 * @param     {string} req.body.genre - Book genre ID
 * @param     {number} req.body.totalCopies - Total number of copies
 * @param     {number} req.body.availableCopies - Number of available copies
 * @param     {string} req.body.coverImageUrl - Cover image URL
 * @param     {number} req.body.publishedYear - Published year
 */
export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      genre,
      totalCopies,
      availableCopies,
      publishedYear,
    } = req.body;

    if (
      !title ||
      !author ||
      !genre ||
      !totalCopies ||
      !availableCopies ||
      !publishedYear
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const genreExists = await Genre.findById(genre);
    if (!genreExists) {
      return res
        .status(404)
        .json({ success: false, message: 'Genre not found' });
    }

    let coverImageUrl = undefined;
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'books' },
          (error, result) => {
            if (error) return reject(error);
            coverImageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const book = new Book({
      title,
      author,
      description,
      genre,
      totalCopies,
      availableCopies,
      coverImageUrl: coverImageUrl || undefined,
      publishedYear,
    });

    await book.save();
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Create book error' });
  }
};

/**
 * @route     PUT /api/books/:id
 * @access    Admin
 * @summary   Update a book by ID
 * @param     {string} req.params.id - Book ID
 * @param     {string} req.body.title - Book title
 * @param     {string} req.body.author - Book author
 * @param     {string} req.body.description - Book description
 * @param     {string} req.body.genre - Book genre ID
 * @param     {number} req.body.totalCopies - Total number of copies
 * @param     {number} req.body.availableCopies - Number of available copies
 * @param     {string} req.body.coverImageUrl - Cover image URL
 * @param     {number} req.body.publishedYear - Published year
 */
export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;

    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }

    if (updates.genre) {
      const genreExists = await Genre.findById(updates.genre);
      if (!genreExists) {
        return res
          .status(404)
          .json({ success: false, message: 'Genre not found' });
      }
    }

    // If there's a new image uploaded
    if (req.file) {
      let newImageUrl;

      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'books' },
          (error, result) => {
            if (error) return reject(error);
            newImageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });

      updates.coverImageUrl = newImageUrl;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
      new: true,
      runValidators: true,
    }).populate('genre', 'name');

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update book error' });
  }
};

/**
 * @route     DELETE /api/books/:id
 * @access    Admin
 * @summary   Delete a book by ID
 * @param     {string} req.params.id - Book ID
 */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Book not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete book error' });
  }
};
