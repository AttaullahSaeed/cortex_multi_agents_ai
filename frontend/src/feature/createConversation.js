import API from "../../utils/axios";

export const createConversation = async () => {
  try {
    const { data } = await API.get("/api/chat/create-conversation");

    return data;
  } catch (error) {
    console.log(error);
  }
};
