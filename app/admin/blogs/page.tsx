"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteBlogModal from "@/components/DeleteBlogModal";

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
  createdAt: string;
}

export default function AdminBlogs() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setChecking(false);
    fetchBlogs();
  }, [router]);

  async function fetchBlogs() {
    setLoading(true);
    setError("");

    try {
      // Fetch all blogs (we'll need to modify API or create admin endpoint)
      const response = await fetch("/api/blogs?limit=100");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blogs");
      }

      setBlogs(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      // Refresh blogs list
      fetchBlogs();
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
    }
  }

  async function handleTogglePublish(blog: Blog) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPublished: !blog.isPublished,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      // Refresh blogs list
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Failed to update blog");
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

  return (
    <div className="neo-container min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              Manage Blogs
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/add-blog" className="neo-btn bg-neo-yellow">
              + Add New
            </Link>
            <button
              onClick={handleLogout}
              className="neo-btn bg-neo-white hover:bg-neo-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border-4 border-neo-black bg-red-100 p-6 mb-6">
            <p className="font-bold text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="neo-card bg-neo-gray">
            <p className="font-black text-xl text-center">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div className="neo-card bg-neo-gray text-center">
            <p className="font-black text-2xl mb-4">No blogs yet</p>
            <p className="font-bold mb-6">Create your first blog post!</p>
            <Link href="/admin/add-blog" className="neo-btn bg-neo-yellow">
              Add First Blog
            </Link>
          </div>
        ) : (
          /* Blogs Grid */
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="neo-card bg-neo-yellow text-center">
                <p className="font-black text-3xl">{blogs.length}</p>
                <p className="font-bold">Total Blogs</p>
              </div>
              <div className="neo-card bg-neo-green text-center">
                <p className="font-black text-3xl">
                  {blogs.filter((b) => b.isPublished).length}
                </p>
                <p className="font-bold">Published</p>
              </div>
              <div className="neo-card bg-neo-gray text-center">
                <p className="font-black text-3xl">
                  {blogs.filter((b) => !b.isPublished).length}
                </p>
                <p className="font-bold">Drafts</p>
              </div>
            </div>

            {/* Blogs List */}
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className={`neo-card ${
                  blog.isPublished ? "bg-neo-white" : "bg-neo-gray"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 border-4 border-neo-black shrink-0">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Status Badge */}
                    <div className="mb-2">
                      {blog.isPublished ? (
                        <span className="inline-block border-4 border-neo-black bg-neo-green px-3 py-1 text-sm font-black">
                          ✅ PUBLISHED
                        </span>
                      ) : (
                        <span className="inline-block border-4 border-neo-black bg-neo-yellow px-3 py-1 text-sm font-black">
                          📝 DRAFT
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black mb-2">{blog.title}</h2>

                    {/* Excerpt */}
                    <p className="font-bold mb-3 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-3 text-sm font-bold text-neo-gray-dark">
                      <span>📱 {blog.platform}</span>
                      <span>
                        📅 {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="border-2 border-neo-black bg-neo-white px-2 py-1 text-xs font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-btn bg-neo-white text-sm px-4 py-2"
                      >
                        🔗 View Post
                      </a>
                      <Link
                        href={`/admin/edit-blog/${blog._id}`}
                        className="neo-btn bg-neo-yellow text-sm px-4 py-2"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className="neo-btn bg-neo-blue text-sm px-4 py-2"
                      >
                        {blog.isPublished ? "📝 Unpublish" : "✅ Publish"}
                      </button>
                      <button
                        onClick={() => setDeleteId(blog._id)}
                        className="neo-btn bg-red-100 text-sm px-4 py-2"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <DeleteBlogModal
            onConfirm={() => handleDelete(deleteId)}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </div>
    </div>
  );
}
