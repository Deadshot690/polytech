export type ProductCategory = "PPHP" | "PPCP" | "Compound" | "HDPE";

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  tag: string;
  description: string;
  application: string;
  color: string;
  form: string;
  specs: { label: string; value: string }[];
}

const baseSpecs = (mfi: string, density: string) => [
  { label: "Melt Flow Index (230 °C, 2.16 kg)", value: mfi },
  { label: "Density", value: density },
  { label: "Tensile strength at yield", value: "32 MPa" },
  { label: "Flexural modulus", value: "1450 MPa" },
  { label: "Notched Izod impact (23 °C)", value: "6.5 kJ/m²" },
  { label: "Heat deflection (0.45 MPa)", value: "95 °C" },
  { label: "Moisture content", value: "< 0.05 %" },
  { label: "Packaging", value: "25 kg bags / 1 T jumbo bags" },
];

export const products: Product[] = [
  {
    slug: "pphp-injection-blue",
    name: "PPHP Injection Grade — Blue",
    category: "PPHP",
    tag: "Homopolymer / PPHP",
    description:
      "High-purity polypropylene homopolymer engineered from recycled polymers for stable injection moulding with excellent flow and colour consistency.",
    application: "Injection moulding",
    color: "Brand blue",
    form: "Granule",
    specs: baseSpecs("12 g/10min", "0.905 g/cm³"),
  },
  {
    slug: "pphp-raffia-natural",
    name: "PPHP Raffia Grade — Natural",
    category: "PPHP",
    tag: "Homopolymer / PPHP",
    description:
      "Consistent MFI raffia-grade homopolymer for woven sacks and tapes with high tensile performance.",
    application: "Raffia / woven",
    color: "Natural",
    form: "Granule",
    specs: baseSpecs("3.5 g/10min", "0.905 g/cm³"),
  },
  {
    slug: "ppcp-impact-black",
    name: "PPCP Impact Grade — Black",
    category: "PPCP",
    tag: "Copolymer / PPCP",
    description:
      "Impact-modified polypropylene copolymer offering superior toughness at low temperatures for demanding automotive parts.",
    application: "Automotive components",
    color: "Black",
    form: "Granule",
    specs: baseSpecs("18 g/10min", "0.902 g/cm³"),
  },
  {
    slug: "ppcp-thinwall-green",
    name: "PPCP Thin-wall Grade — Green",
    category: "PPCP",
    tag: "Copolymer / PPCP",
    description:
      "High-flow copolymer optimised for thin-wall packaging with balanced stiffness and impact.",
    application: "Packaging",
    color: "Brand green",
    form: "Granule",
    specs: baseSpecs("35 g/10min", "0.902 g/cm³"),
  },
  {
    slug: "custom-compound-glass-filled",
    name: "Custom Compound — Glass Filled",
    category: "Compound",
    tag: "Compounds / Custom",
    description:
      "Engineered glass-filled polypropylene compound for enhanced stiffness and dimensional stability in structural applications.",
    application: "Industrial / structural",
    color: "Custom",
    form: "Granule",
    specs: baseSpecs("8 g/10min", "1.13 g/cm³"),
  },
  {
    slug: "pcr-hdpe-granules",
    name: "PCR HDPE Granules",
    category: "HDPE",
    tag: "PCR HDPE",
    description:
      "High-density polyethylene granules engineered from recycled streams, suitable for blow moulding, pipe extrusion and industrial containers.",
    application: "Blow moulding & extrusion",
    color: "Natural / Black",
    form: "Granule",
    specs: baseSpecs("0.35 g/10min", "0.952 g/cm³"),
  },
];

export const productCategories = [
  {
    name: "PCR PP Homopolymer (PCR PPHP)",
    key: "PPHP",
    desc: "Stiff, high-purity homopolymer grades for injection moulding, raffia and extrusion.",
  },
  {
    name: "PCR PP Copolymer (PCR PPCP)",
    key: "PPCP",
    desc: "Impact-resistant copolymer grades for automotive and packaging applications.",
  },
  {
    name: "PCR HDPE",
    key: "HDPE",
    desc: "High-density polyethylene grades for blow moulding, extrusion, and industrial packaging.",
  },
  {
    name: "Customized Compounds",
    key: "Compound",
    desc: "Filled and reinforced compounds custom engineered to your exact specifications.",
  },
];

export interface Industry {
  slug: string;
  name: string;
  blurb: string;
  challenges: string[];
  solutions: string[];
  grades: string[];
  caseStudy: { problem: string; solution: string; result: string };
}

export const industries: Industry[] = [
  {
    slug: "automotive",
    name: "Automotive",
    blurb: "Impact-grade copolymers for interior and under-hood components.",
    challenges: [
      "Low-temperature impact resistance",
      "Dimensional stability",
      "Consistent surface finish",
    ],
    solutions: ["Impact-modified PPCP grades", "In-line MFI monitoring", "Custom colour matching"],
    grades: ["PPCP Impact Grade — Black", "Custom Compound — Glass Filled"],
    caseStudy: {
      problem: "An OEM needed a recycled-content grade with stable impact for interior trim.",
      solution: "We supplied an impact-modified PPCP with validated low-temperature performance.",
      result: "15% cost reduction with no drop in part quality.",
    },
  },
  {
    slug: "packaging",
    name: "Packaging",
    blurb: "High-flow grades for thin-wall containers and closures.",
    challenges: ["High flow for thin walls", "Food-contact consistency", "Colour repeatability"],
    solutions: ["High-flow PPCP thin-wall grades", "Colour masterbatch dosing", "Batch validation"],
    grades: ["PPCP Thin-wall Grade — Green", "Colour Masterbatch — Cyan"],
    caseStudy: {
      problem: "A converter faced short shots on thin-wall tubs.",
      solution: "A 35 MFI copolymer improved fill and cycle time.",
      result: "12% faster cycles and fewer rejects.",
    },
  },
  {
    slug: "paint-industry",
    name: "Paint Industry",
    blurb: "Durable pails and containers for paints and coatings.",
    challenges: ["Chemical resistance", "Stackable strength", "UV stability"],
    solutions: ["Homopolymer pail grades", "Reinforced compounds", "UV masterbatch"],
    grades: ["PPHP Injection Grade — Blue"],
    caseStudy: {
      problem: "A paint brand needed sturdier stackable pails.",
      solution: "A stiffer homopolymer improved top-load strength.",
      result: "20% higher stack height in warehouses.",
    },
  },
  {
    slug: "household",
    name: "Household",
    blurb: "Consumer goods with vibrant, consistent colour.",
    challenges: ["Aesthetic finish", "Colour range", "Cost efficiency"],
    solutions: ["Injection PPHP grades", "Custom colour development"],
    grades: ["PPHP Injection Grade — Blue", "Colour Masterbatch — Cyan"],
    caseStudy: {
      problem: "A houseware maker wanted premium colours at scale.",
      solution: "Bespoke masterbatch matched the brand palette.",
      result: "Consistent colour across 8 product lines.",
    },
  },
  {
    slug: "textile",
    name: "Textile",
    blurb: "Raffia and fibre grades for woven products.",
    challenges: ["Tensile strength", "Consistent MFI", "Spinnability"],
    solutions: ["Raffia homopolymer grades", "Tight MFI control"],
    grades: ["PPHP Raffia Grade — Natural"],
    caseStudy: {
      problem: "A weaver had tape breakage from MFI drift.",
      solution: "Our tightly controlled raffia grade stabilised output.",
      result: "Downtime cut by a third.",
    },
  },
  {
    slug: "industrial",
    name: "Industrial",
    blurb: "Engineered compounds for structural and technical parts.",
    challenges: ["Stiffness & strength", "Heat resistance", "Dimensional control"],
    solutions: ["Glass-filled compounds", "Custom formulation"],
    grades: ["Custom Compound — Glass Filled"],
    caseStudy: {
      problem: "A manufacturer needed a stiffer structural bracket.",
      solution: "A 20% glass-filled compound met the load spec.",
      result: "Passed all durability tests on first trial.",
    },
  },
];

export const CONTACT = {
  email: "info@kpolytech.in",
  phone: "+91 9033118051",
  phone2: "+91 8675278692",
  phoneRaw: "919033118051",
  phoneRaw2: "918675278692",
  address:
    "Plot No. 111-114, Tasnim Nagar, Unn Industrial Estate, behind Sanabil Bakery, Sachin Naka, Surat - 394210, Gujarat",
  linkedin: "https://www.linkedin.com/company/pcrpolymersllp/",
};

export const whatsappUrl = (
  msg = "Hello PCR Polymers LLP, I'd like to inquire about your products.",
) => `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;

export const mapUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`;
