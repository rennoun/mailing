import React from "react";
import { Document, Page, Text, View, StyleSheet, Link, Svg, Rect, Circle, Path, G, Polygon } from "@react-pdf/renderer";
import { SERVICES } from "./service-matcher";
import type { Language } from "./i18n";

// ── Brand Colors ──
const C = {
  navy: "#0B1D3A",
  navyLight: "#162D50",
  orange: "#E8752A",
  orangeLight: "#F29650",
  orangeDark: "#C85D1A",
  white: "#FFFFFF",
  offWhite: "#F7F8FA",
  cream: "#FFF8F2",
  gray: "#6B7A8D",
  grayLight: "#E2E6EC",
  grayDark: "#3A4A5C",
  text: "#1A2332",
  textLight: "#4A5568",
  green: "#27AE60",
  blue: "#2D7DD2",
};

// ── SVG Icons as inline components ──
function IconScan() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Rect x="2" y="2" width="8" height="3" rx="1" fill={C.orange} />
      <Rect x="2" y="2" width="3" height="8" rx="1" fill={C.orange} />
      <Rect x="18" y="2" width="8" height="3" rx="1" fill={C.orange} />
      <Rect x="23" y="2" width="3" height="8" rx="1" fill={C.orange} />
      <Rect x="2" y="23" width="8" height="3" rx="1" fill={C.orange} />
      <Rect x="2" y="18" width="3" height="8" rx="1" fill={C.orange} />
      <Rect x="18" y="23" width="8" height="3" rx="1" fill={C.orange} />
      <Rect x="23" y="18" width="3" height="8" rx="1" fill={C.orange} />
      <Circle cx="14" cy="14" r="5" fill="none" stroke={C.navy} strokeWidth="2" />
      <Circle cx="14" cy="14" r="2" fill={C.navy} />
    </Svg>
  );
}
function IconPrint() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Path d="M8 2 L14 2 L20 2 L20 12 L14 12 L8 12 Z" fill={C.orange} opacity="0.3" />
      <Rect x="6" y="14" width="16" height="4" rx="1" fill={C.navy} />
      <Rect x="8" y="18" width="12" height="8" rx="1" fill={C.orange} />
      <Rect x="10" y="4" width="8" height="2" fill={C.navy} />
      <Rect x="10" y="8" width="8" height="2" fill={C.navy} />
    </Svg>
  );
}
function IconReverse() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Path d="M14 4 C8 4 4 9 4 14" stroke={C.orange} strokeWidth="2.5" fill="none" />
      <Path d="M14 24 C20 24 24 19 24 14" stroke={C.navy} strokeWidth="2.5" fill="none" />
      <Polygon points="6,6 2,4 4,8" fill={C.orange} />
      <Polygon points="22,22 26,24 24,20" fill={C.navy} />
      <Circle cx="14" cy="14" r="3" fill={C.orange} />
    </Svg>
  );
}
function IconCAD() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Rect x="3" y="6" width="22" height="16" rx="2" fill={C.navy} />
      <Rect x="5" y="8" width="18" height="12" rx="1" fill={C.navyLight} />
      <Path d="M8 16 L12 11 L16 14 L20 10" stroke={C.orange} strokeWidth="1.5" fill="none" />
      <Circle cx="12" cy="11" r="1.5" fill={C.orange} />
      <Circle cx="16" cy="14" r="1.5" fill={C.orange} />
    </Svg>
  );
}
function IconProto() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Path d="M14 3 L24 9 L24 19 L14 25 L4 19 L4 9 Z" fill={C.orange} opacity="0.2" />
      <Path d="M14 3 L24 9 L24 19 L14 25 L4 19 L4 9 Z" stroke={C.orange} strokeWidth="1.5" fill="none" />
      <Path d="M14 3 L14 25" stroke={C.navy} strokeWidth="1" opacity="0.5" />
      <Path d="M4 9 L24 9" stroke={C.navy} strokeWidth="1" opacity="0.5" />
      <Circle cx="14" cy="14" r="3" fill={C.navy} />
    </Svg>
  );
}
function IconQC() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Circle cx="14" cy="14" r="10" fill="none" stroke={C.navy} strokeWidth="2" />
      <Path d="M9 14 L12 17 L19 10" stroke={C.orange} strokeWidth="2.5" fill="none" />
    </Svg>
  );
}
function IconSpare() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Circle cx="14" cy="14" r="10" fill="none" stroke={C.navy} strokeWidth="2" />
      <Circle cx="14" cy="14" r="4" fill="none" stroke={C.orange} strokeWidth="2" />
      <Rect x="13" y="2" width="2" height="5" fill={C.navy} />
      <Rect x="13" y="21" width="2" height="5" fill={C.navy} />
      <Rect x="2" y="13" width="5" height="2" fill={C.navy} />
      <Rect x="21" y="13" width="5" height="2" fill={C.navy} />
    </Svg>
  );
}

function IconStar() {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12">
      <Path d="M6 1 L7.5 4 L11 4.5 L8.5 7 L9 10.5 L6 9 L3 10.5 L3.5 7 L1 4.5 L4.5 4 Z" fill={C.orange} />
    </Svg>
  );
}

const SVC_ICONS: Record<string, () => React.JSX.Element> = {
  "3d-scanning": IconScan,
  "3d-printing": IconPrint,
  "reverse-engineering": IconReverse,
  "cad-design": IconCAD,
  "prototyping": IconProto,
  "quality-control": IconQC,
  "spare-parts": IconSpare,
};

// ── Decorative elements ──
function OrangeCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const size = 60;
  const pos: Record<string, Record<string, number>> = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };
  const rot: Record<string, string> = { tl: "0deg", tr: "90deg", bl: "270deg", br: "180deg" };
  return (
    <View style={{ position: "absolute", ...pos[position], width: size, height: size, transform: `rotate(${rot[position]})` }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Path d={`M0 0 L${size} 0 L0 ${size} Z`} fill={C.orange} opacity="0.08" />
      </Svg>
    </View>
  );
}

function ProcessArrow() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20">
      <Path d="M4 10 L14 10" stroke={C.orange} strokeWidth="2" />
      <Path d="M11 6 L15 10 L11 14" stroke={C.orange} strokeWidth="2" fill="none" />
    </Svg>
  );
}

// ── Styles ──
const s = StyleSheet.create({
  // Cover
  coverPage: { backgroundColor: C.navy, padding: 0, fontFamily: "Helvetica", position: "relative" },
  coverTopBar: { backgroundColor: C.orange, height: 5, width: "100%" },
  coverContent: { paddingHorizontal: 60, paddingTop: 100 },
  coverBrand: { fontSize: 56, fontWeight: "bold", color: C.orange, letterSpacing: 5 },
  coverBrandDot: { color: C.white },
  coverTagline: { fontSize: 13, color: C.grayLight, marginTop: 8, letterSpacing: 4, textTransform: "uppercase" },
  coverLine: { width: 80, height: 3, backgroundColor: C.orange, marginTop: 40, marginBottom: 40 },
  coverTitle: { fontSize: 28, color: C.white, fontWeight: "bold", lineHeight: 1.35 },
  coverSub: { fontSize: 11, color: C.grayLight, marginTop: 16, lineHeight: 1.7, maxWidth: 380 },
  coverBadges: { flexDirection: "row", gap: 12, marginTop: 35 },
  coverBadge: { backgroundColor: C.navyLight, borderRadius: 4, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: "#1E3D6E" },
  coverBadgeTxt: { fontSize: 8, color: C.orange, letterSpacing: 1, textTransform: "uppercase", fontWeight: "bold" },
  coverFooter: { position: "absolute", bottom: 35, left: 60, right: 60, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#1A3050", paddingTop: 12 },
  coverFooterL: { fontSize: 9, color: C.gray },
  coverFooterR: { fontSize: 10, color: C.orange, fontWeight: "bold" },

  // Content pages
  page: { padding: 0, fontFamily: "Helvetica", backgroundColor: C.white, position: "relative" },
  hdr: { backgroundColor: C.navy, paddingHorizontal: 50, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hdrLogo: { fontSize: 13, fontWeight: "bold", color: C.orange, letterSpacing: 2 },
  hdrTitle: { fontSize: 8, color: C.grayLight, textTransform: "uppercase", letterSpacing: 2 },
  strip: { height: 3, backgroundColor: C.orange },
  body: { paddingHorizontal: 50, paddingTop: 24, paddingBottom: 50 },
  secTitle: { fontSize: 18, fontWeight: "bold", color: C.navy, marginBottom: 4 },
  secSub: { fontSize: 9, color: C.gray, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  accent: { width: 45, height: 3, backgroundColor: C.orange, marginBottom: 14 },
  para: { fontSize: 9.5, color: C.textLight, lineHeight: 1.7, marginBottom: 10 },

  // Stats row
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  stat: { flex: 1, backgroundColor: C.offWhite, borderRadius: 5, padding: 12, borderTopWidth: 3, borderTopColor: C.orange, alignItems: "center" },
  statN: { fontSize: 22, fontWeight: "bold", color: C.orange },
  statL: { fontSize: 7, color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 },

  // Services
  svcGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  svcCard: { width: "48%", backgroundColor: C.offWhite, borderRadius: 6, padding: 12, borderLeftWidth: 3, borderLeftColor: C.orange, marginBottom: 2 },
  svcIconRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  svcName: { fontSize: 10, fontWeight: "bold", color: C.navy },
  svcDesc: { fontSize: 7.5, color: C.textLight, lineHeight: 1.5 },

  // Process / How we work
  processRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 20 },
  processStep: { alignItems: "center", width: 90 },
  processCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.orange, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  processNum: { fontSize: 16, fontWeight: "bold", color: C.white },
  processLabel: { fontSize: 7, color: C.navy, fontWeight: "bold", textAlign: "center" },
  processSubLabel: { fontSize: 6, color: C.gray, textAlign: "center", marginTop: 1 },

  // References / Testimonials
  refGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  refCard: { width: "48%", backgroundColor: C.offWhite, borderRadius: 6, padding: 14, borderBottomWidth: 3, borderBottomColor: C.orange, marginBottom: 2 },
  refQuote: { fontSize: 8, color: C.textLight, lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 },
  refAuthor: { fontSize: 8, fontWeight: "bold", color: C.navy },
  refRole: { fontSize: 7, color: C.gray },
  refStars: { flexDirection: "row", gap: 2, marginBottom: 6 },

  // Case studies
  caseCard: { backgroundColor: C.offWhite, borderRadius: 6, padding: 14, marginBottom: 10, flexDirection: "row", gap: 14, borderLeftWidth: 4, borderLeftColor: C.orange },
  caseLeft: { flex: 1 },
  caseRight: { width: 120 },
  caseTitle: { fontSize: 10, fontWeight: "bold", color: C.navy, marginBottom: 3 },
  caseSector: { fontSize: 7, color: C.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  caseDesc: { fontSize: 7.5, color: C.textLight, lineHeight: 1.6 },
  caseMetric: { backgroundColor: C.navy, borderRadius: 4, padding: 8, marginBottom: 4 },
  caseMetricN: { fontSize: 14, fontWeight: "bold", color: C.orange, textAlign: "center" },
  caseMetricL: { fontSize: 6, color: C.grayLight, textAlign: "center", textTransform: "uppercase", marginTop: 1 },

  // Equipment
  eqGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  eqCard: { width: "31%", borderRadius: 5, padding: 10, backgroundColor: C.navy },
  eqName: { fontSize: 8, fontWeight: "bold", color: C.white, marginBottom: 2 },
  eqType: { fontSize: 7, color: C.orange, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  eqSpec: { fontSize: 6.5, color: C.grayLight, lineHeight: 1.4 },

  // Certifications
  certRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  certCard: { flex: 1, borderRadius: 5, padding: 12, borderWidth: 1.5, borderColor: C.grayLight, alignItems: "center" },
  certName: { fontSize: 9, fontWeight: "bold", color: C.navy, marginTop: 6, textAlign: "center" },
  certDesc: { fontSize: 7, color: C.gray, textAlign: "center", marginTop: 2 },

  // Why us
  whyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  whyCard: { width: "48%", flexDirection: "row", gap: 8, padding: 10, backgroundColor: C.offWhite, borderRadius: 5, marginBottom: 2 },
  whyNum: { fontSize: 16, fontWeight: "bold", color: C.orange, width: 24 },
  whyBody: { flex: 1 },
  whyLabel: { fontSize: 8, fontWeight: "bold", color: C.navy, marginBottom: 2 },
  whyTxt: { fontSize: 7, color: C.textLight, lineHeight: 1.5 },

  // Industries
  indRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 16 },
  indTag: { backgroundColor: C.navy, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  indTxt: { fontSize: 7, color: C.white, letterSpacing: 0.5 },

  // CTA
  cta: { backgroundColor: C.navy, borderRadius: 8, padding: 22, flexDirection: "row", gap: 22 },
  ctaL: { flex: 1 },
  ctaTitle: { fontSize: 16, fontWeight: "bold", color: C.white, marginBottom: 6 },
  ctaTxt: { fontSize: 8.5, color: C.grayLight, lineHeight: 1.6 },
  ctaR: { flex: 1 },
  ctaLine: { flexDirection: "row", marginBottom: 6 },
  ctaLbl: { fontSize: 7, color: C.gray, textTransform: "uppercase", letterSpacing: 1, width: 52 },
  ctaVal: { fontSize: 9, color: C.white, flex: 1 },
  ctaLnk: { fontSize: 9, color: C.orange, flex: 1, textDecoration: "none" },

  // Footer
  ft: { position: "absolute", bottom: 15, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: C.grayLight, paddingTop: 5 },
  ftL: { fontSize: 6.5, color: C.gray },
  ftR: { fontSize: 6.5, color: C.orange, fontWeight: "bold" },
});

// ── Bilingual content ──
const T = {
  en: {
    coverTitle: "Your Partner in Advanced\n3D Technology Solutions",
    coverSub: "Empowering industries with precision 3D scanning, additive manufacturing, reverse engineering, and digital inspection solutions.",
    badges: ["ISO CERTIFIED", "INDUSTRY 4.0", "MADE IN MOROCCO"],
    aboutTitle: "Who We Are",
    aboutSub: "COMPANY OVERVIEW",
    aboutP1: "3DS.MA is a leading Moroccan company specialized in advanced 3D technology solutions. Founded with a vision to bridge the gap between traditional manufacturing and digital innovation, we serve as a one-stop partner for all 3D technology needs.",
    aboutP2: "Our team of experienced engineers combines state-of-the-art equipment with deep domain expertise to deliver precision results across multiple industries. We are committed to quality, speed, and innovation in every project we undertake.",
    stats: [
      { n: "7+", l: "Years" },
      { n: "500+", l: "Projects" },
      { n: "200+", l: "Clients" },
      { n: "99%", l: "Satisfaction" },
      { n: "15+", l: "Engineers" },
    ],
    svcTitle: "Our Services",
    svcSub: "COMPREHENSIVE 3D SOLUTIONS",
    processTitle: "How We Work",
    processSub: "OUR METHODOLOGY",
    steps: [
      { l: "Consultation", s: "Needs analysis" },
      { l: "3D Scanning", s: "Data capture" },
      { l: "Processing", s: "CAD modeling" },
      { l: "Production", s: "3D printing" },
      { l: "QC & Delivery", s: "Final inspection" },
    ],
    refTitle: "Client Testimonials",
    refSub: "WHAT OUR CLIENTS SAY",
    refs: [
      { q: "3DS.MA transformed our prototyping process. What used to take weeks now takes days. Their precision and professionalism are unmatched.", a: "Ahmed B.", r: "Production Director, Automotive OEM", stars: 5 },
      { q: "Outstanding quality on our reverse engineering project. The team captured every detail of our legacy parts with incredible accuracy.", a: "Sophie L.", r: "Engineering Manager, Aerospace Corp", stars: 5 },
      { q: "We've been working with 3DS.MA for 3 years. Their 3D scanning and quality control services have reduced our defect rate by 40%.", a: "Karim M.", r: "Quality Manager, Manufacturing Co.", stars: 5 },
      { q: "Fast, reliable, and cost-effective. Their spare parts manufacturing saved us significant downtime on critical production equipment.", a: "Jean-Pierre D.", r: "Maintenance Lead, Industrial Group", stars: 5 },
    ],
    caseTitle: "Project Showcase",
    caseSub: "SELECTED CASE STUDIES",
    cases: [
      { title: "Automotive Legacy Part Reproduction", sector: "Automotive", desc: "Reverse-engineered and 3D printed 50+ discontinued spare parts for a major automotive manufacturer, eliminating months-long procurement delays.", metrics: [{ n: "50+", l: "Parts" }, { n: "85%", l: "Cost Saved" }] },
      { title: "Aerospace Component Inspection", sector: "Aerospace", desc: "Performed high-precision 3D scanning and dimensional analysis on turbine blade components, ensuring compliance with strict aerospace tolerances.", metrics: [{ n: "0.02mm", l: "Accuracy" }, { n: "200+", l: "Parts Inspected" }] },
      { title: "Medical Device Prototyping", sector: "Medical", desc: "Rapid prototyped custom surgical guides and implant models using biocompatible materials, accelerating clinical validation timelines.", metrics: [{ n: "3 Days", l: "Turnaround" }, { n: "100%", l: "Fit Rate" }] },
    ],
    eqTitle: "Our Equipment",
    eqSub: "STATE-OF-THE-ART TECHNOLOGY",
    equipment: [
      { name: "Industrial 3D Scanner", type: "Scanning", spec: "Accuracy: 0.02mm\nRange: 0.2-4m\nStructured light" },
      { name: "Handheld Scanner", type: "Scanning", spec: "Portable\nReal-time mesh\nColor capture" },
      { name: "FDM Printer", type: "3D Printing", spec: "Build: 300x300x400mm\nPLA, ABS, PETG, Nylon" },
      { name: "SLA Printer", type: "3D Printing", spec: "Resolution: 25 microns\nResin-based\nSmooth finish" },
      { name: "SLS System", type: "3D Printing", spec: "PA12 Nylon\nFunctional parts\nNo supports needed" },
      { name: "CMM System", type: "Inspection", spec: "Touch probe\nDimensional analysis\nGD&T reporting" },
    ],
    certTitle: "Certifications & Standards",
    certSub: "QUALITY ASSURANCE",
    certs: [
      { name: "ISO 9001:2015", desc: "Quality Management" },
      { name: "ISO 17025", desc: "Testing & Calibration" },
      { name: "AS9100D", desc: "Aerospace Standard" },
    ],
    whyTitle: "Why Choose 3DS.MA",
    whySub: "OUR COMPETITIVE EDGE",
    why: [
      { t: "Cutting-Edge Technology", d: "Latest generation scanners and printers for unmatched accuracy." },
      { t: "Fast Turnaround", d: "From scan to part in record time, meeting tight deadlines." },
      { t: "Industry Expertise", d: "Deep experience across automotive, aerospace, medical and more." },
      { t: "Competitive Pricing", d: "Professional results at accessible prices for your budget." },
      { t: "End-to-End Service", d: "Scanning, printing, inspection — everything under one roof." },
      { t: "Dedicated Support", d: "Personal project management and technical support always." },
    ],
    indTitle: "Industries We Serve",
    industries: ["Automotive", "Aerospace", "Manufacturing", "Medical", "Architecture", "Energy", "Consumer Products", "Electronics", "Marine", "Defense"],
    ctaTitle: "Let's Work Together",
    ctaTxt: "Ready to optimize your production, reduce costs, and accelerate innovation? Contact us for a free consultation and project assessment.",
    pres: "Company Presentation",
    conf: "Confidential",
  },
  fr: {
    coverTitle: "Votre Partenaire en\nSolutions Technologiques 3D",
    coverSub: "Des solutions de numérisation 3D, fabrication additive, rétro-ingénierie et inspection numérique au service de votre industrie.",
    badges: ["CERTIFIÉ ISO", "INDUSTRIE 4.0", "MADE IN MOROCCO"],
    aboutTitle: "Qui Sommes-Nous",
    aboutSub: "PRÉSENTATION",
    aboutP1: "3DS.MA est une entreprise marocaine leader spécialisée dans les solutions technologiques 3D avancées. Fondée avec la vision de faire le lien entre la fabrication traditionnelle et l'innovation numérique, nous servons de partenaire unique pour tous les besoins en technologie 3D.",
    aboutP2: "Notre équipe d'ingénieurs expérimentés combine des équipements de pointe avec une expertise sectorielle approfondie pour offrir des résultats de précision dans de multiples industries. Nous sommes engagés pour la qualité, la rapidité et l'innovation dans chaque projet.",
    stats: [
      { n: "7+", l: "Années" },
      { n: "500+", l: "Projets" },
      { n: "200+", l: "Clients" },
      { n: "99%", l: "Satisfaction" },
      { n: "15+", l: "Ingénieurs" },
    ],
    svcTitle: "Nos Services",
    svcSub: "SOLUTIONS 3D COMPLÈTES",
    processTitle: "Notre Méthodologie",
    processSub: "COMMENT NOUS TRAVAILLONS",
    steps: [
      { l: "Consultation", s: "Analyse des besoins" },
      { l: "Numérisation", s: "Capture de données" },
      { l: "Traitement", s: "Modélisation CAO" },
      { l: "Production", s: "Impression 3D" },
      { l: "CQ & Livraison", s: "Inspection finale" },
    ],
    refTitle: "Témoignages Clients",
    refSub: "CE QUE DISENT NOS CLIENTS",
    refs: [
      { q: "3DS.MA a transformé notre processus de prototypage. Ce qui prenait des semaines ne prend plus que des jours. Précision et professionnalisme inégalés.", a: "Ahmed B.", r: "Directeur Production, OEM Automobile", stars: 5 },
      { q: "Qualité exceptionnelle sur notre projet de rétro-ingénierie. L'équipe a capturé chaque détail de nos pièces avec une précision incroyable.", a: "Sophie L.", r: "Responsable Ingénierie, Corp. Aéro.", stars: 5 },
      { q: "Nous travaillons avec 3DS.MA depuis 3 ans. Leurs services de scan 3D et contrôle qualité ont réduit notre taux de défauts de 40%.", a: "Karim M.", r: "Responsable Qualité, Fab. Industrielle", stars: 5 },
      { q: "Rapide, fiable et économique. Leur fabrication de pièces de rechange nous a épargné des temps d'arrêt importants.", a: "Jean-Pierre D.", r: "Resp. Maintenance, Groupe Industriel", stars: 5 },
    ],
    caseTitle: "Projets Réalisés",
    caseSub: "ÉTUDES DE CAS SÉLECTIONNÉES",
    cases: [
      { title: "Reproduction Pièces Auto Anciennes", sector: "Automobile", desc: "Rétro-ingénierie et impression 3D de 50+ pièces discontinuées pour un grand constructeur automobile, éliminant des mois de délai d'approvisionnement.", metrics: [{ n: "50+", l: "Pièces" }, { n: "85%", l: "Économie" }] },
      { title: "Inspection Composants Aéronautiques", sector: "Aéronautique", desc: "Numérisation 3D haute précision et analyse dimensionnelle de composants de turbine, assurant la conformité aux tolérances aéronautiques.", metrics: [{ n: "0.02mm", l: "Précision" }, { n: "200+", l: "Pièces Inspectées" }] },
      { title: "Prototypage Dispositifs Médicaux", sector: "Médical", desc: "Prototypage rapide de guides chirurgicaux et modèles d'implants en matériaux biocompatibles, accélérant les délais de validation clinique.", metrics: [{ n: "3 Jours", l: "Délai" }, { n: "100%", l: "Taux Ajustement" }] },
    ],
    eqTitle: "Nos Équipements",
    eqSub: "TECHNOLOGIES DE POINTE",
    equipment: [
      { name: "Scanner 3D Industriel", type: "Numérisation", spec: "Précision: 0.02mm\nPortée: 0.2-4m\nLumière structurée" },
      { name: "Scanner Portable", type: "Numérisation", spec: "Portable\nMaillage temps réel\nCapture couleur" },
      { name: "Imprimante FDM", type: "Impression 3D", spec: "Volume: 300x300x400mm\nPLA, ABS, PETG, Nylon" },
      { name: "Imprimante SLA", type: "Impression 3D", spec: "Résolution: 25 microns\nRésine\nFinition lisse" },
      { name: "Système SLS", type: "Impression 3D", spec: "PA12 Nylon\nPièces fonctionnelles\nSans supports" },
      { name: "Système CMM", type: "Inspection", spec: "Palpeur tactile\nAnalyse dimensionnelle\nRapport GD&T" },
    ],
    certTitle: "Certifications & Normes",
    certSub: "ASSURANCE QUALITÉ",
    certs: [
      { name: "ISO 9001:2015", desc: "Management Qualité" },
      { name: "ISO 17025", desc: "Essais & Calibration" },
      { name: "AS9100D", desc: "Norme Aéronautique" },
    ],
    whyTitle: "Pourquoi Choisir 3DS.MA",
    whySub: "NOTRE AVANTAGE COMPÉTITIF",
    why: [
      { t: "Technologies de Pointe", d: "Scanners et imprimantes dernière génération pour une précision maximale." },
      { t: "Délais Rapides", d: "Du scan à la pièce finie en un temps record." },
      { t: "Expertise Sectorielle", d: "Expérience approfondie automobile, aéro, médical et plus." },
      { t: "Prix Compétitifs", d: "Résultats professionnels à des prix accessibles." },
      { t: "Service Complet", d: "Numérisation, impression, inspection — tout sous un même toit." },
      { t: "Accompagnement Dédié", d: "Gestion de projet personnalisée et support technique." },
    ],
    indTitle: "Industries Servies",
    industries: ["Automobile", "Aéronautique", "Fabrication", "Médical", "Architecture", "Énergie", "Produits Grand Public", "Électronique", "Marine", "Défense"],
    ctaTitle: "Travaillons Ensemble",
    ctaTxt: "Prêt à optimiser votre production, réduire vos coûts et accélérer l'innovation ? Contactez-nous pour une consultation gratuite.",
    pres: "Présentation de l'Entreprise",
    conf: "Confidentiel",
  },
};

interface CompanyInfo { name: string; email: string; phone: string; website: string; address: string }

// ── Page header + footer helpers ──
function PageHeader({ title, lang }: { title: string; lang: string }) {
  return (
    <>
      <View style={s.hdr}>
        <Text style={s.hdrLogo}>3DS.MA</Text>
        <Text style={s.hdrTitle}>{title}</Text>
      </View>
      <View style={s.strip} />
    </>
  );
}
function PageFooter({ name, conf, num, total }: { name: string; conf: string; num: number; total: number }) {
  return (
    <View style={s.ft}>
      <Text style={s.ftL}>{name} — {conf}</Text>
      <Text style={s.ftR}>{num} / {total}</Text>
    </View>
  );
}

// ── Cert icon ──
function CertIcon() {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30">
      <Circle cx="15" cy="13" r="10" fill="none" stroke={C.orange} strokeWidth="2" />
      <Path d="M10 13 L13 16 L20 9" stroke={C.orange} strokeWidth="2" fill="none" />
      <Path d="M12 23 L15 20 L18 23 L18 28 L15 26 L12 28 Z" fill={C.navy} />
    </Svg>
  );
}

export function createPdfDocument(language: Language, companyInfo: CompanyInfo) {
  const t = T[language];
  const nm = companyInfo.name || "3DS.MA";
  const em = companyInfo.email || "contact@3ds.ma";
  const ph = companyInfo.phone || "+212 XXX XXX XXX";
  const ws = companyInfo.website || "www.3ds.ma";
  const ad = companyInfo.address || "Morocco";
  const totalPages = 6;

  return (
    <Document>
      {/* ═══════════════════ PAGE 1: COVER ═══════════════════ */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTopBar} />
        <OrangeCorner position="tr" />
        <OrangeCorner position="bl" />
        <View style={s.coverContent}>
          <Text style={s.coverBrand}>3DS<Text style={s.coverBrandDot}>.MA</Text></Text>
          <Text style={s.coverTagline}>{language === "en" ? "3D Technology Solutions" : "Solutions Technologiques 3D"}</Text>
          <View style={s.coverLine} />
          <Text style={s.coverTitle}>{t.coverTitle}</Text>
          <Text style={s.coverSub}>{t.coverSub}</Text>
          <View style={s.coverBadges}>
            {t.badges.map((b, i) => (
              <View key={i} style={s.coverBadge}><Text style={s.coverBadgeTxt}>{b}</Text></View>
            ))}
          </View>
        </View>
        <View style={s.coverFooter}>
          <Text style={s.coverFooterL}>{em} | {ph}</Text>
          <Text style={s.coverFooterR}>{ws}</Text>
        </View>
      </Page>

      {/* ═══════════════════ PAGE 2: ABOUT + SERVICES ═══════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.pres} lang={language} />
        <View style={s.body}>
          <Text style={s.secSub}>{t.aboutSub}</Text>
          <Text style={s.secTitle}>{t.aboutTitle}</Text>
          <View style={s.accent} />
          <Text style={s.para}>{t.aboutP1}</Text>
          <Text style={s.para}>{t.aboutP2}</Text>

          <View style={s.statsRow}>
            {t.stats.map((st, i) => (
              <View key={i} style={s.stat}>
                <Text style={s.statN}>{st.n}</Text>
                <Text style={s.statL}>{st.l}</Text>
              </View>
            ))}
          </View>

          <Text style={s.secSub}>{t.svcSub}</Text>
          <Text style={s.secTitle}>{t.svcTitle}</Text>
          <View style={s.accent} />
          <View style={s.svcGrid}>
            {SERVICES.map((svc) => {
              const Icon = SVC_ICONS[svc.id];
              return (
                <View key={svc.id} style={s.svcCard}>
                  <View style={s.svcIconRow}>
                    {Icon && <Icon />}
                    <Text style={s.svcName}>{svc.name[language]}</Text>
                  </View>
                  <Text style={s.svcDesc}>{svc.description[language]}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={2} total={totalPages} />
      </Page>

      {/* ═══════════════════ PAGE 3: PROCESS + TESTIMONIALS ═══════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.processTitle} lang={language} />
        <View style={s.body}>
          <Text style={s.secSub}>{t.processSub}</Text>
          <Text style={s.secTitle}>{t.processTitle}</Text>
          <View style={s.accent} />
          <View style={s.processRow}>
            {t.steps.map((step, i) => (
              <React.Fragment key={i}>
                <View style={s.processStep}>
                  <View style={s.processCircle}>
                    <Text style={s.processNum}>{i + 1}</Text>
                  </View>
                  <Text style={s.processLabel}>{step.l}</Text>
                  <Text style={s.processSubLabel}>{step.s}</Text>
                </View>
                {i < t.steps.length - 1 && <ProcessArrow />}
              </React.Fragment>
            ))}
          </View>

          <Text style={s.secSub}>{t.refSub}</Text>
          <Text style={s.secTitle}>{t.refTitle}</Text>
          <View style={s.accent} />
          <View style={s.refGrid}>
            {t.refs.map((ref, i) => (
              <View key={i} style={s.refCard}>
                <View style={s.refStars}>
                  {Array.from({ length: ref.stars }).map((_, si) => <IconStar key={si} />)}
                </View>
                <Text style={s.refQuote}>&ldquo;{ref.q}&rdquo;</Text>
                <Text style={s.refAuthor}>{ref.a}</Text>
                <Text style={s.refRole}>{ref.r}</Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={3} total={totalPages} />
      </Page>

      {/* ═══════════════════ PAGE 4: CASE STUDIES ═══════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.caseTitle} lang={language} />
        <View style={s.body}>
          <Text style={s.secSub}>{t.caseSub}</Text>
          <Text style={s.secTitle}>{t.caseTitle}</Text>
          <View style={s.accent} />
          {t.cases.map((c, i) => (
            <View key={i} style={s.caseCard}>
              <View style={s.caseLeft}>
                <Text style={s.caseSector}>{c.sector}</Text>
                <Text style={s.caseTitle}>{c.title}</Text>
                <Text style={s.caseDesc}>{c.desc}</Text>
              </View>
              <View style={s.caseRight}>
                {c.metrics.map((m, mi) => (
                  <View key={mi} style={s.caseMetric}>
                    <Text style={s.caseMetricN}>{m.n}</Text>
                    <Text style={s.caseMetricL}>{m.l}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={{ marginTop: 8 }} />
          <Text style={s.secSub}>{t.eqSub}</Text>
          <Text style={s.secTitle}>{t.eqTitle}</Text>
          <View style={s.accent} />
          <View style={s.eqGrid}>
            {t.equipment.map((eq, i) => (
              <View key={i} style={s.eqCard}>
                <Text style={s.eqType}>{eq.type}</Text>
                <Text style={s.eqName}>{eq.name}</Text>
                <Text style={s.eqSpec}>{eq.spec}</Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={4} total={totalPages} />
      </Page>

      {/* ═══════════════════ PAGE 5: CERTIFICATIONS + WHY US ═══════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.whyTitle} lang={language} />
        <View style={s.body}>
          <Text style={s.secSub}>{t.certSub}</Text>
          <Text style={s.secTitle}>{t.certTitle}</Text>
          <View style={s.accent} />
          <View style={s.certRow}>
            {t.certs.map((cert, i) => (
              <View key={i} style={s.certCard}>
                <CertIcon />
                <Text style={s.certName}>{cert.name}</Text>
                <Text style={s.certDesc}>{cert.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={s.secSub}>{t.whySub}</Text>
          <Text style={s.secTitle}>{t.whyTitle}</Text>
          <View style={s.accent} />
          <View style={s.whyGrid}>
            {t.why.map((w, i) => (
              <View key={i} style={s.whyCard}>
                <Text style={s.whyNum}>0{i + 1}</Text>
                <View style={s.whyBody}>
                  <Text style={s.whyLabel}>{w.t}</Text>
                  <Text style={s.whyTxt}>{w.d}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={s.secTitle}>{t.indTitle}</Text>
          <View style={s.accent} />
          <View style={s.indRow}>
            {t.industries.map((ind, i) => (
              <View key={i} style={s.indTag}><Text style={s.indTxt}>{ind}</Text></View>
            ))}
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={5} total={totalPages} />
      </Page>

      {/* ═══════════════════ PAGE 6: CONTACT / CTA ═══════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.ctaTitle} lang={language} />
        <OrangeCorner position="br" />
        <View style={{ ...s.body, justifyContent: "center", flex: 1 }}>
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Svg width="60" height="60" viewBox="0 0 60 60">
              <Circle cx="30" cy="30" r="28" fill={C.navy} />
              <Path d="M20 30 L27 37 L40 24" stroke={C.orange} strokeWidth="4" fill="none" />
            </Svg>
          </View>

          <View style={s.cta}>
            <View style={s.ctaL}>
              <Text style={s.ctaTitle}>{t.ctaTitle}</Text>
              <Text style={s.ctaTxt}>{t.ctaTxt}</Text>
            </View>
            <View style={s.ctaR}>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>Email</Text>
                <Link src={`mailto:${em}`} style={s.ctaLnk}>{em}</Link>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>{language === "en" ? "Phone" : "Tél."}</Text>
                <Text style={s.ctaVal}>{ph}</Text>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>Web</Text>
                <Link src={`https://${ws.replace(/^https?:\/\//, "")}`} style={s.ctaLnk}>{ws}</Link>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>{language === "en" ? "Address" : "Adresse"}</Text>
                <Text style={s.ctaVal}>{ad}</Text>
              </View>
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Text style={{ fontSize: 32, fontWeight: "bold", color: C.orange, letterSpacing: 4 }}>
              3DS<Text style={{ color: C.navy }}>.MA</Text>
            </Text>
            <Text style={{ fontSize: 9, color: C.gray, marginTop: 6, letterSpacing: 3, textTransform: "uppercase" }}>
              {language === "en" ? "Your 3D Technology Partner" : "Votre Partenaire Technologique 3D"}
            </Text>
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={6} total={totalPages} />
      </Page>
    </Document>
  );
}
