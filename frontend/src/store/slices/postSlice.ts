import PostAPI from "@/lib/postApi";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Post = {
  id: number;
  text?: string;
  imageUrl?: string;
  isPrivate: boolean;
  createdAt: string;
  author: {
    id: number;
    username: string;
    profilePicture?: string;
  };
};

type PostState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
};

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

// Async thunk to fetch user posts
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await PostAPI.get(`/${userId}`);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch posts!");
    }
  }
);

// Async thunk to create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (
    postData: { text?: string; image?: File | null; isPrivate: boolean },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("text", postData.text || "");
      formData.append("isPrivate", String(postData.isPrivate));
      if (postData.image) {
        formData.append("image", postData.image);
      }

      const res = await PostAPI.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to create post!");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts(state) {
      state.posts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserPosts.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading = false;
          state.posts = action.payload;
        }
      )
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Something went wrong!";
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      });
  },
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;
