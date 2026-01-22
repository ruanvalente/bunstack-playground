import { Outlet } from "react-router";

import "../../index.css";

export default function MainLayout() {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar here */}
          <div className="flex-1 flex flex-col">
            {/* Header Here */}
            <main className="flex-1 overflow-auto py-8 px-4">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
