import React from "react";

const AILoader = () => {
  return (
    <div className="flex justify-start my-2">
      <div className="max-w-[60%] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] rounded-tl-sm flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
      </div>
    </div>
  );
};

export default AILoader;
