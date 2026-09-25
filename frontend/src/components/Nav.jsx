import { MessageSquare, Menu, Code2 } from "lucide-react";
import { useSelector } from "react-redux";

function Nav({ setSidebarOpen, setArtifactOpen }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, artifacts } = useSelector((state) => state.message);

  const hasArtifacts = artifacts && artifacts.length > 0;

  return (
    <div className="h-14 flex items-center gap-2.5 px-3 sm:px-5 border-b border-white/[0.06] bg-[#0d0f14] shrink-0">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setSidebarOpen?.(true)}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-colors bg-transparent border-none cursor-pointer shrink-0"
      >
        <Menu size={18} />
      </button>

      {selectedConversation ? (
        <>
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0">
            <MessageSquare size={13} className="text-indigo-400" />
          </div>

          <div className="text-[14px] font-semibold text-slate-100 tracking-tight truncate min-w-0">
            {selectedConversation?.title || "New Chat"}
          </div>

          <div className="hidden sm:block text-[10px] font-medium text-slate-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full shrink-0">
            {messages?.length || 0} Messages
          </div>
        </>
      ) : (
        <div className="text-[14px] font-semibold text-slate-400 tracking-tight">
          CortexAI
        </div>
      )}

      <div className="flex-1" />

      {/* Mobile: open artifacts */}
      {hasArtifacts && (
        <button
          type="button"
          onClick={() => setArtifactOpen?.(true)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors bg-transparent border-none cursor-pointer shrink-0"
          title="View code"
        >
          <Code2 size={17} />
        </button>
      )}
    </div>
  );
}

export default Nav;
