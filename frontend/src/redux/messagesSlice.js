import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    aiMessageLoading: false,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setAiMessageLoading: (state, action) => {
      state.aiMessageLoading = action.payload;
    },
  },
});

export const { setMessages, addMessage, setAiMessageLoading } =
  messagesSlice.actions;
export default messagesSlice.reducer;
