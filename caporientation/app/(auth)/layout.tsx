import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentification - CapOrientation 360',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            CapOrientation 360
          </h1>
          <p className="text-gray-600 mt-2">
            Connexion à votre espace professionnel
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
