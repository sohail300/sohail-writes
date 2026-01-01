/**
 * Database Utility Functions
 * Helper functions for common database operations
 */

import connectDB from "./db";
import Blog, { IBlog } from "./models/Blog";
import { BlogFilters } from "./types/blog";

/**
 * Get all published blogs with optional filters
 */
export async function getBlogs(filters: BlogFilters = {}) {
  await connectDB();

  const {
    platform,
    tag,
    search,
    limit = 10,
    isPublished = true,
  } = filters;

  let query: any = { isPublished };

  if (platform) {
    query.platform = platform;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    return await Blog.find({
      $text: { $search: search },
      ...query,
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();
  }

  return await Blog.find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}

/**
 * Get a single blog by ID
 */
export async function getBlogById(id: string) {
  await connectDB();
  return await Blog.findById(id).lean();
}

/**
 * Get a single blog by URL (useful for checking duplicates)
 */
export async function getBlogByUrl(url: string) {
  await connectDB();
  return await Blog.findOne({ url }).lean();
}

/**
 * Get all unique platforms
 */
export async function getPlatforms() {
  await connectDB();
  return await Blog.distinct("platform");
}

/**
 * Get all unique tags
 */
export async function getAllTags() {
  await connectDB();
  const tags = await Blog.distinct("tags");
  return tags.sort();
}

/**
 * Get tag counts (useful for tag cloud)
 */
export async function getTagCounts() {
  await connectDB();
  
  const result = await Blog.aggregate([
    { $match: { isPublished: true } },
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result.map((item) => ({
    tag: item._id,
    count: item.count,
  }));
}

/**
 * Get platform counts
 */
export async function getPlatformCounts() {
  await connectDB();

  const result = await Blog.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: "$platform",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result.map((item) => ({
    platform: item._id,
    count: item.count,
  }));
}

/**
 * Get recent blogs (last N days)
 */
export async function getRecentBlogs(days: number = 30, limit: number = 10) {
  await connectDB();

  const date = new Date();
  date.setDate(date.getDate() - days);

  return await Blog.find({
    isPublished: true,
    publishedAt: { $gte: date },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}

/**
 * Get blog stats
 */
export async function getBlogStats() {
  await connectDB();

  const [totalBlogs, publishedBlogs, platformCounts, tagCounts] =
    await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      getPlatformCounts(),
      getTagCounts(),
    ]);

  return {
    total: totalBlogs,
    published: publishedBlogs,
    draft: totalBlogs - publishedBlogs,
    platforms: platformCounts,
    topTags: tagCounts.slice(0, 10),
  };
}

/**
 * Create a new blog
 */
export async function createBlog(data: Partial<IBlog>) {
  await connectDB();
  return await Blog.create(data);
}

/**
 * Update a blog
 */
export async function updateBlog(id: string, data: Partial<IBlog>) {
  await connectDB();
  return await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

/**
 * Delete a blog
 */
export async function deleteBlog(id: string) {
  await connectDB();
  return await Blog.findByIdAndDelete(id);
}

/**
 * Toggle blog publish status
 */
export async function togglePublishStatus(id: string) {
  await connectDB();
  
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }

  blog.isPublished = !blog.isPublished;
  await blog.save();
  
  return blog;
}

/**
 * Bulk operations
 */
export async function bulkPublish(ids: string[]) {
  await connectDB();
  return await Blog.updateMany(
    { _id: { $in: ids } },
    { isPublished: true }
  );
}

export async function bulkUnpublish(ids: string[]) {
  await connectDB();
  return await Blog.updateMany(
    { _id: { $in: ids } },
    { isPublished: false }
  );
}

export async function bulkDelete(ids: string[]) {
  await connectDB();
  return await Blog.deleteMany({ _id: { $in: ids } });
}

