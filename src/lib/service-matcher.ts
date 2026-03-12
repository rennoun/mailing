export const SERVICES = [
  {
    id: "3d-scanning",
    name: { en: "3D Scanning", fr: "Numérisation 3D" },
    description: {
      en: "High-precision 3D scanning for reverse engineering, quality control, and digital archiving.",
      fr: "Numérisation 3D haute précision pour la rétro-ingénierie, le contrôle qualité et l'archivage numérique.",
    },
  },
  {
    id: "3d-printing",
    name: { en: "3D Printing", fr: "Impression 3D" },
    description: {
      en: "FDM, SLA, and SLS 3D printing for prototypes, tooling, and end-use parts.",
      fr: "Impression 3D FDM, SLA et SLS pour prototypes, outillage et pièces finales.",
    },
  },
  {
    id: "reverse-engineering",
    name: { en: "Reverse Engineering", fr: "Rétro-ingénierie" },
    description: {
      en: "Recreate CAD models from physical parts using 3D scanning and advanced modeling.",
      fr: "Recréation de modèles CAO à partir de pièces physiques par numérisation 3D et modélisation avancée.",
    },
  },
  {
    id: "cad-design",
    name: { en: "CAD Design", fr: "Conception CAO" },
    description: {
      en: "Professional CAD design and modeling services for new products and modifications.",
      fr: "Services professionnels de conception et modélisation CAO pour nouveaux produits et modifications.",
    },
  },
  {
    id: "prototyping",
    name: { en: "Prototyping", fr: "Prototypage" },
    description: {
      en: "Rapid prototyping to validate designs before mass production.",
      fr: "Prototypage rapide pour valider les conceptions avant la production en série.",
    },
  },
  {
    id: "quality-control",
    name: { en: "Quality Control & Inspection", fr: "Contrôle Qualité & Inspection" },
    description: {
      en: "Dimensional inspection and quality control using 3D scanning technology.",
      fr: "Inspection dimensionnelle et contrôle qualité par technologie de numérisation 3D.",
    },
  },
  {
    id: "spare-parts",
    name: { en: "Spare Parts Manufacturing", fr: "Fabrication de Pièces de Rechange" },
    description: {
      en: "On-demand manufacturing of spare parts using 3D printing and reverse engineering.",
      fr: "Fabrication à la demande de pièces de rechange par impression 3D et rétro-ingénierie.",
    },
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

const INDUSTRY_SERVICE_MAP: Record<string, ServiceId[]> = {
  automotive: ["reverse-engineering", "3d-scanning", "prototyping", "spare-parts", "quality-control"],
  aerospace: ["reverse-engineering", "3d-scanning", "prototyping", "spare-parts", "quality-control"],
  manufacturing: ["3d-printing", "quality-control", "spare-parts", "3d-scanning"],
  industrial: ["3d-printing", "quality-control", "spare-parts", "3d-scanning"],
  medical: ["3d-printing", "3d-scanning", "prototyping", "cad-design"],
  dental: ["3d-printing", "3d-scanning", "prototyping"],
  architecture: ["3d-scanning", "3d-printing", "cad-design"],
  construction: ["3d-scanning", "3d-printing", "cad-design"],
  "consumer products": ["prototyping", "3d-printing", "reverse-engineering", "cad-design"],
  energy: ["reverse-engineering", "spare-parts", "3d-scanning"],
  "oil & gas": ["reverse-engineering", "spare-parts", "3d-scanning", "quality-control"],
  food: ["prototyping", "3d-printing", "spare-parts"],
  packaging: ["prototyping", "3d-printing", "spare-parts", "cad-design"],
  electronics: ["reverse-engineering", "prototyping", "3d-printing"],
  defense: ["reverse-engineering", "3d-scanning", "spare-parts", "quality-control"],
  marine: ["reverse-engineering", "spare-parts", "3d-scanning"],
  textile: ["prototyping", "3d-printing", "cad-design"],
  jewelry: ["3d-printing", "cad-design", "prototyping"],
  education: ["3d-printing", "3d-scanning", "prototyping"],
};

export function matchServices(industry: string | null | undefined): ServiceId[] {
  if (!industry) return SERVICES.map((s) => s.id);

  const lower = industry.toLowerCase();
  for (const [key, services] of Object.entries(INDUSTRY_SERVICE_MAP)) {
    if (lower.includes(key)) return services;
  }

  // Default: return all services
  return SERVICES.map((s) => s.id);
}

export function getServiceById(id: ServiceId) {
  return SERVICES.find((s) => s.id === id);
}
