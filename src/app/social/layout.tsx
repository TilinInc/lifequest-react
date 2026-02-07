import BottomNavigation from '@/components/Shared/BottomNavigation';
import ToastContainer from 'A/components/Shared/Toast';

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <ToastContainer />
      <main className="max-w-lg mx-auto px-4 py-4">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
