// Rule-based Symptom Analysis Engine — works completely offline, no API key needed.

export type TriageLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AnalysisResult {
    symptoms_en: string;
    analysis: string;
    triage_level: TriageLevel;
    risk_factors: string[];
    recommended_actions: string[];
    suggested_specialty: string;
    possible_conditions: string[];
    recommended_action_summary: string;
    eligible_schemes: { name: string; description: string }[];
    // New fields for dynamic risk assessment
    age_group?: 'Child' | 'Adult' | 'Elderly' | 'Unknown';
    pregnancy_status?: string;
    parsed_symptoms?: { symptom: string; duration: string }[];
}

// ── Keyword mappings (English + Hindi/regional transliterations) ──

interface SymptomDef {
    keywords: string[];
    severity: number; // 1-4: 1=low, 2=medium, 3=high, 4=critical
    conditions: string[];
    specialty: string;
    riskFactors: string[];
    actions: string[];
}

const SYMPTOM_DATABASE: SymptomDef[] = [
    // ── FEVER ──
    {
        keywords: ['fever', 'bukhar', 'bukhaar', 'tez bukhar', 'high fever', 'temperature', 'taap', 'jwara', 'kaichal', 'ताप', 'बुखार', 'तेज बुखार', 'ज्वर', 'तापमान', 'ताप आहे', 'ताप येतो', 'ताप आला', 'ताप आलाय'],
        severity: 2,
        conditions: ['Viral Fever', 'Malaria', 'Dengue', 'Typhoid', 'Influenza'],
        specialty: 'General Medicine / Internal Medicine',
        riskFactors: ['Dehydration risk', 'Risk of febrile seizures in children', 'Could indicate underlying infection'],
        actions: ['Monitor temperature regularly', 'Give paracetamol for fever above 100°F', 'Ensure adequate fluid intake', 'Apply cold compress on forehead', 'If fever persists beyond 3 days, refer to PHC'],
    },
    // ── COUGH / RESPIRATORY ──
    {
        keywords: ['cough', 'khansi', 'khaansi', 'dry cough', 'wet cough', 'sookhi khansi', 'balgam', 'phlegm', 'sputum', 'खांसी', 'खोकला', 'कोरडा खोकला', 'बलगम', 'कफ', 'सूखी खांसी', 'खोकला येतो', 'खोकला आहे'],
        severity: 2,
        conditions: ['Upper Respiratory Infection', 'Bronchitis', 'Pneumonia', 'Tuberculosis', 'Asthma'],
        specialty: 'Pulmonology / General Medicine',
        riskFactors: ['May indicate lower respiratory infection', 'TB risk if cough persists > 2 weeks', 'Risk of pneumonia in elderly/children'],
        actions: ['Encourage warm fluids and steam inhalation', 'If cough > 2 weeks, get sputum test for TB', 'Monitor for blood in sputum', 'Refer to PHC if associated with breathlessness'],
    },
    // ── BREATHING DIFFICULTY ──
    {
        keywords: ['breathless', 'breathing', 'saans', 'sans', 'saans lene', 'dyspnea', 'difficulty breathing', 'saans phoolna', 'dam', 'breath problem', 'श्वास', 'सांस', 'दम', 'श्वास घेण्यास त्रास', 'सांस लेने में तकलीफ', 'दम लागणे', 'श्वास लागणे'],
        severity: 3,
        conditions: ['Asthma', 'Pneumonia', 'COPD', 'Heart Failure', 'Severe Allergic Reaction', 'COVID-19'],
        specialty: 'Pulmonology / Emergency Medicine',
        riskFactors: ['Oxygen deprivation risk', 'Possible cardiac involvement', 'Could indicate severe respiratory infection', 'Risk of respiratory failure'],
        actions: ['Keep patient in sitting/semi-upright position', 'Ensure adequate ventilation', 'Check oxygen saturation if oximeter available', 'URGENT: Refer to nearest hospital immediately', 'Do NOT delay transport'],
    },
    // ── CHEST PAIN ──
    {
        keywords: ['chest pain', 'seene mein dard', 'chhati', 'chest', 'heart pain', 'dil ka dard', 'angina', 'छाती', 'छातीत दुखणे', 'सीने में दर्द', 'छातीत दुखतंय', 'दिल का दर्द', 'हृदय'],
        severity: 4,
        conditions: ['Myocardial Infarction (Heart Attack)', 'Angina', 'Pericarditis', 'Pulmonary Embolism', 'GERD'],
        specialty: 'Cardiology / Emergency Medicine',
        riskFactors: ['Potential cardiac emergency', 'Risk of sudden cardiac arrest', 'Time-critical treatment needed'],
        actions: ['EMERGENCY: Call ambulance immediately', 'Keep patient calm and seated', 'Loosen tight clothing', 'Give aspirin if available and not allergic', 'Do NOT let patient walk or exert'],
    },
    // ── HEADACHE ──
    {
        keywords: ['headache', 'sir dard', 'sar dard', 'sir mein dard', 'migraine', 'head pain', 'डोकेदुखी', 'सिरदर्द', 'सर दर्द', 'डोके दुखतंय', 'डोकं दुखतंय', 'माइग्रेन', 'डोकं', 'डोके', 'डोकं दुखत'],
        severity: 1,
        conditions: ['Tension Headache', 'Migraine', 'Sinusitis', 'Hypertension', 'Dehydration'],
        specialty: 'General Medicine / Neurology',
        riskFactors: ['Could indicate high blood pressure', 'Persistent headache may need neurological evaluation'],
        actions: ['Rest in a quiet, dark room', 'Give paracetamol for pain relief', 'Check blood pressure if equipment available', 'Ensure adequate hydration', 'If severe or recurring, refer to PHC'],
    },
    // ── DIARRHEA / LOOSE MOTIONS ──
    {
        keywords: ['diarrhea', 'diarrhoea', 'loose motion', 'loose motions', 'dast', 'ulti dast', 'pet kharab', 'watery stool', 'potty', 'जुलाब', 'दस्त', 'पेट खराब', 'पातळ शौच', 'हगवण', 'संडास लागणे'],
        severity: 2,
        conditions: ['Gastroenteritis', 'Cholera', 'Food Poisoning', 'Dysentery', 'Intestinal Infection'],
        specialty: 'General Medicine / Gastroenterology',
        riskFactors: ['High risk of dehydration especially in children/elderly', 'Electrolyte imbalance', 'Could indicate cholera in endemic areas'],
        actions: ['Start ORS (Oral Rehydration Solution) immediately', 'Give zinc tablets to children < 5 years', 'Continue breastfeeding in infants', 'Monitor urine output for dehydration', 'If blood in stool or severe dehydration, refer to hospital urgently'],
    },
    // ── VOMITING ──
    {
        keywords: ['vomiting', 'vomit', 'ulti', 'nausea', 'ji machlana', 'ji matlana', 'matli', 'उलटी', 'उल्टी', 'मळमळ', 'ओकारी', 'मतली', 'उलटी होणे', 'उलटी येणे'],
        severity: 2,
        conditions: ['Gastritis', 'Food Poisoning', 'Pregnancy (Morning Sickness)', 'Gastroenteritis', 'Intestinal Obstruction'],
        specialty: 'General Medicine / Gastroenterology',
        riskFactors: ['Dehydration risk', 'Aspiration risk if unconscious', 'Could indicate pregnancy complication'],
        actions: ['Small sips of ORS or clean water', 'Avoid solid food until vomiting subsides', 'Turn patient on side if drowsy to prevent choking', 'If persistent > 24 hrs or blood in vomit, refer to hospital'],
    },
    // ── STOMACH / ABDOMINAL PAIN ──
    {
        keywords: ['stomach pain', 'pet dard', 'pet mein dard', 'abdominal', 'belly pain', 'pait dard', 'cramps', 'पोटदुखी', 'पेट दर्द', 'पोट दुखतंय', 'पोटात दुखतंय', 'पेट में दर्द', 'पोट', 'पोटात', 'पोट दुखत'],
        severity: 2,
        conditions: ['Gastritis', 'Appendicitis', 'Peptic Ulcer', 'Kidney Stones', 'Intestinal Obstruction'],
        specialty: 'General Medicine / Surgery',
        riskFactors: ['Appendicitis risk if pain in lower right abdomen', 'Could indicate surgical emergency', 'Kidney stone if pain radiates to back/groin'],
        actions: ['Do not give heavy food', 'Monitor pain location and intensity', 'If severe/sudden or with vomiting, refer to hospital', 'Check for tenderness and rigidity'],
    },
    // ── PREGNANCY RELATED ──
    {
        keywords: ['pregnant', 'pregnancy', 'garbhvati', 'garbh', 'pet se', 'delivery', 'labor', 'labour', 'prasav', 'bleeding pregnancy', 'spotting', 'गरोदर', 'गर्भवती', 'प्रसव', 'डिलिव्हरी', 'गर्भ', 'पेट से'],
        severity: 3,
        conditions: ['Normal Pregnancy', 'Ectopic Pregnancy', 'Pre-eclampsia', 'Threatened Abortion', 'Gestational Diabetes'],
        specialty: 'Obstetrics & Gynecology',
        riskFactors: ['High risk pregnancy indicators', 'Bleeding in pregnancy is always concerning', 'Pre-eclampsia risk with high BP'],
        actions: ['Check blood pressure', 'Monitor fetal movement', 'If bleeding, refer to hospital IMMEDIATELY', 'Ensure regular ANC visits', 'Prepare birth preparedness plan'],
    },
    // ── SKIN / RASH ──
    {
        keywords: ['rash', 'skin', 'itching', 'khujli', 'daane', 'dane', 'allergy', 'red spots', 'lal daane', 'scabies', 'fungal', 'खाज', 'खुजली', 'पुरळ', 'दाने', 'अंगावर दाने', 'त्वचा', 'एलर्जी', 'खरूज'],
        severity: 1,
        conditions: ['Allergic Dermatitis', 'Scabies', 'Fungal Infection', 'Measles', 'Chickenpox', 'Eczema'],
        specialty: 'Dermatology',
        riskFactors: ['Could spread if infectious (scabies, chickenpox)', 'Watch for secondary bacterial infection'],
        actions: ['Keep affected area clean and dry', 'Avoid scratching', 'Apply calamine lotion for itching', 'If widespread rash with fever, refer to PHC', 'Check other family members for similar symptoms'],
    },
    // ── BODY ACHE / PAIN ──
    {
        keywords: ['body ache', 'body pain', 'badan dard', 'joint pain', 'jodo mein dard', 'muscle pain', 'weakness', 'kamzori', 'thakan', 'fatigue', 'अंगदुखी', 'बदन दर्द', 'सांधेदुखी', 'अशक्तपणा', 'थकवा', 'अंग दुखतंय', 'कमजोरी', 'जोडों में दर्द', 'अंग दुखत'],
        severity: 1,
        conditions: ['Viral Fever', 'Dengue', 'Chikungunya', 'Arthritis', 'Nutritional Deficiency'],
        specialty: 'General Medicine',
        riskFactors: ['Could indicate dengue/chikungunya if with fever', 'Weakness may indicate anemia'],
        actions: ['Rest and adequate nutrition', 'Check for associated fever', 'Give paracetamol for pain', 'If severe joint pain with fever and rash, get dengue test', 'Check hemoglobin if persistent weakness'],
    },
    // ── EYE PROBLEMS ──
    {
        keywords: ['eye pain', 'aankh', 'ankh', 'eye', 'vision', 'nazar', 'blurry', 'red eye', 'aankh lal', 'डोळे', 'आंख', 'नजर', 'डोळे दुखतात', 'डोळे लाल', 'दिसत नाही', 'आंखों में दर्द'],
        severity: 1,
        conditions: ['Conjunctivitis', 'Refractive Error', 'Glaucoma', 'Cataract', 'Eye Infection'],
        specialty: 'Ophthalmology',
        riskFactors: ['Vision loss risk if untreated', 'Infectious conjunctivitis can spread'],
        actions: ['Do not rub eyes', 'Wash hands frequently', 'Apply clean cold compress', 'If sudden vision loss, refer to hospital IMMEDIATELY', 'Visit eye specialist at PHC'],
    },
    // ── BURNS ──
    {
        keywords: ['burn', 'jalaa', 'jala', 'jalne', 'scald', 'fire', 'aag', 'भाजणे', 'जळणे', 'आग', 'जला', 'भाजलं', 'जल गया'],
        severity: 3,
        conditions: ['First Degree Burn', 'Second Degree Burn', 'Third Degree Burn'],
        specialty: 'Surgery / Emergency Medicine',
        riskFactors: ['Infection risk', 'Fluid loss and shock', 'Scarring'],
        actions: ['Cool burn under clean running water for 20 minutes', 'Do NOT apply ice, toothpaste, or oil', 'Cover with clean cloth/bandage', 'Give pain relief if needed', 'If large area or blistering, refer to hospital URGENTLY'],
    },
    // ── SNAKE / ANIMAL BITE ──
    {
        keywords: ['snake bite', 'saanp', 'sanp', 'bite', 'dog bite', 'kutta', 'animal bite', 'scorpion', 'bichhu', 'साप', 'सर्प', 'कुत्रा', 'कुत्ता', 'विंचू', 'बिच्छू', 'साप चावला', 'कुत्र्याने चावले'],
        severity: 4,
        conditions: ['Snake Envenomation', 'Rabies Risk', 'Wound Infection', 'Allergic Reaction'],
        specialty: 'Emergency Medicine',
        riskFactors: ['Life-threatening if venomous snake', 'Rabies risk from dog bite', 'Anaphylaxis risk'],
        actions: ['EMERGENCY: Transport to hospital IMMEDIATELY', 'Keep patient calm and immobilize bitten limb', 'Do NOT apply tourniquet or try to suck venom', 'Note the time of bite', 'For dog bite: wash wound with soap and water for 15 minutes'],
    },
    // ── MALARIA / DENGUE ──
    {
        keywords: ['malaria', 'dengue', 'platelets', 'chikungunya', 'mosquito', 'मलेरिया', 'डेंगू', 'हिवताप', 'डास', 'मच्छर'],
        severity: 3,
        conditions: ['Malaria', 'Dengue Fever', 'Chikungunya'],
        specialty: 'General Medicine / Infectious Disease',
        riskFactors: ['Platelet drop in dengue can be life-threatening', 'Cerebral malaria risk', 'Dengue hemorrhagic fever risk'],
        actions: ['Get blood test for malaria parasite and dengue', 'Monitor platelet count daily', 'Ensure adequate hydration', 'Give paracetamol ONLY (no aspirin/ibuprofen)', 'If platelet < 50,000 or bleeding, refer to hospital urgently'],
    },
    // ── SEIZURES / CONVULSIONS ──
    {
        keywords: ['seizure', 'convulsion', 'mirgi', 'epilepsy', 'fit', 'jhatkay', 'unconscious', 'behosh', 'fainting', 'फिट', 'मिरगी', 'बेहोश', 'झटके', 'आकडी', 'शुद्ध हरपणे', 'बेशुद्ध'],
        severity: 4,
        conditions: ['Epilepsy', 'Febrile Seizure', 'Meningitis', 'Hypoglycemia', 'Head Injury'],
        specialty: 'Neurology / Emergency Medicine',
        riskFactors: ['Airway obstruction risk', 'Could indicate brain infection', 'Risk of injury during seizure'],
        actions: ['EMERGENCY: Clear the area around patient', 'Turn patient on their side', 'Do NOT put anything in mouth', 'Time the seizure duration', 'Transport to hospital IMMEDIATELY after seizure stops'],
    },
    // ── DIABETES RELATED ──
    {
        keywords: ['sugar', 'diabetes', 'madhumeh', 'blood sugar', 'thirst', 'baar baar peshab', 'frequent urination', 'मधुमेह', 'शुगर', 'डायबिटीज', 'तहान', 'वारंवार लघवी', 'बार बार पेशाब'],
        severity: 2,
        conditions: ['Type 2 Diabetes', 'Diabetic Ketoacidosis', 'Urinary Tract Infection', 'Kidney Disease'],
        specialty: 'Endocrinology / General Medicine',
        riskFactors: ['Risk of diabetic complications', 'Kidney damage risk', 'Wound healing issues'],
        actions: ['Check blood sugar if glucometer available', 'Ensure regular medication if already diagnosed', 'Monitor for wounds on feet', 'Dietary advice: reduce sugar and refined carbs', 'Regular follow-up at PHC'],
    },
    // ── BLOOD PRESSURE ──
    {
        keywords: ['blood pressure', 'bp', 'high bp', 'low bp', 'hypertension', 'chakkar', 'dizziness', 'dizzy', 'रक्तदाब', 'बीपी', 'चक्कर', 'चक्कर येणे', 'भोवळ', 'ब्लड प्रेशर'],
        severity: 2,
        conditions: ['Hypertension', 'Hypotension', 'Vertigo', 'Anemia', 'Inner Ear Disorder'],
        specialty: 'Cardiology / General Medicine',
        riskFactors: ['Stroke risk with uncontrolled high BP', 'Fall risk with dizziness', 'Could indicate heart disease'],
        actions: ['Check blood pressure', 'If very high (>180/120), refer to hospital immediately', 'Reduce salt intake', 'Ensure regular medication compliance', 'Avoid sudden position changes if dizzy'],
    },
    // ── CHILD-SPECIFIC ──
    {
        keywords: ['child', 'baby', 'bachcha', 'infant', 'newborn', 'neonatal', 'not feeding', 'doodh nahi', 'crying', 'irritable', 'बाळ', 'बच्चा', 'मूल', 'नवजात', 'दूध नाही पीत', 'रडतंय', 'दूध नहीं पी रहा'],
        severity: 2,
        conditions: ['Neonatal Sepsis', 'Malnutrition', 'Dehydration', 'Pneumonia', 'Diarrheal Disease'],
        specialty: 'Pediatrics',
        riskFactors: ['Neonatal infections can be life-threatening', 'Malnutrition affects development', 'Rapid dehydration in infants'],
        actions: ['Continue breastfeeding', 'Monitor temperature', 'Check for danger signs: not feeding, convulsions, chest indrawing', 'Weigh the child and check growth chart', 'If any danger signs, refer to hospital IMMEDIATELY'],
    },
];

// ── Hindi/regional phrase translations ──
const PHRASE_TRANSLATIONS: Record<string, string> = {
    // Existing Hindi (Roman script)
    'tez bukhar': 'high fever',
    'saans lene mein takleef': 'difficulty breathing',
    'saans phoolna': 'shortness of breath',
    'pet dard': 'stomach pain',
    'sir dard': 'headache',
    'sar dard': 'headache',
    'badan dard': 'body ache',
    'jodo mein dard': 'joint pain',
    'seene mein dard': 'chest pain',
    'ulti dast': 'vomiting and diarrhea',
    'aankh lal': 'red eye',
    'ji machlana': 'nausea',
    'baar baar peshab': 'frequent urination',
    'khoon aana': 'bleeding',
    'peshab mein jalan': 'burning urination',
    'doodh nahi pee raha': 'not feeding (infant)',
    'teen din se': 'for three days',
    'ek hafte se': 'for one week',
    'marij ko': 'patient has',
    'mein takleef': 'difficulty in',
    'ho rahi hai': 'is happening',
    'bahut zyada': 'very much / excessive',
    'thoda thoda': 'mild / intermittent',
    'raat ko': 'at night',
    'subah ko': 'in the morning',
    'khana khane ke baad': 'after eating',
    'pet se hai': 'is pregnant',
    // ── Devanagari Hindi ──
    'तेज बुखार': 'high fever',
    'सांस लेने में तकलीफ': 'difficulty breathing',
    'सांस फूलना': 'shortness of breath',
    'पेट दर्द': 'stomach pain',
    'पेट में दर्द': 'stomach pain',
    'सिर दर्द': 'headache',
    'सिर में दर्द': 'headache',
    'बदन दर्द': 'body ache',
    'जोड़ों में दर्द': 'joint pain',
    'सीने में दर्द': 'chest pain',
    'उल्टी दस्त': 'vomiting and diarrhea',
    'आंख लाल': 'red eye',
    'जी मचलना': 'nausea',
    'बार बार पेशाब': 'frequent urination',
    'खून आना': 'bleeding',
    'पेशाब में जलन': 'burning urination',
    'तीन दिन से': 'for three days',
    'एक हफ्ते से': 'for one week',
    'बहुत ज्यादा': 'very much / excessive',
    'रात को': 'at night',
    'सुबह को': 'in the morning',
    'खाना खाने के बाद': 'after eating',
    'पेट से है': 'is pregnant',
    'दूध नहीं पी रहा': 'not feeding (infant)',
    // ── Marathi ──
    'तीन दिवसापासून ताप आहे': 'fever for three days',
    'ताप आहे': 'has fever',
    'ताप येतो': 'getting fever',
    'ताप आला': 'got fever',
    'खोकला येतो': 'has cough',
    'खोकला आहे': 'has cough',
    'डोकं दुखतंय': 'has headache',
    'डोकं दुखत आहे': 'has headache',
    'डोकं दुखतोय': 'has headache',
    'डोकेदुखी आहे': 'has headache',
    'पोटात दुखतंय': 'has stomach pain',
    'पोटात दुखत आहे': 'has stomach pain',
    'पोट दुखतंय': 'has stomach pain',
    'पोट दुखत आहे': 'has stomach pain',
    'पोटदुखी आहे': 'has stomach pain',
    'उलटी होतेय': 'is vomiting',
    'उलटी येतेय': 'is vomiting',
    'जुलाब होतात': 'has diarrhea',
    'जुलाब लागले': 'got diarrhea',
    'संडास लागतोय': 'has diarrhea',
    'अंग दुखतंय': 'has body ache',
    'अंग दुखत आहे': 'has body ache',
    'अंगदुखी आहे': 'has body ache',
    'सांधे दुखतात': 'has joint pain',
    'श्वास लागतो': 'has breathing difficulty',
    'दम लागतो': 'has breathlessness',
    'छातीत दुखतंय': 'has chest pain',
    'छातीत दुखत आहे': 'has chest pain',
    'चक्कर येतो': 'has dizziness',
    'चक्कर येतात': 'has dizziness',
    'भोवळ येते': 'feels dizzy',
    'डोळे दुखतात': 'has eye pain',
    'डोळे लाल आहेत': 'has red eyes',
    'खाज सुटते': 'has itching',
    'पुरळ आले': 'got rash',
    'अंगावर दाने': 'rash on body',
    'बाळाला ताप': 'baby has fever',
    'बाळ रडतंय': 'baby is crying',
    'दूध पीत नाही': 'not drinking milk',
    'तीन दिवसांपासून': 'for three days',
    'एक आठवड्यापासून': 'for one week',
    'दोन दिवसांपासून': 'for two days',
    'काल पासून': 'since yesterday',
    'रात्री': 'at night',
    'सकाळी': 'in the morning',
    'जेवल्यावर': 'after eating',
    'खूप': 'very much',
    'थोडं': 'mild',
    'दिवसापासून': 'days since',
};

// ── Government Health Schemes ──
interface SchemeRule {
    name: string;
    description: string;
    match: (input: string, patient?: { age?: string; gender?: string; pregnancyStatus?: string }, conditions?: string[], severity?: number) => boolean;
}

const HEALTH_SCHEMES: SchemeRule[] = [
    {
        name: 'Ayushman Bharat (PM-JAY)',
        description: 'Free treatment up to ₹5 lakh/year for hospitalization in empanelled hospitals. Covers 1,350+ medical packages.',
        match: (_input, _patient, _conditions, severity) =>
            // Only for cases serious enough to need hospitalization
            (severity || 0) >= 3,
    },
    {
        name: 'Janani Suraksha Yojana (JSY)',
        description: 'Cash assistance for institutional delivery. ₹1,400 for rural and ₹1,000 for urban pregnant women.',
        match: (input, patient) =>
            !!(patient?.pregnancyStatus && patient.pregnancyStatus !== 'Not Pregnant' && patient.pregnancyStatus !== 'none') ||
            /pregnan|garbh|delivery|prasav|pet se|गरोदर|गर्भवती|प्रसव/i.test(input),
    },
    {
        name: 'PM Matru Vandana Yojana (PMMVY)',
        description: 'Cash incentive of ₹5,000 in 3 installments for first living child. Covers maternity and nutrition needs.',
        match: (input, patient) =>
            !!(patient?.pregnancyStatus && patient.pregnancyStatus !== 'Not Pregnant' && patient.pregnancyStatus !== 'none') ||
            /pregnan|garbh|pet se|गरोदर|गर्भवती/i.test(input),
    },
    {
        name: 'National Health Mission (NHM)',
        description: 'Free healthcare services at government health facilities including PHC, CHC, and District Hospitals.',
        match: (_input, _patient, _conditions, severity) =>
            // Only when referral to PHC/hospital is warranted (medium+)
            (severity || 0) >= 2,
    },
    {
        name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
        description: 'Free health screening and treatment for children 0-18 years. Covers 4Ds: Defects, Diseases, Deficiencies, Development delays.',
        match: (input, patient) => {
            const age = parseInt(patient?.age || '99');
            return age < 18 || /child|baby|bachcha|infant|newborn|बाळ|बच्चा|मूल/i.test(input);
        },
    },
    {
        name: 'Nikshay Poshan Yojana',
        description: 'Nutritional support of ₹500/month for TB patients during treatment duration.',
        match: (input, _patient, conditions) =>
            /tb|tuberculosis|tubercul/i.test(input) ||
            !!(conditions?.some(c => /tuberculosis|tb/i.test(c))),
    },
    {
        name: 'National Programme for Prevention and Control of Cancer, Diabetes, CVD and Stroke (NPCDCS)',
        description: 'Free screening and management of non-communicable diseases at district NCD clinics.',
        match: (input, _patient, conditions) =>
            /diabetes|sugar|heart|bp|blood pressure|cancer|stroke|hypertension|मधुमेह|रक्तदाब|शुगर/i.test(input) ||
            !!(conditions?.some(c => /diabetes|hypertension|heart|stroke|cancer/i.test(c))),
    },
    {
        name: 'Rashtriya Swasthya Bima Yojana (RSBY)',
        description: 'Health insurance for BPL families covering hospitalization up to ₹30,000 per family per year.',
        match: (_input, _patient, _conditions, severity) =>
            // Only for hospitalization-level cases
            (severity || 0) >= 3,
    },
];

// ── Core Analysis Function ──

export function analyzeSymptoms(
    input: string,
    patientContext?: string
): AnalysisResult {
    const normalizedInput = input.toLowerCase().trim();

    // FIRST: Translate phrases to English before matching
    let translatedInput = normalizedInput;
    for (const [phrase, english] of Object.entries(PHRASE_TRANSLATIONS)) {
        if (normalizedInput.includes(phrase.toLowerCase())) {
            translatedInput = translatedInput + ' ' + english.toLowerCase();
        }
    }

    // Match symptoms against both original and translated input
    const combinedInput = translatedInput;
    const matchedSymptoms: SymptomDef[] = [];

    // Helper: for short keywords (≤4 chars), use word boundary regex to avoid
    // false matches like 'साप' (snake) inside 'दिवसापासून' (since days)
    const matchKeyword = (text: string, kw: string): boolean => {
        const lkw = kw.toLowerCase();
        if (lkw.length <= 4) {
            // Use regex with word boundaries for short keywords
            const escaped = lkw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp('(?:^|\\s|[,;.!?])' + escaped + '(?:$|\\s|[,;.!?])', 'i');
            return re.test(text);
        }
        return text.includes(lkw);
    };

    for (const symptom of SYMPTOM_DATABASE) {
        for (const keyword of symptom.keywords) {
            if (matchKeyword(combinedInput, keyword)) {
                matchedSymptoms.push(symptom);
                break;
            }
        }
    }

    // Build English summary from translations
    let englishSummary = input;
    for (const [hindi, english] of Object.entries(PHRASE_TRANSLATIONS)) {
        if (normalizedInput.includes(hindi.toLowerCase())) {
            englishSummary = englishSummary + ` [${english}]`;
        }
    }

    // Parse patient context
    const patient: { age?: string; gender?: string; pregnancyStatus?: string } = {};
    let ageGroup: 'Child' | 'Adult' | 'Elderly' | 'Unknown' = 'Unknown';
    let ageNum = 30; // Default Adult

    if (patientContext) {
        const ageMatch = patientContext.match(/Age:\s*(\d+)/i);
        const genderMatch = patientContext.match(/Gender:\s*(\w+)/i);
        const pregMatch = patientContext.match(/Pregnancy Status:\s*([^,.]+)/i); // Stop at comma/period

        if (ageMatch) {
            patient.age = ageMatch[1];
            ageNum = parseInt(patient.age);
            if (ageNum <= 12) ageGroup = 'Child';
            else if (ageNum >= 60) ageGroup = 'Elderly';
            else ageGroup = 'Adult';
        }
        if (genderMatch) patient.gender = genderMatch[1];
        if (pregMatch) patient.pregnancyStatus = pregMatch[1].trim();
    }

    // Identify pregnancy status boolean
    const isPregnant = !!(
        (patient.pregnancyStatus && patient.pregnancyStatus.toLowerCase() !== 'not pregnant' && patient.pregnancyStatus.toLowerCase() !== 'none') ||
        /pregnan|garbh|pet se|गरोदर|गर्भवती/i.test(normalizedInput)
    );

    // Extract duration in days
    // Matches: "for X days", "X din se", "since X days", "X days"
    let parsedDurationInDays = 0;
    const durationMatch = normalizedInput.match(/(\d+)\s*(din|day|days)/i);
    const textNumberMatch = normalizedInput.match(/(one|two|three|four|five|six|seven|eight|nine|ten)\s*(din|day|days)/i);
    const hindiWordsMap: Record<string, number> = { 'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'chaar': 4, 'paanch': 5, 'panch': 5, 'chhe': 6, 'saat': 7 };
    const textHindiMatch = normalizedInput.match(/(ek|do|teen|char|chaar|paanch|panch|chhe|saat)\s*(din)/i);

    if (durationMatch) {
        parsedDurationInDays = parseInt(durationMatch[1]);
    } else if (textNumberMatch) {
        const textToNum: Record<string, number> = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10 };
        parsedDurationInDays = textToNum[textNumberMatch[1].toLowerCase()] || 0;
    } else if (textHindiMatch) {
        parsedDurationInDays = hindiWordsMap[textHindiMatch[1].toLowerCase()] || 0;
    } else if (/hafte|week|7 days/i.test(normalizedInput)) {
        parsedDurationInDays = 7;
    } else if (/mahine|month/i.test(normalizedInput)) {
        parsedDurationInDays = 30;
    } else if (/kal se|yesterday/i.test(normalizedInput)) {
        parsedDurationInDays = 1;
    }

    const durationText = parsedDurationInDays > 0 ? `${parsedDurationInDays} day(s)` : 'Not specified';

    // Determine severity modifiers from input (legacy modifier fallback)
    let severityBoost = 0;
    if (parsedDurationInDays >= 3 && parsedDurationInDays < 7) severityBoost += 0.5;
    if (parsedDurationInDays >= 7) severityBoost += 1;
    if (/bahut|very severe|extreme|unbearable|bardasht nahi|bahut zyada/i.test(normalizedInput)) {
        severityBoost += 1; // Only strong severity keywords boost
    } else if (/severe|tez|bahut|very/i.test(normalizedInput)) {
        severityBoost += 0.5; // Mild severity keywords boost less
    }
    if (/child|baby|bachcha|infant|newborn/i.test(normalizedInput)) {
        severityBoost += 0.5; // Children get a small boost
    }
    if (/elderly|buddha|buzurg/i.test(normalizedInput)) {
        severityBoost += 0.5; // Elderly get a small boost
    }
    if (/blood|khoon|bleeding/i.test(normalizedInput)) {
        severityBoost += 1; // Bleeding is always concerning
    }

    if (ageGroup === 'Child') severityBoost += 0.5;
    else if (ageGroup === 'Elderly') severityBoost += 0.5;

    // If no symptoms matched, provide a generic LOW response
    if (matchedSymptoms.length === 0) {
        return {
            symptoms_en: `Patient reports: "${input}". Unable to identify specific symptoms from the description. A medical professional should evaluate.`,
            analysis: 'The symptoms described could not be precisely matched to known conditions in our database. This does not mean the symptoms are not significant. A qualified medical professional should evaluate the patient in person for proper diagnosis.',
            triage_level: 'Low',
            risk_factors: ['Unidentified symptoms require professional evaluation', 'Could be a condition not covered by keyword matching'],
            recommended_actions: [
                'Refer patient to the nearest Primary Health Centre (PHC)',
                'List all symptoms clearly for the doctor',
                'Monitor for worsening or new symptoms',
                'Ensure patient stays hydrated and rested',
            ],
            suggested_specialty: 'General Medicine',
            possible_conditions: ['Requires professional diagnosis'],
            recommended_action_summary: 'Home care with monitoring, visit PHC if needed',
            eligible_schemes: HEALTH_SCHEMES.filter(s => s.match(combinedInput, patient, [], 1)).map(s => ({
                name: s.name,
                description: s.description,
            })),
            age_group: ageGroup,
            pregnancy_status: isPregnant ? 'Pregnant' : 'Not Pregnant',
            parsed_symptoms: [],
        };
    }

    // Base severity calculation
    const effectiveBoost = Math.min(Math.floor(severityBoost), 1);
    let maxSeverity = Math.min(
        4,
        Math.max(...matchedSymptoms.map(s => s.severity)) + effectiveBoost
    );

    const isSymptomMatch = (keywords: string[]) =>
        keywords.some(kw => matchedSymptoms.some(ms => ms.keywords.includes(kw)));

    let triageLevel: TriageLevel = 'Low';
    let dynamicRecommendation = 'Home care with monitoring';

    // ── DYNAMIC RISK ASSESMENT OVERRIDES ──
    if (isPregnant) {
        if (isSymptomMatch(['fever', 'bukhar'])) {
            maxSeverity = parsedDurationInDays > 2 ? 3 : 2; // High if >2, Medium if 1-2
        }
        if (isSymptomMatch(['stomach pain', 'pet dard'])) maxSeverity = Math.max(maxSeverity, 3); // Immediate High
        if (isSymptomMatch(['blood', 'bleeding', 'khoon'])) {
            maxSeverity = 4; // Immediate Critical (High)
            dynamicRecommendation = 'Emergency doctor consultation immediately';
        }
        if (isSymptomMatch(['swelling'])) maxSeverity = Math.max(maxSeverity, 2); // Medium
        if (isSymptomMatch(['headache', 'dizziness', 'blur'])) maxSeverity = Math.max(maxSeverity, 3); // High (preeclampsia)
        if (isSymptomMatch(['fetal movement', 'baby moving'])) maxSeverity = Math.max(maxSeverity, 3); // High
    } else if (ageGroup === 'Elderly') {
        if (isSymptomMatch(['fever', 'bukhar'])) {
            maxSeverity = parsedDurationInDays > 3 ? 3 : 2; // High if >3, Medium if 1-2
        }
        if (isSymptomMatch(['chest pain', 'seene mein dard'])) {
            maxSeverity = 4; // Immediate High/Critical
            dynamicRecommendation = 'Urgent doctor consultation immediately';
        }
        if (isSymptomMatch(['breathless', 'saans'])) maxSeverity = Math.max(maxSeverity, 3); // Immediate High
        if (isSymptomMatch(['weakness', 'chakkar'])) maxSeverity = Math.max(maxSeverity, 2); // Medium (Dehydration)
        if (isSymptomMatch(['cough', 'khansi'])) {
            if (parsedDurationInDays > 5) maxSeverity = Math.max(maxSeverity, 3); // High
            else if (parsedDurationInDays >= 3) maxSeverity = Math.max(maxSeverity, 2); // Medium
        }
        if (isSymptomMatch(['confusion', 'mental'])) maxSeverity = Math.max(maxSeverity, 3); // Immediate High
    } else if (ageGroup === 'Child') {
        if (isSymptomMatch(['fever', 'bukhar'])) {
            if (isSymptomMatch(['tez', 'high', 'severe'])) maxSeverity = Math.max(maxSeverity, 3); // High if tez bukhar
            else if (parsedDurationInDays > 3) maxSeverity = Math.max(maxSeverity, 3); // High
            else if (parsedDurationInDays > 1) maxSeverity = Math.max(maxSeverity, 2); // Medium
            else maxSeverity = Math.max(maxSeverity, 1); // Low
        }
        if (isSymptomMatch(['vomiting', 'diarrhea', 'ulti', 'dast'])) {
            maxSeverity = parsedDurationInDays > 2 ? 3 : 2; // High if > 2, else Medium
        }
        if (isSymptomMatch(['breathless', 'saans'])) maxSeverity = Math.max(maxSeverity, 3); // Immediate High
        if (isSymptomMatch(['cough', 'khansi'])) {
            if (parsedDurationInDays > 5) maxSeverity = Math.max(maxSeverity, 3); // High
            else if (parsedDurationInDays >= 3) maxSeverity = Math.max(maxSeverity, 2); // Medium
        }
        if (isSymptomMatch(['weakness', 'not feeding', 'doodh nahi'])) {
            maxSeverity = parsedDurationInDays > 2 ? 3 : 2; // High if > 2, else Medium
        }
    } else {
        // Adult rules
        if (isSymptomMatch(['fever', 'bukhar'])) {
            if (parsedDurationInDays > 7) {
                maxSeverity = Math.max(maxSeverity, 3); // High
                dynamicRecommendation = 'Suggest doctor consultation immediately';
            }
            else if (parsedDurationInDays >= 4) maxSeverity = Math.max(maxSeverity, 2); // Medium
            else maxSeverity = Math.max(maxSeverity, 1); // Low
        }
    }

    // Map numeric severity back to Enum
    const triageLevels: TriageLevel[] = ['Low', 'Medium', 'High', 'Critical'];
    triageLevel = triageLevels[Math.min(maxSeverity, 4) - 1] || 'Low';

    const allConditions = [...new Set(matchedSymptoms.flatMap(s => s.conditions))];
    const allRiskFactors = [...new Set(matchedSymptoms.flatMap(s => s.riskFactors))];
    const allActions = [...new Set(matchedSymptoms.flatMap(s => s.actions))];
    const primarySpecialty = matchedSymptoms.sort((a, b) => b.severity - a.severity)[0].specialty;

    // Build English summary
    const symptomNames = matchedSymptoms.map(s => s.keywords[0]).join(', ');
    const cleanSummary = `Patient presents with: ${symptomNames}. ${patientContext || ''} ${severityBoost > 0 ? 'Severity factors detected.' : ''}`.trim();

    // Determine action summary if dynamic hasn't overriden it
    let actionSummary = dynamicRecommendation;
    if (actionSummary === 'Home care with monitoring') {
        switch (triageLevel) {
            case 'Critical':
                actionSummary = 'EMERGENCY: Immediate hospital referral';
                break;
            case 'High':
                actionSummary = 'Urgent: Refer to hospital within 24 hours';
                break;
            case 'Medium':
                actionSummary = 'Visit PHC within 2-3 days';
                break;
            default:
                actionSummary = 'Home care with monitoring';
        }
    }

    // Build clinical analysis
    const analysis = `Based on the reported symptoms (${symptomNames}) for ${durationText}, the patient shows signs consistent with ${allConditions.slice(0, 3).join(', ')
        }. ${triageLevel === 'Critical' || triageLevel === 'High'
            ? 'This is a potentially serious condition requiring urgent medical attention.'
            : 'The condition appears manageable with appropriate care and monitoring.'
        } ${patient.age ? `Patient age (${patient.age}) ` : ''
        }${ageNum < 5 ? 'places them in a vulnerable pediatric group requiring extra caution.' :
            ageNum > 65 ? 'places them in an elderly group requiring extra monitoring.' :
                'has been factored into the assessment.'
        }`;

    // Match schemes based on actual conditions and severity
    const eligibleSchemes = HEALTH_SCHEMES
        .filter(s => s.match(combinedInput, patient, allConditions, maxSeverity))
        .map(s => ({ name: s.name, description: s.description }));

    return {
        symptoms_en: cleanSummary,
        analysis,
        triage_level: triageLevel,
        risk_factors: allRiskFactors.slice(0, 5),
        recommended_actions: allActions.slice(0, 6),
        suggested_specialty: primarySpecialty,
        possible_conditions: allConditions.slice(0, 5),
        recommended_action_summary: actionSummary,
        eligible_schemes: eligibleSchemes,
        age_group: ageGroup,
        pregnancy_status: isPregnant ? 'Pregnant' : 'Not Pregnant',
        parsed_symptoms: matchedSymptoms.map(s => ({ symptom: s.keywords[0], duration: durationText }))
    };
}
