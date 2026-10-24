import { studentReview } from "./media";

export const batches = [
  { name: "CSS 2027 Foundation", note: "Morning · PAS & FSP mentors", date: "MON 03 NOV", time: "09:00–13:00", mode: "Hybrid", left: 7, total: 40, status: "Filling fast" },
  { name: "CSS Executive Evening", note: "Professionals · Recorded", date: "WED 05 NOV", time: "18:00–21:00", mode: "Hybrid", left: 5, total: 35, status: "Filling fast" },
  { name: "PMS Punjab Intensive", note: "Urdu essay & provincial laws", date: "SAT 08 NOV", time: "14:00–17:00", mode: "Campus", left: 9, total: 30, status: "Boarding" },
  { name: "Essay & Précis Clinic", note: "40 days · 15 marked essays", date: "TUE 10 NOV", time: "16:00–18:30", mode: "Hybrid", left: 6, total: 40, status: "Final call" },
  { name: "MPT & MCQ Sprint", note: "12 computerised mocks", date: "SAT 14 NOV", time: "10:00–14:00", mode: "Online", left: 33, total: 60, status: "Boarding" },
];

/**
 * Real faculty, verified from public sources (Oct 2026):
 * - CSI Instagram and YouTube credit Dr. Sassi Malik Sher; the YouTube channel is named "Civil Services Institute".
 * - CSS 2017, first attempt, précis & composition topper; MLCG, 46th CTP: her YouTube video descriptions and channel bio.
 * - TEDxQAU speaker, Dec 2024: ted.com/tedx/events/59084.
 * Other faculty are not published anywhere, so they stay as open slots until CSI confirms names.
 */
export const leadFaculty = {
  name: "Dr. Sassi Malik Sher",
  role: "Founder mentor · English Précis & Composition",
  group: "MLCG",
  facts: [
    "Cleared CSS 2017 in her first attempt",
    "Précis & Composition topper, CSS 2017",
    "Military Lands & Cantonments Group, 46th CTP",
    "MBBS · TEDxQAU speaker (2024)",
  ],
  bio: "A serving civil servant who teaches the paper she topped. Her free précis and composition lectures on YouTube are where many aspirants first meet CSI.",
};

/** Open seats on the faculty board — filled once CSI shares its teaching panel. */
export const facultySlots = ["Current Affairs", "Pakistan Affairs", "General Science & Ability"];

/** Results announced by CSI in its "Star of CSI" posts (Instagram, "Our stars" highlight). */
export const stars = [
  { name: "Memoona Malik", group: "FSP", service: "Foreign Service of Pakistan", result: "CSS 2024 qualifier", photo: "/csi/stars/memoona-malik.jpg", poster: "/csi/stars/memoona-malik-poster.png" },
  { name: "Kinza Nawaz", group: "PAS", service: "Pakistan Administrative Service", result: "CSS 2024 qualifier", photo: "/csi/stars/kinza-nawaz.jpg", poster: "/csi/stars/kinza-nawaz-poster.png" },
  { name: "Arsal Hussain", group: "CCE", service: "Sindh Combined Competitive Exam", result: "CCE Sindh written qualifier", photo: "/csi/stars/arsal-hussain.jpg", poster: "/csi/stars/arsal-hussain-poster.png" },
];
export type Star = (typeof stars)[number];

/** Stops on the alumni road: CSI's three stars plus the real student review CSI shared. */
export type Station = { kind: "officer" | "review"; label: string; hint: string; review?: typeof studentReview; star?: Star };

export const alumniStations: Station[] = [
  { kind: "officer", label: "Star of CSI", hint: "", star: stars[0] },
  { kind: "review", label: "Student review", hint: "", review: studentReview },
  { kind: "officer", label: "Star of CSI", hint: "", star: stars[1] },
  { kind: "officer", label: "Star of CSI", hint: "", star: stars[2] },
];

export const optionals: Record<string, { subjects: [string, number][]; why: string }> = {
  "Engineering & Sciences": {
    subjects: [["Applied Mathematics", 200], ["Physics", 200], ["Computer Science", 100], ["Geography", 100]],
    why: "Quantitative papers reward precision; scoring is consistent for candidates with a technical background.",
  },
  "Social Sciences": {
    subjects: [["International Relations", 200], ["Political Science", 200], ["Sociology", 100], ["Criminology", 100]],
    why: "Strong overlap with Current Affairs and Pakistan Affairs means one reading list serves several papers.",
  },
  "Law & Commerce": {
    subjects: [["Constitutional Law", 100], ["Mercantile Law", 100], ["Accountancy & Auditing", 200], ["Business Administration", 100], ["Public Administration", 100]],
    why: "Builds directly on your degree and keeps optional preparation time short.",
  },
  "Arts & Humanities": {
    subjects: [["English Literature", 200], ["History of Pakistan & India", 100], ["Islamic History & Culture", 100], ["Gender Studies", 100], ["Punjabi", 100]],
    why: "Essay-friendly subjects that reward the same writing skill you build for the compulsories.",
  },
};
