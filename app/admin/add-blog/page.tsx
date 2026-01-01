"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [platform, setPlatform] = useState("Medium");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setChecking(false);
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Parse tags from comma-separated string
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const blogData = {
        title,
        excerpt,
        platform,
        url,
        image,
        publishedAt,
        tags: tagsArray,
        isPublished,
      };

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog");
      }

      // Success
      setSuccess(true);

      // Reset form
      setTitle("");
      setExcerpt("");
      setPlatform("Medium");
      setUrl("");
      setImage("");
      setPublishedAt("");
      setTags("");
      setIsPublished(true);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  }

  // Show loading state while checking auth
  if (checking) {
    return (
      <div className="neo-container min-h-screen flex items-center justify-center">
        <div className="neo-card bg-neo-yellow">
          <p className="font-black text-2xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-container min-h-screen py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black">Add New Blog</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/blogs"
              className="neo-btn bg-neo-blue hover:bg-neo-blue"
            >
              View All
            </Link>
            <button
              onClick={handleLogout}
              className="neo-btn bg-neo-white hover:bg-neo-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="border-4 border-neo-black bg-neo-green p-6 mb-6">
            <p className="font-black text-xl">✅ Blog created successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="border-4 border-neo-black bg-red-100 p-6 mb-6">
            <p className="font-bold text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="neo-card bg-neo-white">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block font-black text-lg mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="neo-input"
              placeholder="Enter blog title"
              required
              disabled={loading}
              maxLength={200}
            />
            <p className="text-sm font-semibold text-neo-gray-dark mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label htmlFor="excerpt" className="block font-black text-lg mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="neo-input min-h-[100px]"
              placeholder="Brief description of the blog"
              required
              disabled={loading}
              maxLength={500}
            />
            <p className="text-sm font-semibold text-neo-gray-dark mt-1">
              {excerpt.length}/500 characters
            </p>
          </div>

          {/* Platform */}
          <div className="mb-6">
            <label htmlFor="platform" className="block font-black text-lg mb-2">
              Platform *
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="neo-input"
              required
              disabled={loading}
            >
              <option value="Medium">Medium</option>
              <option value="Dev.to">Dev.to</option>
              <option value="Hashnode">Hashnode</option>
              <option value="Personal Blog">Personal Blog</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* URL */}
          <div className="mb-6">
            <label htmlFor="url" className="block font-black text-lg mb-2">
              URL *
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="neo-input"
              placeholder="https://medium.com/@username/blog-post"
              required
              disabled={loading}
            />
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label htmlFor="image" className="block font-black text-lg mb-2">
              Image URL *
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="neo-input"
              placeholder="https://example.com/image.jpg"
              required
              disabled={loading}
            />
            {image && (
              <div className="mt-4 border-4 border-neo-black">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Published Date */}
          <div className="mb-6">
            <label
              htmlFor="publishedAt"
              className="block font-black text-lg mb-2"
            >
              Published Date *
            </label>
            <input
              id="publishedAt"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="neo-input"
              required
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label htmlFor="tags" className="block font-black text-lg mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="neo-input"
              placeholder="backend, nodejs, databases"
              disabled={loading}
            />
            <p className="text-sm font-semibold text-neo-gray-dark mt-1">
              Separate tags with commas
            </p>
            {tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.split(",").map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  return (
                    <span
                      key={index}
                      className="border-4 border-neo-black bg-neo-yellow px-3 py-1 font-bold text-sm"
                    >
                      {trimmedTag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="mb-8 border-4 border-neo-black p-4 bg-neo-gray">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-6 h-6 border-4 border-neo-black"
                disabled={loading}
              />
              <div>
                <span className="font-black block">Publish this blog</span>
                <span className="text-sm font-bold text-neo-gray-dark">
                  Make it visible to the public
                </span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="neo-btn w-full text-xl"
          >
            <span className="mx-auto text-center">
              {loading ? "Creating Blog..." : "Create Blog"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
