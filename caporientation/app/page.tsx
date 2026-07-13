import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">CapOrientation 360</h1>
          <Link href="/auth/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Positionnez-vous pour réussir votre parcours
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              CapOrientation 360 est un outil d&apos;auto-positionnement innovant qui vous aide
              à identifier vos forces, axes de progression et pistes d&apos;amélioration dans la
              gestion de votre parcours professionnel.
            </p>
            <Link href="/auth/login">
              <Button size="lg">Commencer</Button>
            </Link>
          </div>

          <div className="bg-primary-100 rounded-lg p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary-600 mb-4">360°</div>
              <p className="text-gray-700">
                Une vision holistique de vos compétences professionnelles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Caractéristiques</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold">10 Dimensions</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Analyse complète de 10 dimensions clés de vos compétences professionnelles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold">Rapport Détaillé</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Obtenez un rapport personnalisé avec interprétations et recommandations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-xl font-semibold">Multi-Export</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Exportez vos résultats en PDF, JSON ou imprimez votre rapport.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-8">Prêt à commencer ?</h3>
        <Link href="/auth/login">
          <Button size="lg">Se connecter</Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 CapOrientation 360. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
