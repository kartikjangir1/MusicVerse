import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("musicverseToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const searchSongs = async (query) => {
  const response = await API.get("/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};

export const registerUser = async (name, email, password) =>
  (await API.post("/auth/register", { name, email, password })).data;

export const loginUser = async (email, password) =>
  (await API.post("/auth/login", { email, password })).data;

export const getCurrentUser = async () =>
  (await API.get("/auth/me")).data;

export const updateUserProfile = async (name) =>
  (await API.patch("/auth/profile", { name })).data;

export const deleteUserAccount = async () =>
  (await API.delete("/auth/account")).data;

export const getUserData = async () =>
  (await API.get("/user/data")).data;

export const saveUserData = async (data) =>
  (await API.put("/user/data", data)).data;