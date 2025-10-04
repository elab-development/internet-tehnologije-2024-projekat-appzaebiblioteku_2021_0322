import Borrow from '../model/Borrow.model.js';

/**
 * @route     GET /api/reports/top-books
 * @access    Admin
 * @summary   Get Top Borrowed Books
 **/
export const getTopBooks = async (req, res) => {
  try {
    const topBooks = await Borrow.aggregate([
      { $group: { _id: '$book', borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          bookId: '$bookDetails._id',
          title: '$bookDetails.title',
          coverImageUrl: '$bookDetails.coverImageUrl',
          borrowCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: topBooks });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching top books' });
  }
};

/**
 * @route     GET /api/reports/top-genres
 * @access    Admin
 * @summary   Get Top Borrowed Genres
 **/
export const getTopGenres = async (req, res) => {
  try {
    const topGenres = await Borrow.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $group: {
          _id: '$bookDetails.genre',
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'genres',
          localField: '_id',
          foreignField: '_id',
          as: 'genreDetails',
        },
      },
      { $unwind: '$genreDetails' },
      {
        $project: {
          _id: 0,
          genreId: '$_id',
          name: '$genreDetails.name',
          borrowCount: 1,
        },
      },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({ success: true, data: topGenres });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching top genres' });
  }
};

/**
 * @route     GET /api/reports/top-users
 * @access    Admin
 * @summary   Get Top Users
 **/
export const getTopUsers = async (req, res) => {
  try {
    const topUsers = await Borrow.aggregate([
      { $group: { _id: '$user', borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          userId: '$userDetails._id',
          name: '$userDetails.name',
          email: '$userDetails.email',
          borrowCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: topUsers });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching top users' });
  }
};

/**
 * @route     GET /api/reports/new-york-times-top-books
 * @access    Admin
 * @summary   Get Top New York Times Books
 **/
export const getNewYorkTimesTopBooks = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.NEW_YORK_TIMES_API_KEY}`
    );
    const data = await response.json();

    res.status(200).json({
      success: true,
      data: data.results.lists[0].books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top books from New York Times API',
    });
  }
};
