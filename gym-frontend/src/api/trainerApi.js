// src/api/trainerApi.js
import { API } from "/src/api/http.js";

// GET ALL
export const getAllTrainers = () =>
  API.get(`/trainers`).then(r => r.data);

// CREATE
export const createTrainer = (data) =>
  API.post(`/trainers`, data).then(r => r.data);

// GET BY ID
export const getTrainerById = (id) =>
  API.get(`/trainers/${id}`).then(r => r.data);

// UPDATE
export const updateTrainer = (id, data) =>
  API.put(`/trainers/${id}`, data).then(r => r.data);

// DELETE
export const deleteTrainer = (id) =>
  API.delete(`/trainers/${id}`).then(r => r.data);
