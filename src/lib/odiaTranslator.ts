// Utility for automatic English to Odia (Oriya) translation and transliteration
// Handles leader designations, names, and honorifics

const DESIGNATION_MAP: Record<string, string> = {
  'president': 'ସଭାପତି',
  'vice president': 'ଉପ-ସଭାପତି',
  'vice-president': 'ଉପ-ସଭାପତି',
  'general secretary': 'ସାଧାରଣ ସମ୍ପାଦକ',
  'secretary': 'ସମ୍ପାଦକ',
  'joint secretary': 'ସହ ସମ୍ପାଦକ',
  'assistant secretary': 'ସହକାରୀ ସମ୍ପାଦକ',
  'treasurer': 'କୋଷାଧ୍ୟକ୍ଷ',
  'chairperson': 'ଚେୟାରପରସନ',
  'chairman': 'ଅଧ୍ୟକ୍ଷ',
  'chairwoman': 'ଅଧ୍ୟକ୍ଷା',
  'vice chairman': 'ଉପ ଅଧ୍ୟକ୍ଷ',
  'vice chairperson': 'ଉପ ଚେୟାରପରସନ',
  'founder': 'ପ୍ରତିଷ୍ଠାତା',
  'co-founder': 'ସହ-ପ୍ରତିଷ୍ଠାତା',
  'cofounder': 'ସହ-ପ୍ରତିଷ୍ଠାତା',
  'trustee': 'ଟ୍ରଷ୍ଟି',
  'managing trustee': 'ପରିଚାଳନା ଟ୍ରଷ୍ଟି',
  'advisor': 'ଉପଦେଷ୍ଟା',
  'advisory member': 'ଉପଦେଷ୍ଟା',
  'chief advisor': 'ମୁଖ୍ୟ ଉପଦେଷ୍ଟା',
  'patron': 'ପୃଷ୍ଠପୋଷକ',
  'chief patron': 'ମୁଖ୍ୟ ପୃଷ୍ଠପୋଷକ',
  'executive member': 'କାର୍ଯ୍ୟକାରୀ ସଦସ୍ୟ',
  'executive committee': 'କାର୍ଯ୍ୟକାରୀ କମିଟି',
  'member': 'ସଦସ୍ୟ',
  'director': 'ନିର୍ଦ୍ଦେଶକ',
  'managing director': 'ପରିଚାଳନା ନିର୍ଦ୍ଦେଶକ',
  'coordinator': 'ସଂଯୋଜକ',
  'youth coordinator': 'ଯୁବ ସଂଯୋଜକ',
  'social worker': 'ସମାଜସେବୀ',
  'activist': 'ସମାଜସେବୀ',
  'volunteer': 'ସ୍ୱେଚ୍ଛାସେବୀ',
  'head': 'ମୁଖ୍ୟ',
  'project head': 'ପ୍ରକଳ୍ପ ମୁଖ୍ୟ',
  'organizer': 'ସଂଯୋଜକ',
  'chief coordinator': 'ମୁଖ୍ୟ ସଂଯୋଜକ'
};

const HONORIFICS_MAP: Record<string, string> = {
  'dr.': 'ଡ.',
  'dr': 'ଡ.',
  'doctor': 'ଡାକ୍ତର',
  'er.': 'ଇଂ.',
  'er': 'ଇଂ.',
  'engineer': 'ଇଞ୍ଜିନିୟର',
  'mr.': 'ଶ୍ରୀ',
  'mr': 'ଶ୍ରୀ',
  'mrs.': 'ଶ୍ରୀମତୀ',
  'mrs': 'ଶ୍ରୀମତୀ',
  'smt.': 'ଶ୍ରୀମତୀ',
  'smt': 'ଶ୍ରୀମତୀ',
  'ms.': 'କୁମାରୀ',
  'ms': 'କୁମାରୀ',
  'miss': 'କୁମାରୀ',
  'prof.': 'ପ୍ରଫେସର',
  'prof': 'ପ୍ରଫେସର',
  'professor': 'ପ୍ରଫେସର'
};

const NAME_DICTIONARY: Record<string, string> = {
  // Common Muslim and Non-Hindu First/Last Names in Odisha
  'ejaz': 'ଏଜାଜ',
  'ejaj': 'ଏଜାଜ',
  'khan': 'ଖାନ',
  'mohammad': 'ମହମ୍ମଦ',
  'mohammed': 'ମହମ୍ମଦ',
  'md': 'ମହମ୍ମଦ',
  'sk': 'ଶେଖ',
  'sekh': 'ଶେଖ',
  'sheikh': 'ଶେଖ',
  'shekh': 'ଶେଖ',
  'ahmed': 'ଅହମ୍ମଦ',
  'ahmad': 'ଅହମ୍ମଦ',
  'ali': 'ଅଲ୍ଲୀ',
  'hussain': 'ହୁସେନ',
  'husain': 'ହୁସେନ',
  'alam': 'ଆଲାମ',
  'rehman': 'ରେହମାନ',
  'rahman': 'ରେହମାନ',
  'imran': 'ଇମ୍ରାନ',
  'salman': 'ସଲମାନ',
  'aslam': 'ଅସଲମ',
  'imtiaz': 'ଇମତିଆଜ',
  'tariq': 'ତାରିକ',
  'parvez': 'ପରଭେଜ',

  // First/Middle Names
  'ramesh': 'ରମେଶ',
  'suresh': 'ସୁରେଶ',
  'rajesh': 'ରାଜେଶ',
  'bikash': 'ବିକାଶ',
  'bikas': 'ବିକାଶ',
  'prakash': 'ପ୍ରକାଶ',
  'subash': 'ସୁବାସ',
  'subhash': 'ସୁଭାଷ',
  'ashok': 'ଅଶୋକ',
  'prabhat': 'ପ୍ରଭାତ',
  'pravat': 'ପ୍ରଭାତ',
  'niranjan': 'ନିରଞ୍ଜନ',
  'manoj': 'ମନୋଜ',
  'sanjib': 'ସଞ୍ଜୀବ',
  'sanjeev': 'ସଞ୍ଜୀବ',
  'deepak': 'ଦୀପକ',
  'dipak': 'ଦୀପକ',
  'dilip': 'ଦିଲ୍ଲୀପ',
  'dillip': 'ଦିଲ୍ଲୀପ',
  'santosh': 'ସନ୍ତୋଷ',
  'manas': 'ମାନସ',
  'soumya': 'ସୌମ୍ୟ',
  'satya': 'ସତ୍ୟ',
  'ranjan': 'ରଞ୍ଜନ',
  'prasanna': 'ପ୍ରସନ୍ନ',
  'kumar': 'କୁମାର',
  'chandra': 'ଚନ୍ଦ୍ର',
  'kanta': 'କାନ୍ତ',
  'sekhar': 'ଶେଖର',
  'shekhar': 'ଶେଖର',
  'narayan': 'ନାରାୟଣ',
  'jagannath': 'ଜଗନ୍ନାଥ',
  'laxman': 'ଲକ୍ଷ୍ମଣ',
  'lakshman': 'ଲକ୍ଷ୍ମଣ',
  'balaram': 'ବଳରାମ',
  'rabindra': 'ରବୀନ୍ଦ୍ର',
  'bijay': 'ବିଜୟ',
  'vijay': 'ବିଜୟ',
  'sanjay': 'ସଞ୍ଜୟ',
  'ajay': 'ଅଜୟ',
  'anil': 'ଅନିଲ',
  'sunil': 'ସୁନିଲ',
  'amit': 'ଅମିତ',
  'anup': 'ଅନୂପ',
  'debasis': 'ଦେବାଶିଷ',
  'debasish': 'ଦେବାଶିଷ',
  'ashutosh': 'ଆଶୁତୋଷ',
  'priyabrata': 'ପ୍ରିୟବ୍ରତ',
  'tapas': 'ତାପସ',
  'biswajit': 'ବିଶ୍ୱଜିତ୍',
  'satyabrata': 'ସତ୍ୟବ୍ରତ',
  'jitendra': 'ଜିତେନ୍ଦ୍ର',
  'dharmendra': 'ଧର୍ମେନ୍ଦ୍ର',
  'jayanta': 'ଜୟନ୍ତ',
  'basanta': 'ବସନ୍ତ',
  'hemanta': 'ହେମନ୍ତ',
  'sushanta': 'ସୁଶାନ୍ତ',
  'susanta': 'ସୁଶାନ୍ତ',
  'gourahari': 'ଗୌରହରି',
  'trilochan': 'ତ୍ରିଲୋଚନ',
  'kailash': 'କୈଳାସ',
  'subhendu': 'ସୁଭେନ୍ଦୁ',
  'sudhanshu': 'ସୁଧାଂଶୁ',
  'himanshu': 'ହିମାଂଶୁ',
  'priyanka': 'ପ୍ରିୟଙ୍କା',
  'pooja': 'ପୂଜା',
  'puja': 'ପୂଜା',
  'sunita': 'ସୁନୀତା',
  'anita': 'ଅନୀତା',
  'sanghamitra': 'ସଂଘମିତ୍ରା',
  'mamata': 'ମମତା',
  'minati': 'ମିନତି',
  'sujata': 'ସୁଜାତା',
  'rashmi': 'ରଶ୍ମି',
  'smruti': 'ସମୃତି',
  'lipi': 'ଲିପି',
  'akshaya': 'ଅକ୍ଷୟ',
  'akshya': 'ଅକ୍ଷୟ',
  'amar': 'ଅମର',
  'anand': 'ଆନନ୍ଦ',
  'ananda': 'ଆନନ୍ଦ',
  'bhaskar': 'ଭାସ୍କର',
  'bibhuti': 'ବିଭୂତି',
  'binod': 'ବିନୋଦ',
  'birendra': 'ବୀରେନ୍ଦ୍ର',
  'braja': 'ବ୍ରଜ',
  'chittaranjan': 'ଚିତ୍ତରଞ୍ଜନ',
  'damodar': 'ଦାମୋଦର',
  'dinesh': 'ଦିନେଶ',
  'ganesh': 'ଗଣେଶ',
  'girish': 'ଗିରୀଶ',
  'gopal': 'ଗୋପାଳ',
  'gouranga': 'ଗୌରାଙ୍ଗ',
  'hari': 'ହରି',
  'harish': 'ହରୀଶ',
  'indrajit': 'ଇନ୍ଦ୍ରଜିତ୍',
  'jiban': 'ଜୀବନ',
  'jugal': 'ଜୁଗଳ',
  'kamal': 'କମଳ',
  'kanhu': 'କାନ୍ହୁ',
  'kartik': 'କାର୍ତ୍ତିକ',
  'kartika': 'କାର୍ତ୍ତିକ',
  'kshirod': 'କ୍ଷୀରୋଦ',
  'lokanath': 'ଲୋକନାଥ',
  'loknath': 'ଲୋକନାଥ',
  'madhab': 'ମାଧବ',
  'madhav': 'ମାଧବ',
  'maheswar': 'ମହେଶ୍ୱର',
  'narottam': 'ନରୋତ୍ତମ',
  'naba': 'ନବ',
  'nabin': 'ନବୀନ',
  'panchanan': 'ପଞ୍ଚାନନ',
  'purna': 'ପୂର୍ଣ୍ଣ',
  'radha': 'ରାଧା',
  'rajaram': 'ରାଜାରାମ',
  'ramakanta': 'ରାମାକାନ୍ତ',
  'rameshwar': 'ରାମେଶ୍ୱର',
  'rohit': 'ରୋହିତ',
  'sabyasachi': 'ସବ୍ୟସାଚୀ',
  'sachidananda': 'ସଚ୍ଚିଦାନନ୍ଦ',
  'samir': 'ସମୀର',
  'sameer': 'ସମୀର',
  'saroj': 'ସରୋଜ',
  'siba': 'ଶିବ',
  'shiba': 'ଶିବ',
  'shiva': 'ଶିବ',
  'sidhartha': 'ସିଦ୍ଧାର୍ଥ',
  'siddharth': 'ସିଦ୍ଧାର୍ଥ',
  'sudhir': 'ସୁଧୀର',
  'suraj': 'ସୂରଜ',
  'suryakanta': 'ସୂର୍ଯ୍ୟକାନ୍ତ',
  'tapan': 'ତପନ',
  'tarun': 'ତରୁଣ',
  'umesh': 'ଉମେଶ',
  'upendra': 'ଉପେନ୍ଦ୍ର',

  // Surnames
  'das': 'ଦାସ',
  'dass': 'ଦାସ',
  'jena': 'ଜେନା',
  'mohanty': 'ମହାନ୍ତି',
  'mahanty': 'ମହାନ୍ତି',
  'sahoo': 'ସାହୁ',
  'sahu': 'ସାହୁ',
  'swain': 'ସ୍ୱାଇଁ',
  'patnaik': 'ପଟ୍ଟନାୟକ',
  'pattnaik': 'ପଟ୍ଟନାୟକ',
  'pattanaik': 'ପଟ୍ଟନାୟକ',
  'behera': 'ବେହେରା',
  'nayak': 'ନାୟକ',
  'naik': 'ନାୟକ',
  'rout': 'ରାଉତ',
  'raout': 'ରାଉତ',
  'samal': 'ସାମଲ',
  'mishra': 'ମିଶ୍ର',
  'misra': 'ମିଶ୍ର',
  'panda': 'ପଣ୍ଡା',
  'tripathy': 'ତ୍ରିପାଠୀ',
  'tripathi': 'ତ୍ରିପାଠୀ',
  'dash': 'ଦାଶ',
  'pradhan': 'ପ୍ରଧାନ',
  'parida': 'ପରିଡ଼ା',
  'muduli': 'ମୁଦୁଲି',
  'mallick': 'ମଲ୍ଲିକ',
  'malik': 'ମଲ୍ଲିକ',
  'barik': 'ବାରିକ',
  'sethi': 'ସେଠୀ',
  'biswal': 'ବିଶ୍ୱାଳ',
  'tarai': 'ତରାଇ',
  'tarei': 'ତରାଇ',
  'lenka': 'ଲେଙ୍କା',
  'mohapatra': 'ମହାପାତ୍ର',
  'mahapatra': 'ମହାପାତ୍ର',
  'moharana': 'ମହାରାଣା',
  'maharana': 'ମହାରାଣା',
  'dhall': 'ଢାଳ',
  'nanda': 'ନନ୍ଦ',
  'satapathy': 'ଶତପଥୀ',
  'satpathy': 'ଶତପଥୀ',
  'acharya': 'ଆଚାର୍ଯ୍ୟ',
  'rath': 'ରଥ',
  'ratha': 'ରଥ',
  'bhatta': 'ଭଟ୍ଟ',
  'kar': 'କର',
  'ray': 'ରାୟ',
  'roy': 'ରାୟ',
  'senapati': 'ସେନାପତି',
  'mahala': 'ମହାଲ',
  'majhi': 'ମାଝୀ',
  'singh': 'ସିଂ',
  'dehury': 'ଦେହୁରୀ',
  'khuntia': 'ଖୁଣ୍ଟିଆ',
  'khatua': 'ଖଟୁଆ',
  'mangaraj': 'ମଙ୍ଗରାଜ',
  'pal': 'ପାଲ',
  'subudhi': 'ସୁବୁଦ୍ଧି',
  'bhoi': 'ଭୋଇ',
  'sutar': 'ସୁତାର',
  'patra': 'ପାତ୍ର'
};

/** Checks if text contains Odia Unicode characters (U+0B00 to U+0B7F) */
export function hasOdiaScript(text?: string): boolean {
  if (!text) return false;
  return /[\u0B00-\u0B7F]/.test(text);
}

/** Translate English designation/role into Odia automatically */
export function translateDesignationToOdia(roleEn?: string): string {
  if (!roleEn) return 'କର୍ମକର୍ତ୍ତା';
  if (hasOdiaScript(roleEn)) return roleEn;

  const normalized = roleEn.trim().toLowerCase();

  // Direct map check
  if (DESIGNATION_MAP[normalized]) {
    return DESIGNATION_MAP[normalized];
  }

  // Handle composite roles like "Founder & President" or "Secretary / Treasurer"
  let translated = roleEn;

  // Replace connectors
  translated = translated.replace(/\b(&|and)\b/gi, 'ଓ');
  translated = translated.replace(/\//g, ' / ');

  // Sort keys by length descending to replace multi-word terms first
  const sortedKeys = Object.keys(DESIGNATION_MAP).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    if (regex.test(translated)) {
      translated = translated.replace(regex, DESIGNATION_MAP[key]);
    }
  }

  // If still completely English, return cleaned up or translated version
  return translated;
}

/** Phonetic fallback for English words to Odia characters */
function phoneticToOdiaWord(word: string): string {
  const lower = word.toLowerCase();

  // Check dictionary first
  if (NAME_DICTIONARY[lower]) {
    return NAME_DICTIONARY[lower];
  }

  // Check honorifics
  if (HONORIFICS_MAP[lower]) {
    return HONORIFICS_MAP[lower];
  }

  // Fallback phonetic transliteration rules
  let res = lower;

  // Replacement rules for common phonetic groups
  const rules: [RegExp, string][] = [
    [/ksh/g, 'କ୍ଷ'],
    [/sh/g, 'ଶ'],
    [/ch/g, 'ଚ'],
    [/th/g, 'ଥ'],
    [/dh/g, 'ଧ'],
    [/bh/g, 'ଭ'],
    [/gh/g, 'ଘ'],
    [/jh/g, 'ଝ'],
    [/kh/g, 'ଖ'],
    [/ph/g, 'ଫ'],
    [/ee/g, 'ୀ'],
    [/oo/g, 'ୂ'],
    [/ai/g, 'ୈ'],
    [/au/g, 'ୌ'],
    [/k/g, 'କ'],
    [/g/g, 'ଗ'],
    [/j/g, 'ଜ'],
    [/t/g, 'ତ'],
    [/d/g, 'ଦ'],
    [/n/g, 'ନ'],
    [/p/g, 'ପ'],
    [/b/g, 'ବ'],
    [/m/g, 'ମ'],
    [/y/g, 'ୟ'],
    [/r/g, 'ର'],
    [/l/g, 'ଲ'],
    [/v/g, 'ବ'],
    [/w/g, 'ୱ'],
    [/s/g, 'ସ'],
    [/h/g, 'ହ'],
    [/a/g, 'ା'],
    [/i/g, 'ି'],
    [/u/g, 'ୁ'],
    [/e/g, 'େ'],
    [/o/g, 'ୋ']
  ];

  for (const [pattern, repl] of rules) {
    res = res.replace(pattern, repl);
  }

  // Capitalize first Odia character or clean up double vowels
  return res;
}

/** Transliterate English full name to Odia script automatically */
export function transliterateNameToOdia(nameEn?: string): string {
  if (!nameEn) return 'ସେବାବ୍ରତୀ';
  if (hasOdiaScript(nameEn)) return nameEn;

  const parts = nameEn.trim().split(/\s+/);
  const translatedParts = parts.map(part => {
    const clean = part.replace(/[^\w.]/g, '');
    const lower = clean.toLowerCase();

    if (HONORIFICS_MAP[lower]) return HONORIFICS_MAP[lower];
    if (NAME_DICTIONARY[lower]) return NAME_DICTIONARY[lower];

    return phoneticToOdiaWord(clean);
  });

  return translatedParts.join(' ');
}

/** Helper to get Odia Name - uses provided nameOr if in Odia script and matching, else transliterates nameEn */
export function getOdiaName(nameEn?: string, nameOr?: string): string {
  if (!nameEn) return nameOr || 'ସେବାବ୍ରତୀ';

  if (nameOr && hasOdiaScript(nameOr)) {
    const lowerEn = nameEn.toLowerCase();
    // Guard against stale mock names from initial database state
    const isSantoshStale = nameOr.includes('ସନ୍ତୋଷ') && !lowerEn.includes('santosh');
    const isPradiptaStale = nameOr.includes('ପ୍ରଦୀପ୍ତ') && !lowerEn.includes('pradipta');
    const isDebendraStale = nameOr.includes('ଦେବେନ୍ଦ୍ର') && !lowerEn.includes('debendra');

    if (!isSantoshStale && !isPradiptaStale && !isDebendraStale) {
      return nameOr;
    }
  }

  return transliterateNameToOdia(nameEn);
}

/** Helper to get Odia Role - uses provided roleOr if in Odia script, else translates roleEn */
export function getOdiaRole(roleEn?: string, roleOr?: string): string {
  if (roleOr && hasOdiaScript(roleOr)) {
    return roleOr;
  }
  return translateDesignationToOdia(roleEn);
}
