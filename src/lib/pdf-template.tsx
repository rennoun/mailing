import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { SERVICES } from "./service-matcher";
import { translations, type Language } from "./i18n";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11, color: "#1a1a1a" },
  header: { marginBottom: 30, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e3a5f", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#5a6a7a" },
  divider: { borderBottom: "2px solid #1e3a5f", marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1e3a5f", marginBottom: 10, marginTop: 20 },
  paragraph: { marginBottom: 8, lineHeight: 1.6 },
  serviceBox: { backgroundColor: "#f0f4f8", padding: 12, marginBottom: 8, borderRadius: 4, borderLeft: "3px solid #1e3a5f" },
  serviceName: { fontSize: 12, fontWeight: "bold", color: "#1e3a5f", marginBottom: 4 },
  serviceDesc: { fontSize: 10, color: "#4a5568" },
  whyItem: { flexDirection: "row", marginBottom: 6, alignItems: "center" as const },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1e3a5f", marginRight: 8 },
  contactSection: { backgroundColor: "#1e3a5f", color: "#ffffff", padding: 20, borderRadius: 6, marginTop: 20 },
  contactTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#ffffff" },
  contactLine: { fontSize: 11, marginBottom: 4, color: "#e0e8f0" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 9, color: "#9ca3af" },
});

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

export function createPdfDocument(language: Language, companyInfo: CompanyInfo) {
  const t = translations[language].pdf;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{companyInfo.name}</Text>
          <Text style={styles.subtitle}>{t.title}</Text>
        </View>

        <View style={styles.divider} />

        {/* About */}
        <Text style={styles.sectionTitle}>{t.aboutTitle}</Text>
        <Text style={styles.paragraph}>{t.aboutText}</Text>

        {/* Services */}
        <Text style={styles.sectionTitle}>{t.servicesTitle}</Text>
        {SERVICES.map((service) => (
          <View key={service.id} style={styles.serviceBox}>
            <Text style={styles.serviceName}>{service.name[language]}</Text>
            <Text style={styles.serviceDesc}>{service.description[language]}</Text>
          </View>
        ))}

        <Text style={styles.footer}>{companyInfo.name} — {companyInfo.website}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Why Choose Us */}
        <Text style={styles.sectionTitle}>{t.whyTitle}</Text>
        {[t.why1, t.why2, t.why3, t.why4, t.why5].map((item, i) => (
          <View key={i} style={styles.whyItem}>
            <View style={styles.bullet} />
            <Text>{item}</Text>
          </View>
        ))}

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>{t.contactTitle}</Text>
          <Text style={styles.contactLine}>{companyInfo.name}</Text>
          <Text style={styles.contactLine}>{companyInfo.address}</Text>
          <Text style={styles.contactLine}>{companyInfo.phone}</Text>
          <Text style={styles.contactLine}>{companyInfo.email}</Text>
          <Text style={styles.contactLine}>{companyInfo.website}</Text>
        </View>

        <Text style={styles.footer}>{companyInfo.name} — {companyInfo.website}</Text>
      </Page>
    </Document>
  );
}
