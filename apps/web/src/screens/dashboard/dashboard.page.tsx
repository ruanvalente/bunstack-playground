import { BarChartWidget } from "@/web/features/dashboard/widgets/bar-chart.widget";
import { LineChartWidget } from "@/web/features/dashboard/widgets/line-chart.widget";

export default function DashboardPage() {
  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard Page</h1>
      {/* Card Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                $45,231.89
              </p>
              <p className="text-sm text-green-600 mt-2">
                +20% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">+2,350</p>
              <p className="text-sm text-green-600 mt-2">
                +180% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3.24%</p>
              <p className="text-sm text-green-600 mt-2">
                +4.3% from last month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Session</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4m 32s</p>
              <p className="text-sm text-red-600 mt-2">-2.1% from last month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Acess Section */}

      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Quick Access</h3>
          <p className="text-sm text-gray-500 mt-2">
            Navigate to detailed analytics pages
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group flex flex-col items-center justify-center px-8 py-10 bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:shadow-md hover:cursor-pointer transition-all duration-300">
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>

              <span className="text-lg font-medium text-gray-800">
                Analytics Details
              </span>

              <span className="mt-3 text-sm text-gray-500 flex items-center group-hover:text-blue-600 transition-colors">
                Access Now
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </span>
            </button>

            <button className="group flex flex-col items-center justify-center px-8 py-10 bg-gray-50 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 hover:shadow-md hover:cursor-pointer transition-all duration-300">
              <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>

              <span className="text-lg font-medium text-gray-800">
                Sales Dashboard
              </span>

              <span className="mt-3 text-sm text-gray-500 flex items-center group-hover:text-green-600 transition-colors">
                Access Now
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </span>
            </button>

            <button className="group flex flex-col items-center justify-center px-8 py-10 bg-gray-50 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:shadow-md hover:cursor-pointer transition-all duration-300">
              <div className="bg-purple-100 p-4 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>

              <span className="text-lg font-medium text-gray-800">
                User Management
              </span>

              <span className="mt-3 text-sm text-gray-500 flex items-center group-hover:text-purple-600 transition-colors">
                Access Now
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Monthly revenue for the last 7 months
          </p>
          <div className="mt-6 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-gray-400">
              <LineChartWidget />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total active users over time
          </p>
          <div className="mt-6 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-gray-400">
              <BarChartWidget />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
