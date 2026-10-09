// js/data/content.js  (copy for the secondary pages; edit here, no code changes needed)
export const INFO={
 work:{t:'Our Work',intro:'Practical programs that connect people with knowledge, skills, relationships and opportunity.',groups:[
  ['Youth & Young People',['Mentorship','Leadership','Life skills','Career exposure','Entrepreneurship','Technology','Talent development','Community service']],
  ['Children & Vulnerable Communities',['Dignity-centered support','Opportunity','Education','Inclusion','Community support']],
  ['Education & Human Development',['Educational resources','Human-development learning','Personal development','Purpose and life-direction programs']],
  ['Talent & Creativity',['Music','Art','Fashion','Design','Performance','Sports','Digital creativity','Innovation']],
  ['Families & Relationships',['Communication','Connection','Family strengthening','Relationship education']],
  ['Livelihoods & Employment',['Employment pathways','Apprenticeships','Internships','Skills development','Green and digital opportunities','Enterprise development']],
  ['Wellness Mentorship',['Women\u2019s wellness mentorship','Men\u2019s wellness mentorship','Peer support and life-skills guidance, not medical treatment']]]},
 education:{t:'Education ecosystem',intro:'A long-term vision, always shown by its real status. Regulated qualifications are offered only after the relevant registration, licensing and accreditation.',groups:[
  ['Learning Centers',['Digital literacy','Life skills','Leadership','Community learning'],'future'],
  ['Skills & Vocational Training Centers',['Electrical, construction, fashion, agriculture, digital skills and more','Subject to applicable TVET registration and licensing'],'approval'],
  ['Innovation & Incubation Centers',['Business incubation','Mentorship','Prototyping','Investor and partner connections'],'future'],
  ['Research & Knowledge Centers',['Human development research','Publications','Academic collaboration'],'future'],
  ['L.I.G.O. Academy',['Leadership, human development, entrepreneurship, technology','Legal and educational status determined before any regulated qualification'],'future'],
  ['L.I.G.O. University',['Long-term vision only, not an existing university','Subject to higher-education requirements and accreditation'],'approval']]},
 partners:{t:'Partners',intro:'We cannot build alone. Bring your expertise, technology, network, resources, knowledge, opportunity and experience.',groups:[
  ['Who we welcome',['Universities and schools','Corporations, banks and technology companies','Foundations, NGOs and philanthropists','Government and international organizations','Local businesses and entrepreneurs','Researchers and professionals']]],cta:['/engage/partner','Partner with us']},
 stories:{t:'Stories & impact',intro:'Real people. Real journeys. Real opportunity.',groups:[['Our promise',['Stories preserve dignity.','We share a story only with informed consent.','Impact numbers are linked to documented activities.']]],cta:['/impact','See the impact baseline']},
 events:{t:'Events',intro:'Every event keeps its date, location, purpose, registration, photos and outcomes. Past events stay archived.',groups:[['Official launch: 5 December 2026',['The official L.I.G.O. SPACE launch','Bringing together community, leadership, academia, partners, young people and supporters','Event details and registration will be published here']]],cta:['/engage/involve','Get involved']},
 contact:{t:'Let\u2019s build together',intro:'Reach L.I.G.O. SPACE directly.',groups:[['Contact',['Phone: 0182809790','Email: ligospace.ke@gmail.com','Base: Kajiado South, Kenya','Founder & President: Samuel M.K. (his details are on the Founder page)']],['Social',['TikTok','Facebook','Instagram','YouTube','LinkedIn']]]}
};
export const SLIDES=[
 {tag:'Humanity First',a:'Humanity first. ',b:'Every life',c:' matters.',p:'A human-centered institution building pathways of dignity, opportunity, connection and purposeful living.',btns:[['/about','Discover L.I.G.O. SPACE'],['/engage/partner','Partner with us']]},
 {tag:'The Opportunity Circle',a:'Connecting people with ',b:'opportunity',c:'',p:'Jobs, training, scholarships, mentorship and more: a growing network from potential to opportunity.',btns:[['/opportunities','Explore opportunities'],['/engage/involve','Get involved']]},
 {tag:'Official launch',a:'The journey begins on ',b:'5 December 2026',c:'',p:'Community, leadership, academia, partners and young people coming together.',btns:[['/events','Event details'],['/engage/involve','Register interest']]}];
export const PROGRAMS=[['Youth & Young People','Mentorship, leadership, life skills, technology and career exposure.'],['Children & Vulnerable Communities','Dignity-centered support, education and inclusion.'],['Education & Human Development','Learning resources and purpose-and-direction programs.'],['Talent & Creativity','Music, art, fashion, design, sports and digital creativity.'],['Families & Relationships','Communication, connection and family strengthening.'],['Livelihoods & Employment','Skills, apprenticeships, internships and enterprise.'],['Women\u2019s Wellness Mentorship','Mentorship circles and guidance for women\u2019s wellbeing, confidence and personal growth.'],['Men\u2019s Wellness Mentorship','Mentorship and peer support for men\u2019s wellbeing, purpose and personal growth.']];
export const NOTICES={'womens-wellness-mentorship':'Wellness mentorship is peer and life-skills support. It is not medical treatment or therapy. For medical or mental-health emergencies, contact a qualified professional or emergency services.','mens-wellness-mentorship':'Wellness mentorship is peer and life-skills support. It is not medical treatment or therapy. For medical or mental-health emergencies, contact a qualified professional or emergency services.'};
export const SERVE=[['Youth & young people','/engage/involve/youth'],['Children & vulnerable communities','/work'],['Families','/work'],['Talent & creatives','/work'],['Job-seekers & entrepreneurs','/opportunities'],['Communities','/engage/involve/participant']];
export const PARTNER_WITH=[['Schools','/engage/partner/school'],['Universities & researchers','/engage/partner/academic'],['Corporations & institutions','/engage/partner/corporate'],['Donors & foundations','/engage/partner/sponsor'],['International organizations','/engage/partner/international'],['Technology companies','/engage/partner/tech'],['Professionals & experts','/engage/partner/expert'],['Community organizations','/engage/partner/community']];
export const GEO=[['Our roots','Kajiado South'],['National','Kenya'],['Continental','Africa'],['Global','Global ecosystem']];
export const slug=t=>t.toLowerCase().replace(/['\u2019]/g,'').replace(/&/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const RESTRICTED=['children-vulnerable-communities'];
export const progName=s=>(PROGRAMS.find(p=>slug(p[0])===s)||[s])[0];

/* ---- Talent & Opportunities (the main agenda) ---- */
export const OPP_KINDS=[['jobs','Jobs'],['training','Training'],['scholarships','Scholarships'],['mentorship','Mentorship'],['volunteering','Volunteering'],['fellowships','Fellowships'],['partnerships','Partnerships'],['entrepreneurship','Entrepreneurship'],['community','Community']];
export const kindName=k=>(OPP_KINDS.find(x=>x[0]===k)||[k,''])[1];
export const AVAIL=[['weekdays','Weekdays'],['weekends','Weekends'],['flexible','Flexible']];
export const MOBILITY=[['local','I can travel locally'],['regional','I can travel across Kenya'],['remote','Remote only'],['none','I cannot travel right now']];
export const PROMISE='We don’t just connect people to opportunities. We help make the opportunity reachable.';
export const HOW=[['Match','Tell us your interest, skills, goals, location and availability. We find the closest opportunities and people.'],['Prepare','Get what you need: a profile people can trust, a short pitch, documents and skills.'],['Connect','L.I.G.O. SPACE introduces you to the right person or organization.'],['Mobilize','We help with the real gaps: transport, data, tools, a mentor.'],['Follow through','We stay with you from first contact to the outcome.'],['Measure impact','Every outcome is documented, so what we report is true.']];
export const PREPARE={jobs:['Update your profile and add a photo','Write 3 lines on what you can do','Have your ID and certificates ready','Prepare a short CV'],training:['Check dates and where it takes place','Plan transport and data','Tell us what you want to learn'],scholarships:['Gather results and recommendation letters','Check the deadline and documents','Write a short personal statement'],mentorship:['Decide what you want to learn','Pick a time you can keep','Prepare 2 questions'],volunteering:['Check the dates and your availability','Tell us your skills','Plan how you will get there'],fellowships:['Gather your documents and referees','Write what you want to achieve','Check the deadline'],partnerships:['Write what you offer in 3 lines','Have a link to your work','Choose who should speak for you'],entrepreneurship:['Describe your product or idea simply','Have a price and a first customer in mind','Add photos or a link'],community:['Say what you can contribute','Check the time and place','Bring a friend']};
export const MENU=[
 ['Who we are',[['About','/about'],['Founder','/founder'],['Synchronized Human System','/shs'],['Future initiatives','/future']]],
 ['What we do',[['Our work','/work'],['Education','/education']]],
 ['Talent & Opportunities',[['Find opportunities','/match'],['Opportunities','/opportunities'],['Talent & team','/team'],['Showcase','/showcase']]],
 ['Join us',[['Get involved','/engage/involve'],['Partner with us','/engage/partner'],['Who we partner with','/partners']]],
 ['Stories & Impact',[['Stories','/stories'],['Events','/events'],['Impact','/impact'],['Contact','/contact']]]];
export const MANIFESTO=[['What we believe','Every person carries value, potential and purpose. Most are not lost; many are simply unsynchronized. Opportunity needs access, a pathway and someone who walks it with you.'],['What we do','We make talent visible and opportunity reachable: we match, prepare, connect and mobilize, then follow through and measure the impact.'],['What we will not do','We will not invent numbers, expose children or vulnerable people, or promise what we have not yet been authorized to offer.']];

// Header menu: four groups only. MENU (above) still lists every page for the site map.
export const NAVMENU=[
 ['Who we are',[['About us','/about'],['Our work','/work'],['Education','/education'],['Founder','/founder'],['Synchronized Human System','/shs'],['Future initiatives','/future']]],
 ['Talent & Opportunities',[['Find opportunities','/match'],['Opportunities','/opportunities'],['Talent & team','/team'],['Showcase','/showcase']]],
 ['Join us',[['Get involved','/engage/involve'],['Partner with us','/engage/partner'],['Who we partner with','/partners']]],
 ['Stories & Impact',[['Stories','/stories'],['Events','/events'],['Impact','/impact'],['Contact','/contact']]]];
export const KAELEN='https://lord-kaelen.kaelentechnologies.workers.dev/#/';
