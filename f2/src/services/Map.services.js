import api from "./api";

const RESTO_API = import.meta.env.VITE_RESTO_API; // API endpoint ที่ดึงจาก .env

// Get all courses
const getAllCourse = async () => {
  return await api.get(RESTO_API);
};

// Get course by ID
const getCourseById = async (id) => {
  return await api.get(`${RESTO_API}/${id}`);
};

// Update course data by ID
const editCourse = async (id, store) => {
  try {
    console.log(`Editing course with ID: ${id}`, store); // เพิ่มบรรทัดนี้
    return await api.put(`${RESTO_API}/${id}`, store);
  } catch (error) {
    console.error(`Error updating course with ID ${id}:`, error);
    throw error;
  }
};

// Delete a course by ID
const deleteCourse = async (id) => {
  return await api.delete(`${RESTO_API}/${id}`);
};

// Add a new course
const addstore = async (name, address, direction, lat, lng, radius) => {
  return await api.post(RESTO_API, { name, address, direction, lat, lng, radius });
};

// Export service ที่ใช้จัดการกับ Course
const CourseService = {
  getAllCourse,
  getCourseById,
  editCourse,
  deleteCourse,
  addstore,
};

export default CourseService;
