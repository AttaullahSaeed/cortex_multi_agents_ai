import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    aiMessageLoading: false,
    artifacts: [],
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
    clearMessages: (state) => {
      state.messages = [];
    },
    setArtifacts: (state, action) => {
      state.artifacts = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setAiMessageLoading,
  clearMessages,
  setArtifacts,
} = messagesSlice.actions;
export default messagesSlice.reducer;
