import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetils = async () => {
  const token = localStorage.getItem("accesstoken");
  if (!token) return null; // not logged in

  try {
    const response = await Axios({
      ...SummaryApi.userDetails,
      headers: {
        Authorization: `Bearer ${token}`, // attach token
      },
    });

    return response.data;
  } catch (error) {
    console.log("fetchUserDetils error:", error);
    return null;
  }
};

export default fetchUserDetils;
