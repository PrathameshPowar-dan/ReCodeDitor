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

        }
    }
});