import api from "@/common/utils/api";

const getPublishedPosts = async (params) => {
  const response = await api().get("/blog/posts", { params });
  return response.data;
};

const getPublishedPostBySlug = async (slug) => {
  const response = await api().get(`/blog/posts/${slug}`);
  return response.data;
};

const getAdminPosts = async (params) => {
  const response = await api().get("/blog/admin/posts", { params });
  return response.data;
};

const createBlogPost = async (payload) => {
  const response = await api().post("/blog/admin/posts", payload);
  return response.data;
};

const updateBlogPost = async (id, payload) => {
  const response = await api().put(`/blog/admin/posts/${id}`, payload);
  return response.data;
};

const deleteBlogPost = async (id) => {
  const response = await api().delete(`/blog/admin/posts/${id}`);
  return response.data;
};

const bulkDeleteBlogPosts = async (ids) => {
  const response = await api().delete("/blog/admin/posts/bulk", { data: { ids } });
  return response.data;
};

const blogService = {
  getPublishedPosts,
  getPublishedPostBySlug,
  getAdminPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  bulkDeleteBlogPosts,
};

export default blogService;
