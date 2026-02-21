import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/header';

export default function RootLayout() {
  return (
    <div className="min-h-screen text-foreground">
      <div className="sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center">
            <div className="flex-1">
              <Header />
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
