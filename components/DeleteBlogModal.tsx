"use client";

interface DeleteBlogModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteBlogModal({
  onConfirm,
  onCancel,
}: DeleteBlogModalProps) {
  return (
    <div className="fixed inset-0 bg-neo-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="neo-card bg-neo-white max-w-md w-full">
        <h2 className="text-2xl font-black mb-4">Delete Blog?</h2>
        <p className="font-bold mb-6">
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="neo-btn bg-red-100 w-full cursor-pointer"
          >
            <span className="text-center">Yes, Delete</span>
          </button>
          <button
            onClick={onCancel}
            className="neo-btn bg-neo-gray w-full cursor-pointer"
          >
            <span className="text-center">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
