'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Invitation {
  id: string;
  beneficiary_display_name: string;
  beneficiary_email: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    try {
      const res = await fetch('/api/invitations');
      const json = await res.json();
      setInvitations(json.data || []);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    INVITATION_ENVOYEE: 'bg-blue-100 text-blue-800',
    EN_COURS: 'bg-yellow-100 text-yellow-800',
    RAPPORT_GENERE: 'bg-green-100 text-green-800',
    EXPIREE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Link href="/invitations/create">
          <Button>+ Nouvelle invitation</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{invitations.length}</p>
              <p className="text-gray-600">Invitations envoyées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {invitations.filter((i) => i.status === 'EN_COURS').length}
              </p>
              <p className="text-gray-600">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {invitations.filter((i) => i.status === 'RAPPORT_GENERE').length}
              </p>
              <p className="text-gray-600">Rapports générés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {invitations.filter((i) => i.status === 'EXPIREE').length}
              </p>
              <p className="text-gray-600">Expirées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Invitations récentes</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : invitations.length === 0 ? (
            <p className="text-gray-500">Aucune invitation</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Bénéficiaire</th>
                    <th className="text-left py-2">E-mail</th>
                    <th className="text-left py-2">Statut</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">
                        {inv.beneficiary_display_name}
                      </td>
                      <td className="py-3 text-gray-600">{inv.beneficiary_email}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            statusColors[inv.status] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">
                        {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
