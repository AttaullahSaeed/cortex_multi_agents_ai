import API from "../../utils/axios";

export const logout = async () => {
  try {
    await API.post("/api/auth/logout");
  } catch (error) {
    console.log(error);
  }
};
