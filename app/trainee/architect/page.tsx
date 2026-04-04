import { TopBar } from '@/components/layout/TopBar';
import { ArchitectWizard } from '@/components/trainee/architect/ArchitectWizard';

export default function ArchitectPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="AI Architect" subtitle="Generate your perfect training plan" />
      <div className="flex-1 p-6">
        <ArchitectWizard />
      </div>
    </div>
  );
}
