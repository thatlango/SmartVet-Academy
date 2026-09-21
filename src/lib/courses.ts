import { croilerCourse, layerCourse } from "./additional-courses";

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

const ILLUSTRATION_BROODER_SETUP = "/course-media/brooder-setup.jpg";
const ILLUSTRATION_TEMPERATURE_BEHAVIOUR = "/course-media/chick-temperature-behaviour.jpg";
const ILLUSTRATION_WET_LITTER = "/course-media/wet-litter-management.jpg";
const ILLUSTRATION_STOCKING_DENSITY = "/course-media/stocking-density.jpg";
const ILLUSTRATION_WEIGHT_MONITORING = "/course-media/live-weight-monitoring.jpg";
const ILLUSTRATION_RECORDS = "/course-media/records-profit-tracking.jpg";
const ILLUSTRATION_VET_VISIT = "/course-media/vet-farm-visit.jpg";
const ILLUSTRATION_MARKET = "/course-media/market-readiness.jpg";

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
        kind: "figure",
        title: "Brooder setup: what good readiness looks like",
        src: ILLUSTRATION_BROODER_SETUP,
        alt: "Illustration comparing a simple charcoal brooder and an improved lamp brooder with chicks, guards, drinkers and thermometers.",
        caption: "Use the picture as a checklist: heat source, guard, dry litter, drinkers, feeders and chick-level temperature all have to work together.",
        source: "Smart Vet Africa training illustration library",
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
        kind: "table",
        title: "Pre-placement verification — do not stop at setup",
        headers: ["Moment", "Verify", "Decision if it is wrong"],
        rows: [
          ["At least 2 hours before arrival", "Heat is running and chick-level temperature is stable around 33°C", "Fix the heat source or distribution before opening chick boxes."],
          ["Before placement", "Litter is dry and loose when squeezed; feeders and drinkers are filled and evenly reachable", "Replace wet litter, correct equipment position and remove access dead-zones."],
          ["Immediately after placement", "Chicks spread toward feed and water rather than piling in one zone", "Recheck heat, draughts, light and equipment access before assuming the flock will settle by itself."],
          ["First evening", "No leaks, wet patches, blocked drinkers or persistent crowding", "Correct the physical cause the same day and record what changed."],
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
        kind: "table",
        title: "Broiler feed-phase roadmap",
        note: "Use the feed manufacturer's formulation and your veterinary/production plan as the final authority; these are the Smart Vet Africa training ranges.",
        headers: ["Phase", "Approximate age", "Typical form / protein emphasis", "Management point"],
        rows: [
          ["Starter", "Days 1–10", "Crumble; roughly 22–24% protein", "Do not skip the starter phase. Early nutrient restriction can create a growth gap that is difficult to recover later."],
          ["Grower", "About days 11–28", "Grower ration; roughly 19–21% protein", "This is a high-growth period: protect feed access, water supply and uniformity."],
          ["Finisher", "From about day 29", "Often pellet; roughly 17–19% protein", "Match the ration to market age and avoid holding birds longer without checking the economics."],
        ],
      },
      {
        kind: "list",
        title: "Change feed without creating an intake dip",
        items: [
          "Avoid a sudden hard switch where practical. Blend old and new feed progressively over several days so the gut and feeding behaviour adjust.",
          "Watch actual intake through the transition. A full feeder is not evidence that birds are eating enough.",
          "Check particle size, freshness, mould, smell and storage condition whenever intake falls unexpectedly.",
          "If poor intake appears together with abnormal droppings, lethargy, respiratory signs or rising mortality, treat it as a health signal and seek veterinary advice.",
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
        kind: "figure",
        title: "Chick behaviour is a temperature instrument",
        src: ILLUSTRATION_TEMPERATURE_BEHAVIOUR,
        alt: "Three-panel illustration showing chicks huddling when cold, moving to the edges when hot, and spreading evenly when comfortable.",
        caption: "Compare distribution before changing the brooder: huddled, edge-seeking and evenly spread chicks point to different conditions.",
        source: "Smart Vet Africa training illustration library",
      },
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
        kind: "checklist",
        title: "Environment diagnosis sequence",
        items: [
          "Look first: distribution, activity, panting, huddling, wing position and whether birds avoid a particular zone.",
          "Measure second: check chick-level temperature rather than relying on a wall thermometer alone.",
          "Smell and feel: note ammonia, humidity and whether litter is dry and friable or wet/caked.",
          "Inspect the cause: curtains, roof heat, draughts, drinker leaks, stocking density and blocked air paths.",
          "Change one controllable factor, then re-observe the flock before making another large adjustment.",
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
          "The Smart Vet Africa brooding protocol uses formal crop-fill checkpoints at 2, 8 and 24 hours after placement.",
          "Targets: at least 80% full at 2 hours, 85% feed-and-water fill at 8 hours, and 95% full crops at 24 hours.",
          "Do not record only the percentage—record what the empty, hard or squishy crops are telling you.",
        ],
      },
      {
        kind: "table",
        title: "Crop-fill decision thresholds",
        headers: ["Checkpoint", "Target", "If below target"],
        rows: [
          ["2 hours", "At least 80% of sampled crops full", "Recheck temperature, lower feed/water access to chick level, increase starter-feed visibility and help weak chicks find water. Below 70% is a prompt-support red flag in the trainer protocol."],
          ["8 hours", "At least 85% showing feed-and-water fill", "Identify whether the dominant problem is empty, hard/dry or water-heavy crops, then correct the matching feed or water access issue."],
          ["24 hours", "At least 95% full crops", "Thirty percent or more empty crops is an urgent failure of access: add feeder access, spread starter feed appropriately and contact Smart Vet Africa support/veterinary staff."],
        ],
      },
      {
        kind: "figure",
        title: "Why the first weeks matter",
        src: "/course-media/body-system-development.svg",
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
        kind: "figure",
        title: "Wet litter turns into a flock-health problem",
        src: ILLUSTRATION_WET_LITTER,
        alt: "Illustration contrasting well-managed dry broiler litter with a wet, crowded section around leaking drinkers.",
        caption: "Treat wet litter as evidence. Find the water, ventilation or stocking problem that created it rather than only covering it with fresh material.",
        source: "Smart Vet Africa training illustration library",
      },
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
        kind: "list",
        title: "Turn biosecurity into a system",
        items: [
          "Use all-in/all-out flock planning wherever the farm can support it; overlapping age groups make it harder to break disease cycles between batches.",
          "Keep a clean/dirty boundary at each poultry-house entrance, with dedicated footwear or an effective change/disinfection routine for everyone—including the owner.",
          "Maintain a simple visitor and vehicle record so disease routes can be traced if a problem appears.",
          "Keep wild birds and vermin out with sound barriers and mesh; clear overgrown vegetation and standing water that encourage pests.",
          "Remove organic matter before washing and disinfecting. Disinfectant cannot reliably work through dirt, old litter and manure.",
          "Prepare disinfectants exactly to the product label and replace footbath solution whenever it is dirty or no longer active.",
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
        title: "Stocking density changes bird comfort and performance",
        src: ILLUSTRATION_STOCKING_DENSITY,
        alt: "Split illustration comparing a broiler house with adequate spacing against an overcrowded house.",
        caption: "Density is not only a birds-per-square-metre number: crowding changes feeder access, litter moisture, heat load and air quality.",
        source: "Smart Vet Africa training illustration library",
      },
      {
        kind: "figure",
        title: "Cobb500 growth and feed-intake reference",
        src: "/course-media/broiler-growth-intake.svg",
        alt: "Training chart showing Cobb500 body weight and daily feed intake by age.",
        caption: "Use the chart as a reference, then compare it with your actual flock records under your farm conditions.",
        source: "Smart Vet Africa performance standards facilitator manual",
      },
      {
        kind: "figure",
        title: "Weigh a representative sample",
        src: ILLUSTRATION_WEIGHT_MONITORING,
        alt: "Illustration of a Smart Vet Africa field worker and farmer weighing a broiler using a hanging scale and sling.",
        caption: "Sample birds from across the house—not just the easiest birds to catch—and write individual weights before calculating the average.",
        source: "Smart Vet Africa training illustration library",
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
        kind: "table",
        title: "When weight falls behind the reference",
        note: "Use breeder targets as a reference, not a guarantee. Investigate the farm conditions that produced the gap.",
        headers: ["Gap from age target", "Smart Vet Africa response rule", "What to check first"],
        rows: [
          ["About 10% below", "Intervene now rather than waiting for the next week", "Feed quality, feeder space/access, water availability, brooding history and environmental stress."],
          ["About 15% below", "Add a focused health review and contact Smart Vet Africa/veterinary support the same day", "Disease signs, droppings, mortality trend, respiratory signs, vaccination history and any recent feed/water change."],
          ["20% or more below", "Treat as an urgent whole-farm assessment", "Full production history: environment, feed, water, health, stocking density, records and measurement accuracy."],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Sampling rule",
        items: [
          "The trainer manual uses a 50-bird random sample where flock size and handling conditions make that practical.",
          "Collect birds from different parts of the house and record individual weights before calculating the average; selective sampling hides poor uniformity.",
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
        kind: "figure",
        title: "Records turn flock events into business decisions",
        src: ILLUSTRATION_RECORDS,
        alt: "Illustration of a poultry farmer recording daily flock data beside a poultry house, with a simple trend chart and profitability cue.",
        caption: "A record is useful when it connects what happened in the flock to a management action and, eventually, to money.",
        source: "Smart Vet Africa training illustration library",
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
        kind: "table",
        title: "Minimum recording cadence",
        headers: ["Measure", "Minimum cadence", "Why it matters"],
        rows: [
          ["Birds alive / deaths", "Daily", "Shows mortality trend early and keeps the denominator for performance calculations accurate."],
          ["Feed offered/used", "Daily; split AM/PM when useful", "Connects intake to growth, feed cost and FCR."],
          ["Water supply / abnormal intake", "Check morning and afternoon", "Sudden change can be an early environment or health signal."],
          ["Temperature / environment", "At least AM and PM during critical periods; more often in brooding/extreme weather", "Explains behaviour, intake and stress events."],
          ["Average live weight", "Weekly", "Shows whether the flock is tracking its age target."],
          ["Medicines / vaccines", "Every administration", "Prevents guesswork and supports safe veterinary follow-up."],
          ["Unusual signs / actions taken", "As they occur", "Creates the story behind the numbers so problems can be diagnosed later."],
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
        title: "A farm visit should follow evidence, not guesswork",
        src: ILLUSTRATION_VET_VISIT,
        alt: "Four-panel illustration of a veterinary worker arriving at a farm, inspecting birds, talking with a farmer and recording findings.",
        caption: "The useful sequence is observe, inspect, ask, record and agree the next action—not simply prescribe from one symptom.",
        source: "Smart Vet Africa training illustration library",
      },
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
        kind: "checklist",
        title: "What to send when asking for veterinary support",
        items: [
          "Bird age, starting flock size and current birds alive.",
          "When the problem started, how many birds are affected and whether it is getting better or worse.",
          "Deaths today and the mortality trend over the previous days.",
          "Feed and water intake changes, current house temperature/ventilation observations and litter condition.",
          "Clear description or photos of droppings, breathing, posture, lesions or other visible signs when safe to obtain.",
          "Vaccines, medicines or treatments already given, with dates and product names.",
          "Recent changes in feed, water source, stocking, weather, visitors or management that could explain the timing.",
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
        kind: "figure",
        title: "Market readiness is a production decision",
        src: ILLUSTRATION_MARKET,
        alt: "Illustration of mature broilers being weighed at a local market while a seller and buyer confirm the transaction.",
        caption: "Do not use age alone to decide when to sell. Combine live weight, buyer specification, feed economics, mortality risk and current price.",
        source: "Smart Vet Africa training illustration library",
      },
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
        kind: "table",
        title: "Worked batch closeout — the calculation sequence",
        headers: ["Step", "Formula", "Use"],
        rows: [
          ["Saleable output", "Birds sold × average sale weight", "Shows total live kilograms marketed when birds are sold by weight."],
          ["Revenue", "Quantity sold × actual selling price", "Use the real price received, including different buyer/grade prices where relevant."],
          ["Variable cost", "Chicks + feed + health inputs + litter + energy + transport + other batch costs", "Feed normally dominates; leaving out 'small' costs exaggerates profit."],
          ["Gross batch margin", "Revenue − variable cost", "Shows what the batch contributed before fixed overheads and owner financing costs."],
          ["FCR", "Feed consumed ÷ live-weight gain", "Use together with mortality, sale age and price; a single FCR number does not explain the whole business result."],
          ["Break-even check", "Total relevant cost ÷ saleable units", "Shows the minimum price per bird or per kilogram needed to cover the chosen cost base."],
        ],
      },
      {
        kind: "checklist",
        title: "Close the batch before starting the next one",
        items: [
          "Reconcile birds placed, deaths, culls and birds sold.",
          "Reconcile feed purchased, feed carried forward and feed consumed.",
          "Record average sale weight, selling price and any rejected/discounted birds.",
          "Calculate FCR, mortality, cost per saleable bird/kg and gross batch margin.",
          "Write the three biggest causes of lost performance or money, then assign one concrete change to the next cycle.",
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

export const liveCourses: Course[] = [liveCourse, layerCourse, croilerCourse];

export const catalog: CatalogEntry[] = [
  ...liveCourses.map((course) => ({
    id: course.id,
    title: course.title,
    tagline: course.tagline,
    status: "live" as const,
  })),
  {
    id: "smartvet-advanced",
    title: "Advanced SmartVet Flock Health",
    tagline: "Coming soon — biosecurity, vaccination planning and disease investigation.",
    status: "coming-soon",
  },
];

export function getCourse(id: string): Course | undefined {
  return liveCourses.find((course) => course.id === id);
}

export function getModule(course: Course, moduleId: number): Module | undefined {
  return course.modules.find((m) => m.id === moduleId);
}
