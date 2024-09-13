import { createContext } from "react";
import { signal } from "@preact/signals-react";
import { observable } from "preact-observables";

export const createAppState = () => {
  const defaultModel = "Meta-Llama-3-8B-Instruct";
  const selectedModel = signal(defaultModel);
  const chatboxMessages = observable([]);
  const clientMessage = signal("");
  const isLoading = signal(false);

  return {
    selectedModel,
    chatboxMessages,
    isLoading,
    clientMessage,
  };
};

export const AppState = createContext();
