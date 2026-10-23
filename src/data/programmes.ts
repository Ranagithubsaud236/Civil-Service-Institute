export type Category = "CSS" | "PMS" | "Clinic" | "Interview";

export type Programme = {
  slug: string;
  code: string;
  title: string;
  category: Category;
  duration: string;
  tag: string;
  summary: string;
  features: string[];
  fee: string;
  featured?: boolean;
  schedule: string;
  mode: string;
  outcomes: string[];
};

export const programmes: Programme[] = [
  {
    slug: "css-comprehensive-foundation",
    code: "PRG-01",
    title: "CSS Comprehensive Foundation",
    category: "CSS",
    duration: "6 months",
    tag: "Most recommended",
    featured: true,
    summary: "The complete preparation programme: all six compulsory papers (600 marks) and guided preparation for 600 marks of optionals.",
    features: ["Daily 4-hour lectures by senior mentors", "24 Saturday mock papers under FPSC conditions", "Weekly essay & précis one-on-one feedback", "Library access & monthly current-affairs dossier"],
    fee: "PKR 75,000",
    schedule: "Mon–Fri, 9:00 AM – 1:00 PM",
    mode: "Campus + Online",
    outcomes: ["Full compulsory syllabus covered twice", "Personal optional-subject strategy", "Exam-ready essay and précis portfolio", "Mock series ranking against your batch"],
  },
  {
    slug: "css-executive-evening",
    code: "PRG-02",
    title: "CSS Executive Evening",
    category: "CSS",
    duration: "6 months",
    tag: "For working professionals",
    summary: "The full CSS syllabus rescheduled for working professionals, with recorded lecture access and weekend mock papers.",
    features: ["Mon–Thu, 6:00–9:00 PM", "Recorded lectures on the CSI portal", "Sunday mock papers & essay clinics"],
    fee: "PKR 65,000",
    schedule: "Mon–Thu, 6:00 PM – 9:00 PM",
    mode: "Campus + Online",
    outcomes: ["Prepare without leaving your job", "Catch-up recordings for every lecture", "Weekend mock series"],
  },
  {
    slug: "pms-punjab-intensive",
    code: "PRG-03",
    title: "PMS Punjab Intensive",
    category: "PMS",
    duration: "4 months",
    tag: "PPSC scheme",
    summary: "Targeted written preparation for the Punjab PMS examination, including the Urdu essay and provincial governance modules.",
    features: ["Urdu essay & translation practice", "Punjab-specific current affairs & local government", "Ten full-length PPSC-pattern mocks"],
    fee: "PKR 55,000",
    schedule: "Sat–Wed, 2:00 PM – 5:00 PM",
    mode: "Campus",
    outcomes: ["Command of the PPSC scheme", "Urdu essay confidence", "Provincial governance depth"],
  },
  {
    slug: "essay-precis-clinic",
    code: "PRG-04",
    title: "English Essay & Précis Clinic",
    category: "Clinic",
    duration: "40 days",
    tag: "Highest failure paper",
    summary: "The paper that decides most CSS attempts. Fifteen full essays, each marked line by line with a rewrite session.",
    features: ["Outline building & thesis statement drills", "15 essays with written red-pen feedback", "Précis, comprehension & grammar sprints"],
    fee: "PKR 20,000",
    schedule: "Tue–Sat, 4:00 PM – 6:30 PM",
    mode: "Campus + Online",
    outcomes: ["A repeatable outline method", "15 evaluated essays", "Measured improvement in score"],
  },
  {
    slug: "mpt-mcq-sprint",
    code: "PRG-05",
    title: "MPT & One-Paper MCQ Sprint",
    category: "CSS",
    duration: "6 weeks",
    tag: "MPT ready",
    summary: "Fast, targeted preparation for the FPSC Multiple-choice Preliminary Test and one-paper MCQ examinations.",
    features: ["12 full-length computerised mock MPTs", "Topic-wise question bank with explanations", "Speed & elimination technique workshops"],
    fee: "PKR 15,000",
    schedule: "Sat–Sun, 10:00 AM – 2:00 PM",
    mode: "Live online",
    outcomes: ["Clear the MPT threshold comfortably", "Faster elimination technique"],
  },
  {
    slug: "viva-voce-board",
    code: "PRG-06",
    title: "Psychological & Viva Voce Board",
    category: "Interview",
    duration: "5 weeks",
    tag: "For written qualifiers",
    summary: "Simulated boards chaired by retired secretaries, ambassadors and police officers, with recorded feedback and grooming.",
    features: ["Psychological test & group-task practice", "Three recorded mock viva boards", "Personal profile & service preference counselling"],
    fee: "PKR 25,000",
    schedule: "By appointment",
    mode: "Campus",
    outcomes: ["Calm under board pressure", "A polished personal profile", "A considered service preference list"],
  },
];

export const categories: ("All" | Category)[] = ["All", "CSS", "PMS", "Clinic", "Interview"];

export const getProgramme = (slug: string) => programmes.find((p) => p.slug === slug);
