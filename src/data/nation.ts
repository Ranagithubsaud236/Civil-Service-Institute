/**
 * Content for the "From Aspirant to Nation Builder" home page.
 * Exam rules change — the page points readers to the latest FPSC / PSC notifications.
 */

/** Simplified outline of Pakistan as [longitude, latitude] points — illustrative, not survey-accurate. */
export const pakistanOutline: [number, number][] = [
  [61.61, 25.19], [62.33, 25.11], [63.6, 25.3], [64.65, 25.18], [65.6, 25.35], [66.3, 25.5], [66.65, 25.4],
  [66.95, 24.85], [67.3, 24.7], [67.5, 24.1], [68.2, 23.7], [68.9, 24.25], [69.6, 24.28], [70.6, 24.4],
  [71.05, 24.45], [70.85, 25.15], [70.65, 25.7], [70.3, 25.95], [70.15, 26.5], [69.7, 26.75], [69.55, 27.15],
  [70.0, 27.75], [70.6, 28.0], [71.2, 28.15], [71.9, 27.95], [72.4, 28.6], [72.95, 29.0], [73.4, 29.95],
  [73.9, 30.35], [74.55, 31.0], [74.55, 31.5], [74.65, 31.9], [75.0, 32.3], [75.38, 32.45], [74.65, 32.85],
  [74.3, 33.4], [74.1, 33.75], [74.05, 34.1], [74.3, 34.6], [75.2, 34.7], [76.0, 34.75], [76.6, 35.0],
  [77.1, 35.45], [76.6, 35.85], [76.15, 35.85], [75.9, 36.4], [75.42, 36.85], [74.85, 37.05], [74.55, 37.03],
  [73.7, 36.9], [72.5, 36.8], [71.65, 36.5], [71.25, 36.1], [71.6, 35.4], [71.1, 34.95], [71.2, 34.4],
  [71.08, 34.1], [70.3, 33.95], [69.9, 34.0], [70.15, 33.25], [69.6, 33.0], [69.35, 32.3], [69.2, 31.95],
  [68.8, 31.65], [68.2, 31.8], [67.65, 31.45], [67.0, 31.3], [66.37, 30.93], [66.3, 29.85], [65.0, 29.55],
  [64.1, 29.38], [62.48, 29.4], [60.87, 29.86], [61.35, 29.3], [61.75, 28.8], [62.4, 28.4], [62.75, 28.2],
  [62.8, 27.75], [63.3, 27.2], [63.2, 26.65], [62.4, 26.55], [61.85, 26.25], [61.6, 25.8],
];

export type City = {
  name: string;
  lon: number;
  lat: number;
  institution: string;
  topic: string;
  path: string;
  /** governance topics revealed when the city is selected */
  topics: string[];
  /** which side of the dot the label sits on, to keep labels inside the map */
  label?: "left" | "right";
};

export const cities: City[] = [
  { name: "Islamabad", lon: 73.05, lat: 33.68, institution: "Federal Public Service Commission", topic: "The federal capital, where the CSS examination is conducted and national policy is drafted in the ministries.", path: "Pakistan Administrative Service · Foreign Service", topics: ["Federal policy", "Foreign affairs", "Civil service reform"], label: "right" },
  { name: "Lahore", lon: 74.35, lat: 31.55, institution: "Civil Services Academy", topic: "Where newly selected officers of every group begin their common training, and where the Punjab Public Service Commission sits.", path: "Common Training Programme · PMS Punjab", topics: ["Officer training", "Urban governance", "Heritage & culture"], label: "left" },
  { name: "Karachi", lon: 67.0, lat: 24.86, institution: "Customs & Inland Revenue", topic: "The country's commercial heart — trade, ports and the revenue that funds public services nationwide.", path: "Pakistan Customs · Inland Revenue Service", topics: ["Trade & ports", "Revenue collection", "Urban services"], label: "right" },
  { name: "Peshawar", lon: 71.52, lat: 34.0, institution: "Khyber Pakhtunkhwa PSC", topic: "Provincial administration across districts, tribal merged areas and border regions.", path: "PMS Khyber Pakhtunkhwa · Police Service", topics: ["Merged districts", "Border management", "Education access"], label: "left" },
  { name: "Quetta", lon: 67.0, lat: 30.18, institution: "Balochistan PSC", topic: "Governance across Pakistan's largest province — water, mining, roads and long-distance service delivery.", path: "PMS Balochistan · Commerce & Trade", topics: ["Water management", "Mining & minerals", "Rural roads"], label: "right" },
  { name: "Hyderabad", lon: 68.37, lat: 25.39, institution: "Sindh PSC", topic: "Provincial recruitment for Sindh's administration, revenue and local government.", path: "PMS Sindh · Revenue administration", topics: ["Irrigation", "Land records", "Local government"], label: "right" },
  { name: "Multan", lon: 71.47, lat: 30.2, institution: "South Punjab Secretariat", topic: "Bringing provincial departments closer to the people of southern Punjab.", path: "Provincial secretariat · District management", topics: ["Agriculture", "Regional secretariat", "Health services"], label: "right" },
  { name: "Gilgit", lon: 74.31, lat: 35.92, institution: "Gilgit-Baltistan administration", topic: "District management among the world's highest mountains — tourism, disaster response and connectivity.", path: "District administration", topics: ["Disaster response", "Tourism", "Mountain connectivity"], label: "left" },
  { name: "Muzaffarabad", lon: 73.47, lat: 34.37, institution: "AJK Public Service Commission", topic: "Administration, reconstruction and development across Azad Jammu & Kashmir.", path: "AJK civil service", topics: ["Reconstruction", "Hydropower", "Public works"], label: "right" },
  { name: "Gwadar", lon: 62.32, lat: 25.13, institution: "Port & coastal development", topic: "Deep-sea port, coastal communities and the economic corridor — commerce meets public planning.", path: "Commerce & Trade · Planning", topics: ["Port development", "Coastal communities", "Economic corridor"], label: "right" },
];

export const pathTabs = ["CSS", "PMS", "Eligibility", "Exam stages", "Career groups"] as const;

export const css = {
  title: "Central Superior Services",
  body: "Conducted every year by the Federal Public Service Commission, CSS selects officers in grade BS-17 for the federal government — from district administration and policing to diplomacy, revenue and audit.",
  facts: [
    { value: "12", label: "Occupational groups" },
    { value: "1200", label: "Written marks" },
    { value: "300", label: "Viva voce marks" },
  ],
};

export const pms = {
  title: "Provincial Management Service",
  body: "Each province recruits its own officers through its public service commission. PMS officers serve as assistant commissioners, section officers and in provincial departments — close to the communities they serve.",
  commissions: ["Punjab PSC", "Sindh PSC", "Khyber Pakhtunkhwa PSC", "Balochistan PSC"],
};

export const eligibility = [
  { label: "Nationality", value: "Citizen of Pakistan, or a person deemed to be a citizen" },
  { label: "Education", value: "Bachelor's degree (at least second division) or equivalent from a recognised university" },
  { label: "Age", value: "Within the age window set in the current FPSC rules, with relaxations for specified categories" },
  { label: "Attempts", value: "A limited number of attempts within the age window" },
];

export const stages = [
  { title: "MPT", detail: "Screening test of multiple-choice questions" },
  { title: "Written", detail: "Compulsory and optional papers, 1200 marks" },
  { title: "Medical", detail: "Fitness assessment" },
  { title: "Psychological", detail: "Tests and group tasks" },
  { title: "Viva voce", detail: "Interview before the commission" },
  { title: "Allocation", detail: "Group allocated on merit and preference" },
];

export const groups = [
  "Pakistan Administrative Service",
  "Police Service of Pakistan",
  "Foreign Service of Pakistan",
  "Inland Revenue Service",
  "Pakistan Customs Service",
  "Pakistan Audit & Accounts Service",
  "Commerce & Trade Group",
  "Information Group",
  "Office Management Group",
  "Postal Group",
  "Railways (Commercial & Transportation)",
  "Military Lands & Cantonments",
];

export const milestones = [
  { key: "Discover", urdu: "تلاش", body: "Check eligibility, map the syllabus and choose optionals that fit your strengths.", items: ["Eligibility check", "Syllabus map", "Optional subject advisor"] },
  { key: "Prepare", urdu: "تیاری", body: "Daily study plans, current affairs digests and red-pen evaluation of every essay.", items: ["Study plans", "Current affairs", "Essay & précis clinics"] },
  { key: "Compete", urdu: "مقابلہ", body: "Timed MPT mocks and full written papers under real examination conditions.", items: ["Mock MPTs", "Saturday hall papers", "Performance reports"] },
  { key: "Serve", urdu: "خدمت", body: "Psychological assessment, mock viva boards and guidance on group preferences.", items: ["Psych practice", "Mock viva boards", "Allocation counselling"] },
];

export const weekPlan = [
  { day: "Mon", task: "Pakistan Affairs — Constitution of 1973" },
  { day: "Tue", task: "Current affairs digest + 20 MCQs" },
  { day: "Wed", task: "English essay outline: climate & governance" },
  { day: "Thu", task: "Optional: International Relations, unit 4" },
  { day: "Fri", task: "Précis & composition drill" },
  { day: "Sat", task: "Full mock paper under hall conditions" },
];

export const impact = [
  { key: "Education", body: "Opening schools, training teachers and keeping girls in classrooms across a district." },
  { key: "Healthcare", body: "Running vaccination drives and keeping basic health units staffed and supplied." },
  { key: "Infrastructure", body: "Planning roads, water schemes and flood defences that last a generation." },
  { key: "Communities", body: "Resolving disputes, keeping land records honest and leading relief when disaster strikes." },
];

export const stories = [
  { name: "Hira Naveed", role: "Pakistan Administrative Service", year: "CSS 2025", quote: "I grew up queuing outside offices for simple documents. Now I sit on the other side of that desk, and I try to make the queue shorter.", place: "Rawalpindi" },
  { name: "Hamza Iqbal", role: "Foreign Service of Pakistan", year: "CSS 2025", quote: "My essay score doubled once I stopped writing to impress and started writing to argue. That lesson now shapes every brief I draft.", place: "Jhelum" },
  { name: "Mahnoor Ali", role: "Police Service of Pakistan", year: "CSS 2025", quote: "The mock boards were harder than the real one. I walked into the commission calm, because I had already faced the toughest questions.", place: "Multan" },
];

/** Career constellation — an interactive preview, not a live map of official recruitment systems. */
export const constellation = [
  {
    key: "CSS",
    title: "Central Superior Services",
    body: "One competitive examination by the FPSC opens twelve federal occupational groups. Your merit and preferences decide where you serve.",
    x: 260,
    y: 170,
    routes: ["Administrative Service", "Police Service", "Foreign Service", "Inland Revenue", "Customs", "Audit & Accounts"],
  },
  {
    key: "PMS",
    title: "Provincial Management Service",
    body: "Each province recruits its own officers. Serve closest to the people as an assistant commissioner, section officer or in provincial departments.",
    x: 750,
    y: 190,
    routes: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"],
  },
  {
    key: "Other pathways",
    title: "Other public-sector routes",
    body: "Explore other public-sector recruitment routes, official vacancies and their eligibility criteria through federal and provincial commissions.",
    x: 520,
    y: 500,
    routes: ["General recruitment", "Departmental posts", "Autonomous bodies", "Special drives"],
  },
];

/** Swipeable preparation tools. */
export const resources = [
  { title: "Syllabus map", tag: "Discover", body: "Every compulsory and optional paper broken into weekly units you can tick off.", tone: "from-[#024d84] to-[#022b52]" },
  { title: "Daily current affairs", tag: "Prepare", body: "A ten-minute brief each morning, linked to the papers it will help you answer.", tone: "from-[#a8742c] to-[#5a3d14]" },
  { title: "Essay & précis clinic", tag: "Prepare", body: "Fifteen essays, each returned with line-by-line remarks and a rewrite session.", tone: "from-[#376c92] to-[#0f3254]" },
  { title: "Mock MPT", tag: "Compete", body: "Timed computer-based screening tests with topic-wise explanations.", tone: "from-[#1b3150] to-[#0a1a2e]" },
  { title: "Hall-condition papers", tag: "Compete", body: "Full written papers every Saturday, under real time limits and invigilation.", tone: "from-[#5f89a6] to-[#24496a]" },
  { title: "Mock viva board", tag: "Serve", body: "Recorded interviews with retired officers, reviewed with you one-on-one.", tone: "from-[#023b6b] to-[#011a33]" },
];
