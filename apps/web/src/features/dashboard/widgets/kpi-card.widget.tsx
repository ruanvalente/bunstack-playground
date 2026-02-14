type KPICardProps = {
  title: string;
  value: string | number;
  change: number;
  icon: "tasks" | "completed" | "pending" | "rate";
};

function formatChange(change: number): string {
  const prefix = change >= 0 ? "+" : "";
  return `${prefix}${change}%`;
}

function getChangeClass(change: number): string {
  return change >= 0 ? "text-green-600" : "text-red-600";
}

const icons = {
  tasks: (
    <svg
      className="w-6 h-6 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  ),
  completed: (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  pending: (
    <svg
      className="w-6 h-6 text-purple-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  rate: (
    <svg
      className="w-6 h-6 text-orange-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
};

const bgColors = {
  tasks: "bg-green-100",
  completed: "bg-blue-100",
  pending: "bg-purple-100",
  rate: "bg-orange-100",
};

export function KPICard({ title, value, change, icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${getChangeClass(change)}`}>
            {formatChange(change)} from last period
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColors[icon]}`}>{icons[icon]}</div>
      </div>
    </div>
  );
}
