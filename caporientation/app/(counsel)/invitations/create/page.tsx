'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CreateInvitation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    beneficiaryDisplayName: '',
    beneficiaryEmail: '',
    internalReference: '',
    expiresAt: '',
    reportToBeneficiary: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          questionnaireId: 'caporientation-360-v1', // TODO: Make dynamic
          language: 'fr',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create invitation');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Nouvelle invitation</h1>
          <p className="text-gray-600">
            Invitez un bénéficiaire à répondre au questionnaire
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            <div>
              <Input
                type="text"
                name="beneficiaryDisplayName"
                label="Prénom ou pseudonyme"
                placeholder="Camille"
                value={formData.beneficiaryDisplayName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Input
                type="email"
                name="beneficiaryEmail"
                label="Adresse e-mail"
                placeholder="camille@example.com"
                value={formData.beneficiaryEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Input
                type="text"
                name="internalReference"
                label="Référence interne (optionnel)"
                placeholder="DOSSIER-123"
                value={formData.internalReference}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                type="datetime-local"
                name="expiresAt"
                label="Date d'expiration"
                value={formData.expiresAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="reportToBeneficiary"
                id="reportToBeneficiary"
                checked={formData.reportToBeneficiary}
                onChange={handleChange}
                className="rounded"
              />
              <label
                htmlFor="reportToBeneficiary"
                className="ml-2 text-gray-700"
              >
                Envoyer le rapport au bénéficiaire
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Création...' : 'Créer l\'invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
