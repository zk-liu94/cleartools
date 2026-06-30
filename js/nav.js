// MailerLite Universal
(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account', '2477552');

// MailerLite subscribe handler (called from form onsubmit)
function mlSubscribe(event, formId) {
  event.preventDefault();
  var form = document.getElementById(formId);
  var email = form.querySelector('input[name="email"]').value;
  var successEl = document.getElementById('ml-success-' + formId.replace('ml-form-', ''));
  var btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Subscribing...';

  // JSONP approach: create a script tag to avoid CORS issues entirely
  window.mlCallback = function(data) {
    // Callback from MailerLite - ignore result, just show success
  };

  var script = document.createElement('script');
  script.src = 'https://assets.mailerlite.com/jsonp/2477552/forms/IPfNga/subscribe?email=' + encodeURIComponent(email) + '&callback=mlCallback';
  script.onload = function() { document.body.removeChild(script); };
  script.onerror = function() { document.body.removeChild(script); };
  document.body.appendChild(script);

  // Show success immediately - the subscription was submitted
  form.style.display = 'none';
  if (successEl) successEl.style.display = 'block';
  return false;
}

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
    sub.innerHTML = '<h2>Get Weekly English Writing Tips</h2><p>Join English learners who improve their writing with free tips, tools, and resources delivered to your inbox every week.</p><form class="subscribe-form" id="ml-form-tool" onsubmit="return mlSubscribe(event, \'ml-form-tool\')"><input type="email" name="email" placeholder="Your email address" required><button type="submit">Subscribe Free</button></form><div class="ml-success" id="ml-success-tool" style="display:none;color:#6aaa64;font-weight:700">Thanks! Check your inbox to confirm.</div><p class="subscribe-small">No spam. Unsubscribe anytime.</p>';
    footer.parentNode.insertBefore(sub, footer);
  }
});
