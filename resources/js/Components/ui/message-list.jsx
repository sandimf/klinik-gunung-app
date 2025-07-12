import { ChatMessage } from "@/Components/ui/chat-message";
import { TypingIndicator } from "@/Components/ui/typing-indicator"

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions
}) {
  return (
    (<div className="space-y-4 mb-4 overflow-visible">
      <br />
      {messages.map((message, index) => {
        const additionalOptions =
          typeof messageOptions === "function"
            ? messageOptions(message)
            : messageOptions

        return (
          (<ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            {...message}
            {...additionalOptions} />)
        );
      })}
      {isTyping && <TypingIndicator />}
    </div>)
  );
}
