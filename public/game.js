/* Orbite — couche « jeu vidéo » : coéquipiers animés (personnages originaux), boss, combos, sons, confettis.
   Chargé avant app.js ; n'utilise les fonctions de l'appli (h, S, Store, rankOf, render…) qu'au moment des appels. */
"use strict";

/* ---------- Dessins (SVG originaux) ---------- */
const M = (happy, sad, neutral) => `<g class="mh">${happy}</g><g class="ms">${sad}</g><g class="mn">${neutral}</g>`;

const SVG_BIP = `<svg viewBox="0 0 120 150" aria-hidden="true"><g class="bd-body">
<ellipse cx="60" cy="146" rx="30" ry="4" fill="rgba(0,0,0,.25)"/>
<line x1="60" y1="16" x2="60" y2="34" stroke="#9fb3d9" stroke-width="4" stroke-linecap="round"/>
<circle class="bd-ant" cx="60" cy="13" r="7" fill="#FF6F59"/>
<rect x="15" y="54" width="10" height="20" rx="5" fill="#9fb3d9"/><rect x="95" y="54" width="10" height="20" rx="5" fill="#9fb3d9"/>
<rect x="22" y="32" width="76" height="62" rx="18" fill="#d6e0f7"/>
<rect x="30" y="40" width="60" height="44" rx="12" fill="#121c45"/>
<g class="bd-eyes"><rect x="40" y="50" width="12" height="15" rx="5" fill="#5EE6B5"/><rect x="68" y="50" width="12" height="15" rx="5" fill="#5EE6B5"/></g>
<circle cx="37" cy="72" r="3.5" fill="#FF7AA2" opacity=".55"/><circle cx="83" cy="72" r="3.5" fill="#FF7AA2" opacity=".55"/>
${M('<path d="M46 70 Q60 82 74 70" stroke="#5EE6B5" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '<path d="M47 78 Q60 68 73 78" stroke="#FF6F59" stroke-width="4" fill="none" stroke-linecap="round"/><text x="78" y="60" font-size="12" fill="#FFC145" font-family="monospace">?!</text>',
    '<path d="M49 74 H71" stroke="#5EE6B5" stroke-width="4" stroke-linecap="round"/>')}
<rect class="bd-arm-l" x="17" y="98" width="14" height="28" rx="7" fill="#d6e0f7"/><rect class="bd-arm-r" x="89" y="98" width="14" height="28" rx="7" fill="#d6e0f7"/>
<rect x="33" y="95" width="54" height="36" rx="12" fill="#aebfe9"/>
<circle class="bd-light" cx="60" cy="112" r="7" fill="#FFC145"/>
<rect x="40" y="129" width="14" height="14" rx="5" fill="#8195c4"/><rect x="66" y="129" width="14" height="14" rx="5" fill="#8195c4"/>
</g></svg>`;

const SVG_NOVA = `<svg viewBox="0 0 120 150" aria-hidden="true"><g class="bd-body">
<ellipse cx="60" cy="146" rx="30" ry="4" fill="rgba(0,0,0,.25)"/>
<path class="bd-scarf" d="M70 92 C88 88 98 96 110 90 C104 100 92 104 76 102 Z" fill="#FF4D4D"/>
<rect x="36" y="94" width="48" height="40" rx="14" fill="#2BB3A6"/>
<rect x="44" y="104" width="32" height="8" rx="4" fill="#FFC145"/>
<rect class="bd-arm-l" x="22" y="98" width="13" height="28" rx="6.5" fill="#2BB3A6"/><rect class="bd-arm-r" x="85" y="98" width="13" height="28" rx="6.5" fill="#2BB3A6"/>
<circle cx="28" cy="127" r="6" fill="#f2f5ff"/><circle cx="92" cy="127" r="6" fill="#f2f5ff"/>
<path d="M46 88 Q60 96 74 88 L74 96 Q60 102 46 96 Z" fill="#FF4D4D"/>
<circle cx="60" cy="56" r="36" fill="#f2f5ff"/>
<path d="M27 46 A36 36 0 0 1 93 46" stroke="#FF9A5B" stroke-width="7" fill="none"/>
<circle cx="60" cy="62" r="25" fill="#C98B5E"/>
<path d="M36 52 Q44 34 60 36 Q78 34 84 52 Q74 44 60 46 Q46 44 36 52 Z" fill="#3B2416"/>
<rect x="30" y="26" width="60" height="14" rx="7" fill="#1d2a5c" opacity=".92"/>
<rect x="38" y="29" width="18" height="5" rx="2.5" fill="#7CC8FF" opacity=".8"/>
<g class="bd-eyes"><ellipse cx="51" cy="61" rx="3.6" ry="4.4" fill="#1b1230"/><ellipse cx="69" cy="61" rx="3.6" ry="4.4" fill="#1b1230"/></g>
<circle cx="45" cy="70" r="3.5" fill="#E86A5A" opacity=".5"/><circle cx="75" cy="70" r="3.5" fill="#E86A5A" opacity=".5"/>
${M('<path d="M50 71 Q60 81 70 71 Z" fill="#7a1f1f"/>',
    '<path d="M51 76 Q60 70 69 76" stroke="#3b1515" stroke-width="3" fill="none" stroke-linecap="round"/>',
    '<path d="M53 73 Q60 77 67 73" stroke="#3b1515" stroke-width="3" fill="none" stroke-linecap="round"/>')}
<rect x="42" y="132" width="14" height="12" rx="5" fill="#1d2a5c"/><rect x="64" y="132" width="14" height="12" rx="5" fill="#1d2a5c"/>
</g></svg>`;

const SVG_KAZE = `<svg viewBox="0 0 120 150" aria-hidden="true"><g class="bd-body">
<ellipse cx="60" cy="146" rx="30" ry="4" fill="rgba(0,0,0,.25)"/>
<path class="bd-scarf" d="M84 46 C98 40 104 50 116 44 C110 56 98 58 86 54 Z" fill="#FFC145"/>
<rect x="38" y="92" width="44" height="40" rx="14" fill="#2E2459"/>
<path d="M38 104 L82 98 L82 106 L38 112 Z" fill="#FFC145"/>
<rect class="bd-arm-l" x="24" y="96" width="13" height="28" rx="6.5" fill="#2E2459"/><rect class="bd-arm-r" x="83" y="96" width="13" height="28" rx="6.5" fill="#2E2459"/>
<circle cx="60" cy="58" r="34" fill="#3A2C70"/>
<rect x="28" y="40" width="64" height="9" rx="4.5" fill="#FFC145"/>
<rect x="34" y="52" width="52" height="20" rx="10" fill="#E8B58A"/>
${M('<path d="M44 64 Q49 56 54 64" stroke="#1b1230" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M66 64 Q71 56 76 64" stroke="#1b1230" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    '<path d="M44 60 L54 64" stroke="#1b1230" stroke-width="3.5" stroke-linecap="round"/><path d="M76 60 L66 64" stroke="#1b1230" stroke-width="3.5" stroke-linecap="round"/><path d="M78 70 Q81 76 78 79 Q75 76 78 70 Z" fill="#7CC8FF"/>',
    '<g class="bd-eyes"><ellipse cx="49" cy="62" rx="3.8" ry="4.6" fill="#1b1230"/><ellipse cx="71" cy="62" rx="3.8" ry="4.6" fill="#1b1230"/></g>')}
<path d="M30 74 Q60 90 90 74 L90 82 Q60 98 30 82 Z" fill="#2E2459"/>
<rect x="42" y="130" width="14" height="13" rx="5" fill="#1b1538"/><rect x="64" y="130" width="14" height="13" rx="5" fill="#1b1538"/>
</g></svg>`;

const SVG_ZEB = `<svg viewBox="0 0 120 150" aria-hidden="true"><g class="bd-body">
<ellipse cx="60" cy="146" rx="32" ry="4" fill="rgba(0,0,0,.25)"/>
<rect x="32" y="94" width="56" height="40" rx="16" fill="#4FA35B"/>
<rect x="46" y="104" width="28" height="16" rx="4" fill="#3d8a48"/>
<rect x="50" y="98" width="4" height="12" rx="2" fill="#FFC145"/><rect x="58" y="96" width="4" height="14" rx="2" fill="#7CC8FF"/>
<rect class="bd-arm-l" x="18" y="98" width="14" height="28" rx="7" fill="#F1C7A0"/><rect class="bd-arm-r" x="88" y="98" width="14" height="28" rx="7" fill="#F1C7A0"/>
<circle cx="60" cy="58" r="32" fill="#F1C7A0"/>
<circle cx="40" cy="28" r="8" fill="#FF8A3D"/><circle cx="60" cy="22" r="9" fill="#FF8A3D"/><circle cx="80" cy="28" r="8" fill="#FF8A3D"/>
<rect x="28" y="36" width="64" height="7" rx="3.5" fill="#7a4a24"/>
<circle cx="45" cy="38" r="9" fill="#8fd3ff" stroke="#7a4a24" stroke-width="3"/><circle cx="75" cy="38" r="9" fill="#8fd3ff" stroke="#7a4a24" stroke-width="3"/>
<g class="bd-eyes"><circle cx="48" cy="58" r="7" fill="#fff"/><circle cx="72" cy="58" r="7" fill="#fff"/><circle cx="49" cy="59" r="3.4" fill="#1b1230"/><circle cx="73" cy="59" r="3.4" fill="#1b1230"/></g>
<circle cx="60" cy="67" r="5" fill="#E7A27C"/>
<path d="M30 70 Q34 96 60 98 Q86 96 90 70 Q80 80 60 80 Q40 80 30 70 Z" fill="#FF8A3D"/>
${M('<path d="M50 80 Q60 90 70 80 Z" fill="#6b1d1d"/>',
    '<path d="M51 86 Q60 79 69 86" stroke="#6b1d1d" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="86" cy="50" r="3" fill="#7CC8FF"/>',
    '<path d="M53 83 H67" stroke="#6b1d1d" stroke-width="3" stroke-linecap="round"/>')}
<rect x="40" y="132" width="15" height="12" rx="5" fill="#5b3b20"/><rect x="65" y="132" width="15" height="12" rx="5" fill="#5b3b20"/>
</g></svg>`;

function bossSvg(b) {
  const acc = b.acc === "cap"
    ? `<path d="M30 30 Q60 -4 92 26 Q104 34 112 22 L112 30 Q100 44 88 34 Z" fill="#5C4BB8"/><circle cx="112" cy="20" r="6" fill="#fff"/>`
    : b.acc === "crown"
    ? `<path d="M36 26 L44 6 L54 20 L62 2 L70 20 L80 6 L86 26 Z" fill="#FFC145" stroke="#c98a12" stroke-width="2"/><circle cx="62" cy="14" r="3" fill="#FF4D4D"/>`
    : `<rect x="44" y="4" width="34" height="22" rx="5" fill="#1d2a5c" stroke="#9fb3d9" stroke-width="2"/><rect x="48" y="8" width="26" height="14" rx="2" fill="#7CC8FF" opacity=".8"/>`;
  const eyes = b.acc === "cap"
    ? `<path d="M40 54 Q48 50 56 54" stroke="#1b1230" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M68 54 Q76 50 84 54" stroke="#1b1230" stroke-width="4" fill="none" stroke-linecap="round"/><text x="88" y="40" font-size="13" fill="#fff" font-family="monospace">z</text>`
    : `<circle cx="47" cy="54" r="10" fill="#fff"/><circle cx="77" cy="54" r="10" fill="#fff"/><circle class="boss-pupil" cx="49" cy="56" r="4.5" fill="#1b1230"/><circle class="boss-pupil" cx="79" cy="56" r="4.5" fill="#1b1230"/><path d="M36 40 L56 46" stroke="#1b1230" stroke-width="4" stroke-linecap="round"/><path d="M88 40 L68 46" stroke="#1b1230" stroke-width="4" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 124 120" aria-hidden="true"><g class="boss-body">
<ellipse cx="62" cy="116" rx="40" ry="4" fill="rgba(0,0,0,.3)"/>
<path d="M20 70 Q16 28 62 26 Q108 28 104 70 Q106 104 86 112 Q74 104 62 112 Q50 104 38 112 Q18 104 20 70 Z" fill="${b.c}"/>
${acc}${eyes}
<path d="M44 82 L50 88 L56 82 L62 88 L68 82 L74 88 L80 82" stroke="#1b1230" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
</g></svg>`;
}

/* ---------- Personnages et répliques ---------- */
const BUDDIES = {
  bip: { n: "Bip", role: "le petit robot", xp: 0, svg: SVG_BIP,
    hi: ["BIP BOUP ! Prêt pour la mission ?", "Mes batteries sont pleines. Et les tiennes ?", "J'ai calculé : aujourd'hui tu vas tout casser."],
    idle: ["Analyse en cours… je crois en toi.", "Prends ton temps, mes circuits patientent.", "Celle-là, tu la connais, j'en suis sûr à 99,9 %."],
    ok: ["BIP BIP ! Réponse validée à 100 % !", "Mes circuits chauffent tellement tu es fort !", "Calcul terminé : tu es un génie.", "Je range ça dans ma mémoire spéciale champions.", "Niveau de cerveau : MAXIMUM !"],
    ko: ["Erreur 404 : bonne réponse introuvable… on la retrouve au prochain coup !", "Bzzzt ! Petit bug. Même les robots se trompent.", "Mes boulons tremblent… allez, on se reprend !", "Redémarrage du cerveau dans 3… 2… 1… c'est reparti !"] },
  nova: { n: "Nova", role: "la pilote casse-cou", xp: 150, svg: SVG_NOVA,
    hi: ["Moteurs allumés, pilote ! On décolle ?", "Attache ta ceinture, ça va aller vite !", "Aujourd'hui on vise les étoiles."],
    idle: ["Garde le cap, tu gères.", "Respire, vise, réponds.", "Les vrais pilotes restent calmes."],
    ok: ["Atterrissage parfait, pilote !", "Tu vas plus vite que mon vaisseau !", "Trajectoire impeccable, continue comme ça !", "Ça, c'est du pilotage de champion !", "Mach 10 dans ta tête !"],
    ko: ["Oups, petit tonneau dans le vide ! On redresse !", "Panne de carburant ? Le prochain plein est pour toi.", "Même les meilleurs pilotes ratent un virage.", "Turbulences ! Accroche-toi, on repart."] },
  kaze: { n: "Kaze", role: "le ninja des toits", xp: 500, svg: SVG_KAZE,
    hi: ["Le ninja est prêt. Et toi ?", "Silence… la mission commence.", "Un vrai ninja s'entraîne chaque jour."],
    idle: ["Concentre-toi comme un ninja.", "Observe bien… la réponse se cache.", "Lis deux fois, frappe une fois."],
    ok: ["Silencieux… mais redoutable. Bravo !", "Même mon maître n'aurait pas trouvé aussi vite.", "Coup parfait, ninja du cerveau !", "Tu bondis de réponse en réponse !", "Technique secrète : intelligence ultime !"],
    ko: ["Le ninja a glissé sur une peau de banane…", "Une ombre t'a trompé. Concentre-toi, jeune ninja.", "Raté ! Mais un ninja se relève toujours.", "Même les ninjas tombent du toit parfois. Remonte !"] },
  zeb: { n: "Pr Zébulon", role: "l'inventeur farfelu", xp: 1200, svg: SVG_ZEB,
    hi: ["EURÊKA ! Mon assistant préféré est là !", "J'ai inventé une machine à génies. Tu es dedans.", "Prêt pour une expérience cérébrale ?"],
    idle: ["Hmm, intéressant problème…", "Réfléchis comme un savant : étape par étape.", "Mon flair de chercheur dit que tu vas trouver."],
    ok: ["EURÊKA ! C'est exactement ça !", "Ma machine à génies vient de sonner !", "Brillant ! J'en perds mes lunettes !", "Formidable ! Je l'écris dans mon grand livre !", "Ton cerveau mérite un prix Nobel junior !"],
    ko: ["KABOUM ! Expérience ratée… on recommence !", "Hmm, ma potion a viré au violet. On réessaie !", "Les plus grands savants se sont trompés des milliers de fois !", "Mes lunettes ont pris de la buée. La prochaine sera la bonne !"] },
};
const BOSSES = [
  { n: "Docteur Flemme", c: "#9B7BFF", acc: "cap", taunt: ["« Pfff… et si tu allais faire une sieste ? »", "« Hé hé, la flemme gagne toujours ! »", "« Réfléchir, c'est fatigant, non ? »"], ko: "Docteur Flemme est K.O. ! Il retourne dormir." },
  { n: "Roi Distraction", c: "#FF9A5B", acc: "crown", taunt: ["« Oh regarde, un papillon ! »", "« Tu ne veux pas plutôt regarder une vidéo ? »", "« Ha ha ! Je t'ai distrait ! »"], ko: "Le Roi Distraction a perdu sa couronne !" },
  { n: "Glouton d'Écrans", c: "#3FCF9A", acc: "screen", taunt: ["« Miam, encore une erreur ! »", "« Donne-moi ton attention ! »", "« Gniark ! Je grossis à chaque erreur ! »"], ko: "Le Glouton d'Écrans a explosé en pixels !" },
];

/* ---------- Sons (synthétisés, aucun fichier) ---------- */
const SFX = {
  ctx: null,
  get on() { try { return localStorage.getItem("orbite.sound") !== "off"; } catch (e) { return true; } },
  set on(v) { try { localStorage.setItem("orbite.sound", v ? "on" : "off"); } catch (e) {} },
  ac() { if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ctx = new C(); } if (this.ctx.state === "suspended") this.ctx.resume(); return this.ctx; },
  tone(f, t0, d, type = "sine", g = 0.12, f2) {
    const a = this.ac(); if (!a) return;
    const o = a.createOscillator(), v = a.createGain(), t = a.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(g, t + 0.02); v.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(v); v.connect(a.destination); o.start(t); o.stop(t + d + 0.05);
  },
  play(kind) {
    if (!this.on) return;
    try {
      if (kind === "ok") { [523, 659, 784].forEach((f, i) => this.tone(f, i * 0.07, 0.18, "triangle")); }
      else if (kind === "combo") { [659, 784, 988, 1319].forEach((f, i) => this.tone(f, i * 0.06, 0.2, "square", 0.06)); }
      else if (kind === "ko") { this.tone(320, 0, 0.35, "sawtooth", 0.07, 110); this.tone(200, 0.12, 0.3, "triangle", 0.06, 90); }
      else if (kind === "hit") { this.tone(160, 0, 0.12, "square", 0.08, 60); }
      else if (kind === "win") { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.25, "triangle", 0.1)); }
      else if (kind === "tap") { this.tone(880, 0, 0.06, "sine", 0.05); }
    } catch (e) {}
  },
};

/* ---------- Confettis ---------- */
function confetti(n = 40) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
  const cols = ["#FFC145", "#FF6F59", "#5EE6B5", "#7CC8FF", "#B79CFF", "#FF7AA2"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.style.cssText = `left:${50 + (Math.random() - 0.5) * 30}%;background:${cols[i % cols.length]};--dx:${(Math.random() - 0.5) * 120}vw;--dy:${40 + Math.random() * 60}vh;--r:${(Math.random() - 0.5) * 900}deg;animation-delay:${Math.random() * 0.15}s;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px`;
    box.appendChild(p);
  }
  document.body.appendChild(box); setTimeout(() => box.remove(), 1800);
}

/* ---------- Moteur de jeu ---------- */
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const Game = {
  combo: 0, best: 0, boss: null, hp: 0, max: 0, line: "", taunt: "", mood: "", fresh: false, koShown: false, rankUp: null,
  buddyKey() { const k = (typeof S === "function" && S().buddy) || "bip"; return BUDDIES[k] && this.unlocked(k) ? k : "bip"; },
  buddy() { return BUDDIES[this.buddyKey()]; },
  unlocked(k) { return ((typeof S === "function" && S().xp) || 0) >= BUDDIES[k].xp; },
  todayBoss() { const d = Math.floor(Date.now() / 86400000); return BOSSES[d % BOSSES.length]; },
  start(kind, n) {
    this.combo = 0; this.best = 0; this.koShown = false; this.rankUp = null; this.taunt = "";
    this.boss = kind === "mission" || kind === "bilan" ? this.todayBoss() : null;
    this.max = this.hp = Math.max(30, Math.ceil(n * 0.6) * 10);
    this.line = pickOne(this.buddy().hi); this.mood = "wave"; this.fresh = true;
  },
  mult() { return this.combo >= 5 ? 2 : this.combo >= 3 ? 1.5 : 1; },
  onAnswer(ok) {
    const b = this.buddy();
    if (ok) {
      this.combo++; this.best = Math.max(this.best, this.combo);
      this.line = pickOne(b.ok); this.taunt = ""; this.mood = "happy";
      if (this.combo >= 3) this.line = `COMBO x${this.combo} ! ` + this.line;
      if (this.boss && this.hp > 0) {
        this.hp = Math.max(0, this.hp - (this.combo >= 3 ? 15 : 10));
        if (this.hp === 0 && !this.koShown) { this.koShown = true; this.line = this.boss.ko + " Continue pour les points bonus !"; SFX.play("win"); confetti(90); }
        else { SFX.play(this.combo >= 3 ? "combo" : "ok"); setTimeout(() => SFX.play("hit"), 180); confetti(this.combo >= 3 ? 45 : 22); }
      } else { SFX.play(this.combo >= 3 ? "combo" : "ok"); confetti(this.combo >= 3 ? 45 : 22); }
    } else {
      this.combo = 0; this.line = pickOne(b.ko); this.mood = "sad";
      this.taunt = this.boss && this.hp > 0 ? `${this.boss.n} : ${pickOne(this.boss.taunt)}` : "";
      SFX.play("ko");
    }
    this.fresh = true;
  },
  hud() {
    const b = this.buddy();
    const mood = this.fresh ? this.mood : "";
    const line = this.fresh ? this.line : pickOne(b.idle);
    const taunt = this.fresh ? this.taunt : "";
    this.fresh = false;
    const buddyEl = h("div", { class: "buddy " + mood }); buddyEl.innerHTML = b.svg;
    const bubble = h("div", { class: "bubble" + (mood ? " pop" : "") }, h("b", {}, b.n + " : "), line, taunt ? h("span", { class: "taunt" }, taunt) : null);
    const left = h("div", { class: "hud-buddy" }, buddyEl, bubble);
    let right = null;
    if (this.boss) {
      const bossEl = h("div", { class: "boss" + (this.hp === 0 ? " ko" : mood === "happy" ? " hit" : mood === "sad" ? " laugh" : "") }); bossEl.innerHTML = bossSvg(this.boss);
      right = h("div", { class: "hud-boss" }, bossEl, h("div", { class: "hud-boss-info" },
        h("span", { class: "boss-name" }, this.hp === 0 ? "K.O. !" : this.boss.n),
        h("div", { class: "hpbar", role: "progressbar", "aria-label": "Vie du boss", "aria-valuemin": "0", "aria-valuemax": String(this.max), "aria-valuenow": String(this.hp) }, h("i", { style: `width:${(this.hp / this.max) * 100}%` })),
        this.combo >= 2 ? h("span", { class: "combo" }, `Combo x${this.combo}` + (this.mult() > 1 ? `  ·  XP x${this.mult()}` : "")) : null));
    } else if (this.combo >= 2) {
      right = h("div", { class: "hud-boss" }, h("span", { class: "combo" }, `Combo x${this.combo}` + (this.mult() > 1 ? `  ·  XP x${this.mult()}` : "")));
    }
    return h("div", { class: "hud" }, left, right);
  },
  end(sess, oldXp, newXp) {
    if (this.boss) sess.boss = { n: this.boss.n, ko: this.hp === 0 };
    sess.bestCombo = this.best;
    const r0 = rankOf(oldXp).name, r1 = rankOf(newXp).name;
    this.rankUp = r0 !== r1 ? r1 : null;
    const unlockedNow = Object.entries(BUDDIES).filter(([, v]) => oldXp < v.xp && newXp >= v.xp).map(([, v]) => v.n);
    this.newBuddies = unlockedNow;
    if ((this.boss && this.hp === 0) || this.rankUp || unlockedNow.length) setTimeout(() => { SFX.play("win"); confetti(110); }, 250);
  },
  resultBanner(sess) {
    const b = this.buddy(); const parts = [];
    const win = sess.boss && sess.boss.ko;
    const buddyEl = h("div", { class: "buddy " + (win || sess.ok / Math.max(1, sess.n) >= 0.5 ? "happy" : "wave") }); buddyEl.innerHTML = b.svg;
    if (sess.boss) {
      const boss = BOSSES.find((x) => x.n === sess.boss.n) || BOSSES[0];
      const bossEl = h("div", { class: "boss" + (win ? " ko" : " laugh") }); bossEl.innerHTML = bossSvg(boss);
      parts.push(h("div", { class: "fight" }, buddyEl, h("span", { class: "vs" }, "VS"), bossEl));
      parts.push(h("p", { class: "fight-title" }, win ? `Victoire ! Tu as battu ${boss.n} !` : `${boss.n} s'est échappé… Revanche demain !`));
    } else parts.push(h("div", { class: "fight" }, buddyEl));
    if (sess.bestCombo >= 3) parts.push(h("p", { class: "muted center" }, `Meilleur combo : x${sess.bestCombo}`));
    if (this.rankUp) parts.push(h("p", { class: "levelup" }, `NOUVEAU RANG : ${this.rankUp} !`));
    (this.newBuddies || []).forEach((n) => parts.push(h("p", { class: "levelup" }, `Nouveau coéquipier débloqué : ${n} !`)));
    this.rankUp = null; this.newBuddies = [];
    return h("div", { class: "card center result-game pop" }, parts);
  },
  homeCard() {
    const st = S(); const cur = this.buddyKey(); const b = BUDDIES[cur];
    const hero = h("div", { class: "buddy wave big" }); hero.innerHTML = b.svg;
    const list = h("div", { class: "crew" }, Object.entries(BUDDIES).map(([k, v]) => {
      const open = (st.xp || 0) >= v.xp;
      const el = h("button", { class: "crew-item" + (k === cur ? " sel" : "") + (open ? "" : " locked"), disabled: !open, "aria-pressed": k === cur ? "true" : "false",
        "aria-label": open ? `Choisir ${v.n}, ${v.role}` : `${v.n} : se débloque à ${v.xp} XP`,
        onclick: () => { SFX.play("tap"); S().buddy = k; Store.save(); render(); } });
      const pic = h("div", { class: "buddy mini" }); pic.innerHTML = v.svg;
      el.append(pic, h("span", { class: "crew-n" }, v.n), h("span", { class: "crew-r" }, open ? v.role : `${v.xp} XP`));
      return el;
    }));
    const boss = this.todayBoss(); const bossEl = h("div", { class: "boss small laugh" }); bossEl.innerHTML = bossSvg(boss);
    return h("div", { class: "grid g2" },
      h("div", { class: "card hud-home" }, h("div", { class: "hud-buddy" }, hero, h("div", { class: "bubble" }, h("b", {}, b.n + " : "), pickOne(b.hi))),
        h("p", { class: "label", style: "margin-top:12px" }, "Ton coéquipier"), list),
      h("div", { class: "card boss-card" }, h("p", { class: "label" }, "Boss du jour"), h("div", { class: "row", style: "align-items:center;flex-wrap:nowrap" }, bossEl,
        h("div", {}, h("h3", {}, boss.n), h("p", { class: "muted", style: "margin-top:4px" }, "Chaque bonne réponse lui fait perdre de la vie. Enchaîne 3 bonnes réponses pour un COMBO : dégâts et XP boostés !"))),
        h("p", { class: "taunt", style: "margin-top:10px" }, pickOne(boss.taunt))));
  },
  muteBtn() {
    return h("button", { class: "navlink", style: "background:none;cursor:pointer", "aria-pressed": SFX.on ? "true" : "false",
      onclick: (e) => { SFX.on = !SFX.on; e.currentTarget.textContent = SFX.on ? "Son : oui" : "Son : non"; if (SFX.on) SFX.play("tap"); } }, SFX.on ? "Son : oui" : "Son : non");
  },
  sfx(k) { SFX.play(k); },
};
