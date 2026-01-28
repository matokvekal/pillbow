import { FormType, WarningCode, MedColor } from "./constants";

export interface MedicationDef {
  id: string;
  name: string;
  company: string;
  strength: string;
  form: FormType;
  unit: string;
  doctor: string;
  doctorPhone?: string;
  validUntil?: string;
  pharmacy?: string;
  withFood: boolean | null; // true=with food, false=empty stomach, null=any
  warnings: WarningCode[];
  instructions: string;
  color: MedColor;
  image?: string;
}

// Master list of medications
export const MEDICATIONS: MedicationDef[] = [
  {
    id: "med_1",
    name: "Metformin",
    company: "Teva",
    strength: "500mg",
    form: "pill",
    unit: "pills",
    doctor: "Dr. Sarah Cohen",
    doctorPhone: "03-5551234",
    validUntil: "2026-06-30",
    pharmacy: "SuperPharm Dizengoff",
    withFood: true,
    warnings: ["no-alcohol"],
    instructions: "Take with meals to reduce stomach upset",
    color: "bg-blue-300",
  },
  {
    id: "med_2",
    name: "Aspirin",
    company: "Bayer",
    strength: "100mg",
    form: "pill",
    unit: "pills",
    doctor: "Dr. Sarah Cohen",
    doctorPhone: "03-5551234",
    validUntil: "2026-12-31",
    pharmacy: "SuperPharm Dizengoff",
    withFood: true,
    warnings: [],
    instructions: "Take with food to protect stomach",
    color: "bg-red-300",
  },
  {
    id: "med_3",
    name: "Vitamin D3",
    company: "Solgar",
    strength: "1000IU",
    form: "pill",
    unit: "pills",
    doctor: "Dr. Sarah Cohen",
    validUntil: "2027-01-01",
    pharmacy: "Health Store",
    withFood: true,
    warnings: [],
    instructions: "Take with fatty food for better absorption",
    color: "bg-yellow-300",
  },
  {
    id: "med_4",
    name: "Omeprazole",
    company: "AstraZeneca",
    strength: "20mg",
    form: "pill",
    unit: "pills",
    doctor: "Dr. David Levy",
    doctorPhone: "03-5559876",
    validUntil: "2026-03-31",
    pharmacy: "Pharma Plus",
    withFood: false,
    warnings: [],
    instructions: "Take 30 minutes before breakfast on empty stomach",
    color: "bg-purple-300",
  },
  {
    id: "med_5",
    name: "Lisinopril",
    company: "Merck",
    strength: "10mg",
    form: "pill",
    unit: "pills",
    doctor: "Dr. Sarah Cohen",
    doctorPhone: "03-5551234",
    validUntil: "2026-09-30",
    pharmacy: "SuperPharm Dizengoff",
    withFood: null,
    warnings: ["no-drive", "drowsy"],
    instructions: "May cause dizziness. Rise slowly from sitting position.",
    color: "bg-green-300",
  },
  {
    id: "med_6",
    name: "Eye Drops",
    company: "Alcon",
    strength: "0.5%",
    form: "drops",
    unit: "drops",
    doctor: "Dr. Rachel Green",
    doctorPhone: "03-5554321",
    validUntil: "2026-02-28",
    pharmacy: "Optic Pharmacy",
    withFood: null,
    warnings: [],
    instructions: "2 drops in each eye. Wait 5 min before other drops.",
    color: "bg-cyan-300",
  },
  {
    id: "med_7",
    name: "Insulin Lantus",
    company: "Sanofi",
    strength: "100U/ml",
    form: "injection",
    unit: "units",
    doctor: "Dr. Sarah Cohen",
    doctorPhone: "03-5551234",
    validUntil: "2026-04-30",
    pharmacy: "SuperPharm Dizengoff",
    withFood: null,
    warnings: ["refrigerate"],
    instructions: "Inject subcutaneously at same time each day",
    color: "bg-indigo-300",
  },
  {
    id: "med_8",
    name: "Ventolin",
    company: "GSK",
    strength: "100mcg",
    form: "inhaler",
    unit: "puffs",
    doctor: "Dr. Michael Brown",
    doctorPhone: "03-5557777",
    validUntil: "2026-08-31",
    pharmacy: "Pharma Plus",
    withFood: null,
    warnings: [],
    instructions: "Shake well before use. 2 puffs as needed.",
    color: "bg-teal-300",
  },
];

// Helper to get medication by ID
export const getMedicationById = (id: string): MedicationDef | undefined => {
  return MEDICATIONS.find(m => m.id === id);
};
