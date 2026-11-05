// Neue redaktionelle Lernanschlüsse aus selektiv gelesenen Originalpassagen.
// Alle Situationen sind erfunden. Keine Aussage rekonstruiert ein Leben Ralfs
// oder einer anderen Person. Beziehungen sind keine Diagnose- oder Kausalregeln.
// Pfade, Kennungen und genaue Zeilen gehören ausschließlich in bewusst geöffnete
// technische Herkunftsdetails. Menschliche Werktitel bleiben normal zugänglich.

const atlasUrl = 'https://phaenomenautik-koharenz.x99t4dyxr9.chatgpt.site/';
const atlasRoot = 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.';
const fundus = `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`;
const original = (id, title) => ({ id, title, url: `${atlasUrl}#atlas/${encodeURIComponent(id)}` });
const bindung = original('bindung', 'Bindungstheorie im bestehenden Phänomenatlas');
const dbt = original('dbt', 'Dialektisch-Behaviorale Therapie im bestehenden Phänomenatlas');
const trauma = original('herman', 'Komplextrauma-Forschung im bestehenden Phänomenatlas');
const scham = original('scham', 'Scham und Schuld im bestehenden Phänomenatlas');
const gemeinsam = original('e:co-regulation', 'Co-Regulation im bestehenden Phänomenatlas');

export const atlasLineage = [
  {
    id: 'werkstatt-unterscheidungen', title: 'Beziehungswerkstatt · Erleben, Deutung und eigener Anteil',
    kind: 'Geprüfte Originalpassagen eines bestehenden Werks',
    authorStatus: 'Bestehende redaktionelle Lernkarten; konkrete menschliche beziehungsweise KI-Einzelautorenschaft dieser Datei nicht zusätzlich verifiziert. Neue Situationen und Übertragungen: KI-redaktioneller Vorschlag vom 2. November 2026, ohne menschliche Abnahme.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: 'CONCEPTS, Zeilen 25–34; analyzeText, Zeilen 53–57',
    url: `${atlasUrl}beziehungswerkstatt.html`,
    incorporated: 'Beobachtung und Deutung; freiwillige Nähe; Anspannung; Anerkennung ohne Zustimmung; eigene Verantwortung; mehrere mögliche Innenwelten; Entwicklungsgeschichte und aktuelle Sicherheit.',
    limit: 'Redaktionelle Reflexionshilfen, kein klinisch validiertes Instrument. Die neue App übernimmt Unterscheidungen und keine Diagnose einer Person. Ein Lernanschluss ist kein fachlich bestätigter Kausalzusammenhang.'
  },
  {
    id: 'werkstatt-sprachdruck', title: 'Beziehungswerkstatt · Rollen, Wirkung und Kontaktgrenzen',
    kind: 'Geprüfte Originalpassagen eines bestehenden Werks',
    authorStatus: 'Bestehende redaktionelle Sprachregeln, nicht von Fachinstitutionen validiert; Einzelautorenschaft nicht zusätzlich verifiziert. Die hiesigen Beispiele sind neu und erfunden.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: 'RULES, Zeilen 9–21; SCENARIOS, Zeilen 37–42; Kontakt- und Kontextregeln, Zeilen 53–57',
    url: `${atlasUrl}beziehungswerkstatt.html`,
    incorporated: 'Rolle als Verpflichtung; Dankesschuld; mögliche Entwertung; Absicht und Wirkung; Gedankenlesen; Antwortdruck; eigene Not; Diagnosewörter; Übergehen einer Grenze.',
    limit: 'Ein einzelner Satz kann Zitat, praktische Vereinbarung oder Druck sein. Kontext und eigene Prüfung bleiben nötig. Freundlichere Sprache hebt ein Kontakt-Nein nicht auf; ein fehlender Hinweis bescheinigt keine Unbedenklichkeit.'
  },
  {
    id: 'neuroatlas-erleben', title: 'Neuroatlas · Das Erleben vor dem Etikett',
    kind: 'Geprüfte Passagen des vorhandenen Quellenkatalogs',
    authorStatus: 'Redaktioneller Katalog; konkrete Einzelautorenschaft nicht zusätzlich verifiziert. Erfahrungsformulierungen werden als Beschreibungsangebote übernommen, nicht als Selbstbericht Ralfs.',
    path: 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.',
    passage: 'Dimensionen und Kontexte, Zeilen 41–61; Gefühle und Beziehungen, Zeilen 110–135; Erinnerung und Entfremdung, Zeilen 140–149; Borderline-Verbindungen, Zeilen 248–250',
    incorporated: 'Gefühlsüberflutung, Wut, Leere, Verlustangst, Zurückweisung, wechselndes Selbstbild, Scham, Rückzug und Entfremdung. Der Katalog trennt Erfahrungsdimensionen von diagnostischen Kontexten.',
    limit: 'Eine Erfahrung kann in mehreren Zusammenhängen vorkommen. Auswahl und Verknüpfung liefern weder Diagnose noch individuelle Wahrscheinlichkeit. Die vollständigen medizinischen Aussagen des Katalogs wurden hier nicht neu geprüft.'
  },
  {
    id: 'fundus-als-rolle', title: 'Phänomenatlas · Selbstverständnis, Zuschreibung und Rolle',
    kind: 'Begriffliche Arbeitsunterscheidung des vorhandenen Wissensfundus',
    authorStatus: 'Vorhandene redaktionelle Ausarbeitung; sie bezeichnet sich selbst als begriffliche Arbeitsunterscheidung. Keine Übernahme als empirisch validiertes Modell und kein wörtlicher Ralf-Beitrag.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: 'Leitfrage und Aussagegrenzen, Zeilen 5–9; Das „Als“, Zeilen 11–17; Normen, Zeilen 19–23',
    url: `${atlasUrl}wissensfundus/neurodiversitaet/rollen-normen.html`,
    incorporated: 'Ein Mensch kann sich anders verstehen, als andere ihn lesen; eine situative Rolle enthält Erwartungen. Statistische Häufigkeit, Zweckmäßigkeit, institutionelle Erwartung und moralische Bewertung werden auseinandergehalten.',
    limit: 'Aus der ursprünglichen Frage zu Neurodivergenz entsteht hier eine begriffliche Vergleichsfrage zu Beziehungen. Keine neue empirische Aussage über Borderline. Macht, Abhängigkeit und körperliche Bedingungen begrenzen die Wahl von Rollen.'
  },
  {
    id: 'fundus-zeitgeschichte', title: 'Phänomenatlas · Trauma, Dissoziation und Bindung unterscheiden',
    kind: 'Geprüfte Vergleichspassage mit ausdrücklich begrenzten Forschungsanschlüssen',
    authorStatus: 'Bestehende redaktionelle Forschungssynthese; neue Beziehungssituationen sind eigene KI-redaktionelle Übertragungen, keine Forschungsdaten.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: '„Trauma, Dissoziation und Bindung: zeitliche Geschichten ernst nehmen“, Zeilen 33–43',
    url: `${atlasUrl}wissensfundus/neurodiversitaet/verbindungen.html`,
    incorporated: 'Äußerlich ähnlicher Rückzug erlaubt keine Gleichsetzung von Überlastung und Dissoziation. Beginn, vorausgehende Bedingungen und erlebter Verlauf sind Vergleichsfragen. Beziehungsgeschichte und Entwicklungsprofil können gemeinsam bedeutsam sein.',
    limit: 'Die Passage bietet keinen validierten Differenzialtest. Aus Kommunikationsunterschieden folgt keine Bindungsdiagnose; eine Atlasbrücke beweist keinen gemeinsamen Mechanismus.'
  },
  {
    id: 'fundus-passung-macht', title: 'Phänomenatlas · Verständigung, Passung und ungleiche Macht',
    kind: 'Theorie mit aufgabenspezifischen Befunden und Gegenbefunden',
    authorStatus: 'Bestehende redaktionelle Einordnung von Milton, Sasson, Crompton und De Laet; keine neue Untersuchung der hiesigen Situationen.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: '„Beziehung als Erklärung: Double Empathy und Gegenbefunde“, Zeilen 59–73',
    url: `${atlasUrl}wissensfundus/neurodiversitaet/rollen-normen.html`,
    incorporated: 'Verständigung auch als Beziehung zwischen Erfahrungsweisen untersuchen. Wahrnehmende und Darstellungsform können eine Rolle spielen. Gegenseitiges Missverstehen bedeutet keine gleiche Entscheidungsmacht.',
    limit: 'Ursprung ist Autismusforschung; kein empirischer Nachweis einer allgemeinen Borderline-Regel. Die überprüften Aufgaben liefern unterschiedliche Ergebnisse. Gleicher Neurotyp garantiert keine Verständigung.'
  },
  {
    id: 'fundus-kosten', title: 'Phänomenatlas · Die Kosten sichtbaren Gelingens',
    kind: 'Begrifflicher Forschungsanschluss des bestehenden Wissensfundus',
    authorStatus: 'Bestehende redaktionelle Leitfragen, teils an Autismusforschung angeschlossen. Die hiesige Anwendung auf Unterstützung in Beziehungen ist ein begrenzter Vorschlag.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: 'Maskierung und sichtbares Gelingen, Zeilen 67–77; „Unterstützungskosten“, Zeilen 79–85',
    url: `${atlasUrl}wissensfundus/neurodiversitaet/verbindungen.html`,
    incorporated: 'Ruhige Oberfläche, erledigte Aufgabe und geringe Erschöpfung sind verschiedene Ergebnisse. Unterstützung fragt auch nach Vorbereitung, Selbstkontrolle, Begleitung, Erholung und Verteilung der Arbeit.',
    limit: 'Keine belegte universelle Kette von Anpassung zu Erschöpfung. Diese Vergleichsfragen sind keine Diagnose und kein Wirksamkeitsnachweis einer konkreten Hilfe.'
  },
  {
    id: 'traumaatlas-verfahren', title: 'Traumaatlas · Akzeptanz, Veränderung und wiederkehrende Muster',
    kind: 'Geprüfte Passagen einer vorhandenen historischen Lesekopie',
    authorStatus: 'Historischer redaktioneller Arbeitsbestand; Originalautorenschaft nicht abschließend geklärt. Kein neuer Wirksamkeitsbefund aus dieser Übernahme.',
    path: 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.',
    passage: 'Schematherapie, Zeilen 141–148; DBT, insbesondere Zeilen 151–154',
    incorporated: 'Alte Beziehungsmuster als veränderbare Arbeitshypothesen; bei DBT die Verbindung von Anerkennung und Veränderung sowie alltagsbezogene Fertigkeiten.',
    limit: 'Die pauschalen historischen Aussagen „beste Evidenz“ und „in jeder Traumatherapie“ werden nicht übernommen. Aktuelle Behandlungsaussagen sind an die gesonderten Quellen der Borderline-App gebunden. Eine App-Reflexion ist kein Therapieprogramm.'
  },
  {
    id: 'ralf-monde-rollen', title: 'Ralfs eigener Entwurf · Derselbe Gegenstand in mehreren Zusammenhängen',
    kind: 'Als Nutzerwortlaut erhaltene Originalauszüge',
    authorStatus: 'Ralf, am 22. Oktober 2026 als Wortlaut übergebene Auszüge; Zusammenstellung, kein vollständig gelesener Originalchat. Neue Kartierung hier: redaktioneller Vorschlag.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: 'Herkunftsvermerk, Zeilen 1–2; gemeinsame Monde, Zeile 4; Mensch und wechselnde Rollen, Zeile 6',
    url: `${atlasUrl}gemeinsame-monde.html`,
    incorporated: 'Ein Gegenstand soll in mehreren Zusammenhängen erreichbar bleiben. Rollen verändern sich, ohne dass der Mensch mit einer Rolle gleichgesetzt wird. Die vorliegende Karte verwendet deshalb gemeinsame Phänomene und benannte Beziehungen statt mehrfacher unverbundener Kurztexte.',
    limit: 'Planeten, Monde und Quantenverschränkung sind hier Gestaltungsbilder aus Ralfs Auftrag, keine physikalische oder medizinische Erklärung.'
  },
  {
    id: 'notebooklm-vorarbeit', title: 'Vorhandene NotebookLM-Recherche · Fragen und Gegenprüfung',
    kind: 'Dokumentierte frühere Werkzeugbeteiligung',
    authorStatus: 'Redaktioneller Bericht über tatsächlich verwendetes NotebookLM und die Gemini-App. KI-Antworten sind Vorschläge, keine unabhängigen wissenschaftlichen Belege.',
    path: `Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.`, passage: 'Tatsächliche Werkzeuge und Grenzen, Zeilen 3–5; bestehendes Notebook mit 58 Quellen und Forschungsfragen, Zeilen 7–13; Gegenprüfung, Zeilen 15–26; Übernahmeregeln, Zeile 66',
    url: `${atlasUrl}wissensfundus/neurodiversitaet/ki-werkstatt.html`,
    incorporated: 'Der vorhandene gemischte Quellenbestand half Fragen zu Unterstützung, Anforderungen, Anpassung und Selbstbestimmung zu finden. Spätere Gegenprüfungen führten zum Zurücknehmen überstarker Erklärungen.',
    limit: 'Die 58 Quellen sind kein einheitlich geprüftes medizinisches Evidenzkorpus. Diese Herkunft belegt frühere Beteiligung; sie behauptet keinen neuen abgeschlossenen NotebookLM-Lauf für diese Datei.'
  }
];

const node = (value) => ({
  kind: 'phenomenon', sourceIds: [], lineageIds: [], atlasRefs: [],
  knowledgeStatus: 'Redaktioneller Lernanschluss · erfundene Situation · keine Diagnose',
  ...value
});

export const atlasNodes = [
  node({
    id: 'gefuehlswelle', title: 'Gefühle überrollen mich', group: 'Anspannung & Erleben',
    summary: 'Das Gefühl ist schon sehr groß, bevor ein nächster Schritt klar wird. Erleben, Handlungsdruck und tatsächliche Handlung lassen sich getrennt betrachten.',
    situation: 'Eine Verabredung wird kurzfristig abgesagt. Mira spürt Druck im Brustkorb und tippt sofort eine lange Nachricht.',
    observation: 'Die Absage und die begonnene Nachricht sind bekannt. Druck und starke Gefühle sind Miras berichtetes Erleben.',
    interpretation: '„Ich bin unwichtig“ wäre eine Bedeutung, die Mira der Absage gibt. Sie ist noch keine Auskunft über den Grund der anderen Person.',
    uncertainty: 'Wie stark die Anspannung ist, welche Vorgeschichte hineinwirkt und was die Absage bedeutet, lässt sich von außen nicht bestimmen.',
    action: 'Die Nachricht zunächst als eigenen Entwurf behalten. Einen bereits vertrauten, sicheren Schritt zur Pause nutzen und erst später über den Kontakt entscheiden.',
    question: 'Was fühle ich, was möchte ich gerade tun, und welchen Teil davon will ich tatsächlich ausführen?',
    sourceIds: ['cochrane-2020'], lineageIds: ['neuroatlas-erleben', 'werkstatt-unterscheidungen', 'traumaatlas-verfahren'], atlasRefs: [dbt]
  }),
  node({
    id: 'wut', title: 'Wut wird laut', group: 'Anspannung & Erleben',
    summary: 'Ärger kann auf eine Verletzung hinweisen. Was jemand im Ärger tut, bleibt eine eigene Frage von Verantwortung und Schutz.',
    situation: 'Nach einer spöttischen Bemerkung erhebt Jan die Stimme und schlägt eine Tür zu. Die andere Person erschrickt.',
    observation: 'Bemerkung, Lautstärke und Türschlagen lassen sich beschreiben. Dass Jan sich abgewertet fühlt, ist seine Auskunft.',
    interpretation: 'Die Bemerkung könnte verletzend gewesen sein. Daraus folgt keine Erlaubnis, einzuschüchtern oder Grenzen zu übergehen.',
    uncertainty: 'Aus einer Episode ist weder ein Charakter noch eine Diagnose oder feste Eskalationsrolle ableitbar.',
    action: 'Die einschüchternde Handlung unterbrechen. Später den eigenen Anteil konkret benennen und die ursprüngliche Verletzung gesondert besprechen, soweit Kontakt möglich ist.',
    question: 'Welches Verhalten muss jetzt aufhören, und welches Anliegen bleibt danach zu klären?',
    lineageIds: ['neuroatlas-erleben', 'werkstatt-sprachdruck', 'werkstatt-unterscheidungen'], atlasRefs: [dbt]
  }),
  node({
    id: 'leere', title: 'Innen fühlt es sich leer an', group: 'Anspannung & Erleben',
    summary: 'Leere ist ein beschreibbares Erleben und keine vollständige Erklärung. Es verdient Aufmerksamkeit, ohne es aus einer einzelnen Situation zu etikettieren.',
    situation: 'Nach einem intensiven Wochenende sagt Alex: „Jetzt ist alles weg. Ich weiß gar nicht, was ich will.“',
    observation: 'Bekannt ist Alex’ Beschreibung. Außenstehende sehen vielleicht Ruhe, können daraus aber nicht auf innere Entlastung schließen.',
    interpretation: '„Du brauchst nur Ablenkung“ wäre bereits eine Deutung. Auch „das ist bestimmt Borderline“ ginge über die Beobachtung hinaus.',
    uncertainty: 'Dauer, Häufigkeit, körperlicher Zustand und Zusammenhang sind noch offen. Ähnliche Worte können unterschiedliche Erfahrungen meinen.',
    action: 'In eigenen Worten genauer beschreiben: leer, taub, erschöpft, orientierungslos? Bei anhaltender oder stark belastender Erfahrung passende fachliche Unterstützung suchen.',
    question: 'Was fehlt gerade am ehesten: Gefühl, Verbindung, Orientierung, Kraft oder etwas anderes?',
    lineageIds: ['neuroatlas-erleben', 'fundus-kosten'], atlasRefs: [gemeinsam]
  }),
  node({
    id: 'rueckzug', title: 'Rückzug hat mehrere mögliche Bedeutungen', group: 'Anspannung & Erleben',
    summary: 'Wenig sprechen oder weggehen kann verschiedenes bedeuten. Der ähnliche äußere Eindruck ersetzt die Auskunft der Person und den Verlauf nicht.',
    situation: 'Bei einem Gespräch verstummt Lou, schaut auf den Boden und verlässt den Raum.',
    observation: 'Lou spricht weniger und geht hinaus. Ob das eine gewählte Pause, Überlastung, Unsicherheit oder etwas anderes ist, wurde noch nicht gesagt.',
    interpretation: '„Lou bestraft mich mit Schweigen“ schreibt eine Absicht zu. „Lou ist dissoziiert“ behauptet eine fachliche Einordnung ohne ausreichende Grundlage.',
    uncertainty: 'Äußere Ähnlichkeit unterscheidet weder Überlastung von Dissoziation noch Schutz von Ablehnung. Auch die aktuelle Sicherheit muss eigenständig betrachtet werden.',
    action: 'Eine ausdrücklich gewünschte Pause respektieren. Wenn Kontakt möglich ist, später offen nach Erleben und hilfreichen Bedingungen fragen; keine Erklärung erzwingen.',
    question: 'Was weiß ich aus Lous eigener Auskunft, und was ergänze ich nur?',
    lineageIds: ['fundus-zeitgeschichte', 'neuroatlas-erleben', 'werkstatt-unterscheidungen'], atlasRefs: [trauma, bindung]
  }),
  node({
    id: 'entfremdung', title: 'Mir selbst oder der Welt fremd', group: 'Anspannung & Erleben',
    summary: '„Ich stehe neben mir“ und „alles wirkt unwirklich“ beschreiben Erleben. Sie bestimmen für sich genommen weder Ursache noch eine bestimmte Diagnose.',
    situation: 'Nach einer angespannten Begegnung sagt Kim, der Raum habe weit entfernt gewirkt und die eigene Stimme fremd.',
    observation: 'Kims berichtete Wahrnehmung und ihr zeitlicher Zusammenhang sind festhaltbar. Außenstehende können das innere Erleben nicht unmittelbar prüfen.',
    interpretation: 'Ein Zusammenhang mit Anspannung ist eine Frage. Die Behauptung einer verdrängten Erinnerung oder bestimmten Traumageschichte wäre eine zusätzliche, unbelegte Erklärung.',
    uncertainty: 'Beginn, Dauer, Begleiterscheinungen sowie körperliche und andere Erklärungen sind offen; eine App kann sie nicht fachlich abklären.',
    action: 'Beschreiben, wann es anfängt und aufhört, ohne eine verborgene Geschichte zu suchen. Bei neuem, wiederkehrendem oder beunruhigendem Erleben fachlich abklären lassen.',
    question: 'Was war anders an mir, an der Umgebung oder an meiner Erinnerung — und was ist mir sicher bekannt?',
    lineageIds: ['neuroatlas-erleben', 'fundus-zeitgeschichte'], atlasRefs: [trauma]
  }),
  node({
    id: 'antwort-aus', title: 'Eine Antwort bleibt aus', group: 'Nähe & Abstand', kind: 'relationship',
    summary: 'Eine offene Nachricht kann viel Bedeutung bekommen. Zeitablauf, eigener Wunsch und unbekannte Gründe des Gegenübers bleiben verschiedene Ebenen.',
    situation: 'Seit gestern ist eine Nachricht unbeantwortet. Deniz schaut immer wieder aufs Telefon und möchte nachlegen.',
    observation: 'Eine Antwort liegt noch nicht vor. Bekannt ist außerdem, was genau geschrieben und gegebenenfalls vereinbart wurde.',
    interpretation: '„Ich werde verlassen“ oder „ich bin lästig“ können sich sehr überzeugend anfühlen. Ohne weitere Auskunft sind sie keine bestätigten Gründe des Schweigens.',
    uncertainty: 'Beschäftigung, Unklarheit, Überforderung, ein Wunsch nach Abstand oder andere Gründe bleiben möglich. Die App wählt keine davon als Wahrheit aus.',
    action: 'Kontaktvereinbarungen prüfen. Die nächste Nachricht nicht allein zur sofortigen Beruhigung benutzen; den eigenen Unterstützungsbedarf zunächst unabhängig versorgen.',
    question: 'Welche Information fehlt mir, und welche Gewissheit versuche ich durch eine weitere Nachricht zu bekommen?',
    lineageIds: ['werkstatt-sprachdruck', 'werkstatt-unterscheidungen'], atlasRefs: [bindung]
  }),
  node({
    id: 'verlustangst', title: 'Die Angst vor Verlust ist groß', group: 'Nähe & Abstand',
    summary: 'Die Angst ist als Erleben ernst zu nehmen. Sie beweist nicht, dass eine Trennung bevorsteht, und verpflichtet das Gegenüber nicht zu unbegrenzter Rückversicherung.',
    situation: 'Beim Abschied sagt Pat: „Wenn du gehst, bin ich dir wohl nicht wichtig.“ Dabei ist nur ein Abend allein geplant.',
    observation: 'Der geplante Abschied und Pats Satz sind bekannt. Angst und Kontaktwunsch können als eigene Erfahrung benannt werden.',
    interpretation: 'Ein Abschied wird hier möglicherweise als Beziehungsurteil gelesen. Diese Bedeutung muss weder geteilt noch als absichtlicher Druck festgelegt werden.',
    uncertainty: 'Eine Episode belegt keinen Bindungstyp und keine Borderline-Diagnose. Frühere Erfahrungen können bedeutsam sein, ohne aus dem Satz rekonstruierbar zu werden.',
    action: 'Den Wunsch ohne Loyalitätsprüfung formulieren: „Abschiede fallen mir heute schwer. Ich kümmere mich um meinen Abend; was wir vereinbart haben, bleibt bestehen.“',
    question: 'Kann ich meine Angst zeigen und zugleich die Freiheit der anderen Person bestehen lassen?',
    lineageIds: ['neuroatlas-erleben', 'werkstatt-sprachdruck', 'werkstatt-unterscheidungen'], atlasRefs: [bindung]
  }),
  node({
    id: 'naehe-druck', title: 'Wenn Nähe zur Verpflichtung wird', group: 'Nähe & Abstand', kind: 'relationship',
    summary: 'Verbundenheit kann gewünscht sein und trotzdem Druck erzeugen. Entscheidend ist, ob eine andere Antwort oder ein Nein praktisch möglich bleibt.',
    situation: '„Nach allem, was ich für dich getan habe, kannst du wenigstens vorbeikommen.“ Die angesprochene Person hatte abgesagt.',
    observation: 'Vergangene Hilfe wird mit einem aktuellen Besuchswunsch verknüpft. Eine konkrete frühere Vereinbarung ist noch nicht benannt.',
    interpretation: 'Es könnte Dankesschuld eingefordert werden. Möglich ist auch, dass eine wirkliche gemeinsame Verpflichtung ungeschickt angesprochen wird; das muss geklärt werden.',
    uncertainty: 'Ein Wortlaut allein zeigt nicht alle Absprachen oder Machtverhältnisse. Eine liebevolle Absicht würde den erlebten Druck trotzdem nicht automatisch beseitigen.',
    action: 'Konkrete Vereinbarung, eigenen Wunsch und Beziehung voneinander trennen. Einen Besuch nicht als Beweis von Liebe oder Dankbarkeit verlangen.',
    question: 'Welche freie Entscheidung bleibt der anderen Person, ohne dafür abgewertet zu werden?',
    lineageIds: ['werkstatt-sprachdruck', 'fundus-als-rolle'], atlasRefs: [bindung]
  }),
  node({
    id: 'abstand', title: 'Abstand wünschen', group: 'Nähe & Abstand', kind: 'relationship',
    summary: 'Ein Wunsch nach Abstand kann konkret gelten, ohne die ganze Beziehung zu erklären. Weder eine Diagnosevermutung noch ein eigener Kontaktwunsch hebt ihn auf.',
    situation: 'Robin sagt: „Diese Woche möchte ich keine Nachrichten. Ich melde mich selbst.“ Sam möchte sofort fragen, ob noch Hoffnung besteht.',
    observation: 'Robin hat eine Kontaktpause mit eigener Rückmeldung benannt. Eine weitere inhaltliche Erklärung ist nicht gegeben.',
    interpretation: 'Sam erlebt vielleicht Angst oder liest die Pause als endgültige Ablehnung. Das ist Sams Erleben, keine Zustimmung Robins zu einer weiteren Klärung.',
    uncertainty: 'Wie Robin die Beziehung insgesamt sieht, bleibt unbekannt. Eine Pause ist weder automatisch Symptom noch nachgewiesene Bestrafung.',
    action: 'Die benannte Pause gelten lassen und einen Entwurf für die eigene Reflexion behalten. Unterstützung an anderer erreichbarer Stelle organisieren.',
    question: 'Wie kann ich die offene Frage aushalten, ohne die gerade klare Grenze wieder zu öffnen?',
    lineageIds: ['werkstatt-sprachdruck', 'werkstatt-unterscheidungen'], atlasRefs: [bindung]
  }),
  node({
    id: 'eigene-grenze', title: 'Auch meine Grenze gilt', group: 'Nähe & Abstand', kind: 'practice',
    summary: 'Anteilnahme und begrenzte Verfügbarkeit können zusammengehören. Anerkennung eines Bedürfnisses verlangt keine Aufgabe der eigenen Entscheidung.',
    situation: 'Ein Freund möchte, dass Toni nachts immer erreichbar ist. Toni braucht Schlaf und möchte trotzdem unterstützen.',
    observation: 'Es gibt eine Bitte um ständige Erreichbarkeit und Tonis Bedürfnis nach einer Nachtruhe. Beides kann konkret benannt werden.',
    interpretation: '„Wenn ich Nein sage, lasse ich ihn fallen“ wäre eine zusätzliche Schlussfolgerung. Eine Grenze ist nicht schon Gleichgültigkeit.',
    uncertainty: 'Welche andere Unterstützung verfügbar ist und was beide tragen können, braucht persönliche Klärung. Es gibt keine passende Standardzusage für alle Beziehungen.',
    action: 'Eine tragbare Zusage machen, etwa zu einem vereinbarten Gespräch. Nicht mehr anbieten, als tatsächlich gehalten werden kann; ergänzende fachliche Unterstützung gemeinsam erwägen.',
    question: 'Welche Unterstützung ist verlässlich möglich, ohne dass sie meine eigene Versorgung aufzehrt?',
    sourceIds: ['family-2024'], lineageIds: ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck', 'fundus-kosten'], atlasRefs: [bindung]
  }),
  node({
    id: 'gemeinsam-regulieren', title: 'Unterstützung bleibt ein Angebot', group: 'Nähe & Abstand', kind: 'practice',
    summary: 'Gemeinsam ruhiger werden ist ein möglicher Zugang. Das Gegenüber behält seine Entscheidung; Unterstützung wird nicht zum Anspruch auf Anwesenheit.',
    situation: 'Noa fragt: „Würde dir ein kurzer Spaziergang zusammen helfen?“ Lee sagt, heute lieber allein sein zu wollen.',
    observation: 'Ein Angebot und eine Ablehnung sind ausgesprochen. Ob Nähe gerade entlastet, kann Lee am ehesten selbst beschreiben.',
    interpretation: 'Die Ablehnung muss keine Abwertung Noas sein. Ein gut gemeintes Angebot wird durch Beharren möglicherweise zu einer zusätzlichen Anforderung.',
    uncertainty: 'Was früher geholfen hat, muss heute nicht passen. Ein Atlasanschluss zur Co-Regulation beweist keine Wirkung in dieser Situation.',
    action: 'Das Angebot ohne Kränkung zurücknehmen. Für einen späteren Zeitpunkt können beide passende Formen und Grenzen freiwilliger Unterstützung besprechen.',
    question: 'Darf mein Hilfsangebot abgelehnt werden, ohne dass daraus ein neues Problem entsteht?',
    lineageIds: ['werkstatt-unterscheidungen', 'notebooklm-vorarbeit'], atlasRefs: [gemeinsam]
  }),
  node({
    id: 'kritik', title: 'Eine Rückmeldung trifft sehr tief', group: 'Selbstbild & Zuschreibung',
    summary: 'Eine Bemerkung kann sich wie ein Urteil über den ganzen Menschen anfühlen. Die konkrete Rückmeldung und ihre Bedeutung für das Selbstbild lassen sich auseinanderhalten.',
    situation: 'Eine Kollegin sagt: „Die Datei war zu spät fertig.“ Fin hört darin: „Auf dich ist kein Verlass.“',
    observation: 'Gesagt wurde etwas über den Zeitpunkt einer Datei. Fins stärkere Schlussfolgerung ist eine eigene Interpretation.',
    interpretation: 'Vielleicht wird eine frühere Erfahrung von Abwertung berührt. Vielleicht ist die Rückmeldung selbst unsachlich. Beides muss am konkreten Geschehen geprüft werden.',
    uncertainty: 'Ein einzelner starker Schmerz zeigt weder die Absicht der Kollegin noch eine Diagnose. Eigene Empfindlichkeit macht eine tatsächliche Abwertung nicht unmöglich.',
    action: 'Die konkrete Sache klären und die Wirkung gesondert benennen. Bei globaler Abwertung darf eine Grenze gesetzt werden, statt sich vollständig zu erklären.',
    question: 'Was wurde tatsächlich kritisiert, und welchen zusätzlichen Satz über mich höre ich mit?',
    lineageIds: ['neuroatlas-erleben', 'werkstatt-unterscheidungen', 'fundus-als-rolle'], atlasRefs: [scham]
  }),
  node({
    id: 'scham-schuld', title: 'Vom Fehler zum ganzen Selbst', group: 'Selbstbild & Zuschreibung',
    summary: 'Eine konkrete Verantwortung kann untersucht werden, ohne daraus ein umfassendes Werturteil über die eigene Person zu machen.',
    situation: 'Nach einem scharfen Satz denkt Iman: „Ich mache alles kaputt. Mit mir kann niemand sein.“',
    observation: 'Der ausgesprochene Satz kann benannt werden, ebenso die berichtete Verletzung. „Alles“ und „niemand“ gehen über diese Episode hinaus.',
    interpretation: 'Ein eigenes Fehlverhalten und ein Gefühl von Wertlosigkeit sind unterschiedliche Ebenen. Selbstverurteilung repariert die konkrete Wirkung noch nicht.',
    uncertainty: 'Wie die andere Person den Vorfall erlebt und welche Reparatur überhaupt willkommen ist, ist gegebenenfalls noch offen. Nicht jede Verantwortung gehört Iman.',
    action: 'Eine konkrete Handlung und deren Wirkung benennen. Einen nächsten veränderbaren Schritt wählen; zusätzliche Unterstützung für die eigene Scham suchen.',
    question: 'Was muss ich verantworten, und welches pauschale Urteil über meinen Wert füge ich hinzu?',
    lineageIds: ['neuroatlas-erleben', 'werkstatt-unterscheidungen', 'werkstatt-sprachdruck'], atlasRefs: [scham, dbt]
  }),
  node({
    id: 'selbstbild', title: 'Mein Bild von mir wechselt', group: 'Selbstbild & Zuschreibung',
    summary: 'Wie jemand sich erlebt, kann über Situationen und Beziehungen wechseln. Die eigene Beschreibung ist ein Anfang; ein einzelner Wechsel erklärt noch kein längerfristiges Muster.',
    situation: 'Nach einem guten Treffen fühlt Jule sich liebenswert und sicher. Nach einer unbeantworteten Einladung erscheint dieselbe Person sich plötzlich unerwünscht.',
    observation: 'Jule berichtet unterschiedliche Selbstbewertungen in zwei Situationen. Welche anderen Bedingungen sich verändert haben, ist noch nicht festgehalten.',
    interpretation: 'Die Bewertung könnte stark am aktuellen Beziehungserleben hängen. Das bleibt eine zu prüfende Beschreibung, keine Erklärung einer ganzen Persönlichkeit.',
    uncertainty: 'Dauer, Ausmaß, Leidensdruck und weitere Lebensbereiche sind offen. Ein Beispiel ist kein diagnostisches Kriterienset.',
    action: 'Die verschiedenen Selbstbeschreibungen nebeneinander halten. Nach eigenen Werten, Interessen und tragenden Erfahrungen fragen, die in beiden Situationen zugänglich bleiben können.',
    question: 'Was sehe ich in der einen Situation an mir, das mir in der anderen völlig verloren geht?',
    lineageIds: ['neuroatlas-erleben', 'fundus-als-rolle'], atlasRefs: [scham]
  }),
  node({
    id: 'mensch-rolle', title: 'Ich bin mehr als die Rolle, in der du mich siehst', group: 'Selbstbild & Zuschreibung', kind: 'relationship',
    summary: 'Selbstverständnis, Fremdzuschreibung und situative Rolle sind verschiedene Beziehungen. Keine davon umfasst einen Menschen vollständig.',
    situation: 'In der Familie gilt Mara als „die Schwierige“. Bei der Arbeit wird sie als verlässlich erlebt; selbst beschreibt sie sich gerade als erschöpft.',
    observation: 'Drei Beschreibungen stammen aus verschiedenen Perspektiven und Situationen. Sie müssen nicht zu einem einzigen Etikett zusammengeschoben werden.',
    interpretation: 'Eine alte Familienrolle könnte beeinflussen, wie neue Handlungen gelesen werden. Dass sie alles erklärt, ist damit nicht belegt.',
    uncertainty: 'Rollen sind nicht völlig frei wählbar. Abhängigkeiten, Erwartungen und konkrete Entscheidungen anderer begrenzen die Möglichkeit, anders aufzutreten.',
    action: 'Fragen: Wer sieht wen in welcher Situation als was — und mit welcher Folge? Die eigene Beschreibung neben der Zuschreibung stehen lassen.',
    question: 'Welche Erwartung hängt an diesem Namen, und was wird dadurch an mir übersehen?',
    knowledgeStatus: 'Begriffliche Atlas-Unterscheidung · redaktioneller Vergleich',
    lineageIds: ['fundus-als-rolle', 'ralf-monde-rollen'], atlasRefs: [bindung]
  }),
  node({
    id: 'normen', title: 'Welche Erwartung gilt hier eigentlich?', group: 'Selbstbild & Zuschreibung', kind: 'relationship',
    summary: '„Normal“ kann häufig, zweckmäßig, institutionell erwartet oder moralisch geboten bedeuten. Diese Maßstäbe entscheiden nicht alle dieselbe Frage.',
    situation: 'Bei einem Familienessen soll jede Person lange bleiben. Ari braucht eine frühe Pause und wird deshalb als unhöflich bezeichnet.',
    observation: 'Es gibt eine gemeinsame Gewohnheit und einen abweichenden Bedarf. Die moralische Bewertung wird von anderen ergänzt.',
    interpretation: 'Die Erwartung könnte Zusammenhalt ausdrücken, zugleich aber einen realen Bedarf übergehen. Beides lässt sich als Beziehung zwischen Person und Umgebung prüfen.',
    uncertainty: 'Eine unpassende Umgebung erklärt nicht jede Schwierigkeit. Umgekehrt belegt eine Diagnose nicht, dass jede Erwartung sinnvoll oder unveränderbar ist.',
    action: 'Die konkrete Funktion der Regel besprechen und eine tragbare Alternative suchen. Den Wert einer Person nicht daran messen, ob sie eine Gewohnheit erfüllt.',
    question: 'Geht es gerade um praktische Abstimmung, Gewohnheit, Macht oder eine moralische Forderung?',
    knowledgeStatus: 'Analytisches Raster des Atlas · kein Messinstrument',
    lineageIds: ['fundus-als-rolle', 'fundus-kosten']
  }),
  node({
    id: 'beobachtung-deutung', title: 'Was geschah — und was bedeutet es für mich?', group: 'Verständigung & Verantwortung', kind: 'practice',
    summary: 'Wortlaut und Handlung können festgehalten werden. Die Bedeutung, die jemand ihnen gibt, darf sichtbar bleiben und zugleich veränderbar sein.',
    situation: '„Sie hat mich demonstrativ ignoriert“, sagt Ben. Auf Nachfrage: Sie blickte beim Vorbeigehen auf ihr Telefon und grüßte nicht.',
    observation: 'Nichtgrüßen und Blick aufs Telefon sind die beschriebene Episode. „Demonstrativ“ ergänzt eine Absicht.',
    interpretation: 'Absichtliche Ablehnung ist eine mögliche Erklärung. Unaufmerksamkeit oder ein anderer Zusammenhang könnten zum gleichen äußeren Ablauf passen.',
    uncertainty: 'Mehrere passende Erklärungen sind nicht automatisch gleich wahrscheinlich. Die fehlende Information muss als fehlend stehen bleiben.',
    action: 'Zuerst Handlung und Wortlaut notieren, dann die eigene Bedeutung. Wenn eine Klärung möglich und willkommen ist, offen nachfragen.',
    question: 'Welcher Teil meines Satzes beschreibt etwas Wahrnehmbares, welcher Teil meine Schlussfolgerung?',
    lineageIds: ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck'], atlasRefs: [bindung]
  }),
  node({
    id: 'andere-innenwelt', title: 'Die andere Innenwelt bleibt eine Hypothese', group: 'Verständigung & Verantwortung', kind: 'practice',
    summary: 'Auch eine sehr plausible Vermutung ist keine unmittelbare Kenntnis fremder Gedanken. Die Person darf etwas anderes meinen als erwartet.',
    situation: '„Du willst doch nur, dass ich mich schlecht fühle“, sagt Nika nach einer kritischen Nachfrage.',
    observation: 'Bekannt sind die Nachfrage und Nikas Wirkungserleben. Die zugeschriebene Absicht ist noch nicht bestätigt.',
    interpretation: 'Eine verletzende Wirkung kann real sein, während die vermutete Absicht falsch bleibt. Gute Absicht kann umgekehrt eine schädigende Handlung nicht ungeschehen machen.',
    uncertainty: 'Auch die Selbstauskunft der anderen Person klärt nicht automatisch jede Wirkung oder Widersprüchlichkeit. Sie ist dennoch eine andere Quelle als Gedankenlesen.',
    action: 'Die eigene Erfahrung als eigene benennen. Eine zweite Erklärung zulassen und prüfen, welche Information sie stützen oder widerlegen würde.',
    question: 'Welche Aussage über das Gegenüber behandle ich gerade wie eine sichere Tatsache?',
    sourceIds: ['cochrane-2020'], lineageIds: ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck'], atlasRefs: [bindung]
  }),
  node({
    id: 'wirkung-absicht', title: 'Wirkung hören, Absicht getrennt erklären', group: 'Verständigung & Verantwortung', kind: 'relationship',
    summary: 'Eine Erklärung der eigenen Absicht kann wichtig sein. Sie ersetzt nicht die Auseinandersetzung damit, was konkret geschehen ist und wie es ankam.',
    situation: 'Nach einem Witz sagt Eli: „Das hat mich vor allen bloßgestellt.“ Die Antwort lautet: „War doch nur Spaß.“',
    observation: 'Der Witz, die Anwesenheit anderer und Elis berichtete Verletzung sind benennbar. Die Antwort erklärt eine Absicht.',
    interpretation: 'Die Absichtserklärung kann hier wie eine Entwertung der Wirkung wirken. Sie muss nicht bewusst so geplant worden sein.',
    uncertainty: 'Die genaue Wirkung ist Elis Auskunft; die Absicht gehört zur Auskunft der anderen Person. Keine Seite muss deshalb jede Tatsachendeutung übernehmen.',
    action: 'Den konkreten eigenen Beitrag anerkennen: „Ich habe das vor den anderen gesagt.“ Die Absicht anschließend gesondert erklären, ohne die Wirkung zurückzunehmen.',
    question: 'Bleibt meine Anerkennung auch dann stehen, wenn ich anschließend meine Absicht beschreibe?',
    lineageIds: ['werkstatt-sprachdruck', 'werkstatt-unterscheidungen'], atlasRefs: [bindung]
  }),
  node({
    id: 'validierung', title: 'Erleben anerkennen, ohne alles zu bestätigen', group: 'Verständigung & Verantwortung', kind: 'practice',
    summary: 'Dass etwas schmerzt, kann anerkannt werden, während die Deutung der Tatsachen offenbleibt. Auch die eigene Grenze darf bestehen.',
    situation: '„Du hast mich absichtlich stehen lassen“, sagt eine Person. Die andere möchte den Schmerz ernst nehmen, teilt aber die behauptete Absicht nicht.',
    observation: 'Die Person berichtet Verletzung und verbindet sie mit einer Erklärung. Diese beiden Teile lassen sich gesondert beantworten.',
    interpretation: '„Ich höre, dass du dich allein gelassen gefühlt hast“ erkennt das Erleben an. Es behauptet noch nicht, dass ein absichtliches Im-Stich-Lassen geschehen ist.',
    uncertainty: 'Ein verständnisvoll formulierter Satz garantiert keine Beruhigung. Anerkennung ist kein Verfahren, um eine gewünschte Reaktion zu erzwingen.',
    action: 'Zunächst das Verstandene in eigenen Worten zurückgeben; bei Bedarf nachfragen. Die eigene Sicht und eine bestehende Grenze klar danebenstellen.',
    question: 'Was kann ich ehrlich anerkennen, ohne Zustimmung vorzutäuschen oder mich selbst aufzugeben?',
    lineageIds: ['werkstatt-unterscheidungen', 'traumaatlas-verfahren'], atlasRefs: [dbt, bindung]
  }),
  node({
    id: 'verantwortung', title: 'Mein Anteil hat eine konkrete Form', group: 'Verständigung & Verantwortung', kind: 'practice',
    summary: 'Verantwortung wird an einer Handlung und ihrer Veränderung bearbeitbar. Sie ist weder totale Selbstschuld noch eine automatische Halbierung zwischen zwei Personen.',
    situation: 'Zwei Menschen streiten. Eine Person hat beleidigt; die andere hat eine Verabredung ohne Nachricht ausfallen lassen.',
    observation: 'Es liegen verschiedene Handlungen vor. Sie können getrennt beschrieben werden, ohne sie als gleich schwer zu bewerten.',
    interpretation: 'Eine eigene Verletzung erklärt vielleicht Ärger, entschuldigt aber nicht jede Reaktion. Der eigene Anteil macht fremdes Verhalten nicht zur eigenen Verantwortung.',
    uncertainty: 'Ohne genaueren Zusammenhang lassen sich keine faire Gesamtbilanz und keine sichere Gleichverteilung der Verantwortung herstellen.',
    action: 'Den eigenen konkreten Beitrag und eine Veränderung benennen. Für das Verhalten der anderen Person eine eigene Klärung oder Schutzentscheidung treffen.',
    question: 'Welche Handlung kann ich verändern, und welche Zuständigkeit gehört ausdrücklich jemand anderem?',
    lineageIds: ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck'], atlasRefs: [scham, dbt]
  }),
  node({
    id: 'passung-macht', title: 'Missverständnis und Macht sind zwei Fragen', group: 'Verständigung & Verantwortung', kind: 'relationship',
    summary: 'Verständigung kann an unterschiedlichen Erfahrungsweisen scheitern. Gegenseitiges Missverstehen bedeutet trotzdem keine gleiche Freiheit oder gleiche Folgen.',
    situation: 'Ein Vorgesetzter hält eine Bitte um klare schriftliche Absprachen für Misstrauen. Die Mitarbeiterin erlebt spontane mündliche Änderungen als schwer bewältigbar.',
    observation: 'Die Beteiligten beschreiben verschiedene Anforderungen an Verständigung. Nur eine Seite entscheidet zugleich über die Leistungsbeurteilung.',
    interpretation: 'Kommunikative Passung ist eine mögliche Vergleichsfrage. Die unterschiedliche Entscheidungsmacht verschwindet dadurch nicht.',
    uncertainty: 'Die zugrunde liegende Double-Empathy-Forschung betrifft vor allem Autismus und begrenzte Aufgaben. Sie liefert keine allgemeine Regel über Borderline-Beziehungen.',
    action: 'Eine konkrete Kommunikationsform erproben und ihre Folgen gemeinsam prüfen. Zusätzlich benennen, wer Entscheidungen trifft und wer Nachteile tragen muss.',
    question: 'Was braucht bessere Übersetzung — und was braucht eine veränderte Entscheidung oder Grenze?',
    knowledgeStatus: 'Begrifflicher Transfer aus einem anderen Forschungsfeld · offen zu prüfen',
    lineageIds: ['fundus-passung-macht', 'fundus-als-rolle']
  }),
  node({
    id: 'pause', title: 'Eine Pause bekommt eine tragbare Form', group: 'Verständigung & Verantwortung', kind: 'practice',
    summary: 'Unterbrechen kann einen Handlungsspielraum eröffnen. Eine Pause braucht keine sofortige Lösung; Rückkehr und Grenzen dürfen konkret vereinbart werden.',
    situation: 'Ein Gespräch wird immer lauter. Eine Person sagt: „Ich brauche eine Pause. Morgen kann ich überlegen, ob ich weiterreden möchte.“',
    observation: 'Das Gespräch wurde lauter und ein Unterbrechungswunsch ist benannt. Ein Gespräch am nächsten Tag wurde noch nicht zugesagt.',
    interpretation: 'Der Rückzug kann als Abweisung erlebt werden. Daraus folgt nicht, dass die Pause eine Strafe ist oder sofort neu verhandelt werden muss.',
    uncertainty: 'Eine Pause hilft nicht jeder Person auf gleiche Weise. Bei Bedrohung oder Übergriffen reicht ein Gesprächsformat allein nicht als Schutz.',
    action: 'Die Unterbrechung tatsächlich einhalten. Eigene Anspannung anders versorgen; nur die Rückkehr vereinbaren, der beide freiwillig zustimmen können.',
    question: 'Welche Zusage wurde wirklich gemacht, und was wünsche ich mir zusätzlich?',
    lineageIds: ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck'], atlasRefs: [dbt]
  }),
  node({
    id: 'reparatur', title: 'Wiedergutmachung gewährt keinen Anspruch auf Antwort', group: 'Verständigung & Verantwortung', kind: 'practice',
    summary: 'Ein veränderter Umgang wird durch Handlungen sichtbar. Eine Entschuldigung kann Verantwortung ausdrücken und lässt dem Gegenüber seine Entscheidung.',
    situation: 'Nach einer Grenzüberschreitung schreibt eine Person eine überarbeitete Entschuldigung. Die andere hatte ausdrücklich keinen weiteren Kontakt gewünscht.',
    observation: 'Es gibt einen Entwurf und ein bestehendes Kontakt-Nein. Eine bessere Formulierung ändert die Kontaktlage nicht.',
    interpretation: 'Der Wunsch nach Versöhnung ist nachvollziehbar. Ihn als Pflicht zur Annahme oder Antwort zu behandeln würde erneut Druck erzeugen.',
    uncertainty: 'Ob eine spätere Klärung willkommen sein wird, ist nicht bekannt. Es gibt keinen Satz, der Zustimmung zuverlässig herstellt.',
    action: 'Den Text für die eigene Arbeit behalten und die benannte Grenze respektieren. Die Veränderung am eigenen Verhalten beginnen, auch ohne Rückmeldung.',
    question: 'Was will ich ändern, das ich auch dann verantworten kann, wenn keine Versöhnung folgt?',
    lineageIds: ['werkstatt-sprachdruck', 'werkstatt-unterscheidungen'], atlasRefs: [bindung, dbt]
  }),
  node({
    id: 'entwicklung', title: 'Eine Geschichte hat mehrere Einflüsse', group: 'Entwicklung & Unterstützung', kind: 'relationship',
    summary: 'Entwicklung lässt sich nicht auf eine Person oder ein Ereignis reduzieren. Konkrete verletzende Handlungen bleiben benennbar, während die Erklärung eines ganzen Verlaufs offen ist.',
    situation: 'Eine erwachsene Person möchte verstehen, wie frühe Belastungen, eigene Voraussetzungen und spätere Beziehungen mit heutigen Schwierigkeiten zusammenhängen.',
    observation: 'Eigene Erinnerungen, Berichte anderer, Dokumente und heutiges Erleben sind verschiedene Quellen. Sie dürfen mit ihrer Herkunft nebeneinanderstehen.',
    interpretation: 'Belastende Erfahrungen können als mögliche Entwicklungseinflüsse betrachtet werden. Heutige Schwierigkeiten beweisen weder ein verborgenes Ereignis noch eine alleinige Ursache.',
    uncertainty: 'Gruppenbefunde rekonstruieren kein einzelnes Leben. Rückblickende Erklärungen können stimmig erscheinen und dennoch unvollständig oder falsch sein.',
    action: 'Bekanntes, Berichtetes und Vermutetes trennen. Für die heutige Unterstützung fragen, was konkret verändert werden kann, ohne eine vollständige Ursprungsgeschichte zu erzwingen.',
    question: 'Was ist als Erfahrung belegt, was als Zusammenhang vermutet, und was bleibt offen?',
    sourceIds: ['adversity-2020', 'prospective-2016', 'development-2024'], lineageIds: ['werkstatt-unterscheidungen', 'fundus-zeitgeschichte'], atlasRefs: [trauma, bindung]
  }),
  node({
    id: 'ueberlappung', title: 'Ähnliches Erleben, verschiedene Zusammenhänge', group: 'Entwicklung & Unterstützung', kind: 'relationship',
    summary: 'Überforderung, Rückzug oder schwankendes Erleben können Vergleichsfragen öffnen. Ähnlichkeit allein setzt Borderline, Trauma und Neurodivergenz nicht gleich.',
    situation: 'Zwei Personen berichten, in Gesprächen „dichtzumachen“. Bei einer stehen Reize im Vordergrund, bei der anderen Erinnerungsbezüge; beide wissen noch nicht genau, was geschieht.',
    observation: 'Die gleiche Redewendung steht für zwei eigene Berichte. Zeitpunkt, Verlauf, Auslöser und Bedeutung müssen jeweils genauer beschrieben werden.',
    interpretation: 'Mehrere Zusammenhänge können relevant sein. Eine einfache Entweder-oder-Entscheidung wäre ebenso vorschnell wie eine gemeinsame Erklärung für alles.',
    uncertainty: 'Der Atlas bietet kein Verfahren, um Diagnosen abzugrenzen oder Begleitdiagnosen festzustellen. Die fachliche Einordnung benötigt mehr als eine Ähnlichkeit.',
    action: 'Von der eigenen Erfahrung ausgehen: Seit wann, in welchen Situationen, mit welchem Verlauf und welcher Beeinträchtigung? Diese Beobachtungen können ein fachliches Gespräch vorbereiten.',
    question: 'Was sieht nur ähnlich aus, und welche Unterschiede zeigt die eigene Geschichte?',
    lineageIds: ['neuroatlas-erleben', 'fundus-zeitgeschichte', 'werkstatt-unterscheidungen'], atlasRefs: [trauma, bindung]
  }),
  node({
    id: 'unterstuetzungskosten', title: 'Was kostet das scheinbare Gelingen?', group: 'Entwicklung & Unterstützung', kind: 'relationship',
    summary: 'Ein ruhiges Gespräch ist ein Ergebnis; geringe Erschöpfung ein anderes. Unterstützung wird verständlicher, wenn auch Vorbereitung, Erholung und Verteilung der Arbeit sichtbar werden.',
    situation: 'Ein Treffen verlief ohne Streit. Danach braucht eine Person zwei Tage Erholung; die andere hatte währenddessen ständig vermittelt.',
    observation: 'Der sichtbare Verlauf und die berichteten Aufwände gehören zusammen, sind aber nicht dieselbe Messgröße.',
    interpretation: '„Es hat doch wunderbar geklappt“ kann einen Teil des Geschehens treffen und einen anderen übersehen. Das macht den Erfolg nicht wertlos, aber genauer beschreibbar.',
    uncertainty: 'Aus einem Treffen folgt keine allgemeine Aussage über Maskierung, Erschöpfung oder eine Diagnose. Verdeckter Aufwand muss erfragt werden, statt ihn vorauszusetzen.',
    action: 'Neben dem Ergebnis auch die Kosten besprechen: Wer hat vorbereitet, verzichtet, beruhigt, begleitet und sich erholt? Eine veränderte Bedingung ausprobieren.',
    question: 'Was würde Erfolg bedeuten, wenn die Belastung beider Personen mitgezählt wird?',
    knowledgeStatus: 'Redaktionelle Vergleichsfrage aus dem vorhandenen Wissensfundus',
    lineageIds: ['fundus-kosten', 'notebooklm-vorarbeit'], atlasRefs: [gemeinsam]
  }),
  node({
    id: 'behandlung', title: 'Unterstützung gemeinsam passend machen', group: 'Entwicklung & Unterstützung', kind: 'practice',
    summary: 'Strukturierte Psychotherapie, persönliche Ziele und verlässliche Absprachen gehören in eine fachliche Behandlungsplanung. Eine einzelne Reflexion in der App ersetzt diesen Rahmen nicht.',
    situation: 'Eine Person möchte weniger unter Gefühlswechseln leiden und Beziehungen tragbarer gestalten. Sie fragt, welches Verfahren zu ihren Zielen und Umständen passt.',
    observation: 'Eigene Ziele, Alltagsbelastungen, bisherige Erfahrungen und verfügbare Angebote lassen sich für das Gespräch zusammentragen.',
    interpretation: 'DBT, MBT, Schematherapie oder andere strukturierte Ansätze setzen unterschiedliche Schwerpunkte. Daraus entsteht keine einfache Rangliste für jede Person.',
    uncertainty: 'Die Studienlage ist für viele Vergleiche begrenzt. Ein günstiger Gruppenbefund garantiert kein persönliches Ergebnis und belegt keine Wirkung einzelner App-Übungen.',
    action: 'Mit einer qualifizierten Fachperson Ziele, Rahmen, Sicherheit, Begleiterkrankungen und Präferenzen besprechen. Fortlaufend prüfen, was im eigenen Alltag tatsächlich besser oder schwerer wird.',
    question: 'Welche konkrete Veränderung wäre für mich bedeutsam, und woran würden wir sie gemeinsam erkennen?',
    sourceIds: ['apa-2024', 'cochrane-2020', 'psychotherapy-2024', 'boots-2026'], lineageIds: ['traumaatlas-verfahren', 'werkstatt-unterscheidungen'], atlasRefs: [dbt]
  })
];

const edge = (from, to, label, kind, explanation, lineageIds, limit = 'Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.') =>
  ({ from, to, label, kind, explanation, limit, lineageIds });

export const atlasEdges = [
  edge('antwort-aus', 'verlustangst', 'Eine mögliche Bedeutung des Wartens', 'comparison', 'Eine unbeantwortete Nachricht kann in einer erfundenen Situation als drohender Verlust erlebt werden. Der Zeitablauf beweist diese Bedeutung nicht.', ['werkstatt-unterscheidungen', 'neuroatlas-erleben']),
  edge('antwort-aus', 'beobachtung-deutung', 'Zeitablauf von Erklärung trennen', 'practice', 'Die fehlende Antwort ist bekannt; ihr Grund bleibt ohne weitere Auskunft offen.', ['werkstatt-unterscheidungen']),
  edge('verlustangst', 'naehe-druck', 'Wenn Beruhigung eingefordert wird', 'tension', 'Aus eigener Angst kann eine Forderung nach Kontakt entstehen. Die Angst begründet keinen Anspruch auf Verfügbarkeit.', ['werkstatt-sprachdruck']),
  edge('verlustangst', 'eigene-grenze', 'Bedürfnis trifft begrenzte Verfügbarkeit', 'tension', 'Ein starkes Bedürfnis und die Grenze des Gegenübers dürfen zugleich ernst genommen werden.', ['werkstatt-unterscheidungen']),
  edge('naehe-druck', 'mensch-rolle', 'Die Rolle verpflichtet nicht zu allem', 'comparison', 'Familien- oder Partnerschaftsrollen können Erwartungen tragen. Sie ersetzen keine konkrete Vereinbarung oder Zustimmung.', ['werkstatt-sprachdruck', 'fundus-als-rolle']),
  edge('naehe-druck', 'normen', 'Welche Pflicht wird behauptet?', 'comparison', 'Der Vergleich fragt nach der Herkunft einer Erwartung: Gewohnheit, Sachvereinbarung oder moralische Forderung.', ['fundus-als-rolle', 'werkstatt-sprachdruck']),
  edge('abstand', 'reparatur', 'Kontaktgrenze bleibt bestehen', 'practice', 'Ein Entwurf kann der eigenen Klärung dienen. Eine Entschuldigung hebt ein ausdrücklich benanntes Kontakt-Nein nicht auf.', ['werkstatt-sprachdruck']),
  edge('abstand', 'pause', 'Eine konkrete Unterbrechung', 'comparison', 'Zeitpunkt und Bedingungen einer Pause ergeben sich aus tatsächlichen Zusagen; der eigene Wunsch ergänzt keine Zustimmung.', ['werkstatt-sprachdruck']),
  edge('abstand', 'rueckzug', 'Grenze und vermutete Erklärung trennen', 'comparison', 'Ein ausdrücklich gewünschter Abstand ist eine Information. Die Erklärung des Rückzugs bleibt eine andere Frage.', ['werkstatt-unterscheidungen', 'fundus-zeitgeschichte']),
  edge('eigene-grenze', 'validierung', 'Anerkennen und Nein sagen', 'practice', 'Die Erfahrung einer anderen Person kann anerkannt werden, während die eigene Verfügbarkeit begrenzt bleibt.', ['werkstatt-unterscheidungen']),
  edge('eigene-grenze', 'unterstuetzungskosten', 'Was ist dauerhaft tragbar?', 'comparison', 'Bei einer Zusage zählen auch Vorbereitung, Erholung und Arbeit der unterstützenden Person.', ['fundus-kosten']),
  edge('gemeinsam-regulieren', 'eigene-grenze', 'Freiwillige Unterstützung', 'practice', 'Ein Angebot bleibt Unterstützung, wenn es abgelehnt und seine Form gemeinsam begrenzt werden kann.', ['werkstatt-unterscheidungen']),
  edge('gemeinsam-regulieren', 'unterstuetzungskosten', 'Wirkung und Aufwand getrennt prüfen', 'comparison', 'Gemeinsame Hilfe wird nicht allein an sichtbarer Ruhe beurteilt. Ihre Bedingungen und Kosten gehören zur Rückschau.', ['fundus-kosten', 'notebooklm-vorarbeit']),
  edge('gefuehlswelle', 'pause', 'Zwischen Impuls und Handlung', 'practice', 'Eine gewählte Unterbrechung kann Raum für die Entscheidung über eine nächste Handlung anbieten.', ['werkstatt-unterscheidungen', 'traumaatlas-verfahren'], 'Reflexionsangebot, kein Wirkversprechen und kein Ersatz für einen persönlich passenden Krisen- oder Behandlungsplan.'),
  edge('gefuehlswelle', 'beobachtung-deutung', 'Gefühl und Bedeutung nebeneinander', 'practice', 'Ein Gefühl ist berichtetes Erleben; die Erklärung der auslösenden Situation bleibt zusätzlich prüfbar.', ['werkstatt-unterscheidungen']),
  edge('wut', 'verantwortung', 'Gefühl und Verhalten unterscheiden', 'practice', 'Ärger kann ernst genommen werden, während eine verletzende oder einschüchternde Handlung konkret verantwortet wird.', ['werkstatt-sprachdruck', 'werkstatt-unterscheidungen']),
  edge('wut', 'pause', 'Einschüchternde Handlung unterbrechen', 'practice', 'Eine Unterbrechung richtet sich auf konkretes Verhalten. Bei Bedrohung braucht Schutz eine eigenständige Entscheidung.', ['werkstatt-sprachdruck']),
  edge('leere', 'unterstuetzungskosten', 'Ruhig aussehen ist nicht entlastet sein', 'comparison', 'Eine ruhige Außenwirkung sagt noch nicht, wie viel Kraft, Verbindung oder Orientierung eine Person erlebt.', ['neuroatlas-erleben', 'fundus-kosten']),
  edge('rueckzug', 'entfremdung', 'Ähnlicher Eindruck, verschiedene Fragen', 'comparison', 'Wenig sprechen, weggehen und ein fremdes Selbsterleben können nebeneinander beschrieben werden, ohne sie gleichzusetzen.', ['fundus-zeitgeschichte', 'neuroatlas-erleben']),
  edge('rueckzug', 'andere-innenwelt', 'Keine Absicht aus Schweigen ableiten', 'practice', 'Ohne eigene Auskunft bleibt die Erklärung eines Rückzugs offen. Eine ausdrücklich gesetzte Grenze gilt dennoch.', ['werkstatt-unterscheidungen']),
  edge('entfremdung', 'ueberlappung', 'Verlauf statt Etikett vergleichen', 'comparison', 'Beginn, Dauer und eigenes Erleben öffnen genauere Fragen als die äußere Ähnlichkeit.', ['fundus-zeitgeschichte', 'neuroatlas-erleben']),
  edge('kritik', 'scham-schuld', 'Von einer Episode zum ganzen Selbst', 'comparison', 'Der Vergleich fragt, ob aus einer konkreten Rückmeldung ein umfassendes negatives Selbsturteil entsteht.', ['werkstatt-sprachdruck', 'neuroatlas-erleben']),
  edge('kritik', 'wirkung-absicht', 'Rückmeldung und Verletzung gesondert hören', 'practice', 'Eine Sachfrage kann geklärt und eine verletzende Wirkung zugleich anerkannt werden.', ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck']),
  edge('kritik', 'beobachtung-deutung', 'Den zusätzlichen Satz erkennen', 'practice', 'Was gesagt wurde und welches Urteil über sich selbst jemand daraus hört, bleiben gesondert sichtbar.', ['werkstatt-unterscheidungen']),
  edge('scham-schuld', 'verantwortung', 'Konkreter Anteil statt Totalurteil', 'practice', 'Eine veränderbare Handlung ist genauer als das Urteil, als ganzer Mensch falsch oder an allem schuld zu sein.', ['werkstatt-unterscheidungen']),
  edge('selbstbild', 'mensch-rolle', 'Mehrere Perspektiven auf dieselbe Person', 'comparison', 'Selbstbewertung, Fremdzuschreibung und situative Rolle dürfen nebeneinander stehen, ohne einen Menschen darauf zu reduzieren.', ['fundus-als-rolle', 'ralf-monde-rollen']),
  edge('selbstbild', 'antwort-aus', 'Eine offene Vergleichsfrage', 'comparison', 'Die erfundene Situation lädt dazu ein, Selbstbewertung in unterschiedlichen Beziehungssituationen zu vergleichen.', ['neuroatlas-erleben', 'werkstatt-unterscheidungen']),
  edge('mensch-rolle', 'normen', 'Rollen tragen Erwartungen', 'comparison', 'Die Betrachtung fragt, welche Erwartung eine Rolle auslöst und welche Folgen eine Abweichung hat.', ['fundus-als-rolle']),
  edge('mensch-rolle', 'passung-macht', 'Wer darf wen definieren?', 'comparison', 'Eine Zuschreibung und die Macht, Folgen daran zu knüpfen, sind verschiedene und gemeinsam relevante Ebenen.', ['fundus-als-rolle', 'fundus-passung-macht']),
  edge('beobachtung-deutung', 'andere-innenwelt', 'Wissen und Vermutung kennzeichnen', 'practice', 'Eine beobachtete Handlung erlaubt mehrere Deutungen; vermutete Gedanken sollen als Vermutung erkennbar bleiben.', ['werkstatt-unterscheidungen']),
  edge('andere-innenwelt', 'wirkung-absicht', 'Fremde Absicht bleibt fremde Auskunft', 'comparison', 'Die bekannte Wirkung ist kein unmittelbarer Beweis einer Absicht; eine erklärte Absicht beseitigt die Wirkung nicht.', ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck']),
  edge('wirkung-absicht', 'validierung', 'Erfahrung ernst nehmen', 'practice', 'Eine Wirkung kann anerkannt werden, ohne jede Interpretation zu bestätigen oder eine bestimmte Gegenreaktion zu erwarten.', ['werkstatt-unterscheidungen']),
  edge('validierung', 'verantwortung', 'Anerkennung bekommt eine Handlung', 'practice', 'Wenn ein eigener Beitrag bekannt ist, kann er konkret benannt und verändert werden.', ['werkstatt-unterscheidungen', 'traumaatlas-verfahren']),
  edge('verantwortung', 'reparatur', 'Verändern ohne Gegenleistung', 'practice', 'Die eigene Veränderung darf nicht davon abhängig gemacht werden, dass eine andere Person sofort antwortet oder versöhnt ist.', ['werkstatt-unterscheidungen', 'werkstatt-sprachdruck']),
  edge('passung-macht', 'normen', 'Verständigung und Entscheidungsrecht', 'comparison', 'Nicht jede Schwierigkeit ist durch bessere Übersetzung lösbar. Wer Regeln setzt und Nachteile trägt, bleibt eine zusätzliche Frage.', ['fundus-passung-macht', 'fundus-als-rolle']),
  edge('pause', 'gemeinsam-regulieren', 'Später gemeinsam prüfen', 'practice', 'Wenn beide wieder Kontakt möchten, kann besprochen werden, welche Unterstützung in einer angespannten Situation willkommen ist.', ['werkstatt-unterscheidungen']),
  edge('entwicklung', 'ueberlappung', 'Geschichten nicht vereinheitlichen', 'comparison', 'Beziehungsgeschichte, Entwicklungsprofil und heutige Belastung werden gemeinsam betrachtet, ohne einander vollständig zu erklären.', ['fundus-zeitgeschichte', 'werkstatt-unterscheidungen']),
  edge('entwicklung', 'verantwortung', 'Entstehung und aktuelle Handlung trennen', 'comparison', 'Offene Fragen zur Entwicklung verhindern nicht, dass eine heutige verletzende Handlung konkret benannt wird.', ['werkstatt-unterscheidungen']),
  edge('ueberlappung', 'behandlung', 'Beobachtungen in die fachliche Klärung mitnehmen', 'practice', 'Eigene Beschreibungen zu Beginn, Verlauf und Beeinträchtigung können das Gespräch vorbereiten; sie ersetzen keine Diagnostik.', ['neuroatlas-erleben', 'werkstatt-unterscheidungen']),
  edge('unterstuetzungskosten', 'behandlung', 'Alltagsfolgen als gemeinsame Frage', 'practice', 'Die Planung kann neben Beschwerden auch Autonomie, Belastung und die Tragbarkeit konkreter Unterstützung besprechen.', ['fundus-kosten', 'werkstatt-unterscheidungen']),
  edge('behandlung', 'verantwortung', 'Ziele als konkrete Veränderungen', 'practice', 'Eine persönliche Zielvereinbarung kann benennen, welches Verhalten und welcher Alltag sich verändern sollen.', ['traumaatlas-verfahren', 'werkstatt-unterscheidungen']),
  edge('behandlung', 'gemeinsam-regulieren', 'Beziehungshilfe hat einen eigenen Rahmen', 'comparison', 'Freiwillige Unterstützung im Alltag und strukturierte Behandlung können nebeneinander stehen. Freundschaft wird damit nicht zum Therapieauftrag.', ['werkstatt-unterscheidungen', 'traumaatlas-verfahren'])
];
