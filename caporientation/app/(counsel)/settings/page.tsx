'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    organizationName: '',
    contactEmail: '',
    notificationsEmail: true,
    notificationsPush: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et configuration</p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Paramètres sauvegardés
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Organisation</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              label="Nom de l&apos;organisation"
              placeholder="Ex: Centre d&apos;insertion professionnelle"
              value={settings.organizationName}
              onChange={(e) =>
                setSettings({ ...settings, organizationName: e.target.value })
              }
            />
          </div>

          <div>
            <Input
              type="email"
              label="E-mail de contact"
              placeholder="contact@exemple.fr"
              value={settings.contactEmail}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Sauvegarder
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Notifications</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label>
              <input
                type="checkbox"
                checked={settings.notificationsEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationsEmail: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Notifications par e-mail
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label>
              <input
                type="checkbox"
                checked={settings.notificationsPush}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationsPush: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Notifications push navigateur
            </label>
          </div>

          <Button onClick={handleSave} className="w-full">
            Sauvegarder
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Compte</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm">
            Pour modifier votre mot de passe ou vos données de compte, veuillez
            contacter l&apos;administrateur.
          </p>

          <form action="/api/auth/logout" method="post">
            <Button variant="danger" className="w-full">
              Déconnexion
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
