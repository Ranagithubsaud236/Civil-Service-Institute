/**
 * Sample CSS essay used to demonstrate red-pen evaluation. The mistakes are deliberate and
 * typical of real scripts. Deductions add up to 40, so the script ends at 60 / 100.
 * Facts cited in the remarks: 2022 floods affected ~33 million people; damages and losses
 * exceeded US$30 billion (Post-Disaster Needs Assessment, 2022).
 */
export type Category = "Structure" | "Expression" | "Argument" | "Evidence";

export const rubric: { name: Category; max: number }[] = [
  { name: "Argument", max: 30 },
  { name: "Structure", max: 25 },
  { name: "Expression", max: 25 },
  { name: "Evidence", max: 20 },
];

export type Remark = { id: number; category: Category; deduct: number; note: string; good?: boolean };

export const remarks: Remark[] = [
  { id: 1, category: "Structure", deduct: 4, note: "Cliché opening. Start with a Pakistan hook — the 2022 floods affected 33 million people." },
  { id: 2, category: "Expression", deduct: 3, note: "“for the whole world, especially Pakistan”. And “very big” says nothing." },
  { id: 3, category: "Expression", deduct: 2, note: "“discuss”, not “discuss about”." },
  { id: 4, category: "Argument", deduct: 8, note: "No thesis. The examiner wants your stance in the first paragraph." },
  { id: 5, category: "Evidence", deduct: 0, note: "Specific and relevant — this is what earns marks.", good: true },
  { id: 6, category: "Expression", deduct: 2, note: "“affected”, not “effected”." },
  { id: 7, category: "Evidence", deduct: 4, note: "Quantify it: over $30 billion in damages and losses (PDNA 2022)." },
  { id: 8, category: "Argument", deduct: 7, note: "Slogans, not policy. Name a policy and judge it — e.g. the National Adaptation Plan." },
  { id: 9, category: "Evidence", deduct: 5, note: "Unrelated quotation. Decorative quotes cost marks." },
  { id: 10, category: "Structure", deduct: 5, note: "Weak close. Restate the thesis and give a way forward." },
];

/** Each paragraph is plain text with marked fragments referring to a remark id. */
export type Fragment = string | { id: number; text: string };

export const essay: { title: string; paragraphs: Fragment[][] } = {
  title: "Climate Change: Pakistan’s Silent Emergency",
  paragraphs: [
    [
      { id: 1, text: "Since the dawn of civilization, man has always faced challenges from nature." },
      " ",
      { id: 2, text: "Climate change is a very big problem for whole world and specially Pakistan." },
      " In this essay I will ",
      { id: 3, text: "discuss about" },
      " ",
      { id: 4, text: "its causes, effects and solutions." },
    ],
    [
      { id: 5, text: "Pakistan contributes less than one percent of global emissions, yet it is among the ten most vulnerable countries." },
      " The floods of 2022 ",
      { id: 6, text: "effected" },
      " millions of people and ",
      { id: 7, text: "caused damages of billions of dollars." },
    ],
    [
      { id: 8, text: "Government should plant more trees, people should save water and industries should stop pollution." },
      " ",
      { id: 9, text: "As Allama Iqbal said, “Nations are born in the hearts of poets.”" },
    ],
    [{ id: 10, text: "In a nutshell, climate change is a big problem and we all must play our role." }],
  ],
};

export const totalDeduction = remarks.reduce((sum, r) => sum + r.deduct, 0);
