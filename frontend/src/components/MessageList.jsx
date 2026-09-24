import { useSelector } from "react-redux";
import MessageBuble from "./MessageBuble";
import { useEffect, useRef } from "react";
import AILoader from "./AILoader";
import { useSendMessage } from "../hooks/useSendMessage";

const MessageList = () => {
  const messagesEndRef = useRef(null);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, aiMessageLoading } = useSelector((state) => state.message);
  const { sendUserMessage } = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Messages change hone par (User query ya AI response par) auto scroll hoga
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    "Write a Netflix clone",
    "Explain Redis",
    "Build a dashboard",
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
              CortexAI
            </h1>
            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">
              How can I help you?
            </p>
            <p className="text-[13px] text-slate-600 max-w-65 leading-relaxed">
              Ask me anything - code, ideas, explanations, or just a quick
              question.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendUserMessage(s)}
                className="text-[12px] text-slate-400 bg-white/4 border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {messages?.map((msg, i) => (
            <div key={i}>
              <MessageBuble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || []}
              />
            </div>
          ))}
          {aiMessageLoading && <AILoader />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
