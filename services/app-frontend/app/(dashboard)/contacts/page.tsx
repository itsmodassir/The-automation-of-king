"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Plus, Edit, Trash2, User } from "lucide-react";

export default function ContactsPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const data = await api("/api/contacts");
            setContacts(data);
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm)
    );

    if (loading) {
        return <div className="p-8">Loading contacts...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
                    <p className="text-gray-500 mt-2">Manage your WhatsApp contacts and customer information.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Add Contact
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Contacts Grid */}
            {filteredContacts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <User className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">
                        {searchTerm ? "No contacts match your search." : "No contacts yet. Add your first contact!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map((contact) => (
                        <div key={contact.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{contact.name || "Unknown"}</h3>
                                        <p className="text-sm text-gray-500">{contact.phone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                        <Edit size={16} className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                            {contact.email && (
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Email:</span> {contact.email}
                                </p>
                            )}
                            {contact.tags && contact.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {contact.tags.map((tag: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
