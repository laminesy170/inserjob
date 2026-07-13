import React from 'react';
import { redirect } from 'next/navigation';
import { requireCounselor } from '@/lib/auth';

export default async function CounselLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireCounselor();
  } catch {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              CapOrientation 360
            </h1>
            <div className="flex gap-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Tableau de bord
              </a>
              <a
                href="/settings"
                className="text-gray-600 hover:text-gray-900"
              >
                Paramètres
              </a>
              <form action="/api/auth/logout" method="post">
                <button className="text-gray-600 hover:text-gray-900">
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
