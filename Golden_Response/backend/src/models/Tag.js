const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tag', TagSchema);
