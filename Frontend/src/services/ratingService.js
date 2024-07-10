import axios from "axios";
import { isMobile } from "react-device-detect";

let baseURL =
  process.env.REACT_APP_ENV === "production"
    ? "https://coil.cs.bgu.ac.il/"
    : "http://localhost:3001/";

export const handleRateImage = async (imageId, fromBasket, toBasket) => {
  try {
    const response = await axios.post(
      baseURL + "api/rate/rateImage",
      {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("email"),
        imageId: imageId,
        fromBasket: fromBasket,
        toBasket: toBasket,
        submittedFrom: isMobile ? "Mobile" : "Desktop",
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

export const handleSaveRating = async (email) => {
  try {
    const response = await axios.post(
      baseURL + "api/rate/save",
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
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
