/** Interactive, explicitly fictional learning scene derived from the existing Atlas. */
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STAGES = ['Kontext', 'Wortlaut', 'Deutung', 'Körper & Gefühl', 'Handlung', 'Antwort', 'Danach'];
const OPTIONS = {
  context: [
    ['pressure','Unter Druck','Wenig Zeit, schon viel Belastung. Frühere Beschämung ist im Beispiel möglich; sie ist keine festgestellte Ursache.'],
    ['support','Mit Unterstützung','Aufgabe, Zeit und Hilfe werden gemeinsam geklärt. Das kann einen Unterschied machen; die Wirkung bleibt offen.']
  ],
  wording: [
    ['task','Sachbezogen','„Hier fehlt noch die Begründung.“'],
    ['hurt','Abwertend','„Du machst immer alles falsch.“']
  ],
  meaning: [
    ['self','Auf mich bezogen','„Ich bin falsch.“ Eine mögliche Deutung; keine Tatsache über die Person.'],
    ['specific','Auf die Aufgabe bezogen','„Ein Teil fehlt. Was genau wird gebraucht?“'],
    ['open','Noch offen lassen','„Ich weiß noch nicht, wie es gemeint ist. Ich möchte nachfragen.“']
  ],
  body: [
    ['unknown','Noch unbekannt','Ein Gefühl beweist keine bestimmte Körperreaktion. Hier muss nichts erspürt werden.'],
    ['shame','Mögliche Scham','Scham könnte auftreten. Hitze, Enge oder andere Körperempfindungen sind damit nicht automatisch festgestellt.'],
    ['anger','Möglicher Ärger','Irritation oder Ärger könnten eine Reaktion auf den Ton oder auf unfaire Bedingungen sein.'],
    ['distant','Mögliches Wegsein','Ein Gefühl von Distanz ist denkbar. Es beweist hier weder Dissoziation noch eine Diagnose.']
  ],
  action: [
    ['ask','Konkret nachfragen','„Welche Begründung fehlt? Kannst du mir ein Beispiel zeigen?“'],
    ['pause','Pause mit Rückweg','„Ich brauche eine Pause. Können wir um 15 Uhr in Ruhe weiterreden?“'],
    ['boundary','Eine Grenze benennen','„Über die Aufgabe können wir sprechen. So möchte ich nicht angesprochen werden.“'],
    ['leave','Situation verlassen','„Ich beende das Gespräch jetzt.“ Schutz oder Entlastung können im Vordergrund stehen.']
  ],
  reply: [
    ['unknown','Noch nicht bekannt','Die Antwort des Gegenübers ist nicht durch meinen nächsten Schritt bestimmt.'],
    ['listen','Nimmt die Rückfrage auf','„Ich meine diesen Absatz. Mein Ton war nicht in Ordnung; lass uns neu anfangen.“'],
    ['defend','Wehrt ab','„So habe ich das doch gar nicht gemeint.“ Die Wirkung des Satzes bleibt trotzdem besprechbar.'],
    ['pressure','Erhöht den Druck','„Stell dich nicht so an. Mach es einfach.“ Jetzt rücken Grenze, Unterstützung und Schutz in den Vordergrund.']
  ],
  recovery: [
    ['look','Mit Abstand verstehen','Was war beobachtbar? Was war meine Deutung? Was hat das Gegenüber beigetragen?'],
    ['help','Unterstützung suchen','Mit einer passenden Person klären, was hilft und welche Bedingungen verändert werden sollen.'],
    ['stop','Für jetzt beenden','Nicht alles muss jetzt verstanden oder gelöst werden. Die Szene kann jederzeit verlassen werden.']
  ]
};
const KEYS = ['context','wording','meaning','body','action','reply','recovery'];

/**
 * Render into a normal page region (no focus trap, no storage and no diagnosis).
 * onRead(entryId); onSkill(skillTitle, {id, title, skillId}); onClose().
 * Returns cleanup, which stops media and removes all listeners and markup.
 */
export function mountRelationshipScene(host, {entries = [], onClose = () => {}, onRead = () => {}, onSkill = () => {}} = {}) {
  if (!(host instanceof Element)) throw new TypeError('Eine sichtbare Fläche für die Lernsituation fehlt.');
  const original = entries.find(entry => entry.id === 'scene:kritik');
  const spielraum = entries.find(entry => entry.id === 'trigger:spielraum');
  const state = {stage:0, perspective:'receive', context:'pressure', wording:'task', meaning:'self', body:'unknown', action:'pause', reply:'unknown', recovery:'look'};
  const controller = new AbortController();
  let disposed = false;
  const choice = key => OPTIONS[key].find(item => item[0] === state[key]);
  const danger = () => state.wording === 'hurt' || state.reply === 'pressure';
  const currentSummary = () => KEYS.map(key => choice(key)[1]).join(' → ');
  const texts = () => {
    const other = state.perspective === 'give';
    return [
      {title:'Was bringt die Situation mit?', text:other ? 'Wer eine Rückmeldung gibt, trägt Verantwortung für Klarheit, Ton und die Bedingungen. Belastung und frühere Erfahrungen sind von außen nicht sicher erkennbar.' : 'Eine Rückmeldung trifft nicht auf einen leeren Moment. Zeitdruck, Unterstützung und die konkrete Aufgabe gehören mit ins Bild.', question:'Verändere eine Bedingung. Der Verlauf darunter bleibt eine Möglichkeit, keine Vorhersage.'},
      {title:'Ein Satz ist noch nicht der ganze Zusammenhang.', text:other ? 'Eine fehlende Begründung lässt sich konkret ansprechen. Eine pauschale Abwertung greift dagegen die Person an. Gute Absicht hebt einen verletzenden Wortlaut nicht auf.' : 'Halte zunächst fest, was tatsächlich gesagt wurde. Trenne diesen Wortlaut von Ton, vermuteter Absicht und der Bedeutung, die bei dir ankommt.', question:'Hier lässt sich der Wortlaut verändern. Beide Varianten sind erfundene Beispiele.'},
      {title:'Was kommt zwischen Satz und Bedeutung?', text:other ? 'Was bei jemandem ankommt, lässt sich nicht aus dem Verhalten ablesen. Nachfragen ist möglich; eine Erklärung über die Person hinweg wäre eine Vermutung.' : '„Ein Teil fehlt“ kann sich wie „Ich bin falsch“ anfühlen. Diese Verschiebung ist eine mögliche Lesart. Auch eine unklare Aufgabe oder ein tatsächlich abwertender Umgang kommen als Erklärung infrage.', question:danger() ? 'Bei Abwertung bleibt die Grenzverletzung bestehen. Eine andere Deutung ersetzt keinen respektvollen Umgang.' : 'Probiere eine andere Lesart aus. Du musst keine davon für wahr halten.'},
      {title:'Nicht alles ist von außen sichtbar.', text:other ? 'Rückzug, Schweigen oder Ärger verraten nicht sicher, welches Gefühl oder welcher Körperzustand dahintersteht. Fragen dürfen gestellt, Antworten dürfen abgelehnt werden.' : 'Scham, Irritation, Ärger oder Distanz sind denkbar. Körperempfindungen sind hier nicht beobachtet. Du kannst diesen Schritt ohne Innenwahrnehmung erkunden.', question:'Wähle eine Möglichkeit oder lasse es ausdrücklich unbekannt. Das ist keine Selbsteinschätzung.'},
      {title:'Ein kleiner Schritt verändert den Verlauf.', text:other ? 'Eine Pause oder eine Grenze zu respektieren liegt auch beim Gegenüber. Die Verantwortung für einen tragfähigen Kontakt lässt sich nicht einer Person allein übertragen.' : 'Nachfragen, pausieren, eine Grenze aussprechen oder gehen sind unterschiedliche Möglichkeiten. Was passt, hängt auch von Sicherheit, Abhängigkeiten und dem tatsächlichen Gegenüber ab.', question:danger() ? 'Bei Abwertung oder Druck darf Schutz wichtiger sein als Verständigung. Niemand muss eine Grenzverletzung aushalten, um etwas zu lernen.' : 'Verändere die Handlung. Sie verspricht weder Entlastung noch eine bestimmte Antwort.'},
      {title:'Die Antwort gehört dem Gegenüber.', text:other ? 'Du kannst konkret werden, Verantwortung für deinen Ton übernehmen oder defensiv reagieren. Die Folgen gehören zur Betrachtung dazu; Erklärungen entschuldigen keine Abwertung.' : 'Eine hilfreiche Rückfrage kann aufgegriffen, abgewehrt oder mit weiterem Druck beantwortet werden. Dein Schritt kontrolliert die andere Person nicht.', question:'Hier veränderst du bewusst die Reaktion der anderen Person. Die Szene berechnet sie nicht.'},
      {title:'Was bleibt — und was wird veränderbar?', text:other ? 'Wurde die Aufgabe klarer? Wurde eine Grenze respektiert? Ist eine Entschuldigung oder Reparatur nötig? Gezeigte Fähigkeit bedeutet nicht, dass sie in jeder Situation verfügbar ist.' : 'Kurzfristiger Rückzug kann schützen oder entlasten. Was später hilft und was einengt, lässt sich erst mit Abstand prüfen. Ein schwieriger Verlauf ist kein Beweis persönlichen Versagens.', question:'Die Wirkung bleibt offen. Erholung kann Zeit, Abstand oder Unterstützung brauchen.'}
    ][state.stage];
  };
  function diagram() {
    const harmful = danger();
    const meaningLabel = {self:'Ich bin falsch.', specific:'Ein Teil fehlt.', open:'Wie ist es gemeint?'}[state.meaning];
    const bodyLabel = {unknown:'Erleben noch unbekannt', shame:'Scham ist denkbar', anger:'Ärger ist denkbar', distant:'Distanz ist denkbar'}[state.body];
    const actionLabel = {ask:'Nachfragen', pause:'Pause mit Rückweg', boundary:'Grenze benennen', leave:'Gehen / Schutz suchen'}[state.action];
    const replyLabel = {unknown:'Antwort bleibt offen', listen:'Geht darauf ein', defend:'Wehrt ab', pressure:'Macht weiter Druck'}[state.reply];
    const forkY = state.meaning === 'self' ? 166 : state.meaning === 'specific' ? 276 : 222;
    const actionY = state.action === 'leave' || state.action === 'boundary' ? 330 : 260;
    const active = stage => state.stage === stage ? ' rs-current' : '';
    return `<svg class="rs-diagram" viewBox="0 0 1000 420" role="img" aria-labelledby="rs-diagram-title rs-diagram-desc">
      <title id="rs-diagram-title">Ein möglicher Weg zwischen Rückmeldung und nächstem Schritt</title>
      <desc id="rs-diagram-desc">${escape(currentSummary())}. Beschriftete Linien zeigen einen redaktionellen Lernverlauf, keine gemessene Ursache oder Wahrscheinlichkeit.</desc>
      <defs><marker id="rs-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>
      <path class="rs-baseline" d="M42 110 H958"/>
      <text class="rs-lane-label" x="42" y="40">WAS GESAGT WIRD</text>
      <text class="rs-wording${active(1)}" x="42" y="88">${state.wording === 'hurt' ? '„Du machst immer alles falsch.“' : '„Hier fehlt noch die Begründung.“'}</text>
      <path class="rs-descend" d="M170 113 V185 Q170 222 200 222 H245" marker-end="url(#rs-arrow)"/>
      <text class="rs-small" x="42" y="150">${state.context === 'pressure' ? 'unter Zeitdruck' : 'mit Zeit und Unterstützung'}</text>
      <path class="rs-option-path" d="M250 222 Q290 166 330 166 H470 M250 222 Q290 276 330 276 H470"/>
      <path class="rs-option-path" d="M250 222 H470"/>
      <path class="rs-chosen-path" d="M250 222 Q290 ${forkY} 330 ${forkY} H470 Q510 ${forkY} 535 222" marker-end="url(#rs-arrow)"/>
      <text class="rs-lane-label" x="330" y="128">WAS ANKOMMEN KÖNNTE</text>
      <text class="rs-branch ${state.meaning === 'self' ? 'rs-branch-active' : ''}${active(2)}" x="330" y="155">„Ich bin falsch.“</text>
      <text class="rs-branch ${state.meaning === 'open' ? 'rs-branch-active' : ''}" x="330" y="212">Bedeutung offenlassen</text>
      <text class="rs-branch ${state.meaning === 'specific' ? 'rs-branch-active' : ''}" x="330" y="300">„Ein Teil fehlt.“</text>
      <path class="rs-pause-mark${active(3)}" d="M551 196 V247 M561 196 V247"/>
      <text class="rs-small" x="552" y="168" text-anchor="middle">${escape(bodyLabel)}</text>
      <path class="rs-action-path${harmful ? ' rs-protect' : ''}" d="M581 222 Q620 222 650 ${actionY} H745" marker-end="url(#rs-arrow)"/>
      <text class="rs-lane-label" x="640" y="${actionY-48}">NÄCHSTER SCHRITT</text>
      <text class="rs-action-text${active(4)}" x="640" y="${actionY-16}">${escape(actionLabel)}</text>
      <path class="rs-response-path" d="M765 ${actionY} Q810 ${actionY} 820 222 H953" marker-end="url(#rs-arrow)"/>
      <text class="rs-small${active(5)}" x="952" y="195" text-anchor="end">${escape(replyLabel)}</text>
      <path class="rs-return-path" d="M955 235 V375 Q955 394 925 394 H565" marker-end="url(#rs-arrow)"/>
      <text class="rs-small" x="790" y="379" text-anchor="middle">mit Abstand verstehen · Bedingungen verändern</text>
      <text class="rs-small" x="42" y="397">${harmful ? 'Abwertung bleibt Verantwortung der handelnden Person.' : 'Eine Möglichkeit unter mehreren. Keine Linie behauptet eine Ursache.'}</text>
    </svg>`;
  }
  function render(focusName) {
    if (disposed) return;
    host.querySelectorAll('video').forEach(video => video.pause());
    const current = texts();
    const key = KEYS[state.stage];
    const other = state.perspective === 'give';
    host.innerHTML = `<section class="relationship-scene" aria-label="Interaktive Lernsituation: Rückmeldung und Scham">
      <header class="rs-header"><div><h2>Was zwischen uns geschieht.</h2><p>Eine Rückmeldung. Mehrere mögliche Verläufe. Verändere die Situation und erkunde, wo Spielraum entsteht.</p></div><button type="button" class="rs-close" data-action="close" aria-label="Zur Wissenslandschaft zurückkehren"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg><span>Zur Karte</span></button></header>
      <div class="rs-perspective" role="group" aria-label="Perspektive auf die Situation"><span>Ich betrachte die Situation als …</span><button type="button" data-perspective="receive" aria-pressed="${!other}">Person, die Rückmeldung erhält</button><button type="button" data-perspective="give" aria-pressed="${other}">Person, die Rückmeldung gibt</button></div>
      <div class="rs-stage-world"><div class="rs-world-title"><span>Zwischen Satz und Antwort</span><span>${state.stage+1} / ${STAGES.length} · ${STAGES[state.stage]}</span></div>${diagram()}<div class="rs-diagram-alternative"><strong>Aktueller Weg:</strong> ${escape(currentSummary())}.</div></div>
      <nav class="rs-sequence" aria-label="Schritte der Lernsituation"><ol>${STAGES.map((label,index) => `<li><button type="button" data-stage="${index}" ${index === state.stage ? 'aria-current="step"' : ''}><span>${index+1}</span>${escape(label)}</button></li>`).join('')}</ol></nav>
      <div class="rs-explore"><section class="rs-explanation" aria-labelledby="rs-question-title"><h3 id="rs-question-title">${escape(current.title)}</h3><p>${escape(current.text)}</p><p class="rs-question">${escape(current.question)}</p></section><fieldset class="rs-choices"><legend>${escape(STAGES[state.stage])} verändern</legend>${OPTIONS[key].map(([value,label,text]) => `<label class="rs-choice"><input type="radio" name="rs-${key}" value="${value}" ${state[key] === value ? 'checked' : ''}><span><strong>${escape(label)}</strong><span>${escape(text)}</span></span></label>`).join('')}</fieldset></div>
      ${danger() ? `<aside class="rs-boundary"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 21 7v6c0 5-9 9-9 9S3 18 3 13V7Z"/><path d="M8 12h8"/></svg><div><strong>Verstehen hebt Verantwortung nicht auf.</strong><p>Wer bewertet, Macht hat oder über Arbeit und Zugang entscheidet, hat besondere Verantwortung. Abwertung und Druck werden nicht durch eine „ungünstige Deutung“ der anderen Person harmlos. Abstand, Unterstützung und Schutz dürfen Vorrang haben.</p></div></aside>` : ''}
      <div class="rs-footer"><button type="button" data-action="previous" ${state.stage === 0 ? 'disabled' : ''}>Zurück</button><p class="rs-status" role="status" aria-live="polite">${STAGES[state.stage]} · ${choice(key)[1]}</p><button type="button" class="rs-next" data-action="next">${state.stage === STAGES.length-1 ? 'Zum Anfang' : 'Weiter' }<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></button></div>
      <section class="rs-grounding" aria-labelledby="rs-grounding-title"><figure><video controls playsinline preload="none" poster="/media/trauma-exercises/sos-orientieren.jpg" aria-label="Optionaler stummer Bildimpuls: Licht im Raum"><source src="/media/trauma-exercises/sos-orientieren.mp4" type="video/mp4"></video><figcaption>Licht im Raum · stummer, KI-generierter Bildimpuls aus dem TraumaAtlas Wasser. Keine Demonstration einer Behandlung.</figcaption></figure><div><h3 id="rs-grounding-title">Einen Moment nach außen finden.</h3><p>Wenn du magst: Schau dich im tatsächlichen Raum um. Suche eine neutrale Kante oder eine Farbe. Du brauchst weder die Augen zu schließen noch etwas im Körper zu beobachten.</p><button type="button" class="rs-skill" data-action="skill">Freiwillige Übung beginnen<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></button><p class="rs-small-print">Schritt für Schritt, mit Rückweg und jederzeitigem Abbruch. Das Video ist optional; die Anleitung funktioniert ohne es.</p></div></section>
      <details class="rs-origin"><summary>Originale, Herkunft und Grenzen dieser Lernsituation</summary><div><p>Redaktionelle Weiterentwicklung der vorhandenen erfundenen Lernsituation „${escape(original?.title || 'Aus Rückmeldung wird Scham')}“ und des Triggerkapitels „${escape(spielraum?.title || 'Verstehen heißt nicht, jeden Trigger vermeiden zu müssen.')}“. Wortlautvarianten, Antwortmöglichkeiten und die zweite Perspektive sind didaktische Ergänzungen; sie sind keine gemessenen Abläufe.</p><p>Die Verbindungen illustrieren mögliche Übergänge. Sie beweisen weder eine Traumageschichte noch Borderline, Dissoziation oder eine andere Diagnose. Körper und Gefühl dürfen unbekannt bleiben. Diese Szene ist keine Traumabehandlung.</p><div class="rs-origin-links"><button type="button" data-read="scene:kritik">Ursprüngliche Lernsituation lesen</button><button type="button" data-read="trigger:spielraum">Triggerkapitel und Fachquellen öffnen</button></div><p>Das Triggerkapitel führt zur NICE-Leitlinie und zur dort begrenzt eingeordneten Pilotstudie von Harned et al. Die Szene selbst ist kein Forschungsergebnis. Herkunft und Einschränkungen des Bildimpulses werden im Skillkoffer bewahrt.</p></div></details>
    </section>`;
    if (focusName) host.querySelector(focusName)?.focus({preventScroll:true});
  }
  host.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !host.contains(button)) return;
    if (button.dataset.stage !== undefined) { state.stage = Number(button.dataset.stage); render(`[data-stage="${state.stage}"]`); }
    else if (button.dataset.perspective) { state.perspective = button.dataset.perspective; render(`[data-perspective="${state.perspective}"]`); }
    else if (button.dataset.read) onRead(button.dataset.read);
    else if (button.dataset.action === 'close') { host.querySelectorAll('video').forEach(video => video.pause()); onClose(); }
    else if (button.dataset.action === 'skill') { host.querySelectorAll('video').forEach(video => video.pause()); onSkill('Hier im Raum ankommen', {id:'scene:kritik',title:original?.title || 'Aus Rückmeldung wird Scham',skillId:'orientieren'}); }
    else if (button.dataset.action === 'next') { state.stage = (state.stage+1)%STAGES.length; render('[data-action="next"]'); }
    else if (button.dataset.action === 'previous' && state.stage > 0) { state.stage--; render('[data-action="previous"]'); }
  }, {signal:controller.signal});
  host.addEventListener('change', event => {
    if (!event.target.matches('input[type="radio"]')) return;
    const key = KEYS[state.stage];
    if (OPTIONS[key].some(item => item[0] === event.target.value)) { state[key] = event.target.value; render(`input[value="${state[key]}"]`); }
  }, {signal:controller.signal});
  render();
  return () => { if(disposed) return; disposed = true; controller.abort(); host.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.querySelectorAll('source').forEach(source => source.removeAttribute('src')); video.load(); }); host.replaceChildren(); };
}
