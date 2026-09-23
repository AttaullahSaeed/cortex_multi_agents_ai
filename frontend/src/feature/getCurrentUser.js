import API from "../../utils/axios";

const getCurrentUser = async () => {
  try {
    const { data } = await API.get("api/me");
    return data;
  } catch (error) {
    console.log(error);
  }
};
export default getCurrentUser;
