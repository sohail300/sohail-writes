import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  platform: string;
  url: string;
  image: string;
  publishedAt: Date;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IBlogModel extends Model<IBlog> {
  getPublished(limit?: number): Promise<IBlog[]>;
  getByPlatform(platform: string, limit?: number): Promise<IBlog[]>;
  getByTag(tag: string, limit?: number): Promise<IBlog[]>;
  search(query: string, limit?: number): Promise<IBlog[]>;
}

const BlogSchema = new Schema<IBlog, IBlogModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      trim: true,
      enum: {
        values: ["Medium", "Dev.to", "Hashnode", "Personal Blog", "Other"],
        message: "{VALUE} is not a supported platform",
      },
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Please provide a valid URL",
      },
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: [true, "Published date is required"],
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimized queries
BlogSchema.index({ platform: 1 });
BlogSchema.index({ publishedAt: -1 }); // Descending for latest first
BlogSchema.index({ title: "text" }); // Text index for search
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 }); // Compound index for published blogs

// Compound index for filtering by platform and sorting by date
BlogSchema.index({ platform: 1, publishedAt: -1 });

// Virtual for formatted date
BlogSchema.virtual("formattedDate").get(function () {
  return this.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Pre-save hook to ensure tags are lowercase and unique
BlogSchema.pre("save", function () {
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.map((tag) => tag.toLowerCase().trim()))];
  }
});

// Static method to get published blogs
BlogSchema.statics.getPublished = function (limit = 10) {
  return this.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to get blogs by platform
BlogSchema.statics.getByPlatform = function (platform: string, limit = 10) {
  return this.find({ isPublished: true, platform })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to get blogs by tag
BlogSchema.statics.getByTag = function (tag: string, limit = 10) {
  return this.find({ isPublished: true, tags: tag })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to search blogs
BlogSchema.statics.search = function (query: string, limit = 10) {
  return this.find({
    $text: { $search: query },
    isPublished: true,
  })
    .sort({ score: { $meta: "textScore" } })
    .limit(limit);
};

// Prevent model recompilation in development
const Blog: IBlogModel =
  (mongoose.models.Blog as IBlogModel) || mongoose.model<IBlog, IBlogModel>("Blog", BlogSchema);

export default Blog;

