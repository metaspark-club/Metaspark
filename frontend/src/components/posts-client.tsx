"use client";

import { useCallback, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createPost } from "@/store/slices/postSlice";

function PostClient() {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return setError("Post input cannot be empty.");
    setError(null);
    setLoading(true);

    try {
      await dispatch(createPost({ text, isPrivate, image })).unwrap();
      setText("");
      setImage(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [text, isPrivate, image, dispatch]);

  return (
    <div className="flex space-x-5 justify-center mt-32">
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          placeholder="Write here your thoughts"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-3 text-black border rounded-xl outline-none placeholder:text-sm w-[20rem]"
        />

        {/* Image Upload Field */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <button
          onClick={handleSubmit}
          className="p-3 border rounded-xl hover:bg-red-500 transition-all duration-300 ease-in-out w-[5rem]"
        >
          {loading ? "Posting..." : "Post"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="space-x-5">
        <button
          onClick={() => setIsPrivate(true)}
          className={`p-3 border rounded-xl transition-all duration-300 ease-in-out ${
            isPrivate ? "bg-red-500 text-white" : "hover:bg-red-500"
          }`}
        >
          Private
        </button>
        <button
          onClick={() => setIsPrivate(false)}
          className={`p-3 border rounded-xl transition-all duration-300 ease-in-out ${
            !isPrivate ? "bg-red-500 text-white" : "hover:bg-red-500"
          }`}
        >
          Public
        </button>
      </div>
    </div>
  );
}

export default PostClient;
