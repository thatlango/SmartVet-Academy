BEGIN;

ALTER TABLE learner_profiles
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

DO $$ BEGIN
  ALTER TABLE learner_profiles
    ADD CONSTRAINT learner_profiles_status_check
    CHECK (status IN ('active','suspended'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS academy_admins (
  core_user_id uuid PRIMARY KEY REFERENCES learner_profiles(core_user_id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('owner','admin','assessor','support')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  core_user_id uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE CASCADE,
  course_id text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','withdrawn')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  managed_by uuid REFERENCES learner_profiles(core_user_id) ON DELETE SET NULL,
  PRIMARY KEY (core_user_id, course_id)
);

CREATE INDEX IF NOT EXISTS course_enrollments_course_status_idx
  ON course_enrollments(course_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  position integer NOT NULL CHECK (position > 0),
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, position)
);

CREATE INDEX IF NOT EXISTS assessment_questions_course_idx
  ON assessment_questions(course_id, published, position);

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_by uuid REFERENCES learner_profiles(core_user_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS revocation_reason text;

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id bigserial PRIMARY KEY,
  actor_core_user_id uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE RESTRICT,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx
  ON admin_audit_log(created_at DESC);

INSERT INTO assessment_questions(course_id, position, question_text, options, correct_index, published)
VALUES
('broiler-foundations', 1, 'At what temperature, measured at chick level, must the house be stable before chicks arrive?', '["28°C","30°C","33°C","36°C"]'::jsonb, 2, true),
('broiler-foundations', 2, 'How long must the house dry after white lime treatment before litter is added?', '["3 hours","1 day","At least 3 full days","7 days"]'::jsonb, 2, true),
('broiler-foundations', 3, 'How deep should fresh litter be, using the hand check?', '["Fingertip deep (about 2 cm)","Reaching your wrist, about 6 cm","Up to your elbow","Depth does not matter if it is dry"]'::jsonb, 1, true),
('broiler-foundations', 4, 'What must be ready before the chick box is opened?', '["Only the heat source","Drinkers with glucose water and starter feed on trays or paper","The record sheet only","Vaccines"]'::jsonb, 1, true),
('broiler-foundations', 5, 'Glucose water is given for how long after arrival?', '["First 6–8 hours only","First 24 hours","First 3 days","First 14 days"]'::jsonb, 0, true),
('broiler-foundations', 6, 'On which day is the paper removed from under the feeders?', '["Day 1","Day 3","Day 7","Day 14"]'::jsonb, 1, true),
('broiler-foundations', 7, 'Chicks move to the edges of the house, pant and spread their wings. What does this mean?', '["Too cold","Just right","Too hot — above 36°C","They are hungry"]'::jsonb, 2, true),
('broiler-foundations', 8, 'What is the target crop fill at 2 hours after placement?', '["50% full","70% full","80% full","95% full"]'::jsonb, 2, true),
('broiler-foundations', 9, 'A squishy, floppy crop means the chick has:', '["Feed and water","Water only — it is hungry","Feed only — it is dehydrated","Nothing at all"]'::jsonb, 1, true),
('broiler-foundations', 10, 'How many birds should you weigh each week, and how should they be chosen?', '["10 of the biggest birds","50 birds chosen at random from across the house","All birds in the house","5 birds near the door"]'::jsonb, 1, true),
('broiler-foundations', 11, 'The Cobb500 target average weight at Day 7 is:', '["~100 g","~200 g","~528 g","~1,042 g"]'::jsonb, 1, true),
('broiler-foundations', 12, 'Your birds are 20% below target weight. What should you do?', '["Wait another week","Only change the feed brand","Arrange a full farm assessment with your SmartVet vet urgently","Sell the birds immediately"]'::jsonb, 2, true),
('broiler-foundations', 13, 'When should dead birds be counted and recorded?', '["Every morning before 8 am","Every evening","Weekly","Only when unusual"]'::jsonb, 0, true),
('broiler-foundations', 14, 'More than 1% of birds die in one day. What is the correct action?', '["Record it and wait a week","Call SmartVet now — possible disease outbreak","Reduce feed","Increase the temperature"]'::jsonb, 1, true),
('broiler-foundations', 15, 'An excellent FCR for Cobb500 by Day 42 is:', '["Under 1.65","1.65–1.75","Above 1.75","Above 2.00"]'::jsonb, 0, true),
('broiler-foundations', 16, 'If your eyes sting when you enter the house, what should you do?', '["Nothing — it is normal","Open curtains, replace wet litter and check for drinker leaks the same day","Add more litter next batch","Reduce the number of birds"]'::jsonb, 1, true),
('layers-foundations', 1, 'Before lay, which evidence best shows whether a pullet flock is developing together?', '["Egg price","Body weight and uniformity","Nest colour","Age alone"]'::jsonb, 1, true),
('layers-foundations', 2, 'Why is a poor first week especially costly in layers?', '["It creates long-term flock variation","It makes eggs hatch immediately","It eliminates the grower phase","It increases house size"]'::jsonb, 0, true),
('layers-foundations', 3, 'What does flock uniformity help reveal?', '["How many birds are near a common weight","Only the average egg price","The vaccine brand","The weather forecast"]'::jsonb, 0, true),
('layers-foundations', 4, 'Strong ammonia smell in a layer house should trigger:', '["More sealing","Ventilation and moisture/manure correction","Less water access","No action"]'::jsonb, 1, true),
('layers-foundations', 5, 'Lighting changes before point of lay should be based on:', '["Age alone","Body weight, uniformity and strain guide","Egg tray price","Farm gate colour"]'::jsonb, 1, true),
('layers-foundations', 6, 'Which statement about calcium is correct?', '["It is the only nutrient needed","It matters together with overall diet and intake","It is unnecessary in lay","Unlimited calcium fixes all shell defects"]'::jsonb, 1, true),
('layers-foundations', 7, 'Hen-day production is:', '["Eggs ÷ hens present × 100","Feed ÷ eggs","Hens ÷ eggs × 100","Egg weight ÷ bird age"]'::jsonb, 0, true),
('layers-foundations', 8, 'A sudden production drop should first lead to:', '["Several random changes","A structured check of feed, water, heat, light, health and records","Immediate flock sale","Stopping records"]'::jsonb, 1, true),
('layers-foundations', 9, 'Why record cracked and dirty eggs separately?', '["They point to different causes","They are always identical problems","They do not affect revenue","Only cracked eggs matter"]'::jsonb, 0, true),
('layers-foundations', 10, 'A good vaccination plan is based on:', '["Any online schedule","Hatchery history, flock risk and veterinary guidance","Bird colour","Feed price"]'::jsonb, 1, true),
('layers-foundations', 11, 'Which measure links feed directly to saleable egg output?', '["Feed per dozen saleable eggs","House height","Bird age only","Number of staff"]'::jsonb, 0, true),
('layers-foundations', 12, 'What should trigger investigation during pullet rearing?', '["A sudden slowdown in weekly weight gain","A clean feed store","Stable water supply","Good uniformity"]'::jsonb, 0, true),
('layers-foundations', 13, 'Floor eggs can be reduced by:', '["Preparing accessible nests and collecting floor eggs frequently","Closing all nests","Reducing all light to zero","Withholding water"]'::jsonb, 0, true),
('layers-foundations', 14, 'If shell quality deteriorates, the farmer should review:', '["Diet/intake, heat, health and age","Only tray colour","Only rooster numbers","Only building paint"]'::jsonb, 0, true),
('layers-foundations', 15, 'Why should feed-phase changes use body weight as well as age?', '["Birds may develop faster or slower than the calendar","Age has no meaning at all","Feed has no effect on growth","All strains are identical"]'::jsonb, 0, true),
('layers-foundations', 16, 'End-of-lay timing should primarily consider:', '["Whether any hen still lays at all","Expected revenue versus continuing costs and replacement timing","Feather colour","The farmer''s birthday"]'::jsonb, 1, true),
('croiler-production', 1, 'What should be decided first for a dual-purpose flock?', '["Production objective and market","Feather colour","Broiler target weight","Nothing"]'::jsonb, 0, true),
('croiler-production', 2, 'Why do Croiler chicks need good starter feed?', '["Early nutrient needs cannot be reliably met by scavenging alone","They never forage","Starter prevents every disease","Water is enough"]'::jsonb, 0, true),
('croiler-production', 3, 'Managed free range means:', '["No housing","Foraging plus controlled housing, feed, water and risk management","No records","Unlimited roaming"]'::jsonb, 1, true),
('croiler-production', 4, 'Scavenging resources should be treated as:', '["Always complete feed","A variable contribution that may need supplementation","A water replacement","A vaccine"]'::jsonb, 1, true),
('croiler-production', 5, 'Why should Croiler weights not be judged by broiler charts?', '["Different genetics and growth objectives","Weight is irrelevant","They are identical birds","Croilers cannot be weighed"]'::jsonb, 0, true),
('croiler-production', 6, 'Free-range parasite risk can increase because of:', '["More environmental contact","Less soil contact","No insects","No manure"]'::jsonb, 0, true),
('croiler-production', 7, 'Why plan extra supplementation for some seasons?', '["Range resources change during the year","Birds stop eating in rain","Water becomes feed","Feed quality never changes"]'::jsonb, 0, true),
('croiler-production', 8, 'Do hens need a rooster to lay table eggs?', '["Yes","No","Only in the dry season","Only after 30 weeks"]'::jsonb, 1, true),
('croiler-production', 9, 'Why can offspring of commercial hybrids vary?', '["Genetics segregate in the next generation","Eggs contain no genes","All offspring are clones","Only weather matters"]'::jsonb, 0, true),
('croiler-production', 10, 'A whole-flock Croiler profit review should include:', '["Only egg sales","Meat, eggs, retained birds and major costs","Only chick price","Only mortality"]'::jsonb, 1, true),
('croiler-production', 11, 'If birds are held longer for meat, the farmer should compare:', '["Extra feed cost with expected extra sale value","Only feather length","Only calendar age","Only house size"]'::jsonb, 0, true),
('croiler-production', 12, 'A sudden mortality increase should lead to:', '["Prompt investigation and veterinary escalation","No action","Stopping water","Selling all birds without assessment"]'::jsonb, 0, true),
('croiler-production', 13, 'If females are retained for eggs, feeding should:', '["Transition toward suitable layer nutrition at the right stage","Remain chick starter forever","Stop completely","Use only limestone"]'::jsonb, 0, true),
('croiler-production', 14, 'Which statement about Kuroiler/SASSO-type birds is safest?', '["All strains share identical targets","Use the actual supplier''s strain targets","They should meet Cobb broiler targets","They never lay eggs"]'::jsonb, 1, true),
('croiler-production', 15, 'Why secure birds before dark?', '["Predator and theft risk often rises when birds roost","To stop them drinking forever","To reduce all ventilation","To remove feed records"]'::jsonb, 0, true),
('croiler-production', 16, 'What is the strongest reason to keep daily records in a dual-purpose system?', '["Multiple outputs and costs must be reconciled","The birds cannot be observed","Feed price never changes","It eliminates disease"]'::jsonb, 0, true)
ON CONFLICT (course_id, position) DO NOTHING;

COMMIT;
