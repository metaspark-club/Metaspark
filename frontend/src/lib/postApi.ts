import axios from "axios";
import Cookies from "js-cookie";

const PostAPI = axios.create({
  baseURL: "http://localhost:8080/api/posts",
});

PostAPI.interceptors.request.use((req) => {
  const token = Cookies.get("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default PostAPI;
