"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  platform: string;
  url: string;
  image: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
}

export default function EditBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    fetchBlog();
  }, [router, id]);

  async function fetchBlog() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blog");
      }

      const blog: Blog = data.data;
      setTitle(blog.title);
      setExcerpt(blog.excerpt);
      setPlatform(blog.platform);
      setUrl(blog.url);
      setImage(blog.image);
      setPublishedAt(blog.publishedAt.split("T")[0]);
      setTags(blog.tags.join(", "));
      setIsPublished(blog.isPublished);
    } catch (err: any) {
      setError(err.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          platform,
          url,
          image,
          publishedAt,
          tags: tagsArray,
          isPublished,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update blog");
      }

      setSuccess(true);

      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  }

  if (checking) {
    return (
      <div className="neo-container min-h-screen flex items-center justify-center">
        <div className="neo-card bg-neo-yellow">
          <p className="font-black text-2xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="neo-container min-h-screen flex items-center justify-center">
        <div className="neo-card bg-neo-gray">
          <p className="font-black text-2xl">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-neo-gray pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-2">Edit Blog</h1>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/blogs" className="neo-btn bg-neo-gray">
              ← Back to Blogs
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
            <p className="font-bold text-neo-black">
              ✅ Blog updated successfully! Redirecting...
            </p>
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
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-black mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="neo-input"
                required
                maxLength={200}
                disabled={saving}
                placeholder="Enter blog title"
              />
              <p className="text-sm font-semibold text-neo-gray-dark mt-1">
                {title.length}/200 characters
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block font-black mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="neo-input min-h-[120px]"
                required
                maxLength={500}
                disabled={saving}
                placeholder="Brief description of your blog post"
              />
              <p className="text-sm font-semibold text-neo-gray-dark mt-1">
                {excerpt.length}/500 characters
              </p>
            </div>

            {/* Platform */}
            <div>
              <label htmlFor="platform" className="block font-black mb-2">
                Platform *
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="neo-input"
                required
                disabled={saving}
              >
                <option value="Medium">Medium</option>
                <option value="Dev.to">Dev.to</option>
                <option value="Hashnode">Hashnode</option>
                <option value="Personal Blog">Personal Blog</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block font-black mb-2">
                URL *
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="neo-input"
                required
                disabled={saving}
                placeholder="https://example.com/your-blog-post"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block font-black mb-2">
                Image URL *
              </label>
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="neo-input"
                required
                disabled={saving}
                placeholder="https://example.com/image.jpg"
              />
              {image && (
                <div className="mt-4 border-4 border-neo-black">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Published Date */}
            <div>
              <label htmlFor="publishedAt" className="block font-black mb-2">
                Published Date *
              </label>
              <input
                type="date"
                id="publishedAt"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="neo-input"
                required
                disabled={saving}
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block font-black mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="neo-input"
                disabled={saving}
                placeholder="backend, nodejs, databases (comma-separated)"
              />
              <p className="text-sm font-bold text-neo-gray-dark mt-2">
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

            {/* Published Toggle */}
            <div className="border-4 border-neo-black p-4 bg-neo-gray">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-6 h-6 border-4 border-neo-black"
                  disabled={saving}
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
              disabled={saving}
              className="neo-btn bg-neo-yellow w-full text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mx-auto">
                {saving ? "Updating Blog..." : "Update Blog"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
