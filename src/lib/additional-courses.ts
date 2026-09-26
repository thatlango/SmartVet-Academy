import type { Course, Module } from "./courses";

const MEDIA = {
  brooder: "/course-media/brooder-setup.jpg",
  temperature: "/course-media/chick-temperature-behaviour.jpg",
  litter: "/course-media/wet-litter-management.jpg",
  density: "/course-media/stocking-density.jpg",
  weight: "/course-media/live-weight-monitoring.jpg",
  records: "/course-media/records-profit-tracking.jpg",
  vet: "/course-media/vet-farm-visit.jpg",
  market: "/course-media/market-readiness.jpg",
  body: "/course-media/body-system-development.svg",
  growth: "/course-media/broiler-growth-intake.svg",
};

const layerModules: Module[] = [
  {
    id: 1,
    stepLabel: "Module 1 of 10",
    title: "The Layer Enterprise & the Production Cycle",
    intro:
      "Layer farming is a long-cycle business. The decisions made during brooding and pullet rearing determine whether hens enter lay at the right body weight, build strong skeletons, reach a good peak and continue producing saleable eggs efficiently. This module maps the full cycle from day-old chick to end-of-lay so every later decision has a clear purpose.",
    quote: "A layer flock is prepared for eggs long before the first egg appears.",
    keyMessage: "Manage layers by production stage, target body weight and flock condition—not by calendar age alone.",
    durationMinutes: 65,
    outcomes: [
      "Explain the rearing, point-of-lay, peak, persistency and late-lay stages.",
      "Separate body-weight targets from egg-production targets.",
      "Set farm goals for eggs, mortality, feed use and saleable output.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Growth creates the future laying bird",
        src: MEDIA.body,
        alt: "Training illustration showing body-system development in a growing chicken.",
        caption: "Early development builds the skeleton, organs and body reserves that later support sustained egg production.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Layer production stages",
        headers: ["Stage", "Main management objective", "Main evidence"],
        rows: [
          ["Brooding: 0–6 weeks", "Survival, heat, feed and water access, early frame growth", "Crop fill, mortality, body weight, chick behaviour"],
          ["Pullet rearing: ~6–16 weeks", "Uniform frame growth without premature sexual stimulation", "Weekly body weight and uniformity"],
          ["Pre-lay / transfer", "Move birds with minimum stress and prepare bone/calcium reserves", "Target weight, house readiness, feed and water access"],
          ["Point-of-lay / rise", "Support the rapid increase in egg output and feed intake", "Hen-day production, egg weight, feed intake"],
          ["Peak and persistency", "Keep healthy hens eating enough to sustain high output", "Production %, egg mass, shell quality, mortality"],
          ["Late lay / closeout", "Protect egg quality while deciding the economic end point", "Feed per egg, egg grade, mortality, margin"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Do not copy one breed's targets blindly",
        items: [
          "Commercial layer hybrids differ in body weight, egg size, feed intake and age-of-production targets.",
          "Use the hatchery or breeder guide supplied for the actual strain on your farm and treat Academy numbers as management examples, not a substitute for the strain guide.",
        ],
      },
      {
        kind: "checklist",
        title: "Before buying layer chicks",
        items: [
          "Choose the egg market first: tray eggs, graded retail eggs, institutional buyers or local direct sales.",
          "Confirm chick source, strain, vaccination history and expected breeder performance guide.",
          "Budget feed through rearing and the first months of lay; layer cashflow is slower than broiler cashflow.",
          "Plan brooder space, grower space and laying-house capacity before chicks arrive.",
          "Identify a SmartVet or local veterinary contact and agree how mortality and disease alerts will be escalated.",
        ],
      },
      {
        kind: "activity",
        title: "Build the flock calendar",
        minutes: 15,
        items: [
          "Draw the flock timeline from chick arrival to planned end-of-lay.",
          "Mark brooding, grower, pre-lay, point-of-lay, expected peak and review points.",
          "Add the records you must collect at each stage and the person responsible.",
        ],
      },
    ],
  },
  {
    id: 2,
    stepLabel: "Module 2 of 10",
    title: "Brooding Layer Chicks for a Strong Pullet Start",
    intro:
      "Layer chicks need the same disciplined first-hours management as other commercial chicks, but the objective is different: the farmer is building a healthy, uniform pullet that must remain productive for many months. Early dehydration, chilling, poor feed access and crowding create permanent variation that is difficult to repair later.",
    quote: "The first week is the first investment in the laying cycle.",
    keyMessage: "Confirm that every chick can eat, drink, stay warm and settle evenly from the first hours.",
    durationMinutes: 75,
    outcomes: [
      "Prepare a brooding area before chick arrival.",
      "Use chick behaviour, temperature and crop fill to assess the start.",
      "Correct early access problems before they become flock-uniformity problems.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Brooder readiness",
        src: MEDIA.brooder,
        alt: "Illustration showing brooder equipment, heat, feeders and drinkers.",
        caption: "Heat, litter, feeder space and drinker access must be ready before chick boxes are opened.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "First-day control points",
        headers: ["Moment", "What to observe", "Action"],
        rows: [
          ["Before arrival", "Dry litter, stable chick-level warmth, feed and clean water ready", "Fix any gap before placement"],
          ["2 hours", "Chicks active and crops filling", "Correct feeder/drinker access or temperature immediately"],
          ["8 hours", "Most chicks have soft, full crops and are evenly distributed", "Investigate empty crops, piling or panting"],
          ["24 hours", "Strong activity, low early mortality, no wet litter", "Escalate persistent access, heat or health problems"],
        ],
      },
      {
        kind: "figure",
        title: "Read the chicks, not only the thermometer",
        src: MEDIA.temperature,
        alt: "Training image showing chick distribution under too cold, correct and too hot conditions.",
        caption: "Even distribution usually indicates comfort; piling suggests cold or draughts, while edge-seeking and panting suggest excess heat.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "checklist",
        title: "Layer chick brooding routine",
        items: [
          "Start with clean, disinfected, dry equipment and litter.",
          "Pre-warm the brooding area and measure at chick height.",
          "Provide enough feeder and drinker points so timid chicks are not excluded.",
          "Keep water clean and cool enough to encourage intake.",
          "Record deaths, temperature, feed use, water observations and unusual behaviour daily.",
          "Reduce heat gradually as chicks feather and behaviour shows comfort; do not follow a calendar if the birds show distress.",
        ],
      },
      {
        kind: "activity",
        title: "Two-minute brooder diagnosis",
        minutes: 12,
        items: [
          "Stand quietly at the brooder entrance before touching anything.",
          "Describe chick distribution, sound, feeding, drinking and litter condition.",
          "Name the single highest-priority correction and explain why it comes first.",
        ],
      },
    ],
  },
  {
    id: 3,
    stepLabel: "Module 3 of 10",
    title: "Pullet Growth, Body Weight & Uniformity",
    intro:
      "The pullet phase is the bridge between a healthy chick and a productive hen. The management question is not simply whether birds are alive; it is whether most birds are developing together toward the breeder's target body weight. Uniformity tells you whether the flock can respond consistently to feed changes, transfer and later lighting decisions.",
    quote: "Averages can hide a weak flock. Uniformity shows whether the flock is growing together.",
    keyMessage: "Weigh every week, compare with the strain guide and investigate variation early.",
    durationMinutes: 70,
    outcomes: [
      "Sample pullets correctly for weekly weighing.",
      "Calculate average body weight and a simple uniformity indicator.",
      "Use weight trends to guide feed, space and management decisions.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Weekly live-weight monitoring",
        src: MEDIA.weight,
        alt: "Training image of poultry live-weight monitoring.",
        caption: "Use a consistent weekly sample from different parts of the house so the result represents the flock.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "What weight data can reveal",
        headers: ["Pattern", "Likely questions", "Management response"],
        rows: [
          ["Average weight below target", "Feed quality? feeder access? disease? stocking? water?", "Check intake and health before simply changing feed quantity"],
          ["Average near target but poor uniformity", "Are small birds being excluded? uneven light/heat? mixed ages?", "Find access and environment differences across the house"],
          ["Sudden weekly slowdown", "Feed change? heat stress? illness? water interruption?", "Investigate the event and compare daily records"],
          ["Too-heavy pullets", "Overfeeding? wrong feed phase? delayed phase change?", "Review diet and strain guide before sexual maturity"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "A practical uniformity method",
        items: [
          "Weigh a representative sample and calculate the flock average.",
          "Count how many sampled birds fall within plus or minus 10% of that average.",
          "Uniformity % = birds within the band ÷ birds weighed × 100.",
          "Use the trend and breeder guide rather than one isolated number.",
        ],
      },
      {
        kind: "checklist",
        title: "Weekly pullet review",
        items: [
          "Weigh on the same day and roughly the same time each week.",
          "Sample birds from multiple locations, not only near the door.",
          "Record individual weights when practical, not just the average.",
          "Compare average and uniformity with the previous week and the breeder guide.",
          "Document feed phase, daily feed intake, mortality and any management change that may explain the result.",
        ],
      },
      {
        kind: "activity",
        title: "Calculate flock uniformity",
        minutes: 15,
        items: [
          "Use 20 example weights or a real farm sample.",
          "Calculate the average weight.",
          "Create the plus/minus 10% band and count how many birds are inside it.",
          "Decide what you would investigate if the average is acceptable but uniformity is poor.",
        ],
      },
    ],
  },
  {
    id: 4,
    stepLabel: "Module 4 of 10",
    title: "Housing, Ventilation, Litter & Biosecurity for Layers",
    intro:
      "A layer house must support birds for much longer than a broiler house. Ventilation, floor condition, stocking density, feeder access, nest design and biosecurity therefore influence not only survival but also egg cleanliness, shell quality, respiratory health and labour efficiency over many months.",
    quote: "A layer house must stay manageable after month six, not only look good on placement day.",
    keyMessage: "Design the house for long-term airflow, dry floors, easy cleaning and equal access.",
    durationMinutes: 65,
    outcomes: [
      "Identify housing features that protect long-cycle flock health.",
      "Recognise early signs of wet litter, ammonia and overcrowding.",
      "Build a biosecurity flow for staff, visitors and equipment.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Wet litter becomes a production problem",
        src: MEDIA.litter,
        alt: "Training image showing wet litter management.",
        caption: "Persistent moisture increases ammonia, foot problems, dirty eggs and pathogen pressure; find the source rather than covering it with more litter.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "House zones to inspect every day",
        headers: ["Zone", "Good condition", "Warning"],
        rows: [
          ["Feed line / feeders", "Birds can eat without crowding", "Empty sections, bridging feed, dominant birds blocking access"],
          ["Drinkers", "Working, correct height, no leaks", "Wet patches, blocked nipples, dirty troughs"],
          ["Air path", "Fresh air without direct chilling draughts", "Stuffy air, condensation, strong ammonia smell"],
          ["Floor / litter", "Dry and friable", "Caking, dampness, flies, foot irritation"],
          ["Nest area", "Clean, quiet, easy to enter", "Floor eggs, manure contamination, overcrowded nests"],
        ],
      },
      {
        kind: "figure",
        title: "Stocking density is a welfare and production control",
        src: MEDIA.density,
        alt: "Training image comparing poultry stocking density.",
        caption: "Use the housing system and strain guide to set density; overcrowding reduces access and worsens heat, litter and disease pressure.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "checklist",
        title: "Biosecurity flow",
        items: [
          "Keep a clear clean-to-dirty movement pattern around the farm.",
          "Use dedicated footwear or effective entry sanitation for poultry areas.",
          "Control visitors and avoid unnecessary movement between different-age flocks.",
          "Quarantine new or returning birds rather than mixing them immediately.",
          "Store feed so wild birds, rodents and moisture cannot contaminate it.",
          "Remove mortalities safely and promptly according to local veterinary guidance.",
        ],
      },
      {
        kind: "activity",
        title: "Map your contamination routes",
        minutes: 15,
        items: [
          "Draw the farm entrance, feed store, houses, water source, manure area and mortality-disposal point.",
          "Mark where people, tools, vehicles, rodents or wild birds can carry contamination.",
          "Choose three controls that can be implemented this week.",
        ],
      },
    ],
  },
  {
    id: 5,
    stepLabel: "Module 5 of 10",
    title: "Lighting, Sexual Maturity & Point-of-Lay Timing",
    intro:
      "Light is a biological signal. In layer pullets, the objective is to allow adequate body development before using light to support sexual maturity. Sudden, inconsistent or premature lighting changes can create early small eggs, uneven onset of lay and management problems that persist for the rest of the cycle.",
    quote: "Do not ask an under-developed pullet to become a laying hen.",
    keyMessage: "Base lighting decisions on the strain guide, flock body weight and uniformity—not age alone.",
    durationMinutes: 65,
    outcomes: [
      "Explain why lighting programmes differ between rearing and laying.",
      "Avoid accidental light stimulation during pullet development.",
      "Coordinate body weight, transfer and lighting at point of lay.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Lighting decisions by stage",
        headers: ["Stage", "Management aim", "Avoid"],
        rows: [
          ["Early brooding", "Enough light for chicks to find feed and water", "Dark corners and abrupt outages"],
          ["Pullet rearing", "Consistent programme that supports growth without premature stimulation", "Increasing day length too early"],
          ["Pre-lay", "Confirm target weight/uniformity before planned stimulation", "Using age alone as the trigger"],
          ["Lay", "Maintain a stable programme appropriate to the strain and housing system", "Frequent changes, long outages, uncontrolled extra light"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Photostimulation is a management decision",
        items: [
          "Follow the current breeder guide for the actual strain and housing system.",
          "If the flock is materially under target weight or poorly uniform, investigate the cause before increasing light.",
          "Natural day length can affect open-sided houses, so the plan must account for the real light birds receive.",
        ],
      },
      {
        kind: "checklist",
        title: "Point-of-lay readiness",
        items: [
          "Pullet body weight is close to strain target and the flock is acceptably uniform.",
          "Birds are fully adapted to feeders, drinkers and the laying house before peak demand.",
          "Nest boxes or nest areas are clean, open and easy to find.",
          "Pre-lay or appropriate transition nutrition is in place according to the feed programme.",
          "The light programme is written down so all staff follow the same timing.",
        ],
      },
      {
        kind: "activity",
        title: "Audit the real light day",
        minutes: 12,
        items: [
          "Write the time natural light begins and ends at the poultry house.",
          "Add every artificial-light period and identify any uncontrolled night light.",
          "Compare the real programme with the strain guide and correct inconsistencies.",
        ],
      },
    ],
  },
  {
    id: 6,
    stepLabel: "Module 6 of 10",
    title: "Layer Feed, Water, Calcium & Phase Feeding",
    intro:
      "A laying hen must meet maintenance needs and manufacture an egg repeatedly. Feed intake, amino acids, energy, calcium, phosphorus, vitamins, minerals and water all become production constraints if the ration or access is wrong. The correct diet also changes as the bird moves from rearing to pre-lay, peak and later production.",
    quote: "The hen cannot put nutrients into an egg that she did not eat or absorb.",
    keyMessage: "Use the correct feed phase, protect feed quality and monitor feed and water intake every day.",
    durationMinutes: 70,
    outcomes: [
      "Distinguish starter, grower/developer, pre-lay and layer feed purposes.",
      "Explain why calcium demand rises sharply during egg production.",
      "Use intake changes as an early warning signal.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Feed phase logic",
        headers: ["Phase", "Main nutritional job", "Management question"],
        rows: [
          ["Chick starter", "Support rapid organ, immune and frame development", "Are chicks actually consuming enough good-quality starter?"],
          ["Grower / developer", "Build the pullet to target size without excessive fat", "Is body weight tracking the strain guide?"],
          ["Pre-lay / transition", "Prepare mineral reserves and feed intake for onset of lay", "Was the phase change timed to flock development?"],
          ["Layer diets", "Support egg number, egg mass, shell quality and maintenance", "Does the diet match current production and feed intake?"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Calcium is not the only layer nutrient",
        items: [
          "Shell formation requires substantial calcium, but simply adding limestone cannot correct a poorly balanced diet.",
          "Energy, amino acids, available phosphorus, vitamin D and overall feed intake also matter.",
          "Use a reputable formulated layer ration or qualified nutrition support rather than home-mixing by guesswork.",
        ],
      },
      {
        kind: "table",
        title: "Intake warning signs",
        headers: ["Signal", "Possible causes", "Check first"],
        rows: [
          ["Feed intake drops suddenly", "Heat, disease, feed change, poor quality, empty feeders", "House temperature, health, feed supply and smell/appearance"],
          ["Water intake drops", "Blocked lines, dirty water, pressure problem, illness", "Physical water availability before anything else"],
          ["Water intake rises sharply", "Heat, salt, leaks, disease", "Temperature, water system, feed and droppings"],
          ["Shell quality worsens", "Nutrition, disease, heat stress, bird age", "Feed phase/intake and flock health records"],
        ],
      },
      {
        kind: "checklist",
        title: "Daily feed and water control",
        items: [
          "Record feed issued or consumed at the same time each day.",
          "Check water availability at the far end of the system, not only near the tank.",
          "Reject mouldy, wet, sour-smelling or badly contaminated feed.",
          "Keep storage dry and protected from rodents and wild birds.",
          "Investigate a meaningful intake change immediately instead of waiting for egg numbers to fall further.",
        ],
      },
      {
        kind: "activity",
        title: "Feed-per-dozen calculation",
        minutes: 15,
        items: [
          "Record feed used over a chosen period.",
          "Record saleable eggs produced over the same period.",
          "Convert eggs to dozens and divide feed kilograms by dozens produced.",
          "Track the result over time and investigate deterioration.",
        ],
      },
    ],
  },
  {
    id: 7,
    stepLabel: "Module 7 of 10",
    title: "Point of Lay, Peak Production & Persistency",
    intro:
      "When pullets begin laying, their nutrient demand rises faster than at almost any other stage. The farmer must help birds increase feed intake, find nests, adapt to the laying house and avoid unnecessary stress. After peak, the goal shifts to persistency: maintaining as much efficient saleable egg output as possible.",
    quote: "Peak matters, but a profitable flock also knows how to stay productive after peak.",
    keyMessage: "Track production as a curve, not as a single peak number.",
    durationMinutes: 70,
    outcomes: [
      "Calculate hen-day egg production.",
      "Recognise normal rise, peak and decline patterns.",
      "Identify management events that can damage persistency.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Core production measures",
        headers: ["Measure", "Formula", "Use"],
        rows: [
          ["Hen-day production %", "Eggs produced today ÷ hens present today × 100", "Daily rate of lay"],
          ["Egg mass", "Egg number × average egg weight", "Combines egg number and size"],
          ["Saleable egg %", "Saleable eggs ÷ total eggs × 100", "Shows losses from cracks, dirt and defects"],
          ["Mortality %", "Deaths ÷ starting or relevant flock base × 100", "Tracks flock survival"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "A production drop has a cause",
        items: [
          "Do not respond to a sudden fall in eggs by changing several things at once.",
          "Check feed intake, water, heat, light, disease signs, stress events, egg collection and record accuracy in sequence.",
          "Contact veterinary support promptly when production decline is accompanied by mortality, respiratory signs, diarrhoea or other disease indicators.",
        ],
      },
      {
        kind: "checklist",
        title: "Point-of-lay management",
        items: [
          "Open and prepare nests before birds need them.",
          "Collect floor eggs frequently so the behaviour does not become established.",
          "Protect feed and water access while hens are increasing production.",
          "Keep lighting consistent.",
          "Record eggs daily by total, saleable, cracked, dirty and other rejects where practical.",
          "Review the actual production curve against the breeder target weekly.",
        ],
      },
      {
        kind: "activity",
        title: "Build the production curve",
        minutes: 15,
        items: [
          "Use seven to fourteen days of egg records.",
          "Calculate hen-day production for each day.",
          "Plot or list the trend and mark any management event that happened before a drop.",
          "Choose the first evidence you would check if tomorrow's result fell sharply.",
        ],
      },
    ],
  },
  {
    id: 8,
    stepLabel: "Module 8 of 10",
    title: "Egg Quality, Collection, Grading & Loss Control",
    intro:
      "The flock can produce a high number of eggs and still lose money if too many eggs are dirty, cracked, broken, undersized or rejected. Egg quality begins in nutrition and flock health, but it is also strongly affected by nest cleanliness, collection frequency, handling, storage and market requirements.",
    quote: "An egg is not revenue until it reaches the buyer in saleable condition.",
    keyMessage: "Measure and manage egg losses with the same discipline used for egg production.",
    durationMinutes: 60,
    outcomes: [
      "Separate production losses from quality and handling losses.",
      "Set a practical egg collection and grading routine.",
      "Trace common shell and cleanliness problems back to farm causes.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Egg defect diagnosis",
        headers: ["Defect", "Possible farm causes", "What to check"],
        rows: [
          ["Dirty eggs", "Dirty nests, floor eggs, wet litter, infrequent collection", "Nest condition and collection timing"],
          ["Cracked eggs", "Thin shells, rough handling, poor trays, overcrowded nests", "Shell quality and handling points"],
          ["Thin/soft shell", "Nutrition, heat stress, disease, bird age", "Feed intake/phase, flock health and temperature"],
          ["Too many floor eggs", "Late nest opening, poor nest access, bright/disturbed nest area", "Nest location, training and crowding"],
          ["High breakage after collection", "Bad trays, stacking, transport vibration", "Packing and transport process"],
        ],
      },
      {
        kind: "checklist",
        title: "Egg-handling routine",
        items: [
          "Collect eggs frequently enough for the house and production level.",
          "Separate cracked, leaking or heavily contaminated eggs from saleable eggs.",
          "Use clean trays and avoid rough stacking or dropping.",
          "Keep storage clean, shaded and appropriate for the intended market and holding time.",
          "Record reject reasons so losses can be traced to production, housing or handling.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Grade for the market you actually serve",
        items: [
          "Buyers may value size, shell colour, cleanliness, uniformity, tray presentation or delivery reliability differently.",
          "Write the buyer specification down and compare the flock's saleable output against it.",
        ],
      },
      {
        kind: "activity",
        title: "Egg loss audit",
        minutes: 15,
        items: [
          "Take a day's egg record and split output into saleable, dirty, cracked, floor and other rejects.",
          "Calculate each category as a percentage of total eggs.",
          "Select the biggest controllable loss and identify its likely farm cause.",
        ],
      },
    ],
  },
  {
    id: 9,
    stepLabel: "Module 9 of 10",
    title: "Layer Health, Vaccination, Mortality & Welfare",
    intro:
      "A layer flock remains on the farm for many months, so biosecurity, vaccination, parasite control, observation and rapid veterinary escalation must work as a system. Vaccination schedules vary by disease risk, strain, supplier history and local veterinary guidance; the farmer's job is to keep the plan current and execute it correctly.",
    quote: "Long-cycle poultry rewards prevention and punishes delayed response.",
    keyMessage: "Keep a written health plan, watch the flock daily and escalate unusual mortality or production changes promptly.",
    durationMinutes: 70,
    outcomes: [
      "Maintain a flock-specific vaccination and health record.",
      "Recognise disease and welfare red flags that need escalation.",
      "Avoid unplanned medicine use that masks the real problem.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Use veterinary support early",
        src: MEDIA.vet,
        alt: "Training image of a veterinary farm visit.",
        caption: "Bring complete flock records to the veterinary conversation: age, deaths, egg production, feed/water intake, vaccines, treatments and recent management changes.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Escalation signals",
        headers: ["Signal", "Why it matters", "Action"],
        rows: [
          ["Sudden mortality increase", "Possible infectious, toxic or environmental event", "Record and contact veterinary support promptly"],
          ["Sharp egg-production drop", "Can precede or accompany disease, feed, water or light problems", "Check systems immediately and escalate if unexplained"],
          ["Respiratory signs", "Potential infectious or air-quality problem", "Improve environment if needed and seek diagnosis"],
          ["Neurological signs", "Potential serious disease/toxin", "Urgent veterinary assessment"],
          ["Persistent diarrhoea or abnormal droppings", "Disease, feed or water issue", "Investigate with records and veterinary guidance"],
        ],
      },
      {
        kind: "checklist",
        title: "Vaccination governance",
        items: [
          "Use a veterinarian, hatchery and local disease-risk information to create the schedule.",
          "Record vaccine name, batch, expiry, date, route and person responsible.",
          "Protect the cold chain where required.",
          "Prepare water correctly for drinking-water vaccines and avoid disinfectant/chlorine interference according to product instructions.",
          "Do not assume vaccination removes the need for biosecurity.",
        ],
      },
      {
        kind: "activity",
        title: "Health-record handover drill",
        minutes: 15,
        items: [
          "Pretend the usual flock attendant is absent and a veterinarian arrives.",
          "Using only the farm records, explain the last seven days of mortality, egg production, feed/water intake and treatments.",
          "List any information that is missing and add it to the daily record format.",
        ],
      },
    ],
  },
  {
    id: 10,
    stepLabel: "Module 10 of 10",
    title: "Layer Records, KPIs, Cashflow & Flock Closeout",
    intro:
      "Layer profitability is created over hundreds of daily decisions. A strong record system connects technical performance to cash: eggs, feed, mortality, rejects, price, labour, medicines and other operating costs. The farmer should be able to explain where margin is being won or lost before the flock reaches the end of lay.",
    quote: "The egg count tells you what happened today; the records tell you why.",
    keyMessage: "Track technical and financial performance together and review the flock every week.",
    durationMinutes: 70,
    outcomes: [
      "Calculate core layer production and financial KPIs.",
      "Separate egg volume, egg quality and input-cost effects on profit.",
      "Use records to decide whether to correct, continue or close a flock.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Turn records into decisions",
        src: MEDIA.records,
        alt: "Training image showing poultry records and profit tracking.",
        caption: "A layer record should connect birds present, eggs, rejects, feed, health events, price and costs.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Layer business dashboard",
        headers: ["KPI", "Calculation", "Question answered"],
        rows: [
          ["Hen-day production", "Eggs ÷ hens present × 100", "How actively is the current flock laying?"],
          ["Saleable egg %", "Saleable eggs ÷ total eggs × 100", "How much output survives quality control?"],
          ["Feed per dozen", "Feed kg ÷ dozens produced", "How efficiently is feed becoming saleable units?"],
          ["Egg revenue per hen", "Egg sales ÷ hens present or hen-housed basis", "How much income is the flock generating?"],
          ["Gross margin", "Revenue − variable flock costs", "Is the flock contributing cash before fixed overheads?"],
          ["Mortality / depletion", "Bird losses tracked over time", "How much biological capacity has been lost?"],
        ],
      },
      {
        kind: "checklist",
        title: "Weekly layer review",
        items: [
          "Birds present and mortality reconciled.",
          "Egg production, saleable eggs and reject reasons reconciled.",
          "Feed used and feed stock reconciled.",
          "Average egg price and sales receipts captured.",
          "Health, light, feed or housing events linked to performance changes.",
          "One corrective action agreed for the next seven days where a KPI is off track.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "End-of-lay is an economic decision",
        items: [
          "Do not keep a flock only because birds are still laying some eggs.",
          "Compare expected egg revenue with feed, health, labour and other continuing costs, while considering replacement-flock timing and market conditions.",
          "Plan depletion, sale and cleaning so the next flock does not inherit disease or cashflow problems.",
        ],
      },
      {
        kind: "activity",
        title: "One-week layer management report",
        minutes: 20,
        items: [
          "Summarise birds present, mortality, eggs, rejects, feed used, sales and variable costs.",
          "Calculate hen-day production, saleable egg %, feed per dozen and gross margin.",
          "Write three evidence-based actions for the next week.",
        ],
      },
    ],
  },
];

const croilerModules: Module[] = [
  {
    id: 1,
    stepLabel: "Module 1 of 10",
    title: "Croiler & Dual-Purpose Poultry Business Models",
    intro:
      "Croiler is used here as a practical farmer-facing pathway for improved dual-purpose birds such as Kuroiler, SASSO and comparable coloured or hardy hybrids. These birds are neither fast broilers nor specialised layers. The farmer must decide what the flock is expected to produce—meat, eggs, replacement birds or a combination—and manage to that purpose.",
    quote: "Dual-purpose does not mean no-purpose. Decide what you are producing.",
    keyMessage: "Choose the production goal first, then select genetics, feeding and market timing that fit it.",
    durationMinutes: 60,
    outcomes: [
      "Distinguish dual-purpose birds from specialised broilers and layers.",
      "Choose meat, egg or mixed-enterprise objectives for a flock.",
      "Use supplier-specific performance targets for the actual bird purchased.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Three poultry pathways",
        headers: ["Pathway", "Primary output", "Typical management emphasis"],
        rows: [
          ["Broiler", "Fast meat growth", "High early growth rate, feed conversion, short cycle"],
          ["Layer", "Egg production", "Pullet development, lighting, long-cycle nutrition and egg quality"],
          ["Croiler / dual-purpose", "Meat plus eggs / flexible household-market use", "Strong brooding, moderate growth, scavenging/range management and flexible marketing"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Kuroiler and SASSO are not one identical bird",
        items: [
          "Improved dual-purpose strains differ in mature weight, growth rate, age at first egg and annual egg potential.",
          "Use the hatchery or supplier guide for the actual strain. The Academy teaches the management logic that applies across this category.",
        ],
      },
      {
        kind: "table",
        title: "Choose the business model",
        headers: ["Model", "How birds are used", "Key decision"],
        rows: [
          ["Meat-focused", "Males and/or mixed flock sold once target market weight/value is reached", "Does extra feeding still pay for extra growth?"],
          ["Egg-focused females", "Pullets retained into lay", "Can the farm support layer-quality feed and housing through point of lay?"],
          ["Mixed household-market", "Some birds consumed/sold, females retained for eggs", "Which birds are retained and why?"],
          ["Brooder / chick grow-out", "Young birds raised through the high-risk brooding period for sale", "Can survival, vaccination and customer trust be consistently delivered?"],
        ],
      },
      {
        kind: "checklist",
        title: "Before buying dual-purpose chicks",
        items: [
          "Confirm hatchery, strain or cross, sexing status and vaccination history.",
          "Ask for the current growth or laying reference for the supplied bird.",
          "Choose whether males, females or both have a planned market.",
          "Budget high-quality starter feed for the early growth period even if later birds will scavenge.",
          "Plan predator-safe night housing and a safe daytime range if using free-range or semi-intensive management.",
        ],
      },
      {
        kind: "activity",
        title: "Define your flock purpose",
        minutes: 15,
        items: [
          "Write the number of chicks, expected male/female use and intended buyers.",
          "Choose the age or performance checkpoints when meat-sale and pullet-retention decisions will be reviewed.",
          "List the records needed to know whether the plan is working.",
        ],
      },
    ],
  },
  {
    id: 2,
    stepLabel: "Module 2 of 10",
    title: "Brooding Croiler Chicks: Survival, Access & Early Growth",
    intro:
      "Hardy dual-purpose birds are still vulnerable as chicks. The first weeks require controlled heat, dry litter, clean water, starter feed, biosecurity and close observation. The fact that the adult bird can scavenge does not mean the day-old chick can be raised on scraps.",
    quote: "Hardiness is not a substitute for brooding.",
    keyMessage: "Invest most heavily in management during the early weeks when mortality and lost growth are hardest to recover.",
    durationMinutes: 75,
    outcomes: [
      "Prepare a safe brooder and confirm crop fill.",
      "Use chick distribution to adjust heat and draught control.",
      "Protect starter-feed access during the period of fastest early development.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Brooder setup",
        src: MEDIA.brooder,
        alt: "Training illustration of a poultry brooder.",
        caption: "A Croiler chick needs the same basics: heat, dry litter, feed, water, light and enough space to move between resources.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "figure",
        title: "Behaviour confirms comfort",
        src: MEDIA.temperature,
        alt: "Training image showing chick behaviour under different temperatures.",
        caption: "Even distribution is the goal; piling, loud distress or panting are signals to correct the environment.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "checklist",
        title: "First-week routine",
        items: [
          "Pre-warm before arrival and provide clean water and starter feed before boxes are opened.",
          "Check crop fill in the first hours to confirm chicks found feed and water.",
          "Inspect litter for wet patches at least morning and evening.",
          "Record daily mortality and remove dead birds promptly and safely.",
          "Keep predators, children, pets and unnecessary visitors away from the brooder.",
          "Reduce heat gradually according to feathering, weather and chick behaviour.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Do not start scavenging too early",
        items: [
          "Young chicks need concentrated nutrients and protection before they can use a range effectively.",
          "Premature exposure increases chilling, predation, disease contact and nutritional shortfall.",
        ],
      },
      {
        kind: "activity",
        title: "Brooder survival audit",
        minutes: 15,
        items: [
          "Walk the brooder from heat source to outer edge.",
          "Check litter, crop fill, feeder/drinker access and chick distribution.",
          "Record one corrective action and verify the result later the same day.",
        ],
      },
    ],
  },
  {
    id: 3,
    stepLabel: "Module 3 of 10",
    title: "Housing, Range, Stocking & Predator Control",
    intro:
      "Dual-purpose systems often combine secure night housing with daytime range or semi-intensive access. This can reduce some feed pressure and fit rural production, but only when birds remain protected from predators, weather, theft, contaminated standing water and uncontrolled contact with other flocks.",
    quote: "Free range should mean managed range, not unmanaged risk.",
    keyMessage: "Give birds freedom to forage while keeping night housing, range boundaries and disease risks under control.",
    durationMinutes: 65,
    outcomes: [
      "Design practical night housing and daytime range.",
      "Recognise predator and disease risks in free-range systems.",
      "Use stocking and rotation to protect ground condition.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Stocking and access still matter",
        src: MEDIA.density,
        alt: "Training image showing poultry stocking density.",
        caption: "Crowding at night or around feeders can erase the advantages of a larger daytime range.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Range risks and controls",
        headers: ["Risk", "Typical sign", "Control"],
        rows: [
          ["Predators", "Missing/injured birds, night disturbance", "Secure housing, fencing/netting where practical, close birds before dark"],
          ["Standing water / mud", "Dirty feet, wet range, parasite exposure", "Drainage, move drinkers, rotate access"],
          ["Wild-bird contact", "Shared feed/water points", "Protect feed, limit attractants, maintain biosecurity"],
          ["Overused ground", "Bare soil, manure build-up, poor forage", "Rotate or rest sections where land allows"],
          ["Theft / roaming", "Birds leave farm boundaries", "Flock routine, secure perimeter, supervised release"],
        ],
      },
      {
        kind: "checklist",
        title: "Night-house essentials",
        items: [
          "Dry, weatherproof shelter with ventilation.",
          "Enough perch/floor/resting space for the chosen system.",
          "Closable openings that stop common predators.",
          "Clean water available when birds are confined.",
          "Easy access for cleaning and manure removal.",
          "Separate isolation space for sick or newly introduced birds where possible.",
        ],
      },
      {
        kind: "activity",
        title: "Predator and range map",
        minutes: 15,
        items: [
          "Draw the house, release point, water, feed points, garden/crops and common predator routes.",
          "Mark where birds are most vulnerable morning, daytime and evening.",
          "Change one routine or physical control to reduce the highest risk.",
        ],
      },
    ],
  },
  {
    id: 4,
    stepLabel: "Module 4 of 10",
    title: "Feeding & Water: From Starter Feed to Scavenging Support",
    intro:
      "Dual-purpose birds can use forages, insects, crop residues and household resources better than highly specialised commercial birds, but scavenging is variable and rarely balanced. Good performance depends on protecting early nutrition, then using supplementation deliberately as birds grow and production goals change.",
    quote: "Scavenging can supplement a ration; it cannot guarantee a balanced ration.",
    keyMessage: "Protect starter nutrition, supply clean water always, and supplement according to growth or egg-production goals.",
    durationMinutes: 70,
    outcomes: [
      "Match feed strategy to chick, grower and laying stages.",
      "Separate scavenging contribution from required supplementation.",
      "Use feed and water intake observations to detect problems.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Feeding logic by stage",
        headers: ["Stage", "Priority", "Common mistake"],
        rows: [
          ["Chick / brooding", "Balanced starter and uninterrupted access", "Replacing starter with scraps or grain too early"],
          ["Grower", "Support frame and muscle while using safe forage/scavenging where appropriate", "Assuming range always provides enough protein/minerals"],
          ["Meat finishing", "Feed enough to make continued weight gain economic", "Keeping birds longer without checking extra feed cost"],
          ["Pullets entering lay", "Transition to suitable layer nutrition including calcium", "Keeping grower feed after egg production rises"],
          ["Laying females", "Balance production, forage and formulated supplementation", "Offering calcium alone without a balanced diet"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Household waste is not a complete poultry ration",
        items: [
          "Kitchen and crop residues vary in nutrients and may be spoiled, salty, contaminated or unsafe.",
          "Use only safe feed materials and keep formulated feed or a professionally designed ration as the nutritional anchor for performance birds.",
        ],
      },
      {
        kind: "checklist",
        title: "Feed quality check",
        items: [
          "Dry and free from mould or musty smell.",
          "Stored away from rain, rodents and chemicals.",
          "Correct feed phase for the flock objective.",
          "Enough feeder space that small birds can eat.",
          "Daily water available, clean and reachable.",
          "Any sudden drop in intake investigated the same day.",
        ],
      },
      {
        kind: "activity",
        title: "Separate free feed from real nutrition",
        minutes: 15,
        items: [
          "List everything birds currently obtain from the range or household.",
          "Classify each item as mainly energy, protein, mineral, unknown or unsafe.",
          "Identify which essential needs still depend on balanced commercial or formulated feed.",
        ],
      },
    ],
  },
  {
    id: 5,
    stepLabel: "Module 5 of 10",
    title: "Growth Monitoring, Sex Differences & Market Decisions",
    intro:
      "Croiler and other dual-purpose birds grow more slowly than specialised broilers, and males and females may diverge strongly in weight and future value. Weekly or fortnightly weighing helps the farmer decide which birds to sell for meat, which females to retain for eggs and whether continued feeding is still profitable.",
    quote: "A dual-purpose bird becomes valuable when you know when to keep it and when to sell it.",
    keyMessage: "Track weight and condition, then make retention and sale decisions intentionally.",
    durationMinutes: 65,
    outcomes: [
      "Use representative weighing to track growth.",
      "Separate male and female enterprise decisions where relevant.",
      "Compare extra feed cost with expected extra sale value.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Weigh instead of guessing",
        src: MEDIA.weight,
        alt: "Training image of poultry live-weight monitoring.",
        caption: "Breed targets vary, but the habit is universal: weigh a representative sample and compare trends with the supplier guide.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Decision points",
        headers: ["Question", "Evidence", "Possible action"],
        rows: [
          ["Are birds growing as expected?", "Sample weights versus supplier reference", "Check feed, health, range and competition"],
          ["Should males be sold now?", "Weight, buyer price, extra feed cost", "Sell, hold or split by market"],
          ["Which females should be retained?", "Health, frame, uniformity, market plan", "Retain suitable pullets; market unsuitable birds"],
          ["Is the flock too variable?", "Weight spread and access observations", "Separate groups or correct access where practical"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Do not apply broiler growth charts to Croilers",
        items: [
          "Specialised broilers are selected for much faster growth and different feed conversion.",
          "Judge Croilers against their own strain, farm objective and market economics.",
        ],
      },
      {
        kind: "activity",
        title: "Keep-or-sell calculation",
        minutes: 15,
        items: [
          "Estimate current sale value of one bird.",
          "Estimate extra feed and care cost to hold it for the next planned period.",
          "Estimate the likely additional sale value.",
          "Decide whether holding the bird is financially justified, while considering health and market uncertainty.",
        ],
      },
    ],
  },
  {
    id: 6,
    stepLabel: "Module 6 of 10",
    title: "Health, Vaccination, Parasites & Biosecurity",
    intro:
      "Free-range and semi-intensive birds encounter more soil, insects, wild birds and other animals than birds in tightly controlled housing. That flexibility can fit smallholder systems, but it increases exposure to parasites and infectious disease. A written vaccination and parasite-control plan is therefore essential.",
    quote: "Hardy birds still need prevention.",
    keyMessage: "Combine vaccination, biosecurity, parasite control and rapid veterinary escalation.",
    durationMinutes: 70,
    outcomes: [
      "Build a flock-specific vaccination plan with veterinary support.",
      "Recognise parasite and infectious-disease warning signs.",
      "Reduce disease transfer between age groups and farms.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Escalate health problems with evidence",
        src: MEDIA.vet,
        alt: "Training image showing a veterinary farm visit.",
        caption: "Bring mortality, feed/water, vaccination and growth records when seeking veterinary help.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Common risk groups",
        headers: ["Risk group", "Examples", "Control principle"],
        rows: [
          ["Viral/bacterial disease", "Newcastle and other locally important infections", "Vaccination where indicated, biosecurity, diagnosis"],
          ["Internal parasites", "Worm burdens and coccidial challenges", "Range/litter management and veterinarian-guided control"],
          ["External parasites", "Mites, lice and related infestations", "Inspect birds/housing and treat appropriately"],
          ["Toxins/feed spoilage", "Mould, chemicals, contaminated scraps", "Source and store feed safely; investigate sudden signs"],
          ["Predation/injury", "Dogs, snakes, raptors, theft-related injury", "Secure housing and range routines"],
        ],
      },
      {
        kind: "checklist",
        title: "Health plan controls",
        items: [
          "Record hatchery vaccinations and continue with the local veterinarian-approved schedule.",
          "Do not mix newly purchased birds directly into the flock.",
          "Clean drinkers and keep standing contaminated water away from the range.",
          "Inspect droppings, body condition, feathers, breathing and activity routinely.",
          "Record all medicines and observe withdrawal periods for meat or eggs as instructed.",
          "Escalate sudden deaths, neurological signs, severe diarrhoea or respiratory problems promptly.",
        ],
      },
      {
        kind: "activity",
        title: "Build a prevention calendar",
        minutes: 15,
        items: [
          "Write flock age and known vaccinations already given.",
          "Add locally required vaccination, review and parasite-monitoring points with veterinary guidance.",
          "Assign who buys, stores, administers and records each intervention.",
        ],
      },
    ],
  },
  {
    id: 7,
    stepLabel: "Module 7 of 10",
    title: "Managed Scavenging, Seasonal Feed Gaps & Farm Integration",
    intro:
      "One advantage of dual-purpose birds is their ability to use a mixed farm environment. The challenge is that range resources change with season, rainfall, cropping and household activity. Farmers who assume the range will always provide the same nutrition often see unexplained growth or egg-production declines.",
    quote: "The range changes with the season; the ration must respond.",
    keyMessage: "Observe what the environment is providing and increase supplementation when the range cannot meet the flock's needs.",
    durationMinutes: 65,
    outcomes: [
      "Assess forage and scavenging conditions by season.",
      "Protect gardens and crops while integrating poultry into the farm.",
      "Plan feed reserves for dry or lean periods.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Seasonal range audit",
        headers: ["Condition", "Likely effect", "Response"],
        rows: [
          ["Abundant insects/green forage", "More scavenging opportunity", "Still maintain balanced supplementation and water"],
          ["Dry season / bare ground", "Less protein and green material", "Increase planned supplementation"],
          ["Harvest period", "More grains/residues but possible mould or pesticide exposure", "Use safe materials only; protect from contamination"],
          ["Heavy rains", "Mud, parasites, wet shelter, diluted feed resources", "Improve drainage, housing and disease monitoring"],
        ],
      },
      {
        kind: "checklist",
        title: "Farm-integration rules",
        items: [
          "Do not allow poultry access to recently sprayed crops or chemical stores.",
          "Protect high-value seedlings and gardens from destructive scratching.",
          "Move feed points to avoid manure concentration in one area.",
          "Keep birds away from unsafe waste, carcasses and sewage.",
          "Store a feed buffer before predictable lean seasons.",
        ],
      },
      {
        kind: "activity",
        title: "Create a 12-month feed-risk calendar",
        minutes: 15,
        items: [
          "Mark rainy, dry, planting and harvest periods for the farm.",
          "Estimate when natural scavenging resources are strongest and weakest.",
          "Plan the months when additional purchased feed will be needed most.",
        ],
      },
    ],
  },
  {
    id: 8,
    stepLabel: "Module 8 of 10",
    title: "Keeping Females for Eggs: Point of Lay & Egg Management",
    intro:
      "When females are retained for eggs, the enterprise begins to behave more like a layer system. The flock needs suitable layer nutrition, nest access, consistent lighting, daily egg records and egg-quality control. However, production expectations must still be based on the actual dual-purpose strain rather than commercial-layer targets.",
    quote: "A Croiler hen is a dual-purpose layer, not a commercial layer in disguise.",
    keyMessage: "Manage retained females for eggs using layer principles but dual-purpose performance expectations.",
    durationMinutes: 70,
    outcomes: [
      "Prepare retained pullets for point of lay.",
      "Introduce appropriate layer nutrition and nests.",
      "Track egg output without comparing directly to specialised layers.",
    ],
    blocks: [
      {
        kind: "table",
        title: "Transition from grower to laying female",
        headers: ["Area", "Before lay", "During lay"],
        rows: [
          ["Feed", "Grower/developer appropriate to strain", "Balanced layer feed/supplementation with adequate calcium"],
          ["Housing", "Safe grower/night housing", "Add accessible clean nests and egg-handling routine"],
          ["Records", "Weight, mortality, feed", "Add eggs, rejects, feed per dozen and sales"],
          ["Market", "Decide which females to retain", "Choose household consumption, local sale, hatching or mixed use"],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Do not chase commercial-layer egg numbers",
        items: [
          "Dual-purpose females generally produce fewer eggs than specialised commercial layers.",
          "Judge performance against the supplier's strain guide and the farm's combined meat-and-egg economics.",
        ],
      },
      {
        kind: "checklist",
        title: "Egg-management basics",
        items: [
          "Provide clean, attractive nest areas before laying starts.",
          "Collect eggs frequently and separate cracked or badly dirty eggs.",
          "Record eggs daily and note changes after feed, weather, disease or management events.",
          "Maintain clean water and suitable laying nutrition.",
          "If eggs are for eating only, a rooster is not required for hens to lay.",
        ],
      },
      {
        kind: "activity",
        title: "Dual-purpose egg economics",
        minutes: 15,
        items: [
          "Record eggs produced and feed purchased for one week.",
          "Calculate feed cost per dozen eggs.",
          "Add any meat-bird sales from the same flock period and discuss why the combined enterprise may differ from a pure layer calculation.",
        ],
      },
    ],
  },
  {
    id: 9,
    stepLabel: "Module 9 of 10",
    title: "Replacement Birds, Fertile Eggs & Genetic Integrity",
    intro:
      "Farmers may want to hatch chicks from productive dual-purpose birds, but many commercial Croiler, Kuroiler and SASSO-type birds are hybrids or structured crosses. Their offspring may not reproduce the same growth or egg performance. Replacement strategy therefore needs to separate household hatching objectives from maintaining predictable commercial performance.",
    quote: "A good parent does not always produce an identical commercial hybrid.",
    keyMessage: "Know whether your birds breed true before building a replacement business around home-hatched offspring.",
    durationMinutes: 60,
    outcomes: [
      "Explain the difference between table eggs, fertile eggs and replacement genetics.",
      "Avoid promising identical performance from hybrid offspring.",
      "Plan replacement stock from a reliable genetic source when consistency matters.",
    ],
    blocks: [
      {
        kind: "callout",
        tone: "warning",
        title: "Hybrid offspring can vary",
        items: [
          "Commercial dual-purpose birds may be the result of selected parent lines or crosses.",
          "Home-hatched offspring can segregate and show more variable growth, colour, egg output and mature size than the purchased commercial chick.",
          "Ask the supplier whether the product is intended for on-farm breeding before selling offspring as equivalent replacements.",
        ],
      },
      {
        kind: "table",
        title: "Replacement options",
        headers: ["Option", "Advantage", "Risk / trade-off"],
        rows: [
          ["Buy day-old chicks from trusted hatchery", "Most predictable commercial genetics and vaccine history", "Requires cash and hatchery access"],
          ["Buy brooded growers", "Lower early-brooding risk", "Higher purchase price; still verify source"],
          ["Home hatch for household flock", "Local continuity and learning", "Performance may vary, especially from hybrid parents"],
          ["Run a breeding enterprise", "Potential chick sales", "Requires deliberate genetics, fertility, hatchery and biosecurity management"],
        ],
      },
      {
        kind: "checklist",
        title: "If producing fertile eggs",
        items: [
          "Keep clear breeding-group records and know the genetic source.",
          "Use healthy, mature breeding birds and avoid close uncontrolled inbreeding over generations.",
          "Collect clean hatching eggs and handle/store them appropriately for the chosen incubation system.",
          "Separate hatchability problems from chick-quality problems in records.",
          "Do not market variable crossbred offspring as a named commercial hybrid unless authorised and genetically accurate.",
        ],
      },
      {
        kind: "activity",
        title: "Choose a replacement policy",
        minutes: 12,
        items: [
          "Decide whether the farm needs predictable commercial replacements or only household continuity.",
          "Compare hatchery chick cost with home-hatching equipment, labour, fertility and variation risk.",
          "Write the policy the farm will follow for the next flock.",
        ],
      },
    ],
  },
  {
    id: 10,
    stepLabel: "Module 10 of 10",
    title: "Croiler Records, Marketing & Whole-Flock Profit",
    intro:
      "The advantage of a dual-purpose flock is flexibility, but flexibility makes record keeping more important. A farmer may sell males for meat, retain females for eggs, consume some birds at home and later sell spent hens. Profit can only be understood when all outputs and all major costs are captured.",
    quote: "A mixed enterprise still needs one set of numbers.",
    keyMessage: "Track meat, eggs, retained birds and costs together so every flock has a clear economic story.",
    durationMinutes: 70,
    outcomes: [
      "Build a whole-flock income and cost record.",
      "Calculate mortality, growth, egg and margin indicators.",
      "Choose sale timing using weight, price and feed economics.",
    ],
    blocks: [
      {
        kind: "figure",
        title: "Market timing is part of production",
        src: MEDIA.market,
        alt: "Training image of poultry market readiness and weighing.",
        caption: "Use actual weight, buyer preference, feed cost and market price to decide when a meat bird is ready to sell.",
        source: "SmartVet Africa training illustration library",
      },
      {
        kind: "table",
        title: "Whole-flock scorecard",
        headers: ["Area", "Record", "Business use"],
        rows: [
          ["Survival", "Chicks started, deaths, birds present", "Shows biological losses"],
          ["Meat birds", "Birds sold, live weight, price", "Measures meat revenue and timing"],
          ["Retained females", "Pullets retained and later laying", "Tracks future egg-producing asset"],
          ["Eggs", "Total, saleable, household use, sold", "Captures ongoing value"],
          ["Feed", "Purchased and used by stage", "Shows largest controllable cash cost"],
          ["Other costs", "Health, labour, transport, housing, energy", "Prevents false profit calculations"],
        ],
      },
      {
        kind: "checklist",
        title: "Monthly enterprise review",
        items: [
          "Reconcile birds alive, sold, consumed, retained and dead.",
          "Record current sample weight for meat groups.",
          "Record eggs and egg sales for laying females.",
          "Reconcile feed purchases and remaining stock.",
          "Calculate revenue received and variable costs paid.",
          "Choose the next sale, retention or feed decision from the evidence.",
        ],
      },
      {
        kind: "activity",
        title: "Whole-flock profit map",
        minutes: 20,
        items: [
          "List every output from the flock: meat sales, eggs, birds retained, household consumption and manure if monetised.",
          "List major cash costs: chicks, feed, health, labour, transport and housing inputs.",
          "Separate realised cash income from the value of birds still held.",
          "Write the one management change most likely to improve the next flock's margin.",
        ],
      },
    ],
  },
];

export const layerCourse: Course = {
  id: "layers-foundations",
  title: "Layer Production",
  tagline: "From pullet development to egg quality, flock health, and layer economics — the full production cycle in one course.",
  description:
    "From pullet development to egg quality, flock health, and layer economics — the full production cycle in one course.",
  level: "Foundation",
  hours: 11.5,
  audience: "Layer farmers, pullet growers, farm staff, and poultry trainers in Uganda",
  status: "live",
  modules: layerModules,
};

export const croilerCourse: Course = {
  id: "croiler-production",
  title: "Kroiler & Dual-Purpose",
  tagline: "From brooding to market weight — built for Kuroiler, SASSO, and other dual-purpose poultry systems.",
  description:
    "From brooding to market weight — built for Kuroiler, SASSO, and other dual-purpose poultry systems.",
  level: "Foundation",
  hours: 11.25,
  audience: "Smallholder dual-purpose poultry farmers, field trainers, and brooder operators in Uganda",
  status: "live",
  modules: croilerModules,
};
