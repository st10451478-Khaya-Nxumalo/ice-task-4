import User from '../models/User.js';

// @route GET /api/users/me
export const getMe = async (req, res, next) => {
  try {
    // req.user is already fetched (without password) in the protect middleware
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/me
export const updateMe = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({ message: 'Provide a username or email to update' });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email.toLowerCase();

    // If updating email, make sure it isn't already taken by someone else
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(409).json({ message: 'That email is already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/users/:userId (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/:userId/promote (admin only)
export const promoteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/:userId/demote (admin only)
export const demoteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'user') {
      return res.status(400).json({ message: 'User is already a normal user' });
    }

    user.role = 'user';
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
