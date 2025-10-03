import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter book's title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Enter book's author"],
      trim: true,
    },
    description: String,
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: [true, "Enter book's genre"],
    },
    totalCopies: {
      type: Number,
      required: [true, 'Enter total number of copies'],
      min: [1, 'Total copies must be at least 1'],
    },
    availableCopies: {
      type: Number,
      required: [true, 'Enter number of available copies'],
      min: [0, 'Available copies cannot be negative'],
    },
    coverImageUrl: {
      type: String,
      trim: true,
      default:
        'https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png',
    },
    publishedYear: {
      type: Number,
      required: [true, "Enter book's published year"],
      min: [1450, 'Published year must be after 1450'],
      max: [new Date().getFullYear(), 'Published year cannot be in the future'],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', BookSchema);
export default Book;
