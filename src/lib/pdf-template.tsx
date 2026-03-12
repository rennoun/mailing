import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { SERVICES } from "./service-matcher";
import type { Language } from "./i18n";

// ── Brand colors: Dark Blue + Orange ──
const C = {
  navy: "#0B1D3A",
  darkBlue: "#122B52",
  orange: "#E8752A",
  white: "#FFFFFF",
  offWhite: "#F7F8FA",
  gray: "#6B7A8D",
  grayLight: "#E2E6EC",
  text: "#1A2332",
  textLight: "#4A5568",
};

const s = StyleSheet.create({
  // ── Page 1: Cover ──
  coverPage: { backgroundColor: C.navy, padding: 0, fontFamily: "Helvetica" },
  coverTopBar: { backgroundColor: C.orange, height: 6, width: "100%" },
  coverContent: { paddingHorizontal: 60, paddingTop: 140 },
  coverBrand: { fontSize: 52, fontWeight: "bold", color: C.orange, letterSpacing: 4 },
  coverBrandDot: { color: C.white },
  coverTagline: { fontSize: 14, color: C.grayLight, marginTop: 10, letterSpacing: 3, textTransform: "uppercase" },
  coverDivider: { width: 80, height: 3, backgroundColor: C.orange, marginTop: 35, marginBottom: 35 },
  coverTitle: { fontSize: 26, color: C.white, fontWeight: "bold", lineHeight: 1.4 },
  coverSubtitle: { fontSize: 11, color: C.grayLight, marginTop: 14, lineHeight: 1.7 },
  coverFooter: { position: "absolute", bottom: 40, left: 60, right: 60, flexDirection: "row", justifyContent: "space-between" },
  coverFooterText: { fontSize: 9, color: C.gray },
  coverFooterSite: { fontSize: 10, color: C.orange, fontWeight: "bold" },

  // ── Content pages ──
  page: { padding: 0, fontFamily: "Helvetica", backgroundColor: C.white },
  header: { backgroundColor: C.navy, paddingHorizontal: 50, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLogo: { fontSize: 14, fontWeight: "bold", color: C.orange, letterSpacing: 2 },
  headerTitle: { fontSize: 9, color: C.grayLight, textTransform: "uppercase", letterSpacing: 2 },
  strip: { height: 3, backgroundColor: C.orange },
  body: { paddingHorizontal: 50, paddingTop: 28, paddingBottom: 55 },
  secTitle: { fontSize: 18, fontWeight: "bold", color: C.navy, marginBottom: 5 },
  secAccent: { width: 50, height: 3, backgroundColor: C.orange, marginBottom: 16 },
  para: { fontSize: 10, color: C.textLight, lineHeight: 1.7, marginBottom: 12 },

  // Stats
  statsRow: { flexDirection: "row", gap: 14, marginBottom: 22 },
  statCard: { flex: 1, backgroundColor: C.offWhite, borderRadius: 5, padding: 14, borderTopWidth: 3, borderTopColor: C.orange },
  statNum: { fontSize: 24, fontWeight: "bold", color: C.orange, marginBottom: 3 },
  statLabel: { fontSize: 8, color: C.gray, textTransform: "uppercase", letterSpacing: 1 },

  // Services
  svcGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  svcCard: { width: "48%", backgroundColor: C.offWhite, borderRadius: 5, padding: 12, borderLeftWidth: 3, borderLeftColor: C.orange, marginBottom: 2 },
  svcName: { fontSize: 10, fontWeight: "bold", color: C.navy, marginBottom: 3 },
  svcDesc: { fontSize: 8, color: C.textLight, lineHeight: 1.5 },

  // Why us
  whyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  whyCard: { width: "48%", flexDirection: "row", gap: 8, padding: 10, backgroundColor: C.offWhite, borderRadius: 5, marginBottom: 2 },
  whyNum: { fontSize: 18, fontWeight: "bold", color: C.orange, width: 26 },
  whyBody: { flex: 1 },
  whyLabel: { fontSize: 9, fontWeight: "bold", color: C.navy, marginBottom: 2 },
  whyText: { fontSize: 7.5, color: C.textLight, lineHeight: 1.5 },

  // Industries
  indRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 20 },
  indTag: { backgroundColor: C.navy, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  indTagTxt: { fontSize: 7.5, color: C.white, letterSpacing: 0.5 },

  // CTA
  cta: { backgroundColor: C.navy, borderRadius: 8, padding: 24, flexDirection: "row", gap: 24 },
  ctaLeft: { flex: 1 },
  ctaTitle: { fontSize: 16, fontWeight: "bold", color: C.white, marginBottom: 8 },
  ctaText: { fontSize: 9, color: C.grayLight, lineHeight: 1.6 },
  ctaRight: { flex: 1 },
  ctaLine: { flexDirection: "row", marginBottom: 7 },
  ctaLabel: { fontSize: 7, color: C.gray, textTransform: "uppercase", letterSpacing: 1, width: 55 },
  ctaVal: { fontSize: 9, color: C.white, flex: 1 },
  ctaLink: { fontSize: 9, color: C.orange, flex: 1, textDecoration: "none" },

  // Footer
  pgFooter: { position: "absolute", bottom: 18, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: C.grayLight, paddingTop: 6 },
  pgFooterTxt: { fontSize: 7, color: C.gray },
  pgFooterNum: { fontSize: 7, color: C.orange, fontWeight: "bold" },
});

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

const txt = {
  en: {
    coverTitle: "Your Partner in Advanced\n3D Technology Solutions",
    coverSub: "Empowering industries with cutting-edge 3D scanning, printing, reverse engineering, and digital manufacturing solutions.",
    aboutTitle: "Who We Are",
    aboutText: "3DS.MA is a Moroccan company specialized in advanced 3D technology solutions. We combine state-of-the-art equipment with deep engineering expertise to deliver precision results for industries across the region and beyond. From concept to final part, we are your trusted 3D technology partner.",
    svcTitle: "Our Services",
    whyTitle: "Why Choose 3DS.MA",
    why: [
      { t: "Cutting-Edge Technology", d: "Latest generation 3D scanners and printers for maximum accuracy and speed." },
      { t: "Fast Turnaround", d: "Rapid delivery from scan to finished part, meeting tight deadlines." },
      { t: "Industry Expertise", d: "Deep experience across automotive, aerospace, manufacturing, and medical sectors." },
      { t: "Competitive Pricing", d: "Professional-grade results at accessible prices, tailored to your budget." },
      { t: "End-to-End Service", d: "From 3D scanning to printing to quality inspection, all under one roof." },
      { t: "Dedicated Support", d: "Personalized project management and technical support for every client." },
    ],
    indTitle: "Industries We Serve",
    industries: ["Automotive", "Aerospace", "Manufacturing", "Medical", "Architecture", "Energy", "Consumer Products", "Electronics", "Marine", "Defense"],
    ctaTitle: "Let's Work Together",
    ctaText: "Ready to optimize your production, reduce costs, and accelerate innovation? Contact us today for a free consultation.",
    stats: [
      { n: "7+", l: "Years Experience" },
      { n: "500+", l: "Projects Delivered" },
      { n: "200+", l: "Clients Served" },
      { n: "99%", l: "Satisfaction Rate" },
    ],
    pres: "Company Presentation",
    conf: "Confidential",
  },
  fr: {
    coverTitle: "Votre Partenaire en\nSolutions Technologiques 3D",
    coverSub: "Des solutions avancées de numérisation 3D, impression 3D, rétro-ingénierie et fabrication numérique au service de votre industrie.",
    aboutTitle: "Qui Sommes-Nous",
    aboutText: "3DS.MA est une entreprise marocaine spécialisée dans les solutions technologiques 3D avancées. Nous combinons des équipements de dernière génération avec une expertise approfondie en ingénierie pour offrir des résultats de précision aux industries de la région et au-delà. Du concept à la pièce finale, nous sommes votre partenaire technologique 3D de confiance.",
    svcTitle: "Nos Services",
    whyTitle: "Pourquoi Choisir 3DS.MA",
    why: [
      { t: "Technologies de Pointe", d: "Scanners et imprimantes 3D dernière génération pour une précision maximale." },
      { t: "Délais Rapides", d: "Livraison rapide du scan à la pièce finie, respect des délais de production." },
      { t: "Expertise Sectorielle", d: "Expérience approfondie dans l'automobile, l'aéronautique, le médical et plus." },
      { t: "Prix Compétitifs", d: "Résultats professionnels à des prix accessibles, adaptés à votre budget." },
      { t: "Service Complet", d: "De la numérisation 3D à l'impression et au contrôle qualité, tout sous un même toit." },
      { t: "Accompagnement Dédié", d: "Gestion de projet personnalisée et support technique pour chaque client." },
    ],
    indTitle: "Industries Servies",
    industries: ["Automobile", "Aéronautique", "Fabrication", "Médical", "Architecture", "Énergie", "Produits Grand Public", "Électronique", "Marine", "Défense"],
    ctaTitle: "Travaillons Ensemble",
    ctaText: "Prêt à optimiser votre production, réduire vos coûts et accélérer l'innovation ? Contactez-nous pour une consultation gratuite.",
    stats: [
      { n: "7+", l: "Ans d'Expérience" },
      { n: "500+", l: "Projets Livrés" },
      { n: "200+", l: "Clients Accompagnés" },
      { n: "99%", l: "Satisfaction Client" },
    ],
    pres: "Présentation de l'Entreprise",
    conf: "Confidentiel",
  },
};

export function createPdfDocument(language: Language, companyInfo: CompanyInfo) {
  const t = txt[language];
  const nm = companyInfo.name || "3DS.MA";
  const em = companyInfo.email || "contact@3ds.ma";
  const ph = companyInfo.phone || "+212 XXX XXX XXX";
  const ws = companyInfo.website || "www.3ds.ma";
  const ad = companyInfo.address || "Morocco";

  return (
    <Document>
      {/* ══════════════ PAGE 1: COVER ══════════════ */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTopBar} />
        <View style={s.coverContent}>
          <Text style={s.coverBrand}>
            3DS<Text style={s.coverBrandDot}>.MA</Text>
          </Text>
          <Text style={s.coverTagline}>
            {language === "en" ? "3D Technology Solutions" : "Solutions Technologiques 3D"}
          </Text>
          <View style={s.coverDivider} />
          <Text style={s.coverTitle}>{t.coverTitle}</Text>
          <Text style={s.coverSubtitle}>{t.coverSub}</Text>
        </View>
        <View style={s.coverFooter}>
          <Text style={s.coverFooterText}>{em}</Text>
          <Text style={s.coverFooterSite}>{ws}</Text>
        </View>
      </Page>

      {/* ══════════════ PAGE 2: ABOUT + SERVICES ══════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerLogo}>3DS.MA</Text>
          <Text style={s.headerTitle}>{t.pres}</Text>
        </View>
        <View style={s.strip} />
        <View style={s.body}>
          <Text style={s.secTitle}>{t.aboutTitle}</Text>
          <View style={s.secAccent} />
          <Text style={s.para}>{t.aboutText}</Text>

          <View style={s.statsRow}>
            {t.stats.map((st, i) => (
              <View key={i} style={s.statCard}>
                <Text style={s.statNum}>{st.n}</Text>
                <Text style={s.statLabel}>{st.l}</Text>
              </View>
            ))}
          </View>

          <Text style={s.secTitle}>{t.svcTitle}</Text>
          <View style={s.secAccent} />
          <View style={s.svcGrid}>
            {SERVICES.map((svc) => (
              <View key={svc.id} style={s.svcCard}>
                <Text style={s.svcName}>{svc.name[language]}</Text>
                <Text style={s.svcDesc}>{svc.description[language]}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.pgFooter}>
          <Text style={s.pgFooterTxt}>{nm} — {t.conf}</Text>
          <Text style={s.pgFooterNum}>2 / 3</Text>
        </View>
      </Page>

      {/* ══════════════ PAGE 3: WHY US + INDUSTRIES + CONTACT ══════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerLogo}>3DS.MA</Text>
          <Text style={s.headerTitle}>{t.whyTitle}</Text>
        </View>
        <View style={s.strip} />
        <View style={s.body}>
          <Text style={s.secTitle}>{t.whyTitle}</Text>
          <View style={s.secAccent} />
          <View style={s.whyGrid}>
            {t.why.map((w, i) => (
              <View key={i} style={s.whyCard}>
                <Text style={s.whyNum}>0{i + 1}</Text>
                <View style={s.whyBody}>
                  <Text style={s.whyLabel}>{w.t}</Text>
                  <Text style={s.whyText}>{w.d}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={s.secTitle}>{t.indTitle}</Text>
          <View style={s.secAccent} />
          <View style={s.indRow}>
            {t.industries.map((ind, i) => (
              <View key={i} style={s.indTag}>
                <Text style={s.indTagTxt}>{ind}</Text>
              </View>
            ))}
          </View>

          <View style={s.cta}>
            <View style={s.ctaLeft}>
              <Text style={s.ctaTitle}>{t.ctaTitle}</Text>
              <Text style={s.ctaText}>{t.ctaText}</Text>
            </View>
            <View style={s.ctaRight}>
              <View style={s.ctaLine}>
                <Text style={s.ctaLabel}>Email</Text>
                <Link src={`mailto:${em}`} style={s.ctaLink}>{em}</Link>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLabel}>{language === "en" ? "Phone" : "Tél."}</Text>
                <Text style={s.ctaVal}>{ph}</Text>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLabel}>Web</Text>
                <Link src={`https://${ws.replace(/^https?:\/\//, "")}`} style={s.ctaLink}>{ws}</Link>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLabel}>{language === "en" ? "Address" : "Adresse"}</Text>
                <Text style={s.ctaVal}>{ad}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={s.pgFooter}>
          <Text style={s.pgFooterTxt}>{nm} — {t.conf}</Text>
          <Text style={s.pgFooterNum}>3 / 3</Text>
        </View>
      </Page>
    </Document>
  );
}
