import mongoose from 'mongoose';

const GenreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter genre's name"],
      unique: [true, "Genre's name must be unique"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Genre = mongoose.model('Genre', GenreSchema);
export default Genre;
