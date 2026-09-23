import API from "../../utils/axios";

export const getMessages = async (id) => {
  try {
    const { data } = await API.get(`/api/chat/get-messages/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
