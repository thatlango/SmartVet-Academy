/**
 * Curriculum content for SmartVet Africa Academy.
 *
 * Source provenance: all module content below is taken strictly from the
 * "Broiler Farmer Trainer Manual — 5 Steps to Keep 99% of Your Chicks During
 * Brooding" produced by River Poultry & SmartVet Service (Uganda, Cobb500
 * standards). No content has been invented.
 */

export type Callout = {
  kind: "callout";
  tone: "info" | "warning" | "danger" | "success";
  title: string;
  items: string[];
};

export type ListBlock = {
  kind: "list";
  title: string;
  ordered?: boolean;
  items: string[];
};

export type TableBlock = {
  kind: "table";
  title: string;
  note?: string;
  headers: string[];
  rows: string[][];
};

export type ChecklistBlock = {
  kind: "checklist";
  title: string;
  items: string[];
};

export type Block = Callout | ListBlock | TableBlock | ChecklistBlock;

export type KnowledgeCheck = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Module = {
  id: number;
  title: string;
  stepLabel: string;
  intro: string;
  quote: string;
  keyMessage: string;
  blocks: Block[];
  check: KnowledgeCheck;
};

export type QuizQuestion = {
  question: string;
  options: string[];
};

export type Course = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  level: string;
  hours: number;
  audience: string;
  status: "live" | "coming-soon";
  modules: Module[];
  quiz: QuizQuestion[];
};

export const PASS_RATE = 0.75;
export const LIVE_COURSE_ID = "broiler-foundations";

const modules: Module[] = [
  {
    id: 1,
    stepLabel: "Step 1 of 9",
    title: "Prepare Your House Before Chicks Arrive",
    intro:
      "The house is not just a shelter — it is a life-support system. Every corner you miss when cleaning, every wrong temperature, every wet patch of litter will cost you birds and profit. Do this right, every time, and your chicks start strong.",
    quote: "The first 7 days decide the whole batch. The house decides the first 7 days.",
    keyMessage: "A prepared house is a strong start.",
    blocks: [
      {
        kind: "list",
        title: "Cleaning and disinfection — step by step",
        ordered: true,
        items: [
          "Remove all old litter. Sweep every corner — no old droppings left behind.",
          "Wash walls, floor and all equipment with water until visibly clean.",
          "Spread white lime powder everywhere — walls, floor and all surfaces. White lime (not grey construction lime) is highly effective in Uganda and East Africa because it kills disease-causing bacteria and viruses even in the presence of organic matter. Also use white lime powder in the footbath at the entrance.",
          "Let the house dry for at least 3 full days after treatment before adding litter.",
          "Spread fresh dry litter. Push your open hand flat into the litter — it should reach your wrist comfortably (approximately 6 cm). If it does not, add more. Litter must crumble when you squeeze it in your fist — wet litter means disease risk.",
          "Heat the house to 33°C at least 2 hours before chicks arrive. Place the thermometer at chick level (just above the litter) to measure correctly.",
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "White lime safety",
        items: [
          "Always wear gloves — lime burns skin",
          "Always wear a face mask — lime dust damages lungs",
          "Always wear boots — never barefoot",
          "Keep children away from the house during lime application",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Litter depth — hand check",
        items: [
          "Push your open hand flat into the litter. It should reach your wrist (about 6 cm).",
          "If it doesn't — add more litter.",
          "Squeeze a handful: it must crumble. If it clumps or feels wet — replace it immediately.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Temperature timing",
        items: [
          "Light your charcoal jiko or brooder lamp at least 2 hours before chicks arrive.",
          "Check temperature is stable at 33°C at chick level before opening any box.",
        ],
      },
      {
        kind: "checklist",
        title: "Pre-placement checklist — every item must be done",
        items: [
          "House cleaned and white lime applied (3+ days ago)",
          "White lime footbath powder at entrance",
          "Gloves, mask and boots worn during lime work",
          "Fresh litter — hand check depth and dryness confirmed",
          "House at 33°C stable (2 hours before chicks)",
          "Drinkers and feeders ready before chick box opens",
        ],
      },
    ],
    check: {
      question: "How long must the house dry after white lime treatment before adding litter?",
      options: ["A few hours", "1 full day", "At least 3 full days", "At least 2 weeks"],
      correctIndex: 2,
      explanation: "Let the house dry for at least 3 full days after treatment before adding litter.",
    },
  },
  {
    id: 2,
    stepLabel: "Step 2 of 9",
    title: "Feed and Water First — Then Chicks",
    intro:
      "Chicks leave the hatchery and travel for hours without food or water. By the time they reach your farm they are dehydrated and stressed. The moment they arrive, their only job is to find water and food. If drinkers and feeders are not already waiting, your chicks begin the batch in a deficit they may never recover from.",
    quote: "A dehydrated chick on Day 1 never fully catches up.",
    keyMessage: "Food and water must be ready before chicks arrive.",
    blocks: [
      {
        kind: "list",
        title: "Steps — in order, before opening the chick box",
        ordered: true,
        items: [
          "Prepare glucose water first: dissolve oral rehydration glucose in clean water per the pack instructions. Glucose rehydrates chicks far more effectively than plain sugar after a long journey.",
          "Fill all drinkers with glucose water. Place at chick-beak height — chicks should not have to reach up or down.",
          "Spread starter crumble on flat trays or paper on the litter so every chick can see and reach feed easily.",
          "Now open the box. Place each chick gently — dip its beak briefly in water so it learns where to drink.",
          "Keep feeders and drinkers full at all times for the first 14 days. Ad lib = they eat and drink as much as they want, always.",
          "Remove paper from under feeders on Day 3 — chicks now know where the feeders are.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Glucose water — rehydration",
        items: [
          "Use oral rehydration glucose, not ordinary sugar.",
          "Give glucose water for the first 6–8 hours only, then switch to plain clean water.",
          "Never use dirty, warm or stagnant water.",
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "Never do this",
        items: [
          "Never open the box before water and feed are ready",
          "Never let drinkers run dry — dehydration kills in 4 hours",
          "Never restrict feed in the first 14 days — birds never recover",
          "Never use dirty or cold water",
        ],
      },
      {
        kind: "table",
        title: "Daily targets — first two weeks",
        headers: ["Age", "Feed / bird / day", "Water / bird / day", "Key action"],
        rows: [
          ["Day 0–1", "5–10 g (ad lib)", "50–80 ml", "Glucose water. Dip beaks. Crop check at 2 hours."],
          ["Day 2–6", "20–45 g (ad lib)", "80–150 ml", "Plain water from Day 1 evening. Remove paper tray Day 3."],
          ["Day 7", "40–55 g (ad lib)", "150–200 ml", "Weigh 50 birds → target 200 g."],
          ["Day 14", "80–95 g (ad lib)", "250–300 ml", "Weigh 50 birds → target 528 g."],
        ],
      },
    ],
    check: {
      question: "How long should chicks receive glucose water after arrival?",
      options: ["The first 6–8 hours only", "The first 3 days", "The first 14 days", "The whole batch"],
      correctIndex: 0,
      explanation: "Give glucose water for the first 6–8 hours only, then switch to plain clean water.",
    },
  },
  {
    id: 3,
    stepLabel: "Step 3 of 9",
    title: "Read the Temperature — Read Your Chicks",
    intro:
      "A thermometer gives you numbers. Your chicks give you the truth. Temperature management is the single biggest controllable factor in the first two weeks. Too cold and chicks pile, stop eating and die. Too hot and they stop drinking, develop respiratory problems and grow slowly. Learn to read the flock first, and verify with the thermometer second.",
    quote: "Watch your chicks — not just the thermometer.",
    keyMessage: "Chicks will tell you how they feel — just watch them.",
    blocks: [
      {
        kind: "callout",
        tone: "success",
        title: "Just right — 32–34°C",
        items: [
          "Chicks spread evenly across the house, active, eating and drinking.",
          "Quiet and content. This is what you want.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Too cold — below 30°C",
        items: [
          "Chicks pile tightly together under the heat source, loud crying, not eating.",
          "Deaths follow quickly. Raise heat immediately.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Too hot — above 36°C",
        items: [
          "Chicks move to edges, panting, wings spread, drinking too much.",
          "Lower heat or open ventilation.",
        ],
      },
      {
        kind: "table",
        title: "Temperature reduction schedule",
        note: "Reduce by 0.5°C each day from Day 4. Always confirm with thermometer at chick level.",
        headers: ["Age", "Target temperature"],
        rows: [
          ["Day 0–3", "33–35°C"],
          ["Day 4–7", "30–33°C"],
          ["Day 8–14", "28–30°C"],
          ["Day 15–21", "24–28°C"],
          ["Day 22+", "20–24°C"],
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "Ammonia warning",
        items: [
          "If your eyes sting when you enter the house — the birds breathed this all night.",
          "Open curtains immediately, replace wet litter and check for drinker leaks.",
          "Act the same day. Do not wait.",
        ],
      },
    ],
    check: {
      question: "Chicks are piling tightly under the heat source and crying loudly. What does this mean?",
      options: [
        "The house is too hot — lower the heat",
        "The house is too cold — raise heat immediately",
        "Temperature is just right",
        "They need less feed",
      ],
      correctIndex: 1,
      explanation: "Piling and loud crying means below 30°C — too cold. Raise heat immediately.",
    },
  },
  {
    id: 4,
    stepLabel: "Step 4 of 9",
    title: "Feel the Chick — Is the Crop Full?",
    intro:
      "The crop is a small pouch just under the neck, to the right of the chest. It fills with feed and water after a chick eats and drinks. Checking the crop is the most direct way to confirm your chicks are actually finding food and water — not just whether it is available nearby. Do not guess. Feel and count.",
    quote: "A full crop means a chick has eaten and drunk. Check early and take action.",
    keyMessage: "A full crop = a good start. Check early. Take action.",
    blocks: [
      {
        kind: "list",
        title: "The three crop states — what you will feel with 2 fingers",
        items: [
          "FULL CROP — soft and round like a small water balloon. Has both feed AND water. This is what you want.",
          "SQUISHY CROP — soft and floppy, water only, no feed. Chick is hungry. Add more feed immediately.",
          "HARD CROP — firm and dry, feed only, no water. Chick is dehydrated. Check all drinkers right now.",
        ],
      },
      {
        kind: "list",
        title: "How to do the crop check",
        ordered: true,
        items: [
          "Pick 10 random chicks — not only the big or small ones. Truly random.",
          "Hold the chick gently in one hand. Use 2 fingers of the other hand to feel just under the neck on the right side of the chest.",
          "Count: how many FULL? SQUISHY? HARD? Write the result in your record immediately.",
        ],
      },
      {
        kind: "table",
        title: "Crop fill targets — check these 3 times",
        headers: ["Time after placement", "Target"],
        rows: [
          ["2 hours", "80% full"],
          ["8 hours", "85% feed + water"],
          ["24 hours", "95% full crops"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "If below target at 2 hours",
        items: [
          "Dip beaks in glucose water again",
          "Lower feeders to exact chick-beak level",
          "Spread more starter crumble on paper",
          "Check house temperature is stable at 33°C",
          "Call your SmartVet vet if below 70% full",
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "If 30%+ empty at 24 hours",
        items: [
          "Add more feeders — 1 flat tray per 20 chicks minimum",
          "Spread more starter crumble directly on litter paper",
          "Call your SmartVet vet immediately. This is a red flag.",
        ],
      },
    ],
    check: {
      question: "A chick's crop feels firm and dry. What is the problem?",
      options: [
        "It has feed but no water — it is dehydrated, check all drinkers now",
        "It has water but no feed — add more feed",
        "It is perfectly full",
        "It has eaten too much",
      ],
      correctIndex: 0,
      explanation: "A hard crop is feed only, no water. The chick is dehydrated — check all drinkers right now.",
    },
  },
  {
    id: 5,
    stepLabel: "Step 5 of 9",
    title: "Final Check — Are You Ready?",
    intro:
      "Before you open that chick box, you need to be certain — not hopeful, certain. This final checklist is not a formality. Each item represents something that, if missed, can cost you birds, growth and profit. Run through it every single placement. No exceptions.",
    quote: "Start strong with a checklist. Don't guess — check.",
    keyMessage: "Don't guess — check every time.",
    blocks: [
      {
        kind: "checklist",
        title: "Pre-placement final checklist — all 6 must be confirmed",
        items: [
          "Heat is ON and stable at 33°C — measured at chick level inside the house for the past 2 hours.",
          "Glucose water and starter feed ready — drinkers and feeders filled before the box opens.",
          "Chicks placed gently in the brooder — no throwing, no rough handling at any time.",
          "Crop check done at 2 hours — 80% full minimum. Record the result immediately.",
          "Chicks spreading evenly — not piling together means temperature is correct.",
          "Placement time and number recorded — write it in your SmartVet record sheet now.",
        ],
      },
      {
        kind: "callout",
        tone: "success",
        title: "SmartVet placement score",
        items: [
          "6 of 6 — Green. Place your chicks now.",
          "4–5 of 6 — Yellow. Fix the gaps before placing.",
          "Under 4 — Red. Do not place. Call your SmartVet vet first.",
        ],
      },
      {
        kind: "list",
        title: "Record placement details now — fill in immediately",
        items: [
          "Date of placement",
          "Time of placement",
          "Number of chicks placed",
          "House temperature at placement",
        ],
      },
    ],
    check: {
      question: "You score 3 of 6 on the final placement checklist. What should you do?",
      options: [
        "Place the chicks — 3 is enough",
        "Place the chicks and fix problems later",
        "Do not place. Call your SmartVet vet first",
        "Wait one hour and place anyway",
      ],
      correctIndex: 2,
      explanation: "Under 4 of 6 is Red: do not place, call your SmartVet vet first.",
    },
  },
  {
    id: 6,
    stepLabel: "Step 6 of 9",
    title: "Weigh Your Birds Every Week",
    intro:
      "Weight is the most honest indicator of how your flock is performing. Feed conversion, management quality, disease pressure — everything shows up in the weight. If your birds are behind target and you do not know it, every day that passes costs you money. Weigh every week. Same day. Same time.",
    quote: "Weight is money. If your birds are behind, every day without action costs profit.",
    keyMessage: "Weight is money. Know your numbers every single week.",
    blocks: [
      {
        kind: "list",
        title: "How to weigh correctly — 5 steps",
        ordered: true,
        items: [
          "Pick 50 birds at random from across the house — not only big or small. Truly random.",
          "Weigh each bird on the scale. Write every weight individually on your record sheet.",
          "Add all weights together ÷ number of birds = average live weight.",
          "Compare your average to the Cobb500 target in the table.",
          "Share the result with your SmartVet vet. They will advise on any management changes needed immediately.",
        ],
      },
      {
        kind: "table",
        title: "Cobb500 targets — record yours each week",
        note: "Female targets shown. Males typically 10–15% heavier.",
        headers: ["Age", "Target average weight"],
        rows: [
          ["Day 7", "~200 g"],
          ["Day 14", "~528 g"],
          ["Day 21", "~1,042 g"],
          ["Day 28", "~1,675 g"],
          ["Day 35", "~2,348 g"],
          ["Day 42", "~3,052 g"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "If birds are behind target — act immediately",
        items: [
          "10% below target: review feed quality and feeder access. Check feeders are full and accessible.",
          "15% below target: check for disease signs. Call your SmartVet vet today.",
          "20%+ below target: full farm assessment with your SmartVet vet required urgently.",
        ],
      },
    ],
    check: {
      question: "What is the Cobb500 target average weight at Day 14?",
      options: ["~200 g", "~528 g", "~1,042 g", "~1,675 g"],
      correctIndex: 1,
      explanation: "Day 14 target is about 528 g (female targets; males 10–15% heavier).",
    },
  },
  {
    id: 7,
    stepLabel: "Step 7 of 9",
    title: "Record Every Day — No Excuses",
    intro:
      "Records are not paperwork. They are your management memory and your business proof. Without records you cannot calculate your real profit, you cannot find what went wrong, and your SmartVet vet cannot support you effectively. Use the SmartVet record template we provide, or the SmartVet app — and make sure your vet always has your most up-to-date records.",
    quote: "A farmer who records is a farmer who earns.",
    keyMessage: "Records protect your business. Fill them in every single day.",
    blocks: [
      {
        kind: "table",
        title: "What to record and when",
        headers: ["What to record", "When"],
        rows: [
          ["Dead birds (count)", "Every morning before 8 am"],
          ["House temperature", "Morning and afternoon"],
          ["Feed given (kg)", "Morning and afternoon"],
          ["Water supply checked", "Morning and afternoon"],
          ["Bird weight (average)", "Once per week"],
          ["Medicines given", "Every time a drug is used"],
        ],
      },
      {
        kind: "callout",
        tone: "success",
        title: "SmartVet app",
        items: [
          "Enter daily records on your phone",
          "App calculates FCR automatically",
          "Your vet sees data in real time",
          "Alerts when performance drops",
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "Without records",
        items: [
          "Cannot calculate real profit",
          "Vet cannot support remotely",
          "Problems repeat each batch",
        ],
      },
      {
        kind: "list",
        title: "Daily record sheet — use the SmartVet template or app",
        items: [
          "Date, day of batch number",
          "Birds alive, deaths today",
          "Feed AM (kg), feed PM (kg)",
          "Temperature AM, temperature PM",
          "Medicines / treatments given today",
          "Observations / notes",
        ],
      },
    ],
    check: {
      question: "When should dead birds be counted and recorded?",
      options: [
        "Every morning before 8 am",
        "Once per week",
        "Only when more than 10 die",
        "At the end of the batch",
      ],
      correctIndex: 0,
      explanation: "Dead birds are counted and recorded every morning before 8 am.",
    },
  },
  {
    id: 8,
    stepLabel: "Step 8 of 9",
    title: "Red Flags — Call SmartVet Now",
    intro:
      "SmartVet is not just emergency support — it is your full farming partner from Day 1. We are built around prevention first. But when warning signs appear, every hour you wait turns a small, fixable problem into a large, expensive one. Learn the red flags below. Call early. We are here.",
    quote: "Early call = small problem fixed. Late call = big loss. Don't wait.",
    keyMessage: "Register with SmartVet before your chicks arrive. You are never alone.",
    blocks: [
      {
        kind: "table",
        title: "Red flag signs — call SmartVet the same hour",
        headers: ["Sign you see", "Possible cause", "Action"],
        rows: [
          ["More than 1% die in one day", "Disease outbreak", "Call NOW"],
          ["Gasping, coughing, wheezing", "Respiratory disease (ND, IB)", "Call NOW"],
          ["Twisted neck, trembling, can't stand", "Newcastle — NOTIFIABLE", "URGENT"],
          ["Bloody or watery droppings (10%+)", "Coccidiosis or enteritis", "Call TODAY"],
          ["Feed intake drops 20%+ suddenly", "Disease or heat stress", "Investigate"],
          ["Swollen heads, eyes or wattles", "Mycoplasmosis / Gumboro", "Call TODAY"],
          ["Birds suddenly huddle and stop moving", "Severe stress or disease", "Call NOW"],
          ["5%+ birds limping or sitting down", "Leg, litter or nutrition issue", "Within 24 hrs"],
        ],
      },
      {
        kind: "callout",
        tone: "success",
        title: "What SmartVet does for you",
        items: [
          "Register your farm with your date of chick arrival and we will prepare a full management plan and automated reminders for your entire batch — vaccinations, weighing days, critical checks.",
          "You will be matched with the nearest SmartVet vet to your farm for personal support throughout the batch.",
          "If your vet is unavailable, the next available SmartVet vet steps in immediately — you are never left without support.",
          "We are available to you 24 hours a day, 7 days a week.",
          "We also deliver preventive treatments — vaccines, vitamins and drugs — directly to your farm door, at no extra transport cost.",
        ],
      },
      {
        kind: "list",
        title: "My SmartVet contacts — write these down",
        items: ["My SmartVet vet — name", "Phone number", "Farm registration number"],
      },
    ],
    check: {
      question: "Birds show twisted necks, trembling and cannot stand. What is this and how urgent is it?",
      options: [
        "Leg issue — check within 24 hours",
        "Heat stress — investigate later",
        "Newcastle disease — NOTIFIABLE and URGENT",
        "Normal for young birds",
      ],
      correctIndex: 2,
      explanation: "Twisted neck, trembling and inability to stand point to Newcastle — notifiable and urgent.",
    },
  },
  {
    id: 9,
    stepLabel: "Step 9 of 9",
    title: "Calculate Your Profit — Know Your Numbers",
    intro:
      "At the end of every batch, sit down and calculate what you actually earned. Not what you think — what the numbers say. Every cost, every bird sold. If you skip this step, you are farming blind. Your profit per bird and your Feed Conversion Ratio (FCR) are the two numbers that show whether your business is growing or shrinking, and what to change for the next batch.",
    quote: "If you don't know your numbers, you cannot improve your business.",
    keyMessage: "Know your numbers after every batch. That is how you build a business.",
    blocks: [
      {
        kind: "list",
        title: "Income — fill in after sale",
        items: [
          "Number of birds sold",
          "Average weight per bird (kg)",
          "Total kg sold",
          "Price per kg (UGX)",
          "GROSS INCOME (UGX)",
        ],
      },
      {
        kind: "list",
        title: "Costs — fill in from your records",
        items: [
          "Day-old chick cost (UGX)",
          "Total feed cost (UGX)",
          "Medicines + vaccines (UGX)",
          "Fuel / charcoal / electricity (UGX)",
          "Labour + other costs (UGX)",
          "TOTAL COSTS (UGX)",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Net profit = income − costs",
        items: ["Net profit (UGX)", "Profit per bird (UGX)", "FCR this batch"],
      },
      {
        kind: "callout",
        tone: "success",
        title: "FCR targets — Cobb500",
        items: [
          "Under 1.65 by Day 42 — excellent performance",
          "1.65–1.75 — acceptable, room to improve",
          "Above 1.75 — review feed management and health",
          "FCR = total feed used (kg) ÷ total live weight gained (kg).",
          "Every 0.1 improvement in FCR = significantly more profit per bird per batch.",
        ],
      },
    ],
    check: {
      question: "How is FCR calculated?",
      options: [
        "Total live weight gained (kg) ÷ total feed used (kg)",
        "Total feed used (kg) ÷ total live weight gained (kg)",
        "Gross income ÷ number of birds",
        "Total costs ÷ total kg sold",
      ],
      correctIndex: 1,
      explanation: "FCR = total feed used (kg) ÷ total live weight gained (kg).",
    },
  },
];

const quiz: QuizQuestion[] = [
  {
    question: "At what temperature, measured at chick level, must the house be stable before chicks arrive?",
    options: ["28°C", "30°C", "33°C", "36°C"],
},
  {
    question: "How long must the house dry after white lime treatment before litter is added?",
    options: ["3 hours", "1 day", "At least 3 full days", "7 days"],
},
  {
    question: "How deep should fresh litter be, using the hand check?",
    options: [
      "Fingertip deep (about 2 cm)",
      "Reaching your wrist, about 6 cm",
      "Up to your elbow",
      "Depth does not matter if it is dry",
    ],
},
  {
    question: "What must be ready before the chick box is opened?",
    options: [
      "Only the heat source",
      "Drinkers with glucose water and starter feed on trays or paper",
      "The record sheet only",
      "Vaccines",
    ],
},
  {
    question: "Glucose water is given for how long after arrival?",
    options: ["First 6–8 hours only", "First 24 hours", "First 3 days", "First 14 days"],
},
  {
    question: "On which day is the paper removed from under the feeders?",
    options: ["Day 1", "Day 3", "Day 7", "Day 14"],
},
  {
    question: "Chicks move to the edges of the house, pant and spread their wings. What does this mean?",
    options: ["Too cold", "Just right", "Too hot — above 36°C", "They are hungry"],
},
  {
    question: "What is the target crop fill at 2 hours after placement?",
    options: ["50% full", "70% full", "80% full", "95% full"],
},
  {
    question: "A squishy, floppy crop means the chick has:",
    options: ["Feed and water", "Water only — it is hungry", "Feed only — it is dehydrated", "Nothing at all"],
},
  {
    question: "How many birds should you weigh each week, and how should they be chosen?",
    options: [
      "10 of the biggest birds",
      "50 birds chosen at random from across the house",
      "All birds in the house",
      "5 birds near the door",
    ],
},
  {
    question: "The Cobb500 target average weight at Day 7 is:",
    options: ["~100 g", "~200 g", "~528 g", "~1,042 g"],
},
  {
    question: "Your birds are 20% below target weight. What should you do?",
    options: [
      "Wait another week",
      "Only change the feed brand",
      "Arrange a full farm assessment with your SmartVet vet urgently",
      "Sell the birds immediately",
    ],
},
  {
    question: "When should dead birds be counted and recorded?",
    options: ["Every morning before 8 am", "Every evening", "Weekly", "Only when unusual"],
},
  {
    question: "More than 1% of birds die in one day. What is the correct action?",
    options: [
      "Record it and wait a week",
      "Call SmartVet now — possible disease outbreak",
      "Reduce feed",
      "Increase the temperature",
    ],
},
  {
    question: "An excellent FCR for Cobb500 by Day 42 is:",
    options: ["Under 1.65", "1.65–1.75", "Above 1.75", "Above 2.00"],
},
  {
    question: "If your eyes sting when you enter the house, what should you do?",
    options: [
      "Nothing — it is normal",
      "Open curtains, replace wet litter and check for drinker leaks the same day",
      "Add more litter next batch",
      "Reduce the number of birds",
    ],
},
];

export const liveCourse: Course = {
  id: LIVE_COURSE_ID,
  title: "Broiler Production & Poultry Business Foundations",
  tagline: "The 9 steps that keep 99% of your chicks alive through brooding.",
  description:
    "A practical certificate course for Ugandan smallholder poultry farmers, built directly from the River Poultry & SmartVet broiler trainer manual. Learn house preparation, brooding, crop checks, weekly weighing, record keeping, red flags and batch profit — step by step.",
  level: "Foundation",
  hours: 6,
  audience: "Smallholder broiler farmers and trainers in Uganda",
  status: "live",
  modules,
  quiz,
};

export type CatalogEntry = {
  id: string;
  title: string;
  tagline: string;
  status: "live" | "coming-soon";
};

export const catalog: CatalogEntry[] = [
  { id: liveCourse.id, title: liveCourse.title, tagline: liveCourse.tagline, status: "live" },
  {
    id: "layers-foundations",
    title: "Layer Production Foundations",
    tagline: "Coming soon — egg production management for smallholder layer farms.",
    status: "coming-soon",
  },
  {
    id: "sasso-production",
    title: "Sasso Dual-Purpose Production",
    tagline: "Coming soon — free-range and dual-purpose Sasso flock management.",
    status: "coming-soon",
  },
  {
    id: "smartvet-advanced",
    title: "Advanced SmartVet Flock Health",
    tagline: "Coming soon — biosecurity, vaccination planning and disease investigation.",
    status: "coming-soon",
  },
];

export function getCourse(id: string): Course | undefined {
  return id === liveCourse.id ? liveCourse : undefined;
}

export function getModule(course: Course, moduleId: number): Module | undefined {
  return course.modules.find((m) => m.id === moduleId);
}
