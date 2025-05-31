"use client";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchUserPosts } from "@/store/slices/postSlice";

export default function ProfileClient() {
  const params = useParams(); // returns { id: string }
  const userId = params?.id;

  const dispatch = useAppDispatch();
  const { posts, loading } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts(Number(userId)));
    }
  }, [userId, dispatch]);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center">
      <h1 className="p-5">User Profile</h1>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="p-5">
            <p>{post.text}</p>
            {post.imageUrl && <Image src={post.imageUrl} alt="Post Image" />}
            <p>
              <strong>Author:</strong> {post.author?.username ?? "Unknown"}
            </p>
            <div className="flex space-x-1">
              <strong>Visibility:</strong>
              <p>{post.isPrivate ? "Private" : "Public"}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
