import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center text-center px-4">
      <div>
        <div className="font-display font-black text-8xl text-gradient-gold mb-4">404</div>
        <h1 className="font-display font-bold text-2xl text-[--text-primary] mb-2">Page Not Found</h1>
        <p className="text-[--text-muted] mb-8">This page doesn&apos;t exist in the Evolution Prime ecosystem.</p>
        <Link href="/">
          <Button variant="primary" className="gap-2">
            <Zap className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
