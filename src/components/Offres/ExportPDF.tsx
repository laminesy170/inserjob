import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Offre, Structure } from '@/types'

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#1F4E8C', padding: 20, marginBottom: 16, borderRadius: 4 },
  titre: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 4 },
  sousTitre: { fontSize: 12, color: '#DBEAFE' },
  section: { marginBottom: 12 },
  label: { fontSize: 9, color: '#2E86DE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 3 },
  texte: { fontSize: 11, color: '#2C3E50', lineHeight: 1.5 },
  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  infoBlock: { flex: 1 },
  tag: {
    backgroundColor: '#F0FDF4',
    border: '1 solid #BBF7D0',
    padding: '2 6',
    borderRadius: 6,
    fontSize: 9,
    color: '#166534',
    marginRight: 4,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  contactBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 4 },
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, borderTop: '1 solid #E2E8F0', paddingTop: 8 },
  footerTexte: { fontSize: 8, color: '#94A3B8', textAlign: 'center' },
})

interface FichePDFProps {
  offre: Offre
  structure: Structure
}

export function FichePDF({ offre, structure }: FichePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titre}>{offre.titre}</Text>
          <Text style={styles.sousTitre}>
            {offre.type_contrat} {offre.ville ? `\u2022 ${offre.ville}` : ''}
          </Text>
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Type de contrat</Text>
            <Text style={styles.texte}>{offre.type_contrat}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Localisation</Text>
            <Text style={styles.texte}>
              {offre.ville}{offre.code_postal ? ` (${offre.code_postal})` : ''}
            </Text>
          </View>
          {(offre.salaire_min || offre.salaire_max) && (
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Remuneration</Text>
              <Text style={styles.texte}>
                {offre.salaire_min && offre.salaire_max
                  ? `${offre.salaire_min}\u20AC \u2013 ${offre.salaire_max}\u20AC / mois`
                  : `${offre.salaire_min ?? offre.salaire_max}\u20AC / mois`}
              </Text>
            </View>
          )}
        </View>

        {/* Duration */}
        {offre.duree && (
          <View style={styles.section}>
            <Text style={styles.label}>Duree</Text>
            <Text style={styles.texte}>{offre.duree}</Text>
          </View>
        )}

        {/* Description */}
        {offre.description && (
          <View style={styles.section}>
            <Text style={styles.label}>Description du poste</Text>
            <Text style={styles.texte}>{offre.description}</Text>
          </View>
        )}

        {/* Competences */}
        {offre.competences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Competences recherchees</Text>
            <View style={styles.tagsRow}>
              {offre.competences.map((c: string, i: number) => (
                <Text key={i} style={styles.tag}>{c}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Contact */}
        <View style={[styles.section, styles.contactBox]}>
          <Text style={styles.label}>Pour postuler</Text>
          <Text style={styles.texte}>Contactez {structure.nom}</Text>
          {structure.telephone && (
            <Text style={styles.texte}>{structure.telephone}</Text>
          )}
          {structure.email && (
            <Text style={styles.texte}>{structure.email}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTexte}>
            Offre publiee via InserJob {'\u2022'} {structure.nom} {'\u2022'} {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
