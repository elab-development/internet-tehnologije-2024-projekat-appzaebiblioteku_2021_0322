import Genre from '../model/Genre.model.js';

/**
 * @route     GET /api/genres
 * @access    Public
 * @summary   Get All Genres
 */
export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Get all genres error' });
  }
};

/**
 * @route     GET /api/genres/:id
 * @access    Public
 * @summary   Get Genre by ID
 * @param     {string} req.params.id - Genre ID
 */
export const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res
        .status(404)
        .json({ success: false, message: 'Genre not found' });
    }
    res.status(200).json({ success: true, data: genre });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @route     POST /api/genres
 * @access    Admin
 * @summary   Create a new Genre
 * @param     {string} req.body.name - Genre name
 * @param     {string} req.body.description - Genre description
 */
export const createGenre = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Genre's name is required",
      });
    }

    const newGenre = new Genre({ name, description });
    await newGenre.save();

    res.status(201).json({
      success: true,
      data: newGenre,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Create genre error' });
  }
};

/**
 * @route     PUT /api/genres/:id
 * @access    Admin
 * @summary   Update Genre by ID
 * @param     {string} req.params.id - Genre ID
 * @param     {string} req.body.name - Genre name
 * @param     {string} req.body.description - Genre description
 */
export const updateGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (description !== undefined) updatedData.description = description;

    const genre = await Genre.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!genre) {
      return res
        .status(404)
        .json({ success: false, message: 'Genre not found' });
    }

    res.status(200).json({ success: true, data: genre });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update genre error' });
  }
};

/**
 * @route     DELETE /api/genres/:id
 * @access    Admin
 * @summary   Delete Genre by ID
 * @param     {string} req.params.id - Genre ID
 */
export const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
      return res
        .status(404)
        .json({ success: false, message: 'Genre not found' });
    }

    res
      .status(200)
      .json({ success: true, message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete genre error' });
  }
};
