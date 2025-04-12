import axios from "axios";

const API_URL = "http://localhost:8000/api/events";

export const fetchAllEvents = async () => {
  const response = await axios.get(`${API_URL}/get`);
  return response.data.events;
};

export const fetchEventById = async (id) => {
  const response = await axios.get(`${API_URL}/get/${id}`, { withCredentials: true });
  return response.data.event;
};

export const fetchRecommendedEvents = async () => {
  const response = await axios.get(`${API_URL}/recommended`, { withCredentials: true });
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/create`, eventData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true
  });
  return response.data.event;
};

export const fetchEventsByGestionnaire = async (nom) => {
  const response = await axios.get(`${API_URL}/gestionnaire/${nom}`, { withCredentials: true });
  return response.data.events || response.data;
};
