/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceRoleClient } from '@/lib/supabase';
import { questionnaireSchema } from '@/data/questionnaires';

async function seed() {
  const supabase = createServiceRoleClient() as any;

  console.log('🌱 Seeding database...');

  try {
    // Create organization
    console.log('📦 Creating organization...');
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert([
        {
          name: 'Organisation de démonstration',
          slug: 'demo',
          status: 'ACTIVE',
          contact_email: 'admin@demo.fr',
          data_controller_name: 'Admin Démo',
          privacy_contact: 'privacy@demo.fr',
          legal_basis: 'Consentement explicite',
          retention_days: 730,
          beneficiary_report_default: true,
        },
      ])
      .select()
      .single();

    if (orgError) {
      console.error('❌ Error creating organization:', orgError.message);
      process.exit(1);
    }

    console.log('✅ Organization created:', org.id);

    // Create admin user
    console.log('👤 Creating admin user...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@demo.fr',
      password: 'DemoPassword123!',
      email_confirm: true,
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      process.exit(1);
    }

    console.log('✅ Auth user created:', authUser.user?.id);

    // Create profile
    console.log('📋 Creating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authUser.user!.id,
          organization_id: org.id,
          role: 'ADMIN',
          first_name: 'Admin',
          last_name: 'Démo',
          email: 'admin@demo.fr',
          status: 'ACTIVE',
        },
      ]);

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      process.exit(1);
    }

    console.log('✅ Profile created');

    // Create questionnaire
    console.log('📝 Creating questionnaire...');
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from('questionnaires')
      .insert([
        {
          public_id: 'caporientation-360-v1',
          version: '1.0.0',
          status: 'PUBLISHED',
          title: 'CapOrientation 360',
          language: 'fr',
          schema_json: questionnaireSchema,
          scoring_version: '1.0.0',
          published_at: new Date().toISOString(),
          created_by: authUser.user!.id,
        },
      ])
      .select()
      .single();

    if (questionnaireError) {
      console.error('❌ Error creating questionnaire:', questionnaireError.message);
      process.exit(1);
    }

    console.log('✅ Questionnaire created:', questionnaire.id);

    console.log('\n✨ Database seeding completed!');
    console.log('\n📌 Demo credentials:');
    console.log('   Email: admin@demo.fr');
    console.log('   Password: DemoPassword123!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
