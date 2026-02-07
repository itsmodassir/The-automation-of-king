"use client";

export default function Profile() {
    const logout = () => {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
    };

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter">Profile</h1>
                <p className="text-gray-500 font-medium">Manage your personal settings.</p>
            </div>

            <div className="bg-white border p-10 rounded-3xl space-y-8 shadow-sm">
                <div className="flex items-center gap-6 pb-8 border-b">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-black">AD</div>
                    <div>
                        <h3 className="text-2xl font-black">Admin User</h3>
                        <p className="text-gray-400">admin@aerostic.com</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <button className="w-full text-left p-4 rounded-xl border hover:bg-gray-50 font-bold transition-all">Change Password</button>
                    <button className="w-full text-left p-4 rounded-xl border hover:bg-gray-50 font-bold transition-all">Security & 2FA</button>
                    <button
                        onClick={logout}
                        className="w-full text-center p-4 rounded-xl bg-red-50 text-red-600 font-black hover:bg-red-100 transition-all"
                    >
                        Log Out of Workspace
                    </button>
                </div>
            </div>
        </div>
    );
}
