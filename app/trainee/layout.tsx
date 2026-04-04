import { TraineeSidebar } from '@/components/layout/TraineeSidebar';
import { TraineeBottomNav } from '@/components/layout/TraineeBottomNav';

export default function TraineeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-base">
      <TraineeSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {children}
      </div>
      <TraineeBottomNav />
    </div>
  );
}
