const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImageAlt: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for full-text search
PostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

// Auto-set publishedAt when status changes to published
PostSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Calculate reading time based on content
PostSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
