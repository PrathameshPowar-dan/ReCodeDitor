import { create } from "zustand";
import { LANGUAGE_CONFIG } from "@/app/(home)/_constants";
import { CodeEditorState } from "@/types";
import type { editor } from "monaco-editor";

const getIntialState = () => {
    if (typeof window === "undefined") {
        return {
            language: "javascript",
            fontSize: 14,
            theme: "vs-dark",
        }
    }

    const savedLanguage = localStorage.getItem("editor-language") || "javascript";
    const savedFontSize = localStorage.getItem("editor-font-size") || 14
    const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";

    return {
        language: savedLanguage,
        theme: savedTheme,
        fontSize: Number(savedFontSize),
    }
}

export const useStore = create<CodeEditorState>((set, get) => {
    const initialState = getIntialState();

    return {
        ...initialState,
        output: "",
        isRunning: false,
        error: null,
        editor: null,
        executionResult: null,

        getCode: () => {
            const ed = get().editor;
            return ed ? ed.getValue() : "";
        },

        setEditor: (editor: editor.IStandaloneCodeEditor | null) => {
            const savedCode = localStorage.getItem(`editor-code-${get().language}`);
            if (editor && savedCode) editor.setValue(savedCode);
            set({ editor });
        },

        setTheme: (theme: string) => {
            localStorage.setItem("editor-theme", theme);
            set({ theme });
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-font-size", fontSize.toString());
            set({ fontSize });
        },

        setLanguage: (language: string) => {
            const currentCode = get().editor?.getValue();
            if (currentCode) {
                localStorage.setItem(`editor-code-${get().language}`, currentCode);
            }

            localStorage.setItem("editor-language", language);

            set({
                language,
                output: "",
                error: null,
            });
        },

        runCode: async () => {
            const { language, getCode } = get();

            const code = getCode();
            if (!code.trim()) {
                set({ error: "Code is empty. Please write some code to run." });
                return;
            }
            set({ isRunning: true, output: "", error: null, executionResult: null });

            try {
                const runtime = LANGUAGE_CONFIG[language]?.pistonRuntime;
                const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        language: runtime.language,
                        version: runtime.version,
                        files: [{ content: code }]
                    }),
                });

                const data = await response.json();
                console.log("Piston Data", data)

                if (data?.message) {
                    set({ error: data.message, executionResult: { code, output: "", error: data.message } });
                    return;
                }

                if (data.compiler && data.compile.code !== 0) {
                    const error = data.compile.stderr || data.compile.output || "Compilation error";
                    set({ error, executionResult: { code, output: "", error } });
                    return;
                }

                if (data.run && data.run.code !== 0) {
                    const error = data.run.stderr || data.run.output || "Runtime error";
                    set({ error, executionResult: { code, output: "", error } });
                    return;
                }

                const output = data.run.output;

                set({
                    output: output.trim(),
                    error: null,
                    executionResult: {
                        code,
                        output: output.trim(),
                        error: null
                    }
                });
            } catch (error) {
                console.error("Error executing code:", error);
                set({ error: "Error executing code. Please try again." });
            } finally {
                set({ isRunning: false });
            }
        }
    }
});