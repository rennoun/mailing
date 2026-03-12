import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Svg,
  Rect,
  Circle,
  Path,
  Polygon,
  Image,
} from "@react-pdf/renderer";
import { join } from "path";
import { readFileSync } from "fs";
import { SERVICES } from "./service-matcher";
import type { Language } from "./i18n";

// ── Load local images as buffers for @react-pdf/renderer ──
function img(name: string): { data: Buffer; format: "jpg" } {
  const filePath = join(process.cwd(), "public", "images", name);
  return { data: readFileSync(filePath), format: "jpg" };
}

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

// ── SVG Icons ──
function IconScan() {
  return (
    <Svg width="24" height="24" viewBox="0 0 28 28">
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
    <Svg width="24" height="24" viewBox="0 0 28 28">
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
    <Svg width="24" height="24" viewBox="0 0 28 28">
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
    <Svg width="24" height="24" viewBox="0 0 28 28">
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
    <Svg width="24" height="24" viewBox="0 0 28 28">
      <Path d="M14 3 L24 9 L24 19 L14 25 L4 19 L4 9 Z" fill={C.orange} opacity="0.2" />
      <Path d="M14 3 L24 9 L24 19 L14 25 L4 19 L4 9 Z" stroke={C.orange} strokeWidth="1.5" fill="none" />
      <Path d="M14 3 L14 25" stroke={C.navy} strokeWidth="1" opacity="0.5" />
      <Circle cx="14" cy="14" r="3" fill={C.navy} />
    </Svg>
  );
}
function IconQC() {
  return (
    <Svg width="24" height="24" viewBox="0 0 28 28">
      <Circle cx="14" cy="14" r="10" fill="none" stroke={C.navy} strokeWidth="2" />
      <Path d="M9 14 L12 17 L19 10" stroke={C.orange} strokeWidth="2.5" fill="none" />
    </Svg>
  );
}
function IconSpare() {
  return (
    <Svg width="24" height="24" viewBox="0 0 28 28">
      <Circle cx="14" cy="14" r="10" fill="none" stroke={C.navy} strokeWidth="2" />
      <Circle cx="14" cy="14" r="4" fill="none" stroke={C.orange} strokeWidth="2" />
      <Rect x="13" y="2" width="2" height="5" fill={C.navy} />
      <Rect x="13" y="21" width="2" height="5" fill={C.navy} />
      <Rect x="2" y="13" width="5" height="2" fill={C.navy} />
      <Rect x="21" y="13" width="5" height="2" fill={C.navy} />
    </Svg>
  );
}

const SVC_ICONS: Record<string, () => React.JSX.Element> = {
  "3d-scanning": IconScan,
  "3d-printing": IconPrint,
  "reverse-engineering": IconReverse,
  "cad-design": IconCAD,
  prototyping: IconProto,
  "quality-control": IconQC,
  "spare-parts": IconSpare,
};

// ── Decorative ──
function ProcessArrow() {
  return (
    <Svg width="16" height="16" viewBox="0 0 20 20">
      <Path d="M4 10 L14 10" stroke={C.orange} strokeWidth="2" />
      <Path d="M11 6 L15 10 L11 14" stroke={C.orange} strokeWidth="2" fill="none" />
    </Svg>
  );
}
function CertIcon() {
  return (
    <Svg width="26" height="26" viewBox="0 0 30 30">
      <Circle cx="15" cy="13" r="10" fill="none" stroke={C.orange} strokeWidth="2" />
      <Path d="M10 13 L13 16 L20 9" stroke={C.orange} strokeWidth="2" fill="none" />
      <Path d="M12 23 L15 20 L18 23 L18 28 L15 26 L12 28 Z" fill={C.navy} />
    </Svg>
  );
}

// ── Styles ──
const s = StyleSheet.create({
  // Cover
  coverPage: { backgroundColor: C.navy, padding: 0, fontFamily: "Helvetica", position: "relative" },
  coverTopBar: { backgroundColor: C.orange, height: 4, width: "100%" },
  coverHero: { width: "100%", height: 220, objectFit: "cover", objectPosition: "center" },
  coverOverlay: { position: "absolute", top: 224, left: 0, right: 0, bottom: 0, backgroundColor: C.navy },
  coverContent: { paddingHorizontal: 50, paddingTop: 20 },
  coverBrand: { fontSize: 48, fontWeight: "bold", color: C.orange, letterSpacing: 4 },
  coverBrandDot: { color: C.white },
  coverTagline: { fontSize: 11, color: C.grayLight, marginTop: 4, letterSpacing: 3, textTransform: "uppercase" },
  coverLine: { width: 70, height: 3, backgroundColor: C.orange, marginTop: 20, marginBottom: 18 },
  coverTitle: { fontSize: 24, color: C.white, fontWeight: "bold", lineHeight: 1.35 },
  coverSub: { fontSize: 10, color: C.grayLight, marginTop: 12, lineHeight: 1.7, maxWidth: 380 },
  coverBadges: { flexDirection: "row", gap: 10, marginTop: 20 },
  coverBadge: { backgroundColor: C.navyLight, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#1E3D6E" },
  coverBadgeTxt: { fontSize: 7, color: C.orange, letterSpacing: 1, textTransform: "uppercase", fontWeight: "bold" },
  coverFooter: { position: "absolute", bottom: 25, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#1A3050", paddingTop: 10 },
  coverFooterL: { fontSize: 8, color: C.gray },
  coverFooterR: { fontSize: 9, color: C.orange, fontWeight: "bold" },

  // Content pages
  page: { padding: 0, fontFamily: "Helvetica", backgroundColor: C.white, position: "relative" },
  hdr: { backgroundColor: C.navy, paddingHorizontal: 40, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hdrLogo: { fontSize: 11, fontWeight: "bold", color: C.orange, letterSpacing: 2 },
  hdrTitle: { fontSize: 7, color: C.grayLight, textTransform: "uppercase", letterSpacing: 2 },
  strip: { height: 2.5, backgroundColor: C.orange },
  body: { paddingHorizontal: 40, paddingTop: 16, paddingBottom: 40 },
  secTitle: { fontSize: 15, fontWeight: "bold", color: C.navy, marginBottom: 3 },
  secSub: { fontSize: 7.5, color: C.gray, marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 },
  accent: { width: 40, height: 2.5, backgroundColor: C.orange, marginBottom: 10 },
  para: { fontSize: 8.5, color: C.textLight, lineHeight: 1.65, marginBottom: 8 },

  // About row with image
  aboutRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  aboutText: { flex: 1 },
  aboutImg: { width: 180, height: 130, borderRadius: 6, objectFit: "cover" },

  // Stats row
  statsRow: { flexDirection: "row", gap: 7, marginBottom: 14 },
  stat: { flex: 1, backgroundColor: C.offWhite, borderRadius: 4, padding: 8, borderTopWidth: 2.5, borderTopColor: C.orange, alignItems: "center" },
  statN: { fontSize: 18, fontWeight: "bold", color: C.orange },
  statL: { fontSize: 6, color: C.gray, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 1 },

  // Services
  svcGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  svcCard: { width: "48%", backgroundColor: C.offWhite, borderRadius: 5, padding: 9, borderLeftWidth: 2.5, borderLeftColor: C.orange, marginBottom: 1 },
  svcIconRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  svcName: { fontSize: 8.5, fontWeight: "bold", color: C.navy },
  svcDesc: { fontSize: 6.5, color: C.textLight, lineHeight: 1.4 },

  // Process
  processRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 12 },
  processStep: { alignItems: "center", width: 78 },
  processCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.orange, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  processNum: { fontSize: 13, fontWeight: "bold", color: C.white },
  processLabel: { fontSize: 6.5, color: C.navy, fontWeight: "bold", textAlign: "center" },
  processSubLabel: { fontSize: 5.5, color: C.gray, textAlign: "center", marginTop: 1 },

  // Case studies with image
  caseRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  caseImg: { width: 155, height: 190, borderRadius: 6, objectFit: "cover" },
  caseCards: { flex: 1 },
  caseCard: { backgroundColor: C.offWhite, borderRadius: 5, padding: 10, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: C.orange },
  caseTitle: { fontSize: 8.5, fontWeight: "bold", color: C.navy, marginBottom: 2 },
  caseSector: { fontSize: 6, color: C.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  caseDesc: { fontSize: 6.5, color: C.textLight, lineHeight: 1.5 },
  caseMetrics: { flexDirection: "row", gap: 6, marginTop: 4 },
  caseMetric: { backgroundColor: C.navy, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 4 },
  caseMetricN: { fontSize: 10, fontWeight: "bold", color: C.orange, textAlign: "center" },
  caseMetricL: { fontSize: 5, color: C.grayLight, textAlign: "center", textTransform: "uppercase", marginTop: 1 },

  // Equipment
  eqRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  eqImg: { width: 155, height: 140, borderRadius: 6, objectFit: "cover" },
  eqGrid: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  eqCard: { width: "47%", borderRadius: 4, padding: 8, backgroundColor: C.navy },
  eqName: { fontSize: 7, fontWeight: "bold", color: C.white, marginBottom: 1 },
  eqType: { fontSize: 6, color: C.orange, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  eqSpec: { fontSize: 5.5, color: C.grayLight, lineHeight: 1.4 },

  // Certifications
  certRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  certCard: { flex: 1, borderRadius: 4, padding: 10, borderWidth: 1.5, borderColor: C.grayLight, alignItems: "center" },
  certName: { fontSize: 8, fontWeight: "bold", color: C.navy, marginTop: 4, textAlign: "center" },
  certDesc: { fontSize: 6.5, color: C.gray, textAlign: "center", marginTop: 1 },

  // Why us
  whyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  whyCard: { width: "48%", flexDirection: "row", gap: 6, padding: 8, backgroundColor: C.offWhite, borderRadius: 4, marginBottom: 1 },
  whyNum: { fontSize: 14, fontWeight: "bold", color: C.orange, width: 20 },
  whyBody: { flex: 1 },
  whyLabel: { fontSize: 7, fontWeight: "bold", color: C.navy, marginBottom: 1 },
  whyTxt: { fontSize: 6, color: C.textLight, lineHeight: 1.4 },

  // Industries
  indRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 10 },
  indTag: { backgroundColor: C.navy, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  indTxt: { fontSize: 6, color: C.white, letterSpacing: 0.3 },

  // CTA
  cta: { backgroundColor: C.navy, borderRadius: 6, padding: 16, flexDirection: "row", gap: 16, marginTop: 6 },
  ctaL: { flex: 1 },
  ctaTitle: { fontSize: 14, fontWeight: "bold", color: C.white, marginBottom: 4 },
  ctaTxt: { fontSize: 7.5, color: C.grayLight, lineHeight: 1.6 },
  ctaR: { flex: 1 },
  ctaLine: { flexDirection: "row", marginBottom: 5 },
  ctaLbl: { fontSize: 6, color: C.gray, textTransform: "uppercase", letterSpacing: 1, width: 46 },
  ctaVal: { fontSize: 8, color: C.white, flex: 1 },
  ctaLnk: { fontSize: 8, color: C.orange, flex: 1, textDecoration: "none" },

  // Footer
  ft: { position: "absolute", bottom: 12, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: C.grayLight, paddingTop: 4 },
  ftL: { fontSize: 6, color: C.gray },
  ftR: { fontSize: 6, color: C.orange, fontWeight: "bold" },
});

// ── Bilingual content ──
const T = {
  en: {
    coverTitle: "Your Partner in Advanced\n3D Technology Solutions",
    coverSub:
      "Empowering industries with precision 3D scanning, additive manufacturing, reverse engineering, and digital inspection solutions.",
    badges: ["ISO CERTIFIED", "INDUSTRY 4.0", "MADE IN MOROCCO"],
    aboutTitle: "Who We Are",
    aboutSub: "COMPANY OVERVIEW",
    aboutP1:
      "3DS.MA is a leading Moroccan company specialized in advanced 3D technology solutions. Founded with a vision to bridge the gap between traditional manufacturing and digital innovation, we serve as a one-stop partner for all 3D technology needs.",
    aboutP2:
      "Our team of experienced engineers combines state-of-the-art equipment with deep domain expertise to deliver precision results across multiple industries.",
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
    caseTitle: "Project Showcase",
    caseSub: "SELECTED CASE STUDIES",
    cases: [
      {
        title: "Automotive Legacy Part Reproduction",
        sector: "Automotive",
        desc: "Reverse-engineered and 3D printed 50+ discontinued spare parts for a major manufacturer, eliminating months-long procurement delays.",
        metrics: [
          { n: "50+", l: "Parts" },
          { n: "85%", l: "Cost Saved" },
        ],
      },
      {
        title: "Aerospace Component Inspection",
        sector: "Aerospace",
        desc: "High-precision 3D scanning and dimensional analysis on turbine blade components, ensuring strict aerospace tolerances.",
        metrics: [
          { n: "0.02mm", l: "Accuracy" },
          { n: "200+", l: "Inspected" },
        ],
      },
      {
        title: "Medical Device Prototyping",
        sector: "Medical",
        desc: "Rapid prototyped custom surgical guides using biocompatible materials, accelerating clinical validation timelines.",
        metrics: [
          { n: "3 Days", l: "Turnaround" },
          { n: "100%", l: "Fit Rate" },
        ],
      },
    ],
    eqTitle: "Our Equipment",
    eqSub: "STATE-OF-THE-ART TECHNOLOGY",
    equipment: [
      { name: "Industrial 3D Scanner", type: "Scanning", spec: "0.02mm accuracy\nStructured light" },
      { name: "Handheld Scanner", type: "Scanning", spec: "Portable\nReal-time mesh" },
      { name: "FDM Printer", type: "3D Printing", spec: "300x300x400mm\nMulti-material" },
      { name: "SLA Printer", type: "3D Printing", spec: "25 micron resolution\nSmooth finish" },
      { name: "SLS System", type: "3D Printing", spec: "PA12 Nylon\nFunctional parts" },
      { name: "CMM System", type: "Inspection", spec: "Touch probe\nGD&T reporting" },
    ],
    certTitle: "Certifications",
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
      { t: "End-to-End Service", d: "Scanning, printing, inspection \u2014 everything under one roof." },
      { t: "Dedicated Support", d: "Personal project management and technical support always." },
    ],
    indTitle: "Industries We Serve",
    industries: [
      "Automotive",
      "Aerospace",
      "Manufacturing",
      "Medical",
      "Architecture",
      "Energy",
      "Consumer Products",
      "Electronics",
      "Marine",
      "Defense",
    ],
    ctaTitle: "Let\u2019s Work Together",
    ctaTxt: "Ready to optimize your production, reduce costs, and accelerate innovation? Contact us for a free consultation and project assessment.",
    pres: "Company Presentation",
    conf: "Confidential",
  },
  fr: {
    coverTitle: "Votre Partenaire en\nSolutions Technologiques 3D",
    coverSub:
      "Des solutions de num\u00e9risation 3D, fabrication additive, r\u00e9tro-ing\u00e9nierie et inspection num\u00e9rique au service de votre industrie.",
    badges: ["CERTIFI\u00c9 ISO", "INDUSTRIE 4.0", "MADE IN MOROCCO"],
    aboutTitle: "Qui Sommes-Nous",
    aboutSub: "PR\u00c9SENTATION",
    aboutP1:
      "3DS.MA est une entreprise marocaine leader sp\u00e9cialis\u00e9e dans les solutions technologiques 3D avanc\u00e9es. Fond\u00e9e avec la vision de faire le lien entre la fabrication traditionnelle et l\u2019innovation num\u00e9rique, nous servons de partenaire unique pour tous les besoins en technologie 3D.",
    aboutP2:
      "Notre \u00e9quipe d\u2019ing\u00e9nieurs exp\u00e9riment\u00e9s combine des \u00e9quipements de pointe avec une expertise sectorielle approfondie pour offrir des r\u00e9sultats de pr\u00e9cision.",
    stats: [
      { n: "7+", l: "Ann\u00e9es" },
      { n: "500+", l: "Projets" },
      { n: "200+", l: "Clients" },
      { n: "99%", l: "Satisfaction" },
      { n: "15+", l: "Ing\u00e9nieurs" },
    ],
    svcTitle: "Nos Services",
    svcSub: "SOLUTIONS 3D COMPL\u00c8TES",
    processTitle: "Notre M\u00e9thodologie",
    processSub: "COMMENT NOUS TRAVAILLONS",
    steps: [
      { l: "Consultation", s: "Analyse des besoins" },
      { l: "Num\u00e9risation", s: "Capture de donn\u00e9es" },
      { l: "Traitement", s: "Mod\u00e9lisation CAO" },
      { l: "Production", s: "Impression 3D" },
      { l: "CQ & Livraison", s: "Inspection finale" },
    ],
    caseTitle: "Projets R\u00e9alis\u00e9s",
    caseSub: "\u00c9TUDES DE CAS S\u00c9LECTIONN\u00c9ES",
    cases: [
      {
        title: "Reproduction Pi\u00e8ces Auto Anciennes",
        sector: "Automobile",
        desc: "R\u00e9tro-ing\u00e9nierie et impression 3D de 50+ pi\u00e8ces discontinu\u00e9es pour un grand constructeur, \u00e9liminant des mois de d\u00e9lai.",
        metrics: [
          { n: "50+", l: "Pi\u00e8ces" },
          { n: "85%", l: "\u00c9conomie" },
        ],
      },
      {
        title: "Inspection Composants A\u00e9ronautiques",
        sector: "A\u00e9ronautique",
        desc: "Num\u00e9risation 3D haute pr\u00e9cision et analyse dimensionnelle de composants de turbine, conformit\u00e9 aux tol\u00e9rances.",
        metrics: [
          { n: "0.02mm", l: "Pr\u00e9cision" },
          { n: "200+", l: "Inspect\u00e9es" },
        ],
      },
      {
        title: "Prototypage Dispositifs M\u00e9dicaux",
        sector: "M\u00e9dical",
        desc: "Prototypage rapide de guides chirurgicaux en mat\u00e9riaux biocompatibles, acc\u00e9l\u00e9rant la validation clinique.",
        metrics: [
          { n: "3 Jours", l: "D\u00e9lai" },
          { n: "100%", l: "Ajustement" },
        ],
      },
    ],
    eqTitle: "Nos \u00c9quipements",
    eqSub: "TECHNOLOGIES DE POINTE",
    equipment: [
      { name: "Scanner 3D Industriel", type: "Num\u00e9risation", spec: "Pr\u00e9cision: 0.02mm\nLumi\u00e8re structur\u00e9e" },
      { name: "Scanner Portable", type: "Num\u00e9risation", spec: "Portable\nMaillage temps r\u00e9el" },
      { name: "Imprimante FDM", type: "Impression 3D", spec: "300x300x400mm\nMulti-mat\u00e9riau" },
      { name: "Imprimante SLA", type: "Impression 3D", spec: "R\u00e9solution: 25\u03bcm\nFinition lisse" },
      { name: "Syst\u00e8me SLS", type: "Impression 3D", spec: "PA12 Nylon\nPi\u00e8ces fonctionnelles" },
      { name: "Syst\u00e8me CMM", type: "Inspection", spec: "Palpeur tactile\nRapport GD&T" },
    ],
    certTitle: "Certifications",
    certSub: "ASSURANCE QUALIT\u00c9",
    certs: [
      { name: "ISO 9001:2015", desc: "Management Qualit\u00e9" },
      { name: "ISO 17025", desc: "Essais & Calibration" },
      { name: "AS9100D", desc: "Norme A\u00e9ronautique" },
    ],
    whyTitle: "Pourquoi Choisir 3DS.MA",
    whySub: "NOTRE AVANTAGE COMP\u00c9TITIF",
    why: [
      { t: "Technologies de Pointe", d: "Scanners et imprimantes derni\u00e8re g\u00e9n\u00e9ration pour une pr\u00e9cision maximale." },
      { t: "D\u00e9lais Rapides", d: "Du scan \u00e0 la pi\u00e8ce finie en un temps record." },
      { t: "Expertise Sectorielle", d: "Exp\u00e9rience approfondie automobile, a\u00e9ro, m\u00e9dical et plus." },
      { t: "Prix Comp\u00e9titifs", d: "R\u00e9sultats professionnels \u00e0 des prix accessibles." },
      { t: "Service Complet", d: "Num\u00e9risation, impression, inspection \u2014 tout sous un m\u00eame toit." },
      { t: "Accompagnement D\u00e9di\u00e9", d: "Gestion de projet personnalis\u00e9e et support technique." },
    ],
    indTitle: "Industries Servies",
    industries: [
      "Automobile",
      "A\u00e9ronautique",
      "Fabrication",
      "M\u00e9dical",
      "Architecture",
      "\u00c9nergie",
      "Produits Grand Public",
      "\u00c9lectronique",
      "Marine",
      "D\u00e9fense",
    ],
    ctaTitle: "Travaillons Ensemble",
    ctaTxt:
      "Pr\u00eat \u00e0 optimiser votre production, r\u00e9duire vos co\u00fbts et acc\u00e9l\u00e9rer l\u2019innovation ? Contactez-nous pour une consultation gratuite.",
    pres: "Pr\u00e9sentation de l\u2019Entreprise",
    conf: "Confidentiel",
  },
};

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

// ── Helpers ──
function PageHeader({ title }: { title: string }) {
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
      <Text style={s.ftL}>
        {name} — {conf}
      </Text>
      <Text style={s.ftR}>
        {num} / {total}
      </Text>
    </View>
  );
}

export function createPdfDocument(language: Language, companyInfo: CompanyInfo) {
  const t = T[language];
  const nm = companyInfo.name || "3DS.MA";
  const em = companyInfo.email || "contact@3ds.ma";
  const ph = companyInfo.phone || "+212 XXX XXX XXX";
  const ws = companyInfo.website || "www.3ds.ma";
  const ad = companyInfo.address || "Morocco";
  const totalPages = 4;

  // Local images
  const heroImg = img("3d-printer-hero.jpg");
  const workshopImg = img("3d-printing-workshop.jpg");
  const scanningImg = img("industrial-scanning.jpg");
  const manufacturingImg = img("manufacturing.jpg");

  return (
    <Document>
      {/* ═════════════════ PAGE 1: COVER ═════════════════ */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTopBar} />
        <Image src={heroImg} style={s.coverHero} />
        <View style={s.coverContent}>
          <Text style={s.coverBrand}>
            3DS<Text style={s.coverBrandDot}>.MA</Text>
          </Text>
          <Text style={s.coverTagline}>
            {language === "en" ? "3D Technology Solutions" : "Solutions Technologiques 3D"}
          </Text>
          <View style={s.coverLine} />
          <Text style={s.coverTitle}>{t.coverTitle}</Text>
          <Text style={s.coverSub}>{t.coverSub}</Text>
          <View style={s.coverBadges}>
            {t.badges.map((b, i) => (
              <View key={i} style={s.coverBadge}>
                <Text style={s.coverBadgeTxt}>{b}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.coverFooter}>
          <Text style={s.coverFooterL}>
            {em} | {ph}
          </Text>
          <Text style={s.coverFooterR}>{ws}</Text>
        </View>
      </Page>

      {/* ═════════════════ PAGE 2: ABOUT + SERVICES ═════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.pres} />
        <View style={s.body}>
          {/* About with image */}
          <Text style={s.secSub}>{t.aboutSub}</Text>
          <Text style={s.secTitle}>{t.aboutTitle}</Text>
          <View style={s.accent} />
          <View style={s.aboutRow}>
            <View style={s.aboutText}>
              <Text style={s.para}>{t.aboutP1}</Text>
              <Text style={s.para}>{t.aboutP2}</Text>
            </View>
            <Image src={workshopImg} style={s.aboutImg} />
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            {t.stats.map((st, i) => (
              <View key={i} style={s.stat}>
                <Text style={s.statN}>{st.n}</Text>
                <Text style={s.statL}>{st.l}</Text>
              </View>
            ))}
          </View>

          {/* Services */}
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

      {/* ═════════════════ PAGE 3: PROCESS + CASES + EQUIPMENT ═════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.caseTitle} />
        <View style={s.body}>
          {/* Process steps */}
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

          {/* Case studies with image */}
          <Text style={s.secSub}>{t.caseSub}</Text>
          <Text style={s.secTitle}>{t.caseTitle}</Text>
          <View style={s.accent} />
          <View style={s.caseRow}>
            <Image src={scanningImg} style={s.caseImg} />
            <View style={s.caseCards}>
              {t.cases.map((c, i) => (
                <View key={i} style={s.caseCard}>
                  <Text style={s.caseSector}>{c.sector}</Text>
                  <Text style={s.caseTitle}>{c.title}</Text>
                  <Text style={s.caseDesc}>{c.desc}</Text>
                  <View style={s.caseMetrics}>
                    {c.metrics.map((m, mi) => (
                      <View key={mi} style={s.caseMetric}>
                        <Text style={s.caseMetricN}>{m.n}</Text>
                        <Text style={s.caseMetricL}>{m.l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Equipment with image */}
          <Text style={s.secSub}>{t.eqSub}</Text>
          <Text style={s.secTitle}>{t.eqTitle}</Text>
          <View style={s.accent} />
          <View style={s.eqRow}>
            <View style={s.eqGrid}>
              {t.equipment.map((eq, i) => (
                <View key={i} style={s.eqCard}>
                  <Text style={s.eqType}>{eq.type}</Text>
                  <Text style={s.eqName}>{eq.name}</Text>
                  <Text style={s.eqSpec}>{eq.spec}</Text>
                </View>
              ))}
            </View>
            <Image src={manufacturingImg} style={s.eqImg} />
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={3} total={totalPages} />
      </Page>

      {/* ═════════════════ PAGE 4: CERTS + WHY US + INDUSTRIES + CTA ═════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader title={t.whyTitle} />
        <View style={s.body}>
          {/* Certifications */}
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

          {/* Why Us */}
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

          {/* Industries */}
          <Text style={s.secTitle}>{t.indTitle}</Text>
          <View style={s.accent} />
          <View style={s.indRow}>
            {t.industries.map((ind, i) => (
              <View key={i} style={s.indTag}>
                <Text style={s.indTxt}>{ind}</Text>
              </View>
            ))}
          </View>

          {/* CTA Contact */}
          <View style={s.cta}>
            <View style={s.ctaL}>
              <Text style={s.ctaTitle}>{t.ctaTitle}</Text>
              <Text style={s.ctaTxt}>{t.ctaTxt}</Text>
            </View>
            <View style={s.ctaR}>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>Email</Text>
                <Link src={`mailto:${em}`} style={s.ctaLnk}>
                  {em}
                </Link>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>{language === "en" ? "Phone" : "T\u00e9l."}</Text>
                <Text style={s.ctaVal}>{ph}</Text>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>Web</Text>
                <Link src={`https://${ws.replace(/^https?:\/\//, "")}`} style={s.ctaLnk}>
                  {ws}
                </Link>
              </View>
              <View style={s.ctaLine}>
                <Text style={s.ctaLbl}>{language === "en" ? "Address" : "Adresse"}</Text>
                <Text style={s.ctaVal}>{ad}</Text>
              </View>
            </View>
          </View>

          {/* Bottom brand */}
          <View style={{ alignItems: "center", marginTop: 14 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: C.orange, letterSpacing: 3 }}>
              3DS<Text style={{ color: C.navy }}>.MA</Text>
            </Text>
            <Text
              style={{
                fontSize: 7,
                color: C.gray,
                marginTop: 3,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {language === "en" ? "Your 3D Technology Partner" : "Votre Partenaire Technologique 3D"}
            </Text>
          </View>
        </View>
        <PageFooter name={nm} conf={t.conf} num={4} total={totalPages} />
      </Page>
    </Document>
  );
}
