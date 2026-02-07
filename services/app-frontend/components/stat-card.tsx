export function StatCard({ title, value, icon }: { title: string; value: any; icon?: any }) {
    return (
        <div className="bg-white border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                <div className="text-black">{icon}</div>
            </div>
            <h4 className="text-3xl font-black font-mono">{value}</h4>
        </div>
    );
}
