import { forwardRef, useCallback, useRef, useState } from "react";
import { ArrowDown, ThumbsDown, ThumbsUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAutoScroll } from "@/hooks/use-auto-scroll"
import { Button } from "@/Components/ui/button"
import { CopyButton } from "@/Components/ui/copy-button"
import { MessageInput } from "@/Components/ui/message-input"
import { MessageList } from "@/Components/ui/message-list"
import { PromptSuggestions } from "@/Components/ui/prompt-suggestions"
import { ScrollArea } from "@/Components/ui/scroll-area";

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
  setMessages,
  transcribeAudio
}) {
  const lastMessage = messages.at(-1)
  // Ganti logika isEmpty agar suggestions muncul jika belum ada pesan user
  const isEmpty = messages.filter(m => m.role === 'user').length === 0;
  const isTyping = lastMessage?.role === "user"

  const messagesRef = useRef(messages)
  messagesRef.current = messages

  // Enhanced stop function that marks pending tool calls as cancelled
  const handleStop = useCallback(() => {
    stop?.()

    if (!setMessages) return

    const latestMessages = [...messagesRef.current]
    const lastAssistantMessage = latestMessages.findLast((m) => m.role === "assistant")

    if (!lastAssistantMessage) return

    let needsUpdate = false
    let updatedMessage = { ...lastAssistantMessage }

    if (lastAssistantMessage.toolInvocations) {
      const updatedToolInvocations = lastAssistantMessage.toolInvocations.map((toolInvocation) => {
        if (toolInvocation.state === "call") {
          needsUpdate = true
          return {
            ...toolInvocation,
            state: "result",

            result: {
              content: "Tool execution was cancelled",
              __cancelled: true, // Special marker to indicate cancellation
            }
          };
        }
        return toolInvocation
      })

      if (needsUpdate) {
        updatedMessage = {
          ...updatedMessage,
          toolInvocations: updatedToolInvocations,
        }
      }
    }

    if (lastAssistantMessage.parts && lastAssistantMessage.parts.length > 0) {
      const updatedParts = lastAssistantMessage.parts.map((part) => {
        if (
          part.type === "tool-invocation" &&
          part.toolInvocation &&
          part.toolInvocation.state === "call"
        ) {
          needsUpdate = true
          return {
            ...part,
            toolInvocation: {
              ...part.toolInvocation,
              state: "result",
              result: {
                content: "Tool execution was cancelled",
                __cancelled: true,
              },
            },
          }
        }
        return part
      })

      if (needsUpdate) {
        updatedMessage = {
          ...updatedMessage,
          parts: updatedParts,
        }
      }
    }

    if (needsUpdate) {
      const messageIndex = latestMessages.findIndex((m) => m.id === lastAssistantMessage.id)
      if (messageIndex !== -1) {
        latestMessages[messageIndex] = updatedMessage
        setMessages(latestMessages)
      }
    }
  }, [stop, setMessages, messagesRef])

  const messageOptions = useCallback((message) => ({
    actions: onRateResponse ? (
      <>
        <div className="border-r pr-1">
          <CopyButton content={message.content} copyMessage="Copied response to clipboard!" />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onRateResponse(message.id, "thumbs-up")}>
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onRateResponse(message.id, "thumbs-down")}>
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </>
    ) : (
      <CopyButton content={message.content} copyMessage="Copied response to clipboard!" />
    ),
  }), [onRateResponse])

  return (
    <ChatContainer className={cn("h-full flex flex-col", className)}>
      <div className="flex-1 flex flex-col min-h-0">
        {isEmpty && append && suggestions ? (
          <PromptSuggestions label="Klinik Gunung AI ✨" append={append} suggestions={suggestions} />
        ) : null}
        {messages.length > 0 ? (
          <ChatMessages messages={messages}>
            <MessageList messages={messages} isTyping={isTyping} messageOptions={messageOptions} />
          </ChatMessages>
        ) : null}
      </div>
      <ChatForm
        className="mt-0"
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}>
        {({ files, setFiles }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            // allowAttachments
            files={files}
            setFiles={setFiles}
            stop={handleStop}
            isGenerating={isGenerating}
            transcribeAudio={transcribeAudio} />
        )}
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = "Chat"

export function ChatMessages({
  messages,
  children
}) {
  // Auto-scroll logic tetap bisa dipakai jika ingin, atau bisa dihilangkan jika ScrollArea sudah cukup
  // const {
  //   containerRef,
  //   scrollToBottom,
  //   handleScroll,
  //   shouldAutoScroll,
  //   handleTouchStart,
  // } = useAutoScroll([messages])

  return (
    <ScrollArea className="flex-1 w-full pr-2 min-h-0">
      <div className="max-w-full">
        {children}
      </div>
    </ScrollArea>
  );
}

export const ChatContainer = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-full flex flex-col", className)}
      {...props} />
  );
})
ChatContainer.displayName = "ChatContainer"

export const ChatForm = forwardRef(({ children, handleSubmit, isPending, className }, ref) => {
  const [files, setFiles] = useState(null)

  const onSubmit = (event) => {
    if (!files) {
      handleSubmit(event)
      return
    }

    const fileList = createFileList(files)
    handleSubmit(event, { experimental_attachments: fileList })
    setFiles(null)
  }

  return (
    (<form ref={ref} onSubmit={onSubmit} className={className}>
      {children({ files, setFiles })}
    </form>)
  );
})
ChatForm.displayName = "ChatForm"

function createFileList(files) {
  const dataTransfer = new DataTransfer()
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file)
  }
  return dataTransfer.files
}
