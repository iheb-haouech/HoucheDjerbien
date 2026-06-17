export default function DashboardStats({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
      {data.map((item) => (
        <div key={item.label} className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm uppercase tracking-wide text-gray-500">{item.label}</p>
          <p className="text-2xl font-bold text-navy mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
