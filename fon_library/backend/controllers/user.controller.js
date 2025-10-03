import User from '../model/User.model.js';
import Borrow from '../model/Borrow.model.js';

/**
 * @route     GET /api/users
 * @access    Admin
 * @summary   Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

/**
 * @route     GET /api/users/:id/borrows
 * @access    Admin or Authenticated
 * @summary   Get borrow stats for a specific user
 */
export const getUserBorrowStats = async (req, res) => {
  const { id } = req.params;

  try {
    const borrows = await Borrow.find({ user: id });

    const stats = {
      returned: 0,
      borrowed: 0,
      overdue: 0,
    };

    for (const borrow of borrows) {
      if (borrow.status === 'returned') stats.returned++;
      else if (borrow.status === 'borrowed') stats.borrowed++;
      else if (borrow.status === 'overdue') stats.overdue++;
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user borrow stats',
    });
  }
};

/**
 * @route     PUT /api/users/:id/role
 * @access    Admin
 * @summary   Update a user's role
 * @param     {string} req.params.id - User ID
 * @param     {boolean} req.body.isAdmin - New admin status (true or false)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { isAdmin } = req.body;

    if (typeof isAdmin !== 'boolean') {
      return res
        .status(400)
        .json({ success: false, message: '`isAdmin` must be a boolean' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating user admin status' });
  }
};
