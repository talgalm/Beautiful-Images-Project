import axios from "axios";

let baseURL =
  process.env.REACT_APP_ENV === "production"
    ? "https://coil.cs.bgu.ac.il/"
    : "http://localhost:3001/";

export const handleUserRegistration = async (
  email,
  nickname,
  age,
  country,
  gender
) => {
  try {
    const response = await axios.post(baseURL + "api/auth/register", {
      email: email,
      nickname: nickname,
      age: age,
      country: country,
      gender: gender,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleUserLogin = async (email) => {
  try {
    const response = await axios.post(baseURL + "api/auth/login", {
      email: email,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const handleUserLogout = async () => {
  localStorage.clear();
  try {
    const response = await axios.post(
      baseURL + "api/auth/logout",
      {
        email: localStorage.getItem("email"),
        token: localStorage.getItem("token"),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleFetchImages = async () => {
  try {
    const response = await axios.post(
      baseURL + "api/images/fetchImages",
      {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("email"),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleFetchSingleImage = async (imageId, size) => {
  try {
    const response = await axios.post(
      baseURL + "api/images/fetchImage",
      {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("email"),
        imageId: imageId,
        size: window.innerWidth > 600 ? "original" : "small",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
