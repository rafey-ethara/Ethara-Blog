const mongoose = require('mongoose');

const ContactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactSubmission', ContactSubmissionSchema);
