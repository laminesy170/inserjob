'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Dimension {
  dimensionId: string;
  dimensionTitle: string;
  score: number;
  level: string;
  interpretation: string;
  recommendations: string[];
}

interface Result {
  overallScore: number;
  level: string;
  dimensions: Dimension[];
  generatedAt: string;
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [id]);

  async function fetchResult() {
    try {
      const res = await fetch(`/api/results/${id}`);
      if (!res.ok) throw new Error('Result not found');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A renforcer':
        return 'text-red-600';
      case 'En développement':
        return 'text-yellow-600';
      case 'Opérationnel':
        return 'text-green-600';
      case 'Autonome':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch (level) {
      case 'A renforcer':
        return 'bg-red-50';
      case 'En développement':
        return 'bg-yellow-50';
      case 'Opérationnel':
        return 'bg-green-50';
      case 'Autonome':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error || 'Error loading results'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <CardHeader>
            <h1 className="text-3xl font-bold">Votre rapport d'auto-positionnement</h1>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-6xl font-bold mb-2">{result.overallScore}</div>
              <div className="text-xl font-semibold">{result.level}</div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Vos scores par dimension</h2>

          {result.dimensions.map((dim) => (
            <Card key={dim.dimensionId} className={getLevelBgColor(dim.level)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{dim.dimensionTitle}</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{dim.score}</div>
                    <div className={`text-sm font-semibold ${getLevelColor(dim.level)}`}>
                      {dim.level}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Interprétation</h4>
                  <p className="text-gray-700">{dim.interpretation}</p>
                </div>

                {dim.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Pistes d'amélioration</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {dim.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-gray-700">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => window.print()}
            className="flex-1"
            variant="outline"
          >
            Imprimer le rapport
          </Button>
          <Button
            onClick={() =>
              fetch(`/api/results/${id}/export.json`)
                .then((r) => r.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `rapport-${id}.json`;
                  a.click();
                })
            }
            className="flex-1"
            variant="outline"
          >
            Télécharger en JSON
          </Button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Rapport généré le {new Date(result.generatedAt).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}
