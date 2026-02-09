import BottomNavigation from '@/components/Shared/BottomNavigation';
import ToastContainer from '@/components/Shared/Toast';
import LevelUpModal from '@/components/Dashboard/LevelUpModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <ToastContainer />
      <LevelUpModal />
      <main className="max-w-lg mx-auto px-4 py-4">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
