// src/api/attendanceApi.js
import { API } from "/src/api/http";

// Scan attendance by userId
export const scanAttendance = (userId) => {
  return API.post(`/attendance/scan?userId=${userId}`);
};
