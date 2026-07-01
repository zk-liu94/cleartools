// ============================================
// ClearWrite Tools — Shared JavaScript
// ============================================

// ---- Syllable Counter (English) ----
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  var syl = word.match(/[aeiouy]{1,2}/g);
  return syl ? syl.length : 1;
}

// ---- Text Analysis ----
function analyzeText(text) {
  if (!text.trim()) return null;
  var words = text.trim().match(/[a-zA-Z\']+(?:-[a-zA-Z]+)*/g) || [];
  var chars = text.length;
  var charsNoSpace = text.replace(/\s/g, '').length;
  var sentences = text.trim().split(/[.!?]+/).filter(function(s) { return s.trim().length > 0; });
  var paragraphs = text.split(/\n\s*\n/).filter(function(p) { return p.trim().length > 0; });
  var lines = text.split('\n').filter(function(l) { return l.trim().length > 0; });
  var wordCount = words.length;
  var sentCount = sentences.length || 1;
  var paraCount = paragraphs.length || 1;
  var avgWordLen = wordCount > 0 ? (charsNoSpace / wordCount) : 0;
  var avgSentLen = wordCount / sentCount;
  var totalSyllables = words.reduce(function(sum, w) { return sum + countSyllables(w); }, 0);
  var avgSyllables = wordCount > 0 ? totalSyllables / wordCount : 0;
  return {
    words: wordCount,
    characters: chars,
    charactersNoSpace: charsNoSpace,
    sentences: sentCount,
    paragraphs: paraCount,
    lines: lines.length,
    avgWordLength: avgWordLen,
    avgSentenceLength: avgSentLen,
    totalSyllables: totalSyllables,
    avgSyllablesPerWord: avgSyllables
  };
}

// ---- Readability Scores ----
function calcReadability(text) {
  var s = analyzeText(text);
  if (!s || s.words < 1) return null;
  var asl = s.avgSentenceLength;
  var asw = s.avgSyllablesPerWord;
  var flesch = 206.835 - 1.015 * asl - 84.6 * asw;
  flesch = Math.round(Math.min(100, Math.max(0, flesch)));
  var grade = 0.39 * asl + 11.8 * asw - 15.59;
  grade = Math.round(Math.min(20, Math.max(1, grade)));

  var label, desc;
  if (flesch >= 90) { label = 'Very Easy'; desc = 'Easy to read by an average 11-year-old student.'; }
  else if (flesch >= 80) { label = 'Easy'; desc = 'Easy to read. Conversational English for consumers.'; }
  else if (flesch >= 70) { label = 'Fairly Easy'; desc = 'Fairly easy to read. Suitable for most readers.'; }
  else if (flesch >= 60) { label = 'Standard'; desc = 'Plain English. Easily understood by 13- to 15-year-old students.'; }
  else if (flesch >= 50) { label = 'Fairly Difficult'; desc = 'Fairly difficult to read. Suitable for high school students.'; }
  else if (flesch >= 30) { label = 'Difficult'; desc = 'Difficult to read. Best for college graduates.'; }
  else { label = 'Very Confusing'; desc = 'Very difficult to read. Best suited for university graduates.'; }

  var color;
  if (flesch >= 80) color = '#059669';
  else if (flesch >= 60) color = '#2563eb';
  else if (flesch >= 40) color = '#d97706';
  else color = '#dc2626';

  return {
    fleschScore: flesch,
    gradeLevel: grade,
    label: label,
    description: desc,
    color: color,
    avgSentenceLength: asl,
    avgSyllablesPerWord: asw
  };
}

// ---- Word Frequency ----
function wordFrequency(text) {
  var words = text.toLowerCase().match(/[a-zA-Z\']+(?:-[a-zA-Z]+)*/g) || [];
  var freq = {};
  words.forEach(function(w) {
    if (w.length > 2) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq)
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 20);
}

// ---- Live update: Word Counter ----
var counterTextarea = document.getElementById('counter-input');
if (counterTextarea) {
  counterTextarea.addEventListener('input', updateCounter);
  function updateCounter() {
    var text = counterTextarea.value;
    var s = analyzeText(text);
    if (!s) {
      document.getElementById('stat-words').textContent = '0';
      document.getElementById('stat-chars').textContent = '0';
      document.getElementById('stat-chars-ns').textContent = '0';
      document.getElementById('stat-sentences').textContent = '0';
      document.getElementById('stat-paragraphs').textContent = '0';
      document.getElementById('stat-lines').textContent = '0';
      document.getElementById('stat-avg-word').textContent = '0';
      document.getElementById('stat-avg-sent').textContent = '0';
      return;
    }
    document.getElementById('stat-words').textContent = s.words;
    document.getElementById('stat-chars').textContent = s.characters;
    document.getElementById('stat-chars-ns').textContent = s.charactersNoSpace;
    document.getElementById('stat-sentences').textContent = s.sentences;
    document.getElementById('stat-paragraphs').textContent = s.paragraphs;
    document.getElementById('stat-lines').textContent = s.lines;
    document.getElementById('stat-avg-word').textContent = s.avgWordLength.toFixed(1);
    document.getElementById('stat-avg-sent').textContent = s.avgSentenceLength.toFixed(1);
  }
}

// ---- Live update: Readability Checker ----
var readabilityTextarea = document.getElementById('readability-input');
if (readabilityTextarea) {
  readabilityTextarea.addEventListener('input', updateReadability);
  function updateReadability() {
    var text = readabilityTextarea.value;
    var r = calcReadability(text);
    var resultDiv = document.getElementById('readability-result');
    if (!r) { resultDiv.classList.remove('show'); return; }
    resultDiv.classList.add('show');
    document.getElementById('rd-score').textContent = r.fleschScore;
    document.getElementById('rd-score').style.color = r.color;
    document.getElementById('rd-label').textContent = r.label;
    document.getElementById('rd-desc').textContent = r.description;
    document.getElementById('rd-grade').textContent = r.gradeLevel;
    document.getElementById('rd-syllables').textContent = r.avgSyllablesPerWord.toFixed(2);
    document.getElementById('rd-sent-len').textContent = r.avgSentenceLength.toFixed(1);
  }
}

// ---- Share / Copy functionality ----
function copyResults() {
  var text = 'ClearWrite Tools - Results:\n';
  document.querySelectorAll('.stat-card').forEach(function(card) {
    var label = card.querySelector('.stat-label').textContent;
    var value = card.querySelector('.stat-value').textContent;
    text += label + ': ' + value + '\n';
  });
  navigator.clipboard.writeText(text).then(function() {
    alert('Results copied to clipboard!');
  });
}

function clearText(areaId) {
  document.getElementById(areaId).value = '';
  var event = new Event('input');
  document.getElementById(areaId).dispatchEvent(event);
}

// ---- Text Case Converter ----
function convertCase(text, type) {
  if (!text) return "";
  switch(type) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return text.toLowerCase().replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    case "sentence": return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) { return c.toUpperCase(); });
    case "alternating": return text.split("").map(function(c, i) { return i % 2 === 0 ? c.toLowerCase() : c.toUpperCase(); }).join("");
    case "camel": return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(m, c) { return c.toUpperCase(); }).replace(/[^a-zA-Z0-9]/g, "");
  }
}

var caseTextarea = document.getElementById("case-input");
if (caseTextarea) {
  caseTextarea.addEventListener("input", updateCase);
  function updateCase() {
    var text = caseTextarea.value;
    document.getElementById("case-upper").value = convertCase(text, "upper");
    document.getElementById("case-lower").value = convertCase(text, "lower");
    document.getElementById("case-title").value = convertCase(text, "title");
    document.getElementById("case-sentence").value = convertCase(text, "sentence");
  }
}

// ---- Word Frequency Display ----
var freqTextarea = document.getElementById("freq-input");
if (freqTextarea) {
  freqTextarea.addEventListener("input", updateFrequency);
  function updateFrequency() {
    var text = freqTextarea.value;
    var list = document.getElementById("freq-list");
    if (!text.trim()) { list.innerHTML = "<p style=\"color:var(--gray-500)\">Enter text above to see word frequency.</p>"; return; }
    var freq = wordFrequency(text);
    if (freq.length === 0) { list.innerHTML = "<p style=\"color:var(--gray-500)\">No words found.</p>"; return; }
    var max = freq[0][1];
    var html = "<table style=\"width:100%;border-collapse:collapse\"><thead><tr><th style=\"text-align:left;padding:.5rem;border-bottom:2px solid var(--gray-200)\">Word</th><th style=\"text-align:right;padding:.5rem;border-bottom:2px solid var(--gray-200)\">Count</th></tr></thead><tbody>";
    freq.forEach(function(item) {
      var pct = (item[1] / max) * 100;
      html += "<tr><td style=\"padding:.4rem .5rem;border-bottom:1px solid var(--gray-100)\">" + item[0] + "</td><td style=\"padding:.4rem .5rem;border-bottom:1px solid var(--gray-100);text-align:right\"><div style=\"display:inline-block;height:20px;width:" + pct + "%;min-width:20px;background:var(--primary);border-radius:3px;color:white;font-size:.8rem;line-height:20px;padding:0 4px\">" + item[1] + "</div></td></tr>";
    });
    html += "</tbody></table>";
    list.innerHTML = html;
  }
}

// ---- Syllable Counter ----
var sylTextarea = document.getElementById("syllable-input");
if (sylTextarea) {
  sylTextarea.addEventListener("input", updateSyllable);
  function updateSyllable() {
    var text = sylTextarea.value;
    var words = text.trim().match(/[a-zA-Z\']+(?:-[a-zA-Z]+)*/g) || [];
    var total = 0;
    var wordData = [];
    words.forEach(function(w) {
      var count = countSyllables(w);
      total += count;
      wordData.push({ word: w, syllables: count });
    });
    document.getElementById("syl-total").textContent = total;
    document.getElementById("syl-words").textContent = wordData.length;
    document.getElementById("syl-avg").textContent = wordData.length > 0 ? (total / wordData.length).toFixed(1) : "0";
    
    var list = document.getElementById("syl-list");
    if (wordData.length === 0) {
      list.innerHTML = "<p style=\"color:var(--gray-500);margin-top:1rem\">Enter text above to see syllable count per word.</p>";
      return;
    }
    var html = "<div style=\"margin-top:1rem;display:flex;flex-wrap:wrap;gap:.3rem\">";
    wordData.forEach(function(item) {
      var sz = item.syllables >= 4 ? "color:#dc2626;font-weight:700" : item.syllables >= 2 ? "color:#d97706" : "color:var(--gray-700)";
      html += "<span style=\"background:var(--gray-50);border:1px solid var(--gray-200);padding:.15rem .5rem;border-radius:4px;font-size:.85rem;" + sz + "\">" + item.word + "<span style=\"margin-left:.3rem;opacity:.6\">(" + item.syllables + ")</span></span>";
    });
    html += "</div>";
    list.innerHTML = html;
  }
}

// ---- Text Diff Checker ----
function diffTexts(text1, text2) {
  var lines1 = text1.split("\n");
  var lines2 = text2.split("\n");
  var maxLen = Math.max(lines1.length, lines2.length);
  var result = [];
  for (var i = 0; i < maxLen; i++) {
    var l1 = lines1[i] || "";
    var l2 = lines2[i] || "";
    if (l1 === l2) {
      if (l1 !== "") result.push({ type: "same", text: l1 });
    } else {
      if (l1 !== "") result.push({ type: "removed", text: l1 });
      if (l2 !== "") result.push({ type: "added", text: l2 });
    }
  }
  return result;
}

var diffBtn = document.getElementById("diff-compare");
if (diffBtn) {
  diffBtn.addEventListener("click", function() {
    var t1 = document.getElementById("diff-input-1").value;
    var t2 = document.getElementById("diff-input-2").value;
    var out = document.getElementById("diff-output");
    if (!t1 && !t2) { out.innerHTML = "<p style=\"color:var(--gray-500)\">Enter text in both fields to compare.</p>"; return; }
    var diffs = diffTexts(t1 || "", t2 || "");
    if (diffs.length === 0) { out.innerHTML = "<p style=\"color:var(--gray-500)\">The two texts are identical.</p>"; return; }
    var html = "<pre style=\"font-family:monospace;font-size:.9rem;line-height:1.6;white-space:pre-wrap;padding:.5rem;background:var(--gray-50);border:1px solid var(--gray-200);border-radius:var(--radius)\">";
    var added = 0, removed = 0;
    diffs.forEach(function(d) {
      if (d.type === "added") { added++; html += "<span style=\"background:#d1fae5;color:#065f46;display:block;padding:1px 4px\">+ " + escapeHtml(d.text) + "</span>"; }
      else if (d.type === "removed") { removed++; html += "<span style=\"background:#fee2e2;color:#991b1b;display:block;padding:1px 4px\">- " + escapeHtml(d.text) + "</span>"; }
      else { html += "<span style=\"display:block;padding:1px 4px\">  " + escapeHtml(d.text) + "</span>"; }
    });
    html += "</pre>";
    html += "<p style=\"margin-top:.5rem;color:var(--gray-500);font-size:.85rem\">Added: " + added + " lines | Removed: " + removed + " lines</p>";
    out.innerHTML = html;
  });
}

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ---- Additional Readability Formulas ----
function calcGunningFog(text) {
  var s = analyzeText(text);
  if (!s || s.words < 1) return null;
  var words = text.toLowerCase().match(/[a-zA-Z\']+(?:-[a-zA-Z]+)*/g) || [];
  var complex = 0;
  words.forEach(function(w) { if (countSyllables(w) >= 3) complex++; });
  var pctHard = (complex / (words.length || 1)) * 100;
  var fog = 0.4 * (s.avgSentenceLength + pctHard);
  return { score: Math.round(fog * 10) / 10, complexWords: complex };
}

function calcColemanLiau(text) {
  var s = analyzeText(text);
  if (!s || s.words < 1) return null;
  var L = (s.charactersNoSpace / (s.words || 1)) * 100;
  var S = (s.sentences / (s.words || 1)) * 100;
  var cli = 0.0588 * L - 0.296 * S - 15.8;
  return { score: Math.round(cli * 10) / 10 };
}

// Extend readability page if extra divs exist
var rdExtraTextarea = document.getElementById("readability-input");
if (rdExtraTextarea && document.getElementById("rd-fog")) {
  rdExtraTextarea.addEventListener("input", updateExtraReadability);
  function updateExtraReadability() {
    var text = rdExtraTextarea.value;
    var fog = calcGunningFog(text);
    var cli = calcColemanLiau(text);
    if (fog) { document.getElementById("rd-fog").textContent = fog.score; document.getElementById("rd-complex").textContent = fog.complexWords; }
    if (cli) { document.getElementById("rd-cli").textContent = cli.score; }
  }
}


// ---- Random Paragraph Generator ----
var PARA_SENTENCES = [
  "Learning English opens up new opportunities for work and travel around the world.",
  "Reading books every day helps improve your vocabulary and grammar naturally.",
  "Writing short paragraphs is an excellent way to practice English composition skills.",
  "The best way to learn a new language is to use it in real conversations every day.",
  "English is one of the most widely spoken languages in business and education.",
  "Practicing English with native speakers helps you learn natural expressions and idioms.",
  "Setting daily goals for English practice will help you make steady progress over time.",
  "Listening to podcasts in English is a great way to improve your listening comprehension.",
  "English grammar rules can be confusing at first, but they become easier with regular practice.",
  "Building a strong vocabulary is essential for clear and effective communication in English.",
  "Many students find that watching English movies with subtitles helps them learn faster.",
  "Writing a daily journal in English is a simple habit that leads to big improvements.",
  "Learning English opens doors to new cultures, friendships, and professional opportunities.",
  "The key to improving your English writing is to practice regularly and seek feedback.",
  "Using online tools can help you check your grammar, readability, and word choice.",
  "English is the language of the internet, science, and international communication.",
  "Making mistakes is a natural part of learning English and should not discourage you.",
  "Focus on learning the most common English words first to build a strong foundation.",
  "Reading news articles in English keeps you informed while improving your language skills.",
  "Speaking English confidently takes time and consistent practice with real conversations.",
  "English idioms add color to your language but require understanding their cultural context.",
  "Using context clues helps you understand unfamiliar words when reading English texts.",
  "Learning English grammar through examples is often more effective than memorizing rules.",
  "Many English learners find that teaching others helps reinforce their own understanding.",
  "Consistent English practice for fifteen minutes a day is better than studying for hours once a week.",
];

function generateParagraphs(paraCount, sentPerPara) {
  var result = [];
  var used = {};
  for (var p = 0; p < paraCount; p++) {
    var para = [];
    for (var s = 0; s < sentPerPara; s++) {
      var idx = Math.floor(Math.random() * PARA_SENTENCES.length);
      used[idx] = true;
      para.push(PARA_SENTENCES[idx]);
    }
    result.push(para.join(" "));
  }
  return result;
}

var paraBtn = document.getElementById("para-generate");
if (paraBtn) {
  paraBtn.addEventListener("click", function() {
    var count = parseInt(document.getElementById("para-count").value) || 2;
    var sents = parseInt(document.getElementById("para-sents").value) || 4;
    var result = generateParagraphs(Math.min(10, Math.max(1, count)), Math.min(10, Math.max(2, sents)));
    var out = document.getElementById("para-output");
    out.value = result.join("\n\n");
  });
}

var paraCopy = document.getElementById("para-copy");
if (paraCopy) {
  paraCopy.addEventListener("click", function() {
    var out = document.getElementById("para-output");
    if (out.value) {
      navigator.clipboard.writeText(out.value).then(function() { alert("Copied to clipboard!"); });
    }
  });
}

// ---- Grammar Checker ----
var GRAMMAR_RULES = [
  { pattern: /\b(y[o]u[\u2019a]re|your)\s+[\w]+\b/gi, label: "Your vs You\'re", fix: "Check if you mean \"you are\" (you\'re) or possessive (your)." },
  { pattern: /\b(their|there|they[\u2019a]re)\s+[\w]+\b/gi, label: "There/Their/They\'re", fix: "\"There\" = place, \"Their\" = belonging, \"They\'re\" = they are." },
  { pattern: /\b(i[t][\u2019a]s|its)\s+[\w]+\b/gi, label: "Its vs It\'s", fix: "\"It\'s\" = it is, \"Its\" = possessive form of it." },
  { pattern: /\b(than|then)\s+[\w]+\b/gi, label: "Then vs Than", fix: "\"Than\" is for comparisons, \"Then\" is for time/sequence." },
  { pattern: /\ba\s+[aeiou][a-z]*\b/gi, label: "A vs An", fix: "Use \"an\" before vowel sounds, not \"a\". Example: \"an apple\" not \"a apple\"." },
  { pattern: /\ban\s+[^aeiou\s][a-z]*\b/gi, label: "An vs A", fix: "Use \"a\" before consonant sounds, not \"an\". Example: \"a university\" not \"an university\"." },
  { pattern: /\bdon[\u2019a]t\s+have\s+no\b/gi, label: "Double Negative", fix: "Use \"don\'t have any\" instead of \"don\'t have no\"." },
  { pattern: /\bcan[\u2019a]t\s+(hardly|barely|scarcely)\b/gi, label: "Double Negative", fix: "Remove \"can\'t\" when using \"hardly/barely/scarcely\". Say \"I can hardly\" not \"I can\'t hardly\"." },
  { pattern: /\bdifferent\s+than\b/gi, label: "Different From", fix: "Use \"different from\" instead of \"different than\"." },
  { pattern: /\bbased\s+off\s+of\b/gi, label: "Based On", fix: "Use \"based on\" instead of \"based off of\"." },
  { pattern: /\b(each|every|either|neither)\s+\w+\s+(are|were|have|do)\b/gi, label: "Subject-Verb Agreement", fix: "Words like each/every/either/neither take singular verbs (is/was/has/does)." },
  { pattern: /\b([Hh]e|[Ss]he|[Ii]t|[Tt]he\s+\w+)\s+(don[\u2019a]t)\b/gi, label: "Subject-Verb Agreement", fix: "He/she/it uses \"doesn\'t\" not \"don\'t\"." },
];

function checkGrammar(text) {
  var issues = [];
  GRAMMAR_RULES.forEach(function(rule) {
    var match;
    rule.pattern.lastIndex = 0;
    while ((match = rule.pattern.exec(text)) !== null) {
      var ctxStart = Math.max(0, match.index - 15);
      var ctxEnd = Math.min(text.length, match.index + match[0].length + 15);
      var context = (ctxStart > 0 ? "..." : "") + text.substring(ctxStart, ctxEnd) + (ctxEnd < text.length ? "..." : "");
      issues.push({
        match: match[0],
        label: rule.label,
        fix: rule.fix,
        context: context,
        index: match.index
      });
    }
  });
  return issues;
}

function escapeHtml2(str) {
  var d = document.createElement("div");
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

var grammarBtn = document.getElementById("grammar-check");
if (grammarBtn) {
  grammarBtn.addEventListener("click", function() {
    var text = document.getElementById("grammar-input").value;
    var out = document.getElementById("grammar-results");
    if (!text.trim()) { out.innerHTML = "<p style=\"color:var(--gray-500)\">Enter some English text to check for grammar issues.</p>"; return; }
    var issues = checkGrammar(text);
    if (issues.length === 0) {
      out.innerHTML = "<div style=\"padding:1rem;background:#d1fae5;border-radius:var(--radius);color:#065f46\"><strong>No common grammar issues found!</strong> Your text looks good.</div>";
      return;
    }
    var html = "<p style=\"margin-bottom:.75rem;font-weight:600\">Found " + issues.length + " potential issue(s):</p>";
    issues.forEach(function(issue) {
      html += '<div style="background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius);padding:1rem;margin-bottom:.75rem">';
      html += '<div style="display:inline-block;background:#fef3c7;color:#92400e;padding:.15rem .5rem;border-radius:4px;font-size:.8rem;font-weight:600;margin-bottom:.5rem">' + escapeHtml2(issue.label) + '</div>';
      html += '<div style="margin-bottom:.25rem"><span style="background:#fee2e2;padding:.1rem .3rem;border-radius:3px;font-family:monospace;font-size:.9rem">' + escapeHtml2(issue.match) + '</span></div>';
      html += '<div style="font-size:.85rem;color:var(--gray-700);margin-bottom:.35rem">Context: <span style="font-family:monospace;font-size:.8rem;background:var(--gray-50);padding:.1rem .3rem;border-radius:3px">' + escapeHtml2(issue.context) + '</span></div>';
      html += '<div style="font-size:.85rem;color:var(--gray-500)">' + escapeHtml2(issue.fix) + '</div>';
      html += '</div>';
    });
    out.innerHTML = html;
  });
}

// ============================================
// Paraphrasing Tool
// ============================================

// ============================================
// Paraphrasing Tool - v2
// ============================================

var PARA_MODE = 'standard';

var PARA_PHRASES = {
  "a lot of": ["many", "numerous", "a great deal of", "countless"],
  "in my opinion": ["from my perspective", "as I see it", "in my view"],
  "on the other hand": ["conversely", "alternatively", "in contrast"],
  "in addition": ["furthermore", "moreover", "additionally"],
  "as a result": ["consequently", "therefore", "thus"],
  "for example": ["for instance", "as an illustration"],
  "look at": ["examine", "observe", "consider"],
  "make sure": ["ensure", "guarantee", "confirm"],
  "even though": ["although", "though", "despite the fact that"]
};

var PARA_SYNONYMS = {
  "good": ["great", "excellent", "fine", "beneficial", "valuable"],
  "bad": ["poor", "negative", "harmful", "damaging"],
  "big": ["large", "huge", "enormous", "massive", "substantial"],
  "small": ["tiny", "minor", "compact", "modest", "limited"],
  "important": ["significant", "crucial", "essential", "vital", "critical"],
  "use": ["utilize", "employ", "apply", "leverage"],
  "help": ["assist", "aid", "support", "facilitate"],
  "show": ["demonstrate", "indicate", "reveal", "illustrate"],
  "make": ["create", "produce", "generate", "construct"],
  "change": ["modify", "alter", "adjust", "transform"],
  "think": ["believe", "consider", "regard", "suppose"],
  "start": ["begin", "commence", "initiate", "launch"],
  "end": ["finish", "conclude", "complete", "cease"],
  "try": ["attempt", "strive", "seek", "undertake"],
  "give": ["provide", "offer", "supply", "present"],
  "find": ["discover", "locate", "identify", "uncover"],
  "say": ["state", "declare", "express", "mention"],
  "ask": ["inquire", "request", "query"],
  "tell": ["inform", "notify", "advise"],
  "easy": ["simple", "straightforward", "effortless"],
  "hard": ["difficult", "challenging", "demanding", "tough"],
  "new": ["fresh", "novel", "modern", "recent", "innovative"],
  "happy": ["pleased", "delighted", "content", "cheerful"],
  "true": ["accurate", "correct", "precise", "genuine"],
  "clear": ["obvious", "evident", "apparent", "transparent"],
  "many": ["numerous", "countless", "abundant", "plentiful"],
  "choose": ["select", "pick out", "opt for", "decide on"],
  "learn": ["study", "master", "grasp", "comprehend"],
  "understand": ["comprehend", "grasp", "fathom", "follow"],
  "improve": ["enhance", "boost", "upgrade", "refine", "polish"],
  "explain": ["clarify", "elucidate", "expound", "illustrate"],
  "focus": ["concentrate", "center on", "zero in on"],
  "create": ["produce", "generate", "originate", "devise"],
  "need": ["require", "demand", "necessitate"],
  "way": ["method", "approach", "technique", "means"],
  "very": ["extremely", "remarkably", "exceptionally"],
  "also": ["additionally", "furthermore", "moreover"],
  "because": ["since", "as", "due to", "owing to"],
  "so": ["therefore", "thus", "consequently"],
  "but": ["however", "nevertheless", "nonetheless"],
  "better": ["superior", "improved", "enhanced"],
  "simple": ["basic", "straightforward", "plain"],
  "best": ["finest", "optimal", "premier"],
  "student": ["learner", "pupil", "scholar"],
  "writing": ["composition", "text", "content", "prose"],
  "example": ["illustration", "instance", "sample"],
  "idea": ["concept", "notion", "thought", "viewpoint"],
  "grammar": ["syntax", "usage", "sentence structure"],
  "write": ["compose", "draft", "author"],
  "skill": ["ability", "capability", "competence", "proficiency"],
  "knowledge": ["understanding", "awareness", "familiarity"],
  "goal": ["objective", "aim", "target", "aspiration"]
};

var PARA_FORMAL = {
  "help": ["assist", "facilitate", "be of assistance"],
  "use": ["utilize", "employ", "make use of"],
  "start": ["commence", "initiate", "embark upon"],
  "end": ["terminate", "conclude", "cease"],
  "get": ["obtain", "receive", "procure"],
  "give": ["provide", "furnish", "supply"],
  "make": ["manufacture", "produce", "fabricate"],
  "tell": ["inform", "notify", "apprise"],
  "try": ["endeavor", "attempt"],
  "improve": ["enhance", "ameliorate", "optimize"],
  "enough": ["sufficient", "adequate", "ample"],
  "about": ["regarding", "concerning"],
  "before": ["prior to", "preceding"],
  "after": ["subsequent to", "following"],
  "but": ["however", "nevertheless"],
  "so": ["therefore", "consequently"],
  "need": ["requirement", "necessity"]
};

var PARA_CREATIVE = {
  "good": ["outstanding", "splendid", "marvelous", "superb"],
  "bad": ["dreadful", "appalling", "atrocious", "abysmal"],
  "big": ["tremendous", "immense", "colossal", "monumental"],
  "new": ["groundbreaking", "revolutionary", "cutting-edge"],
  "happy": ["overjoyed", "ecstatic", "elated"],
  "hard": ["herculean", "strenuous", "formidable"],
  "easy": ["a breeze", "effortless", "painless"],
  "try": ["give it a shot", "have a go at"],
  "think": ["ponder", "contemplate", "mull over"],
  "important": ["paramount", "imperative"],
  "improve": ["supercharge", "turbocharge", "elevate"],
  "learn": ["master", "get the hang of"],
  "help": ["empower", "uplift", "bolster"],
  "strong": ["indomitable", "invincible", "unyielding"],
  "change": ["metamorphose", "revolutionize"]
};

function structuralTransforms(text) {
  var t = [
    function(s) {
      return s.replace(/^There (is|are) (a|an|the|some|many) (.+?)(\.|$)/i, function(m, v, d, rest, p) {
        if (Math.random() > 0.5) return m;
        var fw = rest.trim().split(/\s+/)[0];
        return fw.charAt(0).toUpperCase() + fw.slice(1) + rest.trim().substring(fw.length) + ' ' + (v === 'is' ? 'exists' : 'exist') + p;
      });
    },
    function(s) {
      return s.replace(/^(I think |I believe )(that )?(.+)\.?$/i, function(m, intro, that, rest) {
        if (Math.random() > 0.5) return m;
        var ops = ['In my view, ', 'From my perspective, ', 'As I see it, '];
        return ops[Math.floor(Math.random() * ops.length)] + rest + '.';
      });
    },
    function(s) {
      return s.replace(/^It is (important|essential|necessary|crucial|vital) to (.+)$/i, function(m, adj, rest) {
        if (Math.random() > 0.5) return m;
        var alt = {important:'vital', essential:'key', necessary:'needed', crucial:'critical', vital:'essential'};
        return 'It is ' + (alt[adj.toLowerCase()] || adj) + ' that one ' + rest;
      });
    }
  ];
  for (var i = 0; i < t.length; i++) text = t[i](text);
  return text;
}

function setParaMode(mode) {
  PARA_MODE = mode;
  document.querySelectorAll('.para-mode-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-mode') === mode);
  });
}

function clearParaphrase() {
  document.getElementById('para-input').value = '';
  document.getElementById('para-output').textContent = '';
  document.getElementById('para-error').style.display = 'none';
  document.getElementById('para-stats').textContent = '';
}

function paraphraseText() {
  var input = document.getElementById('para-input');
  var output = document.getElementById('para-output');
  var error = document.getElementById('para-error');
  var stats = document.getElementById('para-stats');
  var text = input.value.trim();
  error.style.display = 'none';
  if (!text) { error.textContent = 'Please enter some text.'; error.style.display = 'block'; return; }
  if (text.length < 10) { error.textContent = 'Need at least 10 characters.'; error.style.display = 'block'; return; }

  text = structuralTransforms(text);
  var sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  var result = sentences.map(function(s) { return paraSentence(s.trim()); }).join(' ');
  output.textContent = result;
  stats.innerHTML = '<span>Original: ' + text.split(/\s+/).length + ' words</span><span>Paraphrased: ' + result.split(/\s+/).length + ' words</span>';
}

function paraSentence(sentence) {
  if (!sentence) return '';
  var extra = PARA_MODE === 'formal' ? PARA_FORMAL : PARA_MODE === 'creative' ? PARA_CREATIVE : {};
  var dict = Object.assign({}, PARA_SYNONYMS, extra);
  var res = sentence;

  var pk = Object.keys(PARA_PHRASES).sort(function(a,b){return b.length-a.length;});
  for (var i = 0; i < pk.length; i++) {
    if (Math.random() > 0.5) continue;
    var re = new RegExp('\\b' + pk[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    res = res.replace(re, PARA_PHRASES[pk[i]][Math.floor(Math.random() * PARA_PHRASES[pk[i]].length)]);
  }

  return res.split(/(\s+|[.,!?;:\'"])/).map(function(w) {
    var c = w.toLowerCase().replace(/[^a-z]/g, '');
    if (c.length < 3) return w;
    var s = dict[c];
    if (s && s.length > 0 && Math.random() > 0.4) {
      var r = s[Math.floor(Math.random() * s.length)];
      if (w[0] === w[0].toUpperCase() && w.length > 1) r = r.charAt(0).toUpperCase() + r.slice(1);
      return r + w.replace(/[a-zA-Z]/g, '');
    }
    return w;
  }).join('');
}

// HuggingFace AI Paraphraser (proxied via Cloudflare Worker)
var HF_API = 'https://dawn-cloud-353a.616699266.workers.dev';

async function paraphraseAI() {
  var input = document.getElementById('para-input');
  var output = document.getElementById('para-output');
  var error = document.getElementById('para-error');
  var stats = document.getElementById('para-stats');
  var loading = document.getElementById('para-loading');
  var text = input.value.trim();
  error.style.display = 'none';
  if (!text) { error.textContent = 'Please enter some text.'; error.style.display = 'block'; return; }
  if (text.length < 10) { error.textContent = 'Need at least 10 characters.'; error.style.display = 'block'; return; }

  loading.style.display = 'block';
  output.textContent = '';
  stats.textContent = '';

  try {
    // Prepare the prompt
    var mode = PARA_MODE;
    var prompt = mode === 'formal' ? 'paraphrase formally: ' + text
      : mode === 'creative' ? 'paraphrase creatively: ' + text
      : 'paraphrase: ' + text;

    var res = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { num_beams: 5, temperature: mode === 'creative' ? 1.0 : 0.7, max_length: 256 }
      })
    });

    // Handle 503 cold start - try once after waiting
    if (res.status === 503) {
      loading.querySelector('span').textContent = 'Warming up AI model...';
      await new Promise(function(r) { setTimeout(r, 20000); });
      res = await fetch(HF_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { num_beams: 5, temperature: mode === 'creative' ? 1.0 : 0.7, max_length: 256 }
        })
      });
    }

    if (!res.ok) {
      var errBody = await res.text();
      throw new Error('HTTP ' + res.status + ': ' + errBody.substring(0, 200));
    }

    var result = await res.json();
    loading.style.display = 'none';

    if (result && result[0] && result[0].generated_text) {
      var generated = result[0].generated_text;
      output.textContent = generated;
      stats.innerHTML = '<span>AI paraphrased</span><span>Model: T5-base</span>';
    } else {
      console.log('HF response:', JSON.stringify(result));
      throw new Error('Unexpected API response format');
    }
  } catch (e) {
    loading.style.display = 'none';
    error.textContent = 'AI error: ' + e.message + '. Try the regular Paraphrase button.';
    error.style.display = 'block';
  }
}
