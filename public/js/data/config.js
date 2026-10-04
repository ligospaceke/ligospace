// js/data/config.js
export const STATUS={operational:'Operational',developing:'Developing',future:'Future initiative',approval:'Subject to registration / approval'};
export const INITIATIVES=[
 {n:'Community Outreach',s:'operational'},{n:'Youth Mentorship',s:'operational'},{n:'Talent & Creativity',s:'operational'},
 {n:'Digital Library',s:'developing'},{n:'AI Learning Assistant',s:'developing'},{n:'Opportunity Circle',s:'developing'},
 {n:'L.I.G.O. Vocational Training Center',s:'future',r:'Subject to applicable TVET registration and licensing (TVETA).'},
 {n:'L.I.G.O. SACCO',s:'future',r:'Not operational. Subject to registration and authorization (SASRA). No deposits or financial products are offered.'},
 {n:'L.I.G.O. University',s:'future',r:'Long-term vision only. Subject to higher-education requirements and accreditation (CUE).'},
 {n:'L.I.G.O. App',s:'future'},{n:'L.I.G.O. Academy',s:'future'},{n:'Innovation & Incubation Centers',s:'future'}
];
export const SHS=[['Body','Physical wellbeing, energy, health, habits.'],['Mind','Thoughts, learning, reasoning, decisions.'],['Emotion / Heart','Emotional awareness and regulation.'],['Identity / Self','Personal value, strengths, story.'],['Relational / Social','Family, friendship, belonging.'],['Purpose','Meaning, direction, contribution.']];
export const OPP_TYPES=['Jobs','Training','Scholarships','Mentorship','Volunteering','Fellowships','Partnerships','Entrepreneurship','Community'];
export const INDICATORS=[['reached','People reached',0],['youth','Youth engaged'],['schools','Schools / institutions engaged'],['volunteers','Volunteers mobilized'],['mentors','Mentors / professionals onboarded'],['sessions','Training sessions delivered'],['initiatives','Community initiatives conducted'],['academic','Academic / technical collaborators'],['partners','Strategic partners'],['connections','Employment / opportunity connections']].map(([k,l])=>({k,l,target:0,achieved:0,verified:0}));
export const EVIDENCE=['Program','Date','Location','Partner','Activity','Outcome','Photos / documentation','Verification / report'];

/* Funnel config: one generic form renders every pathway from this schema */
export const T='text',E='email',TA='textarea';
export const base=[['name','Full name',T],['email','Email',E],['phone','Phone (optional)',T]];
export const org=[['org','Organization',T],['role','Your role',T]];
export const PATHWAYS={
 partner:{label:'Partner with us',items:[
  ['academic','Academic / Research Partner','Research, validation and academic engagement.',[...org,['interest','Research area or interest',TA]]],
  ['corporate','Corporate / Institutional Partner','Bring your organization\u2019s capacity and expertise.',[...org,['offer','What could you contribute?',TA]]],
  ['sponsor','Sponsor / Donor','Support approved initiatives.',[['org','Organization (if any)',T],['support','Type of support',['Financial','In-kind','Not sure yet']],['note','Anything we should know?',TA]]],
  ['international','International Partner','Collaborate across borders.',[...org,['country','Country',T],['offer','Collaboration idea',TA]]],
  ['community','Community / Strategic Partner','Work with us on local and strategic goals.',[...org,['offer','How could we work together?',TA]]],
  ['tech','Technology / Innovation Partner','Technology, tools and innovation.',[...org,['offer','Technology or expertise offered',TA]]],
  ['school','School / Education Partner','Schools and learning institutions.',[['org','School / institution',T],['level','Level',['Primary','Secondary / SHS','TVET / College','University']],['interest','What are you looking for?',TA]]],
  ['expert','Professional / Expert Partner','Share specialist knowledge.',[['field','Field of expertise',T],['offer','How would you like to contribute?',TA]]]]},
 involve:{label:'Get involved',items:[
  ['volunteer','Volunteer','Give your time, skills and experience.',[['area','Area of interest',T],['avail','Availability',['Weekdays','Weekends','Flexible']]]],
  ['youth','Youth Participant','Join mentorship and programs.',[['age','Age',T],['interest','What would you like to learn or build?',TA]]],
  ['founding','Founding Member','Help establish the institution.',[['why','Why would you like to join?',TA]]],
  ['mentor','Mentor','Share what you know.',[['field','Field / experience',T],['avail','Availability',['Weekly','Monthly','Occasionally']]]],
  ['skills','Professional / Skills Contributor','Contribute professional skills.',[['skill','Your skill',T],['offer','How would you like to help?',TA]]],
  ['opportunity','Opportunity / Employment Connection','Submit a job, training, scholarship or other opportunity.',[['org','Organization',T],['type','Opportunity type',OPP_TYPES],['detail','Describe the opportunity',TA]]],
  ['participant','Community Participant','Be part of the wider community.',[['loc','Where are you based?',T],['interest','What interests you?',TA]]]]}
};
export const NEXT=['We receive your submission and send a confirmation.','Our team reviews it within a few working days.','We contact you about the next step that fits you.'];
