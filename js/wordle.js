// ============================================================
// Wordle for English Learners - Game Logic
// ============================================================

var WORDLE_ANSWERS = [
  "about","above","abuse","adult","after","again","agree","allow","alone","along",
  "among","angel","anger","apple","apply","arena","argue","arise","aside","avoid",
  "award","basic","beach","begin","being","below","bench","birth","black","blade",
  "blame","blank","blast","blaze","bleed","blend","bless","blind","block","blood",
  "bloom","board","boast","bonus","boost","bound","brain","brand","brave","bread",
  "break","breed","brick","brief","bring","broad","broke","brook","brown","brush",
  "buddy","build","bunch","burst","cabin","candy","cargo","carry","catch","cause",
  "chain","chair","chalk","chaos","charm","chart","chase","cheap","check","cheek",
  "cheer","chess","chest","chief","child","chill","china","chunk","civic","claim",
  "clash","class","clean","clear","clerk","click","cliff","climb","cling","clock",
  "close","cloth","cloud","coach","coast","color","comet","count","court","cover",
  "crack","craft","crane","crash","crawl","crazy","cream","crest","crime","crisp",
  "cross","crowd","crown","crush","curve","cycle","daily","dance","dealt","death",
  "decay","decor","delay","delta","dense","depth","derby","desk","deter","devil",
  "diary","dirty","disco","ditch","dizzy","dodge","doubt","dough","draft","drain",
  "drama","drank","drape","drawl","dread","dream","dress","dried","drift","drill",
  "drink","drive","drone","drown","drum","drunk","dying","eager","early","earth",
  "eight","elder","elect","elite","embed","ember","empty","enact","endow","enemy",
  "enjoy","enter","entry","equal","equip","error","essay","event","every","evict",
  "exact","exalt","exams","excel","exert","exist","extra","fable","facet","faint",
  "fairy","faith","false","fancy","fatal","fault","feast","fence","ferry","fetch",
  "fever","fewer","fiber","field","fifth","fifty","fight","final","first","fixed",
  "flame","flash","fleet","flesh","float","flood","floor","flora","flour","fluid",
  "flush","focus","force","forge","forth","forum","found","frame","frank","fraud",
  "fresh","front","frost","froze","fruit","fully","funny","ghost","giant","given",
  "glass","globe","gloom","glory","gloss","glove","going","grace","grade","grain",
  "grand","grant","grape","graph","grasp","grass","grave","great","greed","green",
  "greet","grief","grill","grind","groan","groom","gross","group","grove","grown",
  "guard","guess","guest","guide","guild","guilt","guise","gulch","gully","gummy",
  "heart","heavy","hello","honey","horse","hotel","house","human","humor","image",
  "imply","index","inner","input","irony","ivory","jewel","joint","joker","judge",
  "juice","kebab","knock","known","label","labor","large","laser","later","laugh",
  "layer","learn","lease","least","leave","legal","lemon","level","lever","light",
  "limit","linen","liner","lodge","logic","loose","lover","lower","loyal","lucky",
  "lunar","lunch","lying","magic","major","maker","manor","maple","march","marry",
  "match","mayor","media","mercy","merit","metal","meter","might","minor","minus",
  "mirror","model","money","month","moral","motor","mount","mouse","mouth","movie",
  "music","naive","naked","narrow","nasal","nasty","nation","native","nature","naval",
  "never","newly","night","noble","noise","north","nosed","noted","novel","nurse",
  "nylon","occur","ocean","offer","often","olive","onset","opera","orbit","order",
  "organ","other","ought","outer","owner","oxide","ozone","paint","panel","panic",
  "paper","party","pasta","paste","patch","pause","peace","pearl","penny","perch",
  "phase","phone","photo","piano","piece","pilot","pinch","pitch","pixel","pizza",
  "place","plaid","plain","plane","plant","plate","plaza","plead","pluck","plumb",
  "plume","plump","plunge","point","polar","pound","power","press","price","pride",
  "prime","print","prior","prize","probe","proof","prose","proud","prove","psalm",
  "pulse","punch","pupil","purse","queen","query","quest","queue","quick","quiet",
  "quote","radar","radio","raise","rally","ranch","range","rapid","ratio","reach",
  "react","realm","rebel","refer","reign","relax","reply","rider","ridge","rifle",
  "right","rigid","risky","rival","river","robin","robot","rocky","roman","roost",
  "rough","round","route","royal","rugby","ruler","rural","saint","salad","salon",
  "sauce","scale","scare","scene","scent","scope","score","scout","scrap","sense",
  "serve","setup","seven","shade","shaft","shake","shall","shame","shape","share",
  "shark","sharp","sheep","sheer","sheet","shelf","shell","shift","shine","shirt",
  "shock","shore","short","shout","shove","sight","sigma","silly","since","sixth",
  "sixty","skate","skill","skull","slash","slate","slave","sleep","slice","slide",
  "slope","small","smart","smell","smile","smoke","snack","snake","solid","solve",
  "sorry","sound","south","space","spare","spark","speak","speed","spell","spend",
  "spice","spill","spine","spite","split","spoke","spoon","sport","spray","squad",
  "stack","staff","stage","stain","stake","stale","stall","stamp","stand","stark",
  "start","state","stave","steady","steal","steam","steel","steep","steer","stern",
  "stick","stiff","still","stock","stone","stood","stool","store","storm","story",
  "stove","strap","straw","strip","stuck","study","stuff","style","sugar","suite",
  "sunny","super","surge","sweet","swift","swing","sword","swore","sworn","syrup",
  "table","taste","teach","teeth","tends","theme","there","thick","thief","thing",
  "think","third","thorn","those","three","threw","throw","thumb","tiger","tight",
  "timer","tired","title","toast","today","token","total","touch","tough","towel",
  "tower","toxic","trace","track","trade","trail","train","trait","trash","treat",
  "trend","trial","tribe","trick","tried","troop","truck","truly","trump","trunk",
  "trust","truth","tumor","tuned","twice","twist","ultra","uncle","under","unfair",
  "union","unite","unity","until","upper","upset","urban","usage","usual","utter",
  "valid","value","valve","vapor","vault","venue","verse","video","vigor","vinyl",
  "viola","viral","visit","visor","vista","vital","vivid","vocal","vodka","voice",
  "voter","wagon","waist","waste","watch","water","weary","weave","wedge","weigh",
  "weird","whale","wheat","wheel","where","which","while","white","whole","whose",
  "widen","woman","world","worry","worse","worst","worth","would","wound","wrath",
  "write","wrote","yacht","yield","young","youth","zebra"
];

// Valid guesses (same as answers list)
var WORDLE_VALID = WORDLE_ANSWERS;

// ---- Wordle Game State ----
var wlCurrentRow = 0;
var wlCurrentCol = 0;
var wlAnswer = "";
var wlGameOver = false;
var wlScore = 0;
var wlWordNumber = 1;
var wlGamesPlayed = 0;
var wlGamesWon = 0;
var wlStreak = 0;
var wlBestStreak = 0;

function wordleInit() {
  // Load saved stats
  wlScore = parseInt(localStorage.getItem("wlScore")) || 0;
  wlStreak = parseInt(localStorage.getItem("wlStreak")) || 0;
  wlBestStreak = parseInt(localStorage.getItem("wlBestStreak")) || 0;
  wlGamesPlayed = parseInt(localStorage.getItem("wlGamesPlayed")) || 0;
  wlGamesWon = parseInt(localStorage.getItem("wlGamesWon")) || 0;
  wlWordNumber = parseInt(localStorage.getItem("wlWordNumber")) || 1;
  wlAnswer = WORDLE_ANSWERS[Math.floor(Math.random() * WORDLE_ANSWERS.length)];
  wlCurrentRow = 0;
  wlCurrentCol = 0;
  wlGameOver = false;
  wordleGuesses = [];
  wordleRenderBoard();
  wordleRenderKeyboard();
  wordleShowMessage("");
}

function wlEndGame(won) {
  wlGameOver = true;
  wlGamesPlayed++;
  if (won) { wlGamesWon++; wlStreak++; if (wlStreak > wlBestStreak) wlBestStreak = wlStreak; }
  else { wlStreak = 0; }
  wlSaveStats();
  wlUpdateDisplay();
  document.getElementById("wl-level-display").textContent = "Word #" + wlWordNumber + " — " + (won ? "Solved!" : "Game Over");
  document.getElementById("wl-next-btn").style.display = "inline-flex";
}

function wordleSubmitGuess() {
  if (wlGameOver) return;
  var guess = "";
  for (var c = 0; c < 5; c++) {
    var cell = document.getElementById("wl-cell-" + wlCurrentRow + "-" + c);
    if (!cell || !cell.textContent) { wordleShowMessage("Not enough letters"); return; }
    guess += cell.textContent.toLowerCase();
  }
  if (WORDLE_VALID.indexOf(guess) === -1) { wordleShowMessage("Not in word list"); return; }
  var result = wordleCheckGuess(guess, wlAnswer);
  for (var c2 = 0; c2 < 5; c2++) {
    var cell2 = document.getElementById("wl-cell-" + wlCurrentRow + "-" + c2);
    cell2.classList.add("wq-cell-" + result[c2]);
    wordleUpdateKey(guess[c2], result[c2]);
  }
  wlCurrentRow++;
  wlCurrentCol = 0;
  if (guess === wlAnswer) {
    var pts = [0,50,40,30,20,10,5][wlCurrentRow] || 0;
    wlScore += pts;
    wordleShowMessage("Correct! +" + pts + "pts. The word was " + wlAnswer.toUpperCase() + "!");
    wlEndGame(true);
  } else if (wlCurrentRow >= 6) {
    wordleShowMessage("The word was " + wlAnswer.toUpperCase() + ".");
    wlEndGame(false);
  }
}
function wordleUpdateKey(letter, status) {
  var key = document.getElementById("wl-key-" + letter);
  if (key) {
    if (status === "correct") { key.className = "wq-key wq-key-correct"; }
    else if (status === "present" && !key.classList.contains("wq-key-correct")) { key.className = "wq-key wq-key-present"; }
    else if (!key.classList.contains("wq-key-correct") && !key.classList.contains("wq-key-present")) { key.className = "wq-key wq-key-absent"; }
  }
}

function wordleTypeLetter(letter) {
  if (wlGameOver || wlCurrentCol >= 5) return;
  var cell = document.getElementById("wl-cell-" + wlCurrentRow + "-" + wlCurrentCol);
  if (cell) { cell.textContent = letter.toUpperCase(); wlCurrentCol++; }
}

function wordleDeleteLetter() {
  if (wlGameOver || wlCurrentCol <= 0) return;
  wlCurrentCol--;
  var cell = document.getElementById("wl-cell-" + wlCurrentRow + "-" + wlCurrentCol);
  if (cell) cell.textContent = "";
}

function wordleShowMessage(msg) {
  var el = document.getElementById("wl-message");
  if (el) el.textContent = msg;
}

function wordleRenderBoard() {
  var board = document.getElementById("wl-board");
  if (!board) return;
  board.innerHTML = "";
  for (var r = 0; r < 6; r++) {
    var row = document.createElement("div");
    row.className = "wq-row";
    for (var c = 0; c < 5; c++) {
      var cell = document.createElement("div");
      cell.className = "wq-cell";
      cell.id = "wl-cell-" + r + "-" + c;
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

function wordleRenderKeyboard() {
  var kb = document.getElementById("wl-keyboard");
  if (!kb) return;
  var rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  kb.innerHTML = "";
  rows.forEach(function(r, ri) {
    var row = document.createElement("div");
    row.className = "wq-kb-row";
    if (ri === 2) {
      var enter = document.createElement("button");
      enter.className = "wq-key wq-key-wide";
      enter.textContent = "Enter";
      enter.onclick = function() { wordleSubmitGuess(); };
      row.appendChild(enter);
    }
    for (var i = 0; i < r.length; i++) {
      var key = document.createElement("button");
      key.className = "wq-key";
      key.id = "wl-key-" + r[i];
      key.textContent = r[i].toUpperCase();
      key.onclick = (function(l) { return function() { wordleTypeLetter(l); }; })(r[i]);
      row.appendChild(key);
    }
    if (ri === 2) {
      var del = document.createElement("button");
      del.className = "wq-key wq-key-wide";
      del.textContent = "Del";
      del.onclick = function() { wordleDeleteLetter(); };
      row.appendChild(del);
    }
    kb.appendChild(row);
  });
}

// ---- Stats functions ----
function wlSaveStats() {
  localStorage.setItem("wlScore", wlScore);
  localStorage.setItem("wlStreak", wlStreak);
  localStorage.setItem("wlBestStreak", wlBestStreak);
  localStorage.setItem("wlGamesPlayed", wlGamesPlayed);
  localStorage.setItem("wlGamesWon", wlGamesWon);
  localStorage.setItem("wlWordNumber", wlWordNumber);
}

function wlUpdateDisplay() {
  document.getElementById("wl-score-display").textContent = wlScore;
  document.getElementById("wl-streak-display").textContent = wlStreak;
  document.getElementById("wl-beststreak-display").textContent = wlBestStreak;
  document.getElementById("wl-games-display").textContent = wlGamesPlayed;
  document.getElementById("wl-winrate-display").textContent = wlGamesPlayed > 0 ? Math.round(wlGamesWon / wlGamesPlayed * 100) + "%" : "0%";
}

function wordleResetStats() {
  if (!confirm("Reset all stats and progress?")) return;
  wlScore = 0;
  wlWordNumber = 1;
  wlGamesPlayed = 0;
  wlGamesWon = 0;
  wlStreak = 0;
  wlBestStreak = 0;
  wlSaveStats();
  wlUpdateDisplay();
  wordleInit();
}

function wordleNextWord() {
  document.getElementById("wl-next-btn").style.display = "none";
  wlWordNumber++;
  document.getElementById("wl-level-display").textContent = "Word #" + wlWordNumber;
  wlSaveStats();
  wordleInit();
}

// ---- Check guess against answer ----
function wordleCheckGuess(guess, answer) {
  var result = [];
  var answerChars = answer.split("");
  var guessChars = guess.split("");
  // First pass: mark exact matches
  for (var i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = null;
    } else {
      result[i] = null;
    }
  }
  // Second pass: mark present (wrong position)
  for (var i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    var idx = answerChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerChars[idx] = null;
    } else {
      result[i] = "absent";
    }
  }
  return result;
}

// ---- Physical keyboard support ----
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") { wordleSubmitGuess(); return; }
  if (e.key === "Backspace") { wordleDeleteLetter(); return; }
  if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) { wordleTypeLetter(e.key.toLowerCase()); }
});
