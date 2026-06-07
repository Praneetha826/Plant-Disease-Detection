import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === "post") {
    config.headers["X-Idempotency-Key"] = crypto.randomUUID();
  }
  return config;
});

export async function predictDisease(file) {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post("/predict", formData);
  return response.data;
}

export async function fetchHistory() {
  const response = await api.get("/history/data");
  return response.data;
}

export async function fetchAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function fetchAdminUploads() {
  const response = await api.get("/admin/uploads");
  return response.data;
}

export async function submitFeedback(textarea) {
  const response = await api.post("/feedback", { textarea });
  return response.data;
}
