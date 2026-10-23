export const batches = [
  { name: "CSS 2027 Foundation", note: "Morning · PAS & FSP mentors", date: "MON 03 NOV", time: "09:00–13:00", mode: "Hybrid", left: 7, total: 40, status: "Filling fast" },
  { name: "CSS Executive Evening", note: "Professionals · Recorded", date: "WED 05 NOV", time: "18:00–21:00", mode: "Hybrid", left: 5, total: 35, status: "Filling fast" },
  { name: "PMS Punjab Intensive", note: "Urdu essay & provincial laws", date: "SAT 08 NOV", time: "14:00–17:00", mode: "Campus", left: 9, total: 30, status: "Boarding" },
  { name: "Essay & Précis Clinic", note: "40 days · 15 marked essays", date: "TUE 10 NOV", time: "16:00–18:30", mode: "Hybrid", left: 6, total: 40, status: "Final call" },
  { name: "MPT & MCQ Sprint", note: "12 computerised mocks", date: "SAT 14 NOV", time: "10:00–14:00", mode: "Online", left: 33, total: 60, status: "Boarding" },
];

export const faculty = [
  { group: "PAS", name: "Dr. Ahsan Rafiq", title: "Federal Secretary (Retd.) · Ph.D. Public Policy", subject: "Governance & Public Policy", bio: "Three decades across federal ministries; now leads CSI's public administration and policy-writing clinics." },
  { group: "FSP", name: "Amb. (R) Saima Qureshi", title: "Foreign Service of Pakistan · M.Phil IR", subject: "Current Affairs & IR", bio: "Served in missions across Europe and the Gulf; teaches foreign policy through real diplomatic case files." },
  { group: "EVAL", name: "Prof. Tariq Mansoor", title: "Chief Essay Evaluator · M.Phil Linguistics", subject: "English Essay & Précis", bio: "Thirty years of essay evaluation; known for his unforgiving red pen and his students' essay scores." },
  { group: "PSP", name: "Zeeshan Altaf", title: "Police Service of Pakistan · LL.M.", subject: "Criminology & Constitutional Law", bio: "Brings district command experience into the classroom: case law, procedure and the realities of policing." },
  { group: "GSA", name: "Dr. Ayesha Siddiqui", title: "Ph.D. Environmental Physics", subject: "General Science & Ability", bio: "Makes GSA, the most feared compulsory for arts students, a scoring paper through concept mapping." },
  { group: "PMS", name: "Farah Javed", title: "Provincial Management Service · M.A. Urdu", subject: "Urdu Essay & Punjab Affairs", bio: "A PMS officer who teaches the Urdu essay as a craft — structure first, then voice." },
];

export const achievers = [
  { name: "Hira Naveed", exam: "CSS 2025", group: "PAS", merit: "Top 10" },
  { name: "Hamza Iqbal", exam: "CSS 2025", group: "FSP", merit: "Top 20" },
  { name: "Mahnoor Ali", exam: "CSS 2025", group: "PSP", merit: "Top 50" },
  { name: "Usman Khalid", exam: "CSS 2025", group: "PAS", merit: "Top 50" },
  { name: "Bilal Ahmed Khan", exam: "PMS Punjab 2025", group: "PMS", merit: "2nd Punjab" },
  { name: "Areeba Fatima", exam: "CSS 2025", group: "PSP", merit: "Top 100" },
];

export const testimonials = [
  { quote: "The Saturday mocks were harder than the real paper. By February, sitting in the FPSC hall felt routine.", name: "Hira Naveed", meta: "PAS · CSS 2025" },
  { quote: "My essay went from 28 to 61 marks. Prof. Mansoor returned every draft covered in red ink — that was the point.", name: "Hamza Iqbal", meta: "FSP · CSS 2025" },
  { quote: "The mock viva board asked me tougher questions than the actual one. I walked in calm.", name: "Mahnoor Ali", meta: "PSP · CSS 2025" },
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
