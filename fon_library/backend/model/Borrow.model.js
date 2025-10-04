import mongoose from 'mongoose';

const BorrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Enter borrower's ID"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, "Enter book's ID"],
    },
    borrowDate: {
      type: Date,
      required: [true, 'Enter borrow date'],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Enter due date'],
      validate: {
        validator: function (value) {
          return value > this.borrowDate;
        },
        message: 'Due date must be after borrow date',
      },
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed',
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = mongoose.model('Borrow', BorrowSchema);
export default Borrow;
