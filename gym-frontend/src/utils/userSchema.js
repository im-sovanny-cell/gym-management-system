// src/utils/userSchema.js
import * as yup from "yup";

export const userSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[\d\s\-\+\(\)]+$/, "Invalid phone")
    .required("Phone is required"),
  join_date: yup.date().required("Join date is required").nullable(),
  address: yup.string(),
  role_id: yup.number().required("Role is required").positive(),
  gym_id: yup.number().required("Gym is required").positive(),
  is_active: yup.boolean(),
  profile_photo: yup.mixed().nullable(),
});