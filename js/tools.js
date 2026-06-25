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
