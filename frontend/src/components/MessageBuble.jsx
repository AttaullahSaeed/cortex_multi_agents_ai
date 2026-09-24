import { X, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language, codeString }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 text-[11px] text-slate-400 font-mono">
        <span>{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer bg-transparent border-none"
        >
          {copied ? (
            <>
              <Check size={12} /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "13px",
          background: "rgba(15, 23, 42, 0.8)",
        }}
        wrapLongLines
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

const MessageBuble = ({ role, content, images }) => {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  return (
    <div className={`flex  ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed
      ${
        isUser
          ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
          : " text-slate-200 rounded-tl-sm"
      }`}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                loading="lazy"
                onClick={() => setLightBox(img)}
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            ))}
          </div>
        )}

        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-6   border-b border-white/10 text-white">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-5 mb-3 text-white/90">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium mt-4 mb-2 text-white/80">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-medium mt-3 mb-1 text-white/70">
                {children}
              </h4>
            ),

            // Text & Paragraphs
            p: ({ children }) => (
              <p className="text-slate-300 leading-relaxed  text-sm md:text-base">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-slate-200">{children}</em>
            ),

            // Lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside my-3 space-y-1.5 text-slate-300 pl-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside my-3 space-y-1.5 text-slate-300 pl-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),

            // Links & Media
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full rounded-xl border border-white/10 my-4 object-cover"
              />
            ),

            // Blockquote & Horizontal Rule
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-white/[0.03] text-slate-400 italic rounded-r-lg">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-6 border-white/10" />,

            // Code & Inline Code
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              return inline ? (
                <code
                  className="bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <CodeBlock language={match?.[1]} codeString={codeString} />
              );
            },

            // Tables (GFM extension)
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 border border-white/10 rounded-lg">
                <table className="w-full text-left border-collapse text-sm text-slate-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-white/5 border-b border-white/10 text-white font-semibold">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-white/5">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-white/[0.02] transition">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="p-3 font-semibold">{children}</th>
            ),
            td: ({ children }) => <td className="p-3">{children}</td>,
          }}
        >
          {content}
        </Markdown>
      </div>

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <button
            className="absolute cursor-pointer top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
            onClick={() => setLightBox(null)}
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBuble;
