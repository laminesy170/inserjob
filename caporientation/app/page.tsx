'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CapOrientation 360
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Auto-positionnement à l&apos;orientation professionnelle
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button>Accéder à mon espace</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
