// frontend/src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const generatePlan = async (projectData) => {
  try {
    const response = await axios.post(`${API_BASE}/inception`, projectData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
