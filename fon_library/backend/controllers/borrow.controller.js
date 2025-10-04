import Borrow from '../model/Borrow.model.js';
import Book from '../model/Book.model.js';

/**
 * @route     GET /api/borrows
 * @access    Admin
 * @summary   Get All Borrow Records
 */
export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate('user', 'name email')
      .populate('book', 'title');

    const statusOrder = { overdue: 0, borrowed: 1, returned: 2 };
    borrows.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    res.status(200).json({ success: true, data: borrows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Get all borrows error' });
  }
};

/**
 * @route     GET /api/borrows/my
 * @access    User
 * @summary   Get Borrows for Logged-in User
 */
export const getUserBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.userId }).populate(
      'book',
      'title author coverImageUrl'
    );

    // Custom status sort order
    const statusOrder = { overdue: 0, borrowed: 1, returned: 2 };
    borrows.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    res.status(200).json({ success: true, data: borrows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Get user borrows error' });
  }
};

/**
 * @route     GET /api/borrows/check/:bookId
 * @access    User
 * @summary   Check if user has already borrowed a specific book and hasn't returned it
 * @param     {ObjectId} req.params.bookId - Book ID
 */
export const checkIfBookBorrowed = async (req, res) => {
  try {
    const { bookId } = req.params;

    const existingBorrow = await Borrow.findOne({
      user: req.userId,
      book: bookId,
      status: { $ne: 'returned' }, // status is 'borrowed' or 'overdue'
    });

    if (existingBorrow) {
      return res.status(200).json({
        success: true,
        borrowed: true,
        message: 'User has already borrowed this book',
      });
    }

    return res.status(200).json({
      success: true,
      borrowed: false,
      message: 'User has not borrowed this book yet',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Check borrow error' });
  }
};

/**
 * @route     POST /api/borrows
 * @access    User
 * @summary   Borrow a Book
 * @param     {ObjectId} req.body.book - Book ID
 * @param     {Date} req.body.dueDate - Due Date
 */
export const createBorrow = async (req, res) => {
  const { book, dueDate } = req.body;

  try {
    if (!book || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Book and due date are required',
      });
    }

    const newBorrow = await Borrow.create({
      user: req.userId,
      book,
      dueDate,
    });

    await Book.findByIdAndUpdate(book, { $inc: { availableCopies: -1 } });

    res.status(201).json({ success: true, data: newBorrow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Create borrow error' });
  }
};

/**
 * @route     PUT /api/borrows/:id/return
 * @access    User
 * @summary   Mark a Book as Returned
 */
export const returnBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow || borrow.user.toString() !== req.userId.toString()) {
      return res
        .status(404)
        .json({ success: false, message: 'Borrow record not found' });
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';
    await borrow.save();

    await Book.findByIdAndUpdate(borrow.book, { $inc: { availableCopies: 1 } });

    res.status(200).json({ success: true, data: borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Return book error' });
  }
};

/**
 * @route     PUT /api/borrows/:id/overdue
 * @access    Admin
 * @summary   Manually Mark Borrow as Overdue
 */
export const markAsOverdue = async (req, res) => {
  try {
    const borrow = await Borrow.findByIdAndUpdate(
      req.params.id,
      { status: 'overdue' },
      { new: true }
    );

    if (!borrow) {
      return res
        .status(404)
        .json({ success: false, message: 'Borrow record not found' });
    }

    res.status(200).json({ success: true, data: borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Mark overdue error' });
  }
};
