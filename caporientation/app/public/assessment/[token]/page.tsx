'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface MetadataResponse {
  invitationId: string;
  beneficiaryName: string;
  questionnaire: {
    id: string;
    title: string;
    estimatedDuration: number;
  };
  reportToBeneficiary: boolean;
}

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/public/assessment/${token}`);
        if (!res.ok) throw new Error('Invalid or expired invitation');
        const data = await res.json();
        setMetadata(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleStart = async () => {
    if (!agreed) return;

    try {
      const res = await fetch(`/api/public/assessment/${token}/start`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to start assessment');
      const data = await res.json();
      router.push(`/public/assessment/${token}/question?session=${data.sessionId}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error || 'Error loading assessment'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">{metadata.questionnaire.title}</h1>
            <p className="text-gray-600 mt-2">
              Bienvenue, {metadata.beneficiaryName}!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">À propos de ce questionnaire</h2>
              <p className="text-blue-800 text-sm">
                Cet outil d&apos;auto-positionnement vous aide à identifier vos points forts et axes de progression
                dans la gestion de votre parcours professionnel. Il prend environ {metadata.questionnaire.estimatedDuration} minutes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Informations RGPD</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Responsable de traitement :</strong> [Organisation name]
                </p>
                <p>
                  <strong>Finalité :</strong> Aide à l&apos;orientation professionnelle
                </p>
                <p>
                  <strong>Durée de conservation :</strong> 24 mois après la fin de l&apos;accompagnement
                </p>
                <p>
                  <strong>Vos droits :</strong> Vous pouvez à tout moment accéder, rectifier ou demander la suppression de vos données.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  J&apos;ai lu les informations ci-dessus et j&apos;accepte de répondre à ce questionnaire.
                  Je comprends que cet outil n&apos;est pas un diagnostic mais un support pour mon accompagnement.
                </span>
              </label>
            </div>

            <Button
              onClick={handleStart}
              disabled={!agreed}
              className="w-full"
            >
              Commencer le questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
