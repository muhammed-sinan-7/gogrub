import axios from "axios";

const cloudinaryApi = axios.create({
  baseURL: "https://api.cloudinary.com",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default cloudinaryApi;
