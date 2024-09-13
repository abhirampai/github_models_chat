import { useContext } from "react";
import Footer from "./Chat/Footer";
import classNames from "classnames";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import Header from "./Chat/Header";
import { AppState } from "../Hooks/utils";

const Chat = () => {
  const { chatboxMessages } = useContext(AppState);

  return (
    <div className="p-2 overflow-hidden space-y-5">
      <Header />
      <div className="w-full bg-gray-700 chatbox overflow-y-auto rounded-lg">
        {chatboxMessages &&
          chatboxMessages.map((message, idx) => (
            <div
              className={classNames("chat", {
                "chat-start": message.initiator === "model",
                "chat-end": message.initiator === "client",
              })}
              key={idx}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <div className="chat-header capitalize text-white">
                {message.initiator === "client" ? "you" : message.modelName}
                <time className="text-xs opacity-50 pl-2">{message.time}</time>
              </div>
              <div className="chat-bubble chat-bubble-accent">
                <MDEditor.Markdown
                  source={message.message}
                  style={{
                    padding: 10,
                    backgroundColor: "transparent",
                  }}
                  previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                />
              </div>
            </div>
          ))}
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
