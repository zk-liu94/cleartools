var NAV_PAGES = [
  { href: "/", label: "Home" },
  { href: "/word-counter.html", label: "Word Counter" },
  { href: "/readability-checker.html", label: "Readability" },
  { href: "/text-case-converter.html", label: "Case Converter" },
  { href: "/word-frequency.html", label: "Word Freq" },
  { href: "/syllable-counter.html", label: "Syllables" },
  { href: "/text-diff-checker.html", label: "Text Diff" },
  { href: "/random-paragraph-generator.html", label: "Paragraphs" },
  { href: "/grammar-checker.html", label: "Grammar" },
];
document.addEventListener("DOMContentLoaded", function() {
  var ph = document.getElementById("nav-placeholder");
  if (!ph) return;
  var curr = window.location.pathname.replace(/\/$/, "") || "/";
  var links = "";
  NAV_PAGES.forEach(function(p) {
    var active = curr === p.href ? " class=\"active\"" : "";
    links += "<li><a href=\"" + p.href + "\"" + active + ">" + p.label + "</a></li>";
  });
  ph.innerHTML = "<nav class=\"nav\"><div class=\"container\"><a href=\"/\" class=\"nav-logo\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\"/><path d=\"M2 17l10 5 10-5\"/><path d=\"M2 12l10 5 10-5\"/></svg>ClearWrite</a><ul class=\"nav-links\">" + links + "</ul></div></nav>";
});
