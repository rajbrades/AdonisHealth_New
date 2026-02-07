"use client"

import { useState } from "react"
import { MessageSquare, Send, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isFromPatient: boolean
}

interface Conversation {
  id: string
  participantName: string
  participantRole: "concierge" | "provider"
  participantInitials: string
  participantImage?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantName: "Sarah J.",
    participantRole: "concierge",
    participantInitials: "SJ",
    participantImage: "/images/avatars/sarah-concierge.jpg",
    lastMessage: "Great progress this week! Your check-in scores are trending up across the board.",
    lastMessageTime: "2h ago",
    unreadCount: 1,
    messages: [
      { id: "m1", senderId: "sarah", senderName: "Sarah J.", content: "Hi Michael! I wanted to check in on how you're feeling after the medication adjustment last week.", timestamp: "Feb 3, 10:15 AM", isFromPatient: false },
      { id: "m2", senderId: "patient", senderName: "You", content: "Hey Sarah! I've been feeling great actually. The energy levels are much better, especially in the mornings.", timestamp: "Feb 3, 11:30 AM", isFromPatient: true },
      { id: "m3", senderId: "sarah", senderName: "Sarah J.", content: "That's wonderful to hear! Your latest check-in shows improvement in sleep and energy. Dr. Miller will be reviewing your labs from last week.", timestamp: "Feb 3, 12:00 PM", isFromPatient: false },
      { id: "m4", senderId: "patient", senderName: "You", content: "Perfect. I did notice my injection sites have been a bit more sore. Is that normal with the dose increase?", timestamp: "Feb 3, 2:15 PM", isFromPatient: true },
      { id: "m5", senderId: "sarah", senderName: "Sarah J.", content: "Some soreness is common when adjusting. Try icing the area after injection and make sure you're rotating sites. If it persists, we'll flag it for Dr. Miller.", timestamp: "Feb 3, 2:45 PM", isFromPatient: false },
      { id: "m6", senderId: "sarah", senderName: "Sarah J.", content: "Great progress this week! Your check-in scores are trending up across the board.", timestamp: "Feb 4, 9:00 AM", isFromPatient: false },
    ],
  },
  {
    id: "conv-2",
    participantName: "Dr. Miller",
    participantRole: "provider",
    participantInitials: "DM",
    participantImage: "/images/avatars/dr-miller.jpg",
    lastMessage: "Your latest lab results look excellent. Testosterone levels are right where we want them.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      { id: "m7", senderId: "dr-miller", senderName: "Dr. Miller", content: "Michael, I've reviewed your January lab work. Great news — your testosterone levels have responded well to the protocol.", timestamp: "Feb 2, 3:00 PM", isFromPatient: false },
      { id: "m8", senderId: "dr-miller", senderName: "Dr. Miller", content: "Total T is at 850 ng/dL which is right in our target range. Free T is also looking strong at 22.5 pg/mL.", timestamp: "Feb 2, 3:01 PM", isFromPatient: false },
      { id: "m9", senderId: "patient", senderName: "You", content: "That's great to hear, Dr. Miller! I've definitely been feeling the difference. What about the estradiol?", timestamp: "Feb 2, 4:30 PM", isFromPatient: true },
      { id: "m10", senderId: "dr-miller", senderName: "Dr. Miller", content: "Your latest lab results look excellent. Testosterone levels are right where we want them. E2 is slightly elevated at 45 pg/mL — we may want to adjust your Anastrozole dose slightly. Let's discuss at your next consultation.", timestamp: "Feb 2, 5:15 PM", isFromPatient: false },
    ],
  },
  {
    id: "conv-3",
    participantName: "Lab Coordinator",
    participantRole: "concierge",
    participantInitials: "LC",
    lastMessage: "Your requisition for the February panel has been sent to Quest. You should receive it via email.",
    lastMessageTime: "5 days ago",
    unreadCount: 0,
    messages: [
      { id: "m11", senderId: "lab-coord", senderName: "Lab Coordinator", content: "Hi Michael, your next quarterly lab panel has been ordered. You should receive the requisition from Quest Diagnostics via email within 24 hours.", timestamp: "Jan 30, 10:00 AM", isFromPatient: false },
      { id: "m12", senderId: "patient", senderName: "You", content: "Got it, thanks! Same Quest location as last time?", timestamp: "Jan 30, 11:00 AM", isFromPatient: true },
      { id: "m13", senderId: "lab-coord", senderName: "Lab Coordinator", content: "Your requisition for the February panel has been sent to Quest. You should receive it via email. Yes, you can go to any Quest location. Remember to fast for 12 hours before your draw.", timestamp: "Jan 30, 11:30 AM", isFromPatient: false },
    ],
  },
]

export function PatientMessages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return
    // TODO: API call to send message
    console.log("[v0] Sending message:", { conversationId: selectedConversation.id, content: newMessage })
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground">
            {mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread message{mockConversations.reduce((sum, c) => sum + c.unreadCount, 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="border border-border flex" style={{ height: "calc(100vh - 250px)", minHeight: "500px" }}>
        {/* Conversation List */}
        <div className={cn(
          "w-80 border-r border-border flex flex-col shrink-0",
          selectedConversation ? "hidden md:flex" : "flex"
        )}>
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full p-4 text-left hover:bg-muted/30 transition-colors border-b border-border",
                  selectedConversation?.id === conv.id && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border border-border shrink-0">
                    <AvatarImage src={conv.participantImage || "/placeholder.svg"} alt={conv.participantName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {conv.participantInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-foreground text-sm">{conv.participantName}</span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-mono mb-1">
                      {conv.participantRole}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-background text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className={cn(
          "flex-1 flex flex-col",
          !selectedConversation ? "hidden md:flex" : "flex"
        )}>
          {selectedConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={selectedConversation.participantImage || "/placeholder.svg"} alt={selectedConversation.participantName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {selectedConversation.participantInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{selectedConversation.participantName}</p>
                  <p className="text-xs text-muted-foreground uppercase font-mono">{selectedConversation.participantRole}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.isFromPatient ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[70%] p-3",
                      msg.isFromPatient
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 border border-border text-foreground"
                    )}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={cn(
                        "text-xs mt-2",
                        msg.isFromPatient ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compose */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="resize-none min-h-[40px]"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
