'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Identifiants invalides');
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            type="email"
            label="Adresse e-mail"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <Input
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Se connecter
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Vous avez besoin d&apos;aide ?{' '}
          <a href="mailto:support@caporientation.fr" className="text-primary-500 hover:underline">
            Contactez-nous
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
