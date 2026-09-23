import API from "../../utils/axios";

export const getConversations = async () => {
  try {
    const { data } = await API.get("/api/chat/get-conversations");
    return data;
  } catch (error) {
    console.log(error);
  }
};
