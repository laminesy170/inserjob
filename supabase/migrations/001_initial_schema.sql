-- InserJob — Schéma initial de la base de données
-- ================================================

-- PROFILS UTILISATEURS
create table profiles (
  id uuid references auth.users primary key,
  role text not null check (role in ('candidat', 'entreprise', 'gestionnaire')),
  nom text,
  prenom text,
  email text,
  telephone text,
  avatar_url text,
  structure_id uuid,
  created_at timestamp with time zone default now()
);

-- STRUCTURES (PLIE, Missions Locales...)
create table structures (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  adresse text,
  ville text,
  code_postal text,
  telephone text,
  email text,
  logo_url text,
  widget_token text unique default gen_random_uuid()::text,
  created_at timestamp with time zone default now()
);

-- Ajout FK profiles -> structures
alter table profiles
  add constraint profiles_structure_id_fkey
  foreign key (structure_id) references structures(id);

-- ENTREPRISES
create table entreprises (
  id uuid primary key default gen_random_uuid(),
  structure_id uuid references structures,
  siret text unique,
  nom text not null,
  description text,
  secteur text,
  adresse text,
  ville text,
  code_postal text,
  latitude float,
  longitude float,
  logo_url text,
  contact_nom text,
  contact_email text,
  contact_telephone text,
  user_id uuid references auth.users,
  visible_candidats boolean default false,
  created_at timestamp with time zone default now()
);

-- OFFRES D'EMPLOI
create table offres (
  id uuid primary key default gen_random_uuid(),
  structure_id uuid references structures,
  entreprise_id uuid references entreprises,
  titre text not null,
  description text,
  type_contrat text check (type_contrat in ('CDI', 'CDD', 'Intérim', 'Stage', 'Alternance', 'Bénévolat')),
  duree text,
  salaire_min integer,
  salaire_max integer,
  ville text,
  code_postal text,
  latitude float,
  longitude float,
  competences jsonb default '[]',
  statut text default 'brouillon' check (statut in ('brouillon', 'en_attente', 'publiee', 'cloturee')),
  date_expiration date,
  created_by uuid references auth.users,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- CANDIDATURES
create table candidatures (
  id uuid primary key default gen_random_uuid(),
  offre_id uuid references offres on delete cascade,
  candidat_id uuid references auth.users,
  statut text default 'envoyee' check (statut in ('envoyee', 'vue', 'preselectionee', 'transmise', 'refusee', 'acceptee')),
  cv_url text,
  lettre_motivation text,
  notes_gestionnaire text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- PROFIL CANDIDAT
create table candidats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users unique,
  competences jsonb default '[]',
  experiences jsonb default '[]',
  formations jsonb default '[]',
  cv_url text,
  disponibilite text,
  mobilite_km integer default 30,
  created_at timestamp with time zone default now()
);

-- MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  expediteur_id uuid references auth.users,
  destinataire_id uuid references auth.users,
  offre_id uuid references offres,
  candidature_id uuid references candidatures,
  contenu text not null,
  lu boolean default false,
  created_at timestamp with time zone default now()
);

-- INDEX pour performance
create index idx_offres_statut on offres(statut);
create index idx_offres_structure on offres(structure_id);
create index idx_offres_ville on offres(ville);
create index idx_candidatures_offre on candidatures(offre_id);
create index idx_candidatures_candidat on candidatures(candidat_id);
create index idx_messages_destinataire on messages(destinataire_id);
create index idx_messages_expediteur on messages(expediteur_id);
create index idx_entreprises_structure on entreprises(structure_id);

-- ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table offres enable row level security;
alter table candidatures enable row level security;
alter table messages enable row level security;
alter table entreprises enable row level security;
alter table structures enable row level security;
alter table candidats enable row level security;

-- POLICIES : Profils
create policy "Users can read own profile"
  on profiles for select using (id = auth.uid());

create policy "Users can update own profile"
  on profiles for update using (id = auth.uid());

create policy "Users can insert own profile"
  on profiles for insert with check (id = auth.uid());

create policy "Gestionnaires can read all profiles"
  on profiles for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'gestionnaire')
  );

-- POLICIES : Offres
create policy "Offres publiées visibles par tous"
  on offres for select using (statut = 'publiee');

create policy "Gestionnaires voient toutes les offres de leur structure"
  on offres for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'gestionnaire'
      and p.structure_id = offres.structure_id
    )
  );

create policy "Gestionnaires peuvent créer des offres"
  on offres for insert with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'gestionnaire'
    )
  );

create policy "Gestionnaires peuvent modifier les offres de leur structure"
  on offres for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'gestionnaire'
      and p.structure_id = offres.structure_id
    )
  );

-- POLICIES : Candidatures
create policy "Candidats voient leurs candidatures"
  on candidatures for select using (candidat_id = auth.uid());

create policy "Candidats peuvent créer des candidatures"
  on candidatures for insert with check (candidat_id = auth.uid());

create policy "Candidats peuvent modifier leurs candidatures"
  on candidatures for update using (candidat_id = auth.uid());

create policy "Gestionnaires voient les candidatures de leurs offres"
  on candidatures for select using (
    exists (
      select 1 from offres o
      join profiles p on p.structure_id = o.structure_id
      where o.id = candidatures.offre_id
      and p.id = auth.uid()
      and p.role = 'gestionnaire'
    )
  );

create policy "Gestionnaires peuvent modifier les candidatures"
  on candidatures for update using (
    exists (
      select 1 from offres o
      join profiles p on p.structure_id = o.structure_id
      where o.id = candidatures.offre_id
      and p.id = auth.uid()
      and p.role = 'gestionnaire'
    )
  );

-- POLICIES : Messages
create policy "Users voient leurs messages"
  on messages for select using (
    expediteur_id = auth.uid() or destinataire_id = auth.uid()
  );

create policy "Users peuvent envoyer des messages"
  on messages for insert with check (expediteur_id = auth.uid());

create policy "Users peuvent marquer leurs messages lus"
  on messages for update using (destinataire_id = auth.uid());

-- POLICIES : Entreprises
create policy "Gestionnaires voient les entreprises de leur structure"
  on entreprises for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'gestionnaire'
      and p.structure_id = entreprises.structure_id
    )
  );

create policy "Entreprises voient leur propre profil"
  on entreprises for select using (user_id = auth.uid());

create policy "Gestionnaires peuvent gérer les entreprises"
  on entreprises for all using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'gestionnaire'
      and p.structure_id = entreprises.structure_id
    )
  );

-- POLICIES : Structures
create policy "Gestionnaires voient leur structure"
  on structures for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.structure_id = structures.id
    )
  );

-- POLICIES : Candidats
create policy "Candidats voient leur propre profil"
  on candidats for select using (user_id = auth.uid());

create policy "Candidats peuvent modifier leur profil"
  on candidats for update using (user_id = auth.uid());

create policy "Candidats peuvent créer leur profil"
  on candidats for insert with check (user_id = auth.uid());

create policy "Gestionnaires voient les profils candidats"
  on candidats for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'gestionnaire'
    )
  );

-- FUNCTION : Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger offres_updated_at
  before update on offres
  for each row execute function update_updated_at();

create trigger candidatures_updated_at
  before update on candidatures
  for each row execute function update_updated_at();

-- FUNCTION : Créer un profil après inscription
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'candidat'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
