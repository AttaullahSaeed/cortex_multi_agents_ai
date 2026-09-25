import { Code2, Eye, PanelRightClose, PanelRightOpen } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Artifact() {
  const { artifacts } = useSelector((state) => state.message);
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);

  const artifact = artifacts?.[0];
  const files = artifact?.files || [];
  const currentFile = files[activeFile];

  const previewHtml = useMemo(() => {
    if (!files.length) return "";

    const htmlFile = files.find((f) => f.name.endsWith(".html"));
    const cssFile = files.find((f) => f.name.endsWith(".css"));
    const jsFile = files.find((f) => f.name.endsWith(".js"));

    if (!htmlFile) {
      return "<h2 style='color:white;padding:20px'>No HTML file found</h2>";
    }

    let html = htmlFile.content;

    // Inject CSS
    if (cssFile) {
      html = html.replace(
        /<link[^>]*href=["']style\.css["'][^>]*>/i,
        `<style>${cssFile.content}</style>`,
      );
    }

    // Inject JS
    if (jsFile) {
      html = html.replace(
        /<script[^>]*src=["']script\.js["'][^>]*><\/script>/i,
        `<script>${jsFile.content}</script>`,
      );
    }

    return html;
  }, [files]);

  // Detect language for syntax highlighter
  const getLanguage = (filename = "") => {
    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".jsx")) return "jsx";
    if (filename.endsWith(".ts")) return "typescript";
    if (filename.endsWith(".tsx")) return "tsx";
    if (filename.endsWith(".json")) return "json";
    return "text";
  };

  if (!artifacts || artifacts.length === 0) return null;

  return (
    <motion.div
      initial={{ width: 350 }}
      animate={{ width: collapsed ? 48 : 480 }}
      transition={{ duration: 0.25, ease: easeInOut }}
      className="hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0"
    >
      {!collapsed ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          {/* Header */}
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCollapsed(true)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <PanelRightClose size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <Code2 className="text-indigo-400" size={12} />
              </div>
              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifact?.title}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
              <button
                onClick={() => setTab("code")}
                className={`flex items-center cursor-pointer gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  tab === "code"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <Code2 size={11} /> Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center cursor-pointer gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  tab === "preview"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
          </div>

          {/* File Tabs */}
          {tab === "code" && (
            <div className="flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {files.map((f, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFile(index)}
                  className={`px-4 py-2.5 cursor-pointer text-[11px] font-medium whitespace-nowrap transition-colors border-r border-white/[0.05] relative ${
                    activeFile === index
                      ? "text-indigo-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {f.name}
                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {tab === "code" ? (
              <SyntaxHighlighter
                language={getLanguage(currentFile?.name)}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  background: "transparent",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  height: "100%",
                }}
                showLineNumbers
                wrapLongLines
              >
                {currentFile?.content || "No content"}
              </SyntaxHighlighter>
            ) : (
              <iframe
                title="preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0 bg-white"
                // allow-forms is required for form submission
                sandbox="allow-scripts allow-forms"
              />
            )}
          </div>
        </div>
      ) : (
        /* Collapsed state */
        <div className="flex h-full flex-col items-center py-4 gap-3 bg-[#0d0f14]">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors bg-transparent border-none cursor-pointer"
          >
            <PanelRightOpen size={16} />
          </button>
          <div
            className="text-[10px] font-medium text-slate-600 tracking-widest uppercase"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            {artifact?.title}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Artifact;
