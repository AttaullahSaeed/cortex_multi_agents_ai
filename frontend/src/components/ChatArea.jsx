import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { setArtifacts, setMessages } from "../redux/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../feature/getMessages";

const ChatArea = ({ setSidebarOpen, setArtifactOpen }) => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMesg = async () => {
      if (!selectedConversation) return;
      if (selectedConversation?.title === "New Chat") return;

      try {
        const data = await getMessages(selectedConversation._id);
        dispatch(setMessages(data || []));

        const lastMsgWithArtifacts = Array.isArray(data)
          ? [...data]
              .reverse()
              .find((msg) => msg?.artifacts && msg.artifacts.length > 0)
          : null;

        dispatch(setArtifacts(lastMsgWithArtifacts?.artifacts || []));
      } catch (err) {
        console.error("getMessages error:", err);
      }
    };

    getMesg();
  }, [selectedConversation?._id, dispatch]);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <Nav setSidebarOpen={setSidebarOpen} setArtifactOpen={setArtifactOpen} />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
