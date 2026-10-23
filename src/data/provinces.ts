/**
 * Provinces and regions for the scroll story. Outlines are simplified [lon, lat] traces —
 * illustrative, not survey-accurate. Positions are typical posts, linked to a place on the map.
 */

export type Post = { title: string; place: string; lon: number; lat: number };

export type Province = {
  name: string;
  urdu: string;
  capital: string;
  commission: string;
  line: string;
  outline: [number, number][];
  posts: Post[];
};

export const provinces: Province[] = [
  {
    name: "Punjab",
    urdu: "پنجاب",
    capital: "Lahore",
    commission: "Punjab Public Service Commission",
    line: "Five rivers, the country's breadbasket — and the largest share of its people.",
    outline: [
      [72.3, 33.9], [73.05, 33.85], [73.4, 33.95], [73.45, 33.75], [73.55, 33.4], [73.6, 33.05], [74.05, 32.85], [74.45, 32.8],
      [75.38, 32.45], [75.0, 32.3],
      [74.65, 31.9], [74.55, 31.5], [74.55, 31.0], [73.9, 30.35], [73.4, 29.95], [72.95, 29.0], [72.4, 28.6], [71.9, 27.95],
      [71.2, 28.15], [70.6, 28.0], [69.6, 28.45], [69.4, 28.95], [69.9, 29.4], [70.2, 29.95], [69.85, 30.6], [69.9, 31.0],
      [70.6, 31.5], [71.2, 31.9], [71.4, 32.5], [71.8, 33.0], [72.0, 33.5],
    ],
    posts: [
      { title: "Chief Secretary", place: "Lahore", lon: 74.35, lat: 31.55 },
      { title: "Commissioner", place: "Rawalpindi Division", lon: 73.05, lat: 33.6 },
      { title: "Deputy Commissioner", place: "Faisalabad", lon: 73.08, lat: 31.42 },
      { title: "District Police Officer", place: "Multan", lon: 71.47, lat: 30.2 },
      { title: "Assistant Commissioner", place: "Bahawalpur", lon: 71.68, lat: 29.4 },
      { title: "Secretary School Education", place: "Lahore", lon: 74.2, lat: 31.4 },
    ],
  },
  {
    name: "Sindh",
    urdu: "سندھ",
    capital: "Karachi",
    commission: "Sindh Public Service Commission",
    line: "The Indus delta and the commercial heart of the nation, from the Thar desert to the Arabian Sea.",
    outline: [
      [66.7, 24.9], [66.95, 24.85], [67.3, 24.7], [67.5, 24.1], [68.2, 23.7], [68.9, 24.25], [69.6, 24.28], [70.6, 24.4],
      [71.05, 24.45], [70.85, 25.15], [70.65, 25.7], [70.3, 25.95], [70.15, 26.5], [69.7, 26.75], [69.55, 27.15], [70.0, 27.75],
      [70.6, 28.0], [69.6, 28.45], [68.9, 28.25], [68.4, 28.35], [67.85, 28.0], [67.55, 27.4], [67.35, 26.7], [67.45, 26.0],
      [67.1, 25.5], [66.75, 25.3],
    ],
    posts: [
      { title: "Chief Secretary", place: "Karachi", lon: 67.0, lat: 24.86 },
      { title: "Commissioner", place: "Karachi Division", lon: 67.15, lat: 25.0 },
      { title: "Deputy Commissioner", place: "Hyderabad", lon: 68.37, lat: 25.39 },
      { title: "Collector of Customs", place: "Karachi Port", lon: 67.06, lat: 24.88 },
      { title: "Secretary Irrigation", place: "Sukkur Barrage", lon: 68.85, lat: 27.7 },
      { title: "Assistant Commissioner", place: "Mithi, Thar", lon: 69.8, lat: 24.73 },
    ],
  },
  {
    name: "Khyber Pakhtunkhwa",
    urdu: "خیبر پختونخوا",
    capital: "Peshawar",
    commission: "Khyber Pakhtunkhwa Public Service Commission",
    line: "Mountain valleys, historic passes and the newly merged districts along the western frontier.",
    outline: [
      [69.9, 31.0], [70.6, 31.5], [71.2, 31.9], [71.4, 32.5], [71.8, 33.0], [72.0, 33.5], [72.3, 33.9], [73.05, 33.85],
      [73.4, 33.95], [73.3, 34.1], [73.35, 34.45], [73.6, 34.8], [74.0, 35.05], [73.6, 35.4], [72.95, 35.9], [73.3, 36.4], [73.7, 36.9],
      [72.5, 36.8], [71.65, 36.5], [71.25, 36.1], [71.6, 35.4], [71.1, 34.95], [71.2, 34.4], [71.08, 34.1], [70.3, 33.95],
      [69.9, 34.0], [70.15, 33.25], [69.6, 33.0], [69.35, 32.3], [69.2, 31.95], [69.55, 31.5],
    ],
    posts: [
      { title: "Chief Secretary", place: "Peshawar", lon: 71.52, lat: 34.0 },
      { title: "Inspector General of Police", place: "Peshawar", lon: 71.6, lat: 33.9 },
      { title: "Deputy Commissioner", place: "Swat", lon: 72.36, lat: 34.77 },
      { title: "Deputy Commissioner", place: "Dera Ismail Khan", lon: 70.9, lat: 31.83 },
      { title: "Assistant Commissioner", place: "Chitral", lon: 71.78, lat: 35.85 },
      { title: "Secretary Health", place: "Peshawar", lon: 71.45, lat: 34.1 },
    ],
  },
  {
    name: "Balochistan",
    urdu: "بلوچستان",
    capital: "Quetta",
    commission: "Balochistan Public Service Commission",
    line: "The largest province by area — mineral wealth, a long coastline and great distances to serve across.",
    outline: [
      [61.61, 25.19], [62.33, 25.11], [63.6, 25.3], [64.65, 25.18], [65.6, 25.35], [66.3, 25.5], [66.7, 24.9], [66.75, 25.3],
      [67.1, 25.5], [67.45, 26.0], [67.35, 26.7], [67.55, 27.4], [67.85, 28.0], [68.4, 28.35], [68.9, 28.25], [69.6, 28.45],
      [69.4, 28.95], [69.9, 29.4], [70.2, 29.95], [69.85, 30.6], [69.9, 31.0], [69.55, 31.5], [69.2, 31.95], [68.8, 31.65],
      [68.2, 31.8], [67.65, 31.45], [67.0, 31.3], [66.37, 30.93], [66.3, 29.85], [65.0, 29.55], [64.1, 29.38], [62.48, 29.4],
      [60.87, 29.86], [61.35, 29.3], [61.75, 28.8], [62.4, 28.4], [62.75, 28.2], [62.8, 27.75], [63.3, 27.2], [63.2, 26.65],
      [62.4, 26.55], [61.85, 26.25], [61.6, 25.8],
    ],
    posts: [
      { title: "Chief Secretary", place: "Quetta", lon: 67.0, lat: 30.18 },
      { title: "Commissioner", place: "Makran Division", lon: 63.05, lat: 26.0 },
      { title: "Deputy Commissioner", place: "Gwadar", lon: 62.32, lat: 25.13 },
      { title: "Deputy Commissioner", place: "Zhob", lon: 69.45, lat: 31.34 },
      { title: "Secretary Mines & Minerals", place: "Quetta", lon: 66.9, lat: 30.3 },
      { title: "Assistant Commissioner", place: "Chagai", lon: 64.6, lat: 29.3 },
    ],
  },
  {
    name: "Gilgit-Baltistan",
    urdu: "گلگت بلتستان",
    capital: "Gilgit",
    commission: "Gilgit-Baltistan Public Service Commission",
    line: "Home to some of the world's highest peaks, glaciers and the road to China.",
    outline: [
      [73.7, 36.9], [74.55, 37.03], [74.85, 37.05], [75.42, 36.85], [75.9, 36.4], [76.15, 35.85], [76.6, 35.85], [77.1, 35.45],
      [76.6, 35.0], [76.0, 34.75], [75.2, 34.7], [74.6, 34.95], [74.0, 35.05], [73.6, 35.4], [72.95, 35.9], [73.3, 36.4],
    ],
    posts: [
      { title: "Chief Secretary", place: "Gilgit", lon: 74.31, lat: 35.92 },
      { title: "Deputy Commissioner", place: "Hunza", lon: 74.65, lat: 36.32 },
      { title: "Deputy Commissioner", place: "Skardu", lon: 75.63, lat: 35.3 },
      { title: "Inspector General of Police", place: "Gilgit", lon: 74.4, lat: 35.8 },
      { title: "Secretary Tourism", place: "Gilgit", lon: 74.2, lat: 36.0 },
      { title: "Assistant Commissioner", place: "Ghizer", lon: 73.6, lat: 36.2 },
    ],
  },
  {
    name: "Azad Jammu & Kashmir",
    urdu: "آزاد کشمیر",
    capital: "Muzaffarabad",
    commission: "AJK Public Service Commission",
    line: "Green valleys and rivers, from Mirpur's lake to the Neelum valley in the north.",
    outline: [
      [74.45, 32.8], [74.05, 32.85], [73.6, 33.05], [73.55, 33.4], [73.45, 33.75], [73.4, 33.95], [73.3, 34.1], [73.35, 34.45],
      [73.6, 34.8], [74.0, 35.05], [74.6, 34.95], [74.4, 34.6], [74.0, 34.3], [74.1, 33.9], [74.2, 33.5], [74.45, 33.1],
    ],
    posts: [
      { title: "Chief Secretary", place: "Muzaffarabad", lon: 73.47, lat: 34.37 },
      { title: "Commissioner", place: "Mirpur Division", lon: 73.75, lat: 33.15 },
      { title: "Deputy Commissioner", place: "Neelum", lon: 74.1, lat: 34.75 },
      { title: "Deputy Commissioner", place: "Poonch", lon: 73.9, lat: 33.85 },
      { title: "Secretary Health", place: "Muzaffarabad", lon: 73.55, lat: 34.3 },
      { title: "Assistant Commissioner", place: "Bhimber", lon: 74.08, lat: 32.97 },
    ],
  },
];
