import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../feature/createConversation";
import { updateConversation } from "../feature/updateConversation";
import { sendMessage } from "../feature/sendMessage";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { addMessage, setAiMessageLoading } from "../redux/messagesSlice";

/**
 * Central place for the "send a message" flow.
 * Used by ChatInput (typed messages) and by MessageList's
 * suggestion buttons (pre-filled prompts) so both start a
 * conversation the exact same way.
 */
export const useSendMessage = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);

  const sendUserMessage = async (text, agent = "Auto") => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    let conversation = selectedConversation;
    if (!conversation) {
      const newConversation = await createConversation();
      dispatch(setSelectedConversation(newConversation));
      dispatch(addConversation(newConversation));
      conversation = newConversation;
    }

    dispatch(addMessage({ role: "user", content: trimmed }));
    dispatch(setAiMessageLoading(true));

    if (conversation?.title === "New Chat") {
      await updateConversation({ id: conversation?._id, title: trimmed });
      dispatch(
        setConvTitle({ conversationId: conversation._id, title: trimmed }),
      );
    }

    const payload = {
      prompt: trimmed,
      conversationId: conversation?._id,
      agent: agent.toLowerCase(),
    };

    const data = await sendMessage(payload);

    dispatch(
      addMessage({
        role: "assistant",
        content: data.answer,
        images: data.images,
      }),
    );
    dispatch(setAiMessageLoading(false));
  };

  return { sendUserMessage };
};
