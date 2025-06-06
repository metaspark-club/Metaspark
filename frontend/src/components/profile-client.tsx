"use client";
import { useEffect } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchUserPosts } from "@/store/slices/postSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function ProfileClient() {
  const user = useSelector((state: RootState) => state.auth.user);
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
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-gray-400 font-orbitron">
          Your Profile
        </h1>
        <p className="text-gray-400 mt-4">Manage your digital identity</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-gray-400/10 rounded-2xl" />
          <div className="relative z-10">
            <div className="text-6xl mb-6">👤</div>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 font-semibold text-xl mb-1">
                  Username
                </h3>
                <p className="text-orange-500">{user?.username || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-gray-400 font-semibold text-xl mb-1">
                  Email
                </h3>
                <p className="text-orange-500">{user?.email || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-gray-400 font-semibold text-xl mb-1">
                  User ID
                </h3>
                <p className="text-orange-500">{user?.id || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="p-5">User Posts</h1>
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="p-5">
                <p>{post.text}</p>
                <strong>Image:</strong>
                {post.imageUrl && (
                  <div className="relative h-[300px] w-[300px]">
                    <Image
                      fill
                      sizes="300"
                      src={post.imageUrl}
                      alt="Post Image"
                      className="object-contain"
                      priority
                    />
                  </div>
                )}
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
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
