import MessagesDisplay from "./components/MessagesDisplay";
import CodeDisplay from "./components/CodeDisplay";
import { useState } from "react";

interface ChatData {
  role: string;
  content: string;
}

function App() {
  const [chat, setChat] = useState<ChatData[]>([]);
  const [value, setValue] = useState<string>();

  const getQuery = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
        }),
      };
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      const userMessage = {
        role: "user",
        content: value,
      };
      setChat((oldChat) => [...oldChat, data, userMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const clearChat = () => {
    setValue("");
    setChat([]);
  };

  const filteredMessages = chat.filter((message) => message.role === "user");
  const filteredAssitantMessages = chat
    ?.filter((message) => message.role === "assistant")
    ?.pop();
  return (
    <div className="app">
      <MessagesDisplay userMessages={filteredMessages} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <CodeDisplay text={filteredAssitantMessages?.content || ""} />
      <div className="button-container">
        <button id="get-query" onClick={getQuery}>
          Get Query
        </button>
        <button id="clear-chat" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
