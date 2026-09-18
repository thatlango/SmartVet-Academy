/**
 * Curriculum content for SmartVet Africa Academy.
 *
 * Source provenance: Smart Vet Africa lesson plans, facilitator session manuals,
 * the Nutrition & Water Management manual, the Biosecurity & Sanitation manual,
 * and SmartVet Africa field-training media. Cobb500 figures are used as training
 * reference standards where the source curriculum calls for them.
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

export type FigureBlock = {
  kind: "figure";
  title: string;
  src: string;
  alt: string;
  caption: string;
  source?: string;
};

export type ActivityBlock = {
  kind: "activity";
  title: string;
  minutes: number;
  items: string[];
};

export type Block = Callout | ListBlock | TableBlock | ChecklistBlock | FigureBlock | ActivityBlock;

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
  durationMinutes: number;
  outcomes: string[];
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

const FIELD_TRAINING =
  "https://drive.google.com/thumbnail?id=1v0HbqU3a2JkkmU3yNULzuUy2gAcvggeV&sz=w1600";
const FIELD_COACHING =
  "https://drive.google.com/thumbnail?id=1pUItdTNSFtD6TJbSzHC9cnFlLlIT32a0&sz=w1600";
const FIELD_DIGITAL =
  "https://drive.google.com/thumbnail?id=1JXIlZVF2-PQ2ijUv06_LE0vF9-FDTGaP&sz=w1600";
const FIELD_SUPPORT =
  "https://drive.google.com/thumbnail?id=1JjXVjcTBaEevLcZikOg0scY0b8TFTPse&sz=w1600";

const modules: Module[] = [
  {
    id: 1,
    stepLabel: "Module 1 of 9",
    title: "House Design & Pre-Placement Readiness",
    intro:
      "A poultry house is a production system, not only a shelter. Roof heat, house orientation, curtains, air entry, stocking density, litter, equipment and pre-heating all affect how easily chicks can eat, drink, breathe and grow. This module combines the Smart Vet Africa house-design and pre-placement sessions into one practical start-up routine.",
    quote: "Design the house so good daily management becomes easier, not harder.",
    keyMessage: "A strong flock starts before the chicks arrive.",
    durationMinutes: 80,
    outcomes: [
      "Identify the highest-priority house features for smallholder broiler production.",
      "Prepare brooding space, litter, feeders, drinkers and heat before placement.",
      "Use a repeatable pre-placement checklist instead of relying on memory.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Learning in the field",
        src: FIELD_TRAINING,
        alt: "SmartVet Africa facilitator leading a practical field-training session.",
        caption: "SmartVet Africa field training: practical discussion before farmers make production decisions.",
        source: "SmartVet Africa training photo library",
      },
      {
        kind: "table",
        title: "House-design priorities",
        headers: ["Area", "What good practice is trying to achieve", "Practical decision"],
        rows: [
          ["Roof & orientation", "Reduce direct solar heat entering the house", "Prefer an east–west long axis where the site allows; reduce heat gain from bare roofing with locally appropriate insulation or ceiling measures."],
          ["Curtains & openings", "Control rain, wind and fresh-air entry", "Use curtains that can be adjusted quickly; keep openings functional rather than permanently closed."],
          ["House width & air path", "Let natural ventilation reach the flock", "Avoid creating a wide, sealed space that traps heat and moisture."],
          ["Lighting & backup", "Keep feeding, watering and observation possible", "Plan a dependable light source and a simple backup for outages."],
          ["Feeders & drinkers", "Give every chick reliable access", "Calculate equipment needs from flock size and adjust height as birds grow."],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Smallholder priority before expensive cooling equipment",
        items: [
          "The Smart Vet Africa house-design session explains fans, pads and fogging so farmers understand how large operations manage heat.",
          "For most smallholder houses, first fix roof heat, orientation, curtains, air entry, stocking density, shade, drinker access and management routines before investing in complex systems.",
        ],
      },
      {
        kind: "checklist",
        title: "Pre-placement readiness",
        items: [
          "Remove old litter and organic matter; wash and disinfect the house and equipment using the farm's approved procedure.",
          "After white-lime treatment in the current SmartVet brooding protocol, allow at least three full days for the house to dry before adding litter.",
          "Lay clean, dry, mould-free litter about 5–8 cm deep and remove any wet patches before chicks arrive.",
          "Set up the brooding area so chicks can reach heat, feed and water without crowding.",
          "Test heat, lights, feeders and drinkers before placement; temperature at chick level should be stable around 33°C before the boxes are opened.",
          "Prepare the entrance biosecurity point and keep visitors, footwear and equipment controlled.",
        ],
      },
      {
        kind: "activity",
        title: "Farm walk-through: fix the biggest constraint first",
        minutes: 15,
        items: [
          "Walk from the farm entrance to the chick area and list every point where heat, rain, air, people or equipment could create a problem.",
          "Classify each issue as: must fix before placement, fix this cycle, or longer-term investment.",
          "Choose one no/low-cost fix and one planned investment, with an owner and date.",
        ],
      },
    ],
    check: {
      question: "What temperature should be stable at chick level before placement?",
      options: ["28°C", "30°C", "33°C", "36°C"],
      correctIndex: 2,
      explanation: "The SmartVet brooding protocol uses about 33°C at chick level before chicks are placed.",
    },
  },
  {
    id: 2,
    stepLabel: "Module 2 of 9",
    title: "Feed, Water & the Chick Start",
    intro:
      "A chick cannot benefit from good genetics or a well-built house if it does not quickly find clean water and starter feed. The first hours are about access, hydration, feed discovery and observation. Water quality also matters later, especially on vaccination days.",
    quote: "Availability is not enough: confirm that chicks are actually eating and drinking.",
    keyMessage: "Feed and water must be ready before the chick box opens.",
    durationMinutes: 70,
    outcomes: [
      "Set up feed and water so chicks can find both immediately after placement.",
      "Manage basic water hygiene, drinker access and vaccine-day caution.",
      "Use crop fill to verify that access is working in practice.",
    ],
    blocks: [
      {
        kind: "list",
        title: "Before opening the chick box",
        ordered: true,
        items: [
          "Prepare clean drinking water. For the current brooding protocol, glucose/electrolyte support is used for the first 6–8 hours according to product instructions.",
          "Fill drinkers and position them at a height chicks can reach comfortably.",
          "Put starter crumble on clean trays or paper as well as in feeders so feed is highly visible.",
          "Check that feed, water, heat and light are all working before the first chick is released.",
          "Place chicks gently and spread them through the brooding area so they discover resources quickly.",
          "Remove the starter paper according to the SmartVet routine; the current assessment uses Day 3.",
        ],
      },
      {
        kind: "figure",
        title: "Practical coaching",
        src: FIELD_COACHING,
        alt: "A SmartVet Africa trainer assisting a participant during a hands-on session.",
        caption: "SmartVet Africa training uses coached practice rather than lecture-only delivery.",
        source: "SmartVet Africa training photo library",
      },
      {
        kind: "table",
        title: "Water-management checks",
        headers: ["Check", "What to look for", "Why it matters"],
        rows: [
          ["Cleanliness", "No visible dirt, slime or contamination in drinkers/lines", "Dirty water suppresses intake and can carry disease."],
          ["Access", "Birds drink without stretching or crouching awkwardly", "Poor height or too few drinkers reduces intake and growth."],
          ["Leaks", "Litter under drinkers remains dry and loose", "Leaks create wet litter, ammonia and foot/health problems."],
          ["Daily trend", "Water intake is broadly consistent with flock age, weather and feed intake", "A sudden change is an early warning sign."],
          ["Vaccination day", "Follow the vaccine plan from the veterinarian/paravet and use suitable clean water", "Water quality and handling can affect vaccine delivery."],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Do not improvise vaccination water",
        items: [
          "The training module teaches vaccine-day water preparation as a planning and handling task, not as a substitute for veterinary instructions.",
          "Confirm the vaccine, timing, cold chain and water procedure with the responsible veterinary professional.",
        ],
      },
      {
        kind: "activity",
        title: "Access test",
        minutes: 10,
        items: [
          "Stand at chick height and inspect whether feed, water and heat are visible and reachable from different parts of the brooder.",
          "Correct crowding, empty points, poor drinker height or hidden feed before they become growth problems.",
        ],
      },
    ],
    check: {
      question: "What should be ready before the chick box is opened?",
      options: ["Only the heat source", "Drinkers with water and starter feed on trays/paper", "The record sheet only", "Vaccines only"],
      correctIndex: 1,
      explanation: "Chicks should find both water and starter feed immediately after placement.",
    },
  },
  {
    id: 3,
    stepLabel: "Module 3 of 9",
    title: "Ventilation, Temperature & Brooding Environment",
    intro:
      "Ventilation is the daily balance between fresh air and bird comfort. Too little air traps heat, humidity and ammonia; too much uncontrolled cold air chills young chicks. Use the thermometer, your nose and eyes, litter condition and—most importantly—the flock's behaviour together.",
    quote: "The flock tells you what the room feels like.",
    keyMessage: "Manage air, heat and moisture together.",
    durationMinutes: 70,
    outcomes: [
      "Recognise chick behaviour associated with cold, comfort and heat stress.",
      "Use curtain management and simple air-quality checks to improve ventilation.",
      "Respond early to wet litter, ammonia and heat stress.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Read the flock",
        headers: ["What you observe", "Likely meaning", "Management response"],
        rows: [
          ["Evenly spread, active, feeding and drinking", "Comfortable environment", "Maintain conditions and keep observing."],
          ["Tight huddles near the heat source", "Too cold or draughty", "Check chick-level temperature, draughts and heat distribution."],
          ["Birds move to edges, pant or hold wings away from the body", "Too hot / heat stress", "Increase safe air movement, provide cool clean water and reduce heat load."],
          ["Uneven groups or avoidance of one area", "Uneven heat, draught, light or equipment access", "Find and correct the local cause rather than changing the whole house blindly."],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Use the nose-and-eye test",
        items: [
          "If ammonia is strong enough to sting your eyes or nose, ventilation and litter conditions need attention immediately.",
          "Open curtains appropriately, remove wet litter, check drinker leaks and identify why moisture is accumulating.",
          "Do not wait for birds to show severe respiratory distress before acting.",
        ],
      },
      {
        kind: "list",
        title: "Daily curtain routine",
        items: [
          "Start the morning by checking bird distribution, temperature, smell and litter—not by opening everything automatically.",
          "Adjust curtains progressively as outside temperature changes; avoid sudden chilling of young birds.",
          "Keep a path for fresh air while preventing direct strong draughts at chick level.",
          "During hot periods, maximise safe natural airflow and reduce avoidable heat sources.",
          "Record unusual temperature or ventilation events so later performance problems can be traced.",
        ],
      },
      {
        kind: "activity",
        title: "Five-minute ventilation diagnosis",
        minutes: 10,
        items: [
          "Stand quietly in the house and record chick distribution, panting/huddling, smell, humidity feel and litter moisture.",
          "Check one drinker area and one wall/curtain area.",
          "Make only the smallest management adjustment needed, then re-observe the flock.",
        ],
      },
    ],
    check: {
      question: "Your eyes sting when you enter the house. What is the best immediate response?",
      options: ["Ignore it", "Improve ventilation, remove wet litter and check drinker leaks", "Add more litter next batch only", "Reduce feed"],
      correctIndex: 1,
      explanation: "Eye/nose irritation is a practical ammonia warning. Correct air exchange and the moisture source the same day.",
    },
  },
  {
    id: 4,
    stepLabel: "Module 4 of 9",
    title: "Crop Fill, Brooding Checks & Early Growth",
    intro:
      "Seeing feed and water in the house does not prove chicks consumed them. Crop fill turns observation into evidence. Pair crop checks with chick behaviour and early weighing so access problems are corrected before they become a weak first week.",
    quote: "Do not guess whether chicks found feed and water—check.",
    keyMessage: "Crop fill confirms whether the chick start is working.",
    durationMinutes: 60,
    outcomes: [
      "Feel and interpret the main crop states.",
      "Use early crop-fill checks to identify access problems.",
      "Connect first-week checks to later flock performance.",
    ],
    blocks: [
      {
        kind: "table",
        title: "What the crop feels like",
        headers: ["Crop feel", "Interpretation", "Action"],
        rows: [
          ["Soft and rounded with feed texture", "Feed and water reached the chick", "Continue monitoring access across the flock."],
          ["Squishy / floppy", "Mostly water; chick may not have found enough feed", "Increase feed visibility/access and recheck."],
          ["Hard / dry", "Feed reached the chick but water access may be poor", "Inspect drinker availability, height and flow immediately."],
          ["Empty", "Neither feed nor water reached the chick", "Treat as an urgent access problem and check brooder layout."],
        ],
      },
      {
        kind: "callout",
        tone: "success",
        title: "Early crop-fill checkpoints",
        items: [
          "The SmartVet pre-placement module uses repeated checks at 2, 6, 12 and 24 hours after placement.",
          "The current course benchmark at 2 hours is at least 80% of sampled crops full.",
          "Do not record only the percentage—record what the empty, hard or squishy crops are telling you.",
        ],
      },
      {
        kind: "figure",
        title: "Why the first weeks matter",
        src: "/course-media/body-system-development.jpg",
        alt: "Training chart showing relative development of body systems as a broiler grows.",
        caption: "SmartVet Africa training chart: different body systems develop at different rates, reinforcing the importance of a strong early start.",
        source: "Smart Vet Africa performance standards facilitator manual",
      },
      {
        kind: "activity",
        title: "Crop-fill sample",
        minutes: 15,
        items: [
          "Select chicks from different parts of the brooder rather than one convenient corner.",
          "Feel each crop gently and classify it as full, squishy, hard or empty.",
          "Calculate the full-crop percentage, note the dominant problem state and correct the likely access issue.",
        ],
      },
    ],
    check: {
      question: "A squishy, floppy crop most strongly suggests:",
      options: ["Feed and water", "Water only — the chick still needs feed", "Feed only — the chick needs water", "Normal weekly growth"],
      correctIndex: 1,
      explanation: "A squishy crop points to water intake without enough feed. Improve feed discovery and access, then recheck.",
    },
  },
  {
    id: 5,
    stepLabel: "Module 5 of 9",
    title: "Biosecurity, Sanitation & Flock Readiness",
    intro:
      "Biosecurity prevents disease from entering or moving around the farm; sanitation reduces contamination already present. They work together. The Smart Vet Africa curriculum treats this as a routine system—people, footwear, equipment, cleaning, disinfection, drying and verification—not a one-off spray before chicks arrive.",
    quote: "The cheapest outbreak is the one that never enters the farm.",
    keyMessage: "Control movement, clean methodically and verify before restocking.",
    durationMinutes: 70,
    outcomes: [
      "Identify the main disease-entry routes on a small poultry farm.",
      "Run a practical entrance, visitor and equipment biosecurity routine.",
      "Plan cleaning, disinfection, drying and restocking as a sequence.",
    ],
    blocks: [
      {
        kind: "checklist",
        title: "Everyday biosecurity",
        items: [
          "Limit unnecessary visitors and keep a clear farm entrance routine.",
          "Use dedicated poultry-house footwear/clothing or an equivalent clean/dirty boundary.",
          "Maintain the footbath correctly and replace its contents when dirty or ineffective.",
          "Clean and disinfect shared tools/equipment before they enter the poultry area.",
          "Keep new or returning birds separate from the flock until the farm's health protocol allows mixing.",
          "Control rodents, wild birds, standing water and feed spills that attract pests.",
          "Dispose of mortalities according to the farm's approved safe method.",
        ],
      },
      {
        kind: "list",
        title: "Cleanout sequence between flocks",
        ordered: true,
        items: [
          "Remove birds, litter, feed residues and loose organic material.",
          "Dry-clean dust and debris from surfaces and equipment before wet washing.",
          "Wash systematically from cleaner/high areas toward dirtier/lower areas so removed contamination is not spread back.",
          "Apply the approved disinfectant at the correct label concentration, contact time and safety precautions.",
          "Dry the house and equipment thoroughly; moisture left behind undermines the reset.",
          "Inspect/verify the house, repair leaks or damage, then prepare clean litter and equipment for the next placement.",
          "Use the SmartVet sanitation session's 10-day cleanout/restocking plan as the farm scheduling template where applicable.",
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "Chemical safety",
        items: [
          "Never mix disinfectants or increase concentrations by guesswork.",
          "Use the product label, required PPE and veterinary/farm protocol. Keep chemicals away from feed, drinking water and children.",
        ],
      },
      {
        kind: "activity",
        title: "Biosecurity walk-through",
        minutes: 15,
        items: [
          "Trace the route of a visitor, a feed bag, a crate and a dead bird through your farm.",
          "Mark every point where contamination could move into or between poultry areas.",
          "Commit to one change you can implement this week and record who is responsible.",
        ],
      },
    ],
    check: {
      question: "Which statement best describes good biosecurity?",
      options: ["Spray the house only when birds look sick", "Control how people, equipment, animals and contamination move into and around the farm", "Use antibiotics routinely", "Keep all curtains closed"],
      correctIndex: 1,
      explanation: "Biosecurity is a movement-and-barrier system. It prevents disease entry and spread before treatment is needed.",
    },
  },
  {
    id: 6,
    stepLabel: "Module 6 of 9",
    title: "Growing Phase & Performance Standards",
    intro:
      "After brooding, management shifts from simply keeping chicks stable to controlling growth, uniformity, feed conversion and flock condition. The numbers must be compared with an age-appropriate standard. A flock can look healthy and still be losing margin through slow growth or poor feed conversion.",
    quote: "Performance becomes manageable when it is measured against a target.",
    keyMessage: "Weigh, compare, investigate and act every week.",
    durationMinutes: 80,
    outcomes: [
      "Run a consistent weekly weighing routine.",
      "Compare flock weight and feed use with Cobb500 reference targets.",
      "Calculate FCR and recognise when performance needs investigation.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Cobb500 growth and feed-intake reference",
        src: "/course-media/broiler-growth-intake.jpg",
        alt: "Training chart showing Cobb500 body weight and daily feed intake by age.",
        caption: "Use the chart as a reference, then compare it with your actual flock records under your farm conditions.",
        source: "Smart Vet Africa performance standards facilitator manual",
      },
      {
        kind: "list",
        title: "Weekly weighing routine",
        ordered: true,
        items: [
          "Choose the same day and similar time each week.",
          "Sample about 50 birds randomly from different parts of the house—not only the easiest or biggest birds.",
          "Record individual weights, calculate the average and note the spread/uniformity.",
          "Plot actual average weight against the age/breed reference. The current course benchmark is about 200 g at Day 7.",
          "If birds are about 20% below target, arrange a full farm assessment with the SmartVet veterinary team urgently rather than waiting another week.",
        ],
      },
      {
        kind: "table",
        title: "Core performance measures",
        headers: ["Measure", "Simple calculation", "Management question"],
        rows: [
          ["Average live weight", "Total sample weight ÷ birds weighed", "Are birds on the expected growth curve?"],
          ["Feed Conversion Ratio (FCR)", "Feed used (kg) ÷ live-weight gain (kg)", "How efficiently is feed becoming saleable weight?"],
          ["Mortality %", "Deaths ÷ chicks placed × 100", "Is loss within the farm's expected range and is the trend changing?"],
          ["Uniformity", "Compare individual weights around the flock average", "Are too many birds falling behind?"],
        ],
      },
      {
        kind: "activity",
        title: "Calculate and diagnose",
        minutes: 15,
        items: [
          "Use your latest flock record to calculate average weight and FCR.",
          "Compare the result with the appropriate Cobb500 age target used in the training material.",
          "Write the three most likely management causes to check first: feed, water, environment, disease pressure or data error.",
        ],
      },
    ],
    check: {
      question: "Your birds are about 20% below target weight. What should you do?",
      options: ["Wait another week", "Change only the feed brand", "Arrange a full SmartVet farm assessment urgently", "Sell immediately without investigation"],
      correctIndex: 2,
      explanation: "A large performance gap needs a whole-farm diagnosis—feed, water, environment, health and records—not a single guessed fix.",
    },
  },
  {
    id: 7,
    stepLabel: "Module 7 of 9",
    title: "Record Keeping & Flock Data",
    intro:
      "Records turn daily work into management evidence. They help you see changes before they become crises, explain performance to a veterinary adviser, calculate batch economics and compare one cycle with the next. The Smart Vet Africa record-keeping module is built around simple daily entries that farmers can actually maintain.",
    quote: "If it is not recorded, it is hard to manage and impossible to compare.",
    keyMessage: "Record every day, then use the record to make a decision.",
    durationMinutes: 60,
    outcomes: [
      "Maintain a simple daily flock record.",
      "Read trends in mortality, feed, water, weight and unusual signs.",
      "Use records to support technical and business decisions.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Digital tools support—not replace—good observation",
        src: FIELD_DIGITAL,
        alt: "SmartVet Africa participants using phones together during a training session.",
        caption: "A useful record system can be paper or digital; consistency and accuracy matter more than the device.",
        source: "SmartVet Africa training photo library",
      },
      {
        kind: "table",
        title: "Minimum flock record",
        headers: ["Record", "Frequency", "What it helps you see"],
        rows: [
          ["Mortality / culls", "Daily; current routine records dead birds before 8 am", "Sudden health changes and cumulative survival."],
          ["Feed issued/used", "Daily", "Consumption trend, stock position and FCR."],
          ["Water use / drinker observations", "Daily", "Early intake changes, leaks and heat/health warning signs."],
          ["Temperature / environment", "At least morning and afternoon plus unusual events", "Links growth or health changes to house conditions."],
          ["Body weight", "Weekly sample", "Growth curve, uniformity and intervention timing."],
          ["Vaccination / treatment / advice", "Every event", "Traceability and correct follow-up."],
          ["Sales and costs", "Every transaction", "Batch profit and cost control."],
        ],
      },
      {
        kind: "callout",
        tone: "danger",
        title: "Mortality is a signal, not just a number",
        items: [
          "The current SmartVet emergency threshold used in this course is more than 1% of the flock dying in one day.",
          "Record the count and contact the SmartVet veterinary team promptly rather than waiting for the weekly review.",
        ],
      },
      {
        kind: "activity",
        title: "Seven-day record challenge",
        minutes: 10,
        items: [
          "Choose one flock and complete every minimum record field for seven consecutive days.",
          "At the end of the week, circle one trend that changed and write the management action it triggered.",
          "Keep the sheet/app entry as evidence for your next advisory discussion.",
        ],
      },
    ],
    check: {
      question: "When does the current SmartVet routine record dead birds?",
      options: ["Every morning before 8 am", "Weekly", "Only after a veterinary visit", "Only at sale"],
      correctIndex: 0,
      explanation: "Daily mortality recording, before 8 am in the current routine, makes sudden changes visible quickly.",
    },
  },
  {
    id: 8,
    stepLabel: "Module 8 of 9",
    title: "Bird Health, Vaccination & Red Flags",
    intro:
      "Farmers need enough health knowledge to recognise abnormal patterns, protect the vaccination process and know when to escalate. This module does not turn the learner into a prescriber. It builds observation, planning, cold-chain awareness and timely referral to a qualified veterinary professional.",
    quote: "Recognise early, record clearly and escalate before a small problem becomes a flock problem.",
    keyMessage: "Plan prevention and call early when the flock changes.",
    durationMinutes: 70,
    outcomes: [
      "Recognise important flock-level red flags.",
      "Build a vaccination/health calendar with the veterinary team.",
      "Understand basic cold-chain, vaccine-day water and post-vaccination observation responsibilities.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Advisory support is part of flock management",
        src: FIELD_SUPPORT,
        alt: "A SmartVet Africa trainer discussing practical work with a participant.",
        caption: "Use farm observations and records to make veterinary conversations specific and actionable.",
        source: "SmartVet Africa training photo library",
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Training scope",
        items: [
          "The health module supports recognition and planning; diagnosis, prescription and vaccine selection belong with a qualified veterinary professional.",
          "Do not copy another farm's vaccination schedule without confirming disease risk, vaccine type, flock age and local veterinary guidance.",
        ],
      },
      {
        kind: "list",
        title: "Vaccination-day responsibilities",
        items: [
          "Confirm the agreed vaccine, date, flock age and responsible person in advance.",
          "Protect the cold chain and minimise unnecessary exposure to heat or sunlight.",
          "Prepare suitable clean water and equipment according to the vaccine/veterinary protocol.",
          "Make sure the whole target flock receives the vaccine through the planned method.",
          "Record the batch/event and observe the flock afterwards, reporting abnormal reactions or continuing illness.",
        ],
      },
      {
        kind: "table",
        title: "Red flags that should trigger prompt advice",
        headers: ["Pattern", "What to record", "Next step"],
        rows: [
          ["More than 1% mortality in one day", "Count, age, location, timing and visible signs", "Contact SmartVet veterinary support immediately."],
          ["Sudden feed or water drop", "Consumption change and when it started", "Check equipment/environment, then escalate if unexplained."],
          ["Gasping, coughing, wheezing or severe respiratory effort", "Number affected, temperature/air quality and onset", "Improve obvious environmental problems and seek veterinary assessment."],
          ["Marked diarrhoea, weakness, lameness, neurological signs or unusual behaviour", "Photos/description, count affected and mortality", "Isolate risks where practical and seek veterinary assessment."],
          ["Heat stress / persistent panting", "House temperature, bird distribution and water status", "Reduce heat load, improve safe airflow, provide cool clean water and escalate severe cases."],
        ],
      },
      {
        kind: "activity",
        title: "Build the flock health calendar",
        minutes: 15,
        items: [
          "With the farm's veterinary adviser, map vaccination and health checkpoints against flock age.",
          "Add who is responsible, what must be prepared and what evidence must be recorded.",
          "Add a clear emergency contact and escalation rule so staff do not wait for the farm owner to return.",
        ],
      },
    ],
    check: {
      question: "More than 1% of the flock dies in one day. What is the correct action?",
      options: ["Record it and wait a week", "Contact SmartVet promptly for possible outbreak assessment", "Reduce feed", "Increase temperature automatically"],
      correctIndex: 1,
      explanation: "A sudden mortality spike is an escalation trigger. Record it and seek veterinary assessment promptly.",
    },
  },
  {
    id: 9,
    stepLabel: "Module 9 of 9",
    title: "Poultry Business Performance & Profit",
    intro:
      "Technical performance and business performance are the same system viewed from two sides. Feed efficiency, mortality, sale weight, price and operating costs determine whether the batch creates cash or consumes it. Close every cycle with a batch review and convert the numbers into the next production decision.",
    quote: "A flock record becomes valuable when it changes the next decision.",
    keyMessage: "Close every batch with numbers, lessons and an action plan.",
    durationMinutes: 60,
    outcomes: [
      "Calculate the core technical and financial results of a batch.",
      "Identify the few cost/performance drivers that explain the result.",
      "Create a short next-batch action plan from evidence.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Batch closeout measures",
        headers: ["Measure", "Formula", "What it tells you"],
        rows: [
          ["Mortality %", "Deaths ÷ chicks placed × 100", "How much biological loss occurred."],
          ["Average sale weight", "Total live weight sold ÷ birds sold", "Whether the flock reached a commercially useful weight."],
          ["FCR", "Feed used (kg) ÷ live-weight gain (kg)", "How efficiently the major input became saleable weight."],
          ["Revenue", "Birds/kg sold × selling price", "Gross income from the batch."],
          ["Total batch cost", "Chicks + feed + health + energy + labour + transport + other costs", "What the flock actually consumed financially."],
          ["Batch profit", "Revenue − total batch cost", "The amount remaining before owner-level allocations/tax as applicable."],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Interpret FCR in context",
        items: [
          "The current course assessment treats an FCR below 1.65 around Day 42 as an excellent Cobb500 reference result.",
          "Do not manage toward one number blindly: breed guide, market age, mortality, feed quality, environment and farm conditions all affect interpretation.",
        ],
      },
      {
        kind: "list",
        title: "Five questions after every batch",
        ordered: true,
        items: [
          "Where did actual weight, mortality and FCR differ most from the target?",
          "Which input cost contributed most to total cost?",
          "What did the daily records show before the main performance gap appeared?",
          "Which one management change is most likely to improve the next flock?",
          "What must be budgeted, bought, repaired or scheduled before the next placement?",
        ],
      },
      {
        kind: "activity",
        title: "One-page batch review",
        minutes: 15,
        items: [
          "Write the batch's birds placed, birds sold, mortality, average sale weight, feed used, FCR, revenue, total cost and profit.",
          "Add three lessons supported by the records—not by memory alone.",
          "Choose three next-batch actions with owner, cost (if any) and due date.",
        ],
      },
    ],
    check: {
      question: "What FCR does the current course treat as an excellent Cobb500 result around Day 42?",
      options: ["Under 1.65", "1.65–1.75", "Above 1.75", "Above 2.00"],
      correctIndex: 0,
      explanation: "The current SmartVet course uses under 1.65 as its excellent Day-42 reference, while farm context still matters.",
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
    options: ["Fingertip deep (about 2 cm)", "Reaching your wrist, about 6 cm", "Up to your elbow", "Depth does not matter if it is dry"],
  },
  {
    question: "What must be ready before the chick box is opened?",
    options: ["Only the heat source", "Drinkers with glucose water and starter feed on trays or paper", "The record sheet only", "Vaccines"],
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
    options: ["10 of the biggest birds", "50 birds chosen at random from across the house", "All birds in the house", "5 birds near the door"],
  },
  {
    question: "The Cobb500 target average weight at Day 7 is:",
    options: ["~100 g", "~200 g", "~528 g", "~1,042 g"],
  },
  {
    question: "Your birds are 20% below target weight. What should you do?",
    options: ["Wait another week", "Only change the feed brand", "Arrange a full farm assessment with your SmartVet vet urgently", "Sell the birds immediately"],
  },
  {
    question: "When should dead birds be counted and recorded?",
    options: ["Every morning before 8 am", "Every evening", "Weekly", "Only when unusual"],
  },
  {
    question: "More than 1% of birds die in one day. What is the correct action?",
    options: ["Record it and wait a week", "Call SmartVet now — possible disease outbreak", "Reduce feed", "Increase the temperature"],
  },
  {
    question: "An excellent FCR for Cobb500 by Day 42 is:",
    options: ["Under 1.65", "1.65–1.75", "Above 1.75", "Above 2.00"],
  },
  {
    question: "If your eyes sting when you enter the house, what should you do?",
    options: ["Nothing — it is normal", "Open curtains, replace wet litter and check for drinker leaks the same day", "Add more litter next batch", "Reduce the number of birds"],
  },
];

export const liveCourse: Course = {
  id: LIVE_COURSE_ID,
  title: "Broiler Production & Poultry Business Foundations",
  tagline: "Nine practical modules from house design and brooding to flock health, records and profit.",
  description:
    "A field-practical Smart Vet Africa certificate course for smallholder broiler farmers in Uganda, built from the SmartVet Africa facilitator curriculum and Cobb500 reference standards. Learn house design, pre-placement, feed and water management, ventilation, biosecurity, sanitation, growing-phase performance, vaccination planning, record keeping and poultry-business decisions.",
  level: "Foundation",
  hours: 10.5,
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
