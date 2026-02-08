"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Send, MoreVertical } from "lucide-react";

export default function InboxPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            const data = await api("/api/conversations");
            setConversations(data);
            if (data.length > 0) {
                setSelectedConversation(data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        try {
            const data = await api(`/api/conversations/${conversationId}/messages`);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await api("/api/messages/send", {
                method: "POST",
                body: JSON.stringify({
                    to: selectedConversation.contactPhone,
                    message: newMessage,
                }),
            });

            setNewMessage("");
            fetchMessages(selectedConversation.id);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading inbox...</div>;
    }

    return (
        <div className="h-screen flex">
            {/* Conversations List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedConversation?.id === conv.id ? "bg-blue-50" : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{conv.contactName || conv.contactPhone}</h4>
                                        <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Messages Panel */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {selectedConversation.contactName || selectedConversation.contactPhone}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedConversation.contactPhone}</p>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <MoreVertical size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-12">
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-md px-4 py-2 rounded-lg ${msg.direction === "outbound"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-900 border border-gray-200"
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <span className="text-xs opacity-70 mt-1 block">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a conversation to view messages</p>
                    </div>
                )}
            </div>
        </div>
    );
}
