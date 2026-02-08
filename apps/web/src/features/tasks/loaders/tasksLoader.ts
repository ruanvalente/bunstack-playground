import type { LoaderFunctionArgs } from "react-router-dom";
import { getTasks } from "../queries/task.querie";
import type { QueryClient } from "@tanstack/react-query";

export const tasksLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    return queryClient.ensureQueryData({
      queryKey: ["tasks", page, pageSize],
      queryFn: () => getTasks(page, pageSize),
    });
  };
