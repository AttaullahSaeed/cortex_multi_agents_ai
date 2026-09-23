import API from "../../utils/axios";

export const sendMessage = async (payload) => {
  try {
    const { data } = await API.post("/api/agent/chat", payload);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
