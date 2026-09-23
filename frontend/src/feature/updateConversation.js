import API from "../../utils/axios";

export const updateConversation = async (payload) => {
  try {
    const { data } = await API.post("/api/chat/update-conversation", payload);

    return data;
  } catch (error) {
    console.log(error);
  }
};
