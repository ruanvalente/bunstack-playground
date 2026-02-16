import { Skeleton } from "./skeleton";

export function DashboardSkeleton() {
  return (
    <section className="p-6 space-y-6">
      <Skeleton className="h-8 w-40" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-8 w-12 mx-auto mt-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
