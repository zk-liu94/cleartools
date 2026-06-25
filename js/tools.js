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
