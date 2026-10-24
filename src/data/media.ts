/**
 * Real CSI content, collected Oct 24, 2026 from CSI's public channels:
 * - Instagram @civil_services_institute: images are the 640px versions Instagram serves publicly.
 * - YouTube "Civil Services Institute" (@sassimaliksher777): 1280×720 thumbnails, titles and view counts.
 * Captions are written from what each post shows; Instagram captions themselves weren't readable.
 */
export const ig = (code: string) => `https://www.instagram.com/civil_services_institute/p/${code}/`;
export const reel = (code: string) => `https://www.instagram.com/civil_services_institute/reel/${code}/`;
export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export type Img = { src: string; w: number; h: number; alt: string };

export const posts = {
  frontDesk: { src: "/csi/ig/front-desk.jpg", w: 513, h: 640, alt: "CSI reception desk with the CSI crest, Pakistan flag and the words “What we offer”" },
  publications: { src: "/csi/ig/publications.jpg", w: 512, h: 640, alt: "Civil Services Institute Publications poster: your partner in quality learning" },
  studentLetter: { src: "/csi/ig/student-letter.jpg", w: 541, h: 640, alt: "A student's message to Dr. Sassi Malik Sher about joining CSI" },
  pressReview: { src: "/csi/ig/press-review-plus.jpg", w: 485, h: 640, alt: "Press Review Plus magazine among Dawn, The Nation and The Express Tribune" },
  bundle: { src: "/csi/ig/five-book-bundle.jpg", w: 485, h: 640, alt: "CSI 5-book bundle offer, now Rs. 13,150" },
  reelEvent: { src: "/csi/ig/reel-event.jpg", w: 361, h: 640, alt: "Dr. Sassi Malik Sher at an event" },
  reelEnrol: { src: "/csi/ig/reel-enrol.jpg", w: 361, h: 640, alt: "Dr. Sassi Malik Sher inviting students to enrol" },
  reelWelcome: { src: "/csi/ig/reel-welcome.jpg", w: 360, h: 640, alt: "Dr. Sassi Malik Sher welcoming new aspirants" },
  reelWhatsapp: { src: "/csi/ig/reel-whatsapp.jpg", w: 361, h: 640, alt: "Dr. Sassi Malik Sher sharing the CSI WhatsApp number" },
} satisfies Record<string, Img>;

export type Video = { id: string; title: string; views: string };

/** CSS and English-skills lectures only; the channel's personal vlogs are left out. */
export const videos: Video[] = [
  { id: "cJUCCNueaoY", title: "Routine for CSS/PMS aspirants", views: "63K" },
  { id: "zaIol_s0jZw", title: "How to read the newspaper for CSS/PMS", views: "43K" },
  { id: "mC3Bvfi5DlU", title: "English learning routine — 10 minutes a day", views: "127K" },
  { id: "gJlODX50EYU", title: "How to manage your time", views: "30K" },
  { id: "0iPPeKyYnJE", title: "CSS journey for MBBS students", views: "5.9K" },
  { id: "PMIId5QyGvI", title: "Tips for self study", views: "19K" },
  { id: "TlU4BZrEeDc", title: "10 speaking techniques to speak eloquently", views: "8.5K" },
  { id: "kBZQSa1qzpA", title: "How to be fluent in speaking English", views: "12K" },
  { id: "N_Vv6IRgENk", title: "How to build self-confidence", views: "7.6K" },
  { id: "FvqWCTxflmk", title: "Book review: The Art of Being Alone", views: "2.9K" },
];
export const thumb = (id: string): Img => ({ src: `/csi/yt/${id}.jpg`, w: 1280, h: 720, alt: "" });
export const channel = { subscribers: "60.7K", videos: 58 };

/** Hero carousel: alternates sharp YouTube thumbnails with Instagram posts. */
export const slides = [
  { kicker: "Inside CSI", title: "What we offer", body: "Classes in Rawalpindi and live online across Pakistan, led by Dr. Sassi Malik Sher.", img: posts.frontDesk, href: ig("DcQkCDbDHte") },
  { kicker: "Free lecture · 63K views", title: "Routine for CSS/PMS preparation", body: "A day planned around reading, revision and writing practice.", img: thumb("cJUCCNueaoY"), href: youtubeUrl("cJUCCNueaoY") },
  { kicker: "New edition", title: "Press Review Plus", body: "The month's newspapers distilled for CSS current affairs.", img: posts.pressReview, href: ig("DewF_7RiUSz") },
  { kicker: "Free lecture · 43K views", title: "How to read the newspaper for CSS", body: "What to read in Dawn and Tribune, and how to turn it into exam material.", img: thumb("zaIol_s0jZw"), href: youtubeUrl("zaIol_s0jZw") },
  { kicker: "CSI Publications", title: "The 5-book bundle", body: "Press Review Plus, current affairs, Pakistan affairs, essays and GSA — now Rs. 13,150.", img: posts.bundle, href: ig("DeuD3U9CA9Y") },
];

/** News & events, newest first. Dates are the Instagram post dates. */
export const news = [
  { date: "Oct 21, 2026", tag: "Publications", title: "Press Review Plus — new edition out", body: "The latest digest of Dawn, The Nation, Express Tribune and The Economist, organised for CSS current affairs.", img: posts.pressReview, href: ig("DewF_7RiUSz") },
  { date: "Oct 20, 2026", tag: "Offer", title: "5-book bundle now Rs. 13,150", body: "Down from Rs. 14,150. Order on WhatsApp: 0333 2694260.", img: posts.bundle, href: ig("DeuD3U9CA9Y") },
  { date: "Oct 19, 2026", tag: "Admissions", title: "Enrolment open — WhatsApp 0339 0058140", body: "Dr. Sassi Malik Sher invites new aspirants to join the next batch.", img: posts.reelEnrol, href: reel("Derq43OCT3l") },
  { date: "Oct 08, 2026", tag: "Student voice", title: "“I joined CSI knowing nothing about CSS”", body: "A student shares why CSI stood apart after orientations at other academies.", img: posts.studentLetter, href: ig("DeQnlIngiZA") },
  { date: "Aug 20, 2026", tag: "Launch", title: "CSI Publications: your partner in quality learning", body: "Exam-focused, well-structured books trusted by aspirants.", img: posts.publications, href: ig("DcRFr8xjHSG") },
];

/** A real review, quoted from the student's message CSI shared on Instagram (Oct 8, 2026). */
export const studentReview = {
  quote: "I joined CSI knowing nothing about CSS. I did take multiple orientation sessions by other academies and they were far more generic and basic than one can think of.",
  who: "A CSI student",
  source: "Message shared by CSI on Instagram, Oct 2026",
  href: ig("DeQnlIngiZA"),
};

export const publicationsWhatsapp = "0333 2694260";
