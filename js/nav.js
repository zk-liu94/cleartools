// MailerLite Universal
(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account', '2477552');

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
  { href: "/wordle.html", label: "Word Quest" },
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

  // Inject newsletter section before footer on tool pages
  var footer = document.querySelector("footer.footer");
  if (footer && !document.getElementById("subscribe-section-injected")) {
    var sub = document.createElement("section");
    sub.className = "subscribe-section";
    sub.id = "subscribe-section-injected";
    sub.innerHTML = '<h2>Get Weekly English Writing Tips</h2><p>Join English learners who improve their writing with free tips, tools, and resources delivered to your inbox every week.</p><button class="btn btn-primary btn-lg ml-onclick-form" onclick="ml(\'show\', \'yqoy61\', true)" style="font-size:1.05rem;padding:.8rem 2rem;border:none;cursor:pointer">Subscribe Free</button><p class="subscribe-small">No spam. Unsubscribe anytime.</p>';
    footer.parentNode.insertBefore(sub, footer);
  }
});
