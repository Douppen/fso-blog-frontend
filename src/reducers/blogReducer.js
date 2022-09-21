import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { fetchUsers } from "./userReducer";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    createBlogAction: (state, action) => {
      state.push(action.payload);
    },
    deleteBlogAction: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload);
    },
    likeBlogAction: (state, action) => {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    },
    setBlogs: (state, action) => {
      return action.payload;
    },
    commentOnBlogAction: (state, action) => {
      const { id, comment } = action.payload;
      state.map((blog) => {
        blog.id === id ? blog.comments.push(comment) : blog;
      });
    },
  },
});

export const {
  setBlogs,
  createBlogAction,
  deleteBlogAction,
  likeBlogAction,
  commentOnBlogAction,
} = blogSlice.actions;

export const fetchBlogs = createAsyncThunk(
  "blogs/setBlogs",
  async (_, thunkAPI) => {
    const blogs = await blogService().getAll();
    thunkAPI.dispatch(setBlogs(blogs));
  }
);

export const commentOnBlog = createAsyncThunk(
  "blogs/commentOnBlog",
  async ({ comment, id }, thunkAPI) => {
    blogService().comment(id, comment);
    thunkAPI.dispatch(commentOnBlogAction({ id, comment }));
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blog, thunkAPI) => {
    const newBlog = await blogService().create(blog);
    thunkAPI.dispatch(createBlogAction(newBlog));
    thunkAPI.dispatch(fetchUsers());
  }
);

export const likeBlog = createAsyncThunk(
  "blogs/updateBlog",
  async (blog, thunkAPI) => {
    const updatedBlog = await blogService().like(blog);
    thunkAPI.dispatch(likeBlogAction(updatedBlog));
  }
);

export const removeBlog = createAsyncThunk(
  "blogs/removeBlog",
  async (id, thunkAPI) => {
    await blogService().remove(id);
    thunkAPI.dispatch(deleteBlogAction(id));
  }
);

export default blogSlice.reducer;
