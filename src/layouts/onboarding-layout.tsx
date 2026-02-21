import { Outlet } from 'react-router-dom';

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen text-foreground flex flex-row min-w-screen w-[100vw] h-[100vh] p-4">
      <main className="container flex items-center justify-center flex-1">
        <Outlet />
      </main>
    </div>
  );
}
