// Fiktive Lernbeispiele. Interne Schlüssel und Originalpfade sind Provenienz,
// keine Namen oder Diagnosen von Menschen und keine Daten aus privaten Gesprächen.
export const scenarios = [
  {
    id: 'nachricht',
    title: 'Eine Nachricht bleibt unbeantwortet',
    scene: 'Fiktives Beispiel: Mira schreibt Alex am Nachmittag eine Frage zum gemeinsamen Abend. Vier Stunden später ist keine Antwort da. Mira bemerkt einen engen Brustkorb, schaut häufig aufs Handy und denkt: „Ich bin unwichtig.“ Was Alex gerade tut, ist unbekannt.',
    views: {
      person: {
        title: 'Miras Erleben',
        text: 'In diesem Beispiel erlebt Mira Warten, körperliche Anspannung und Angst vor Zurückweisung. „Ich bin unwichtig“ ist ihre mögliche Bedeutung des Schweigens. Das Gefühl verdient Aufmerksamkeit; die Bedeutung bleibt prüfbar. Auch eine unklare Verabredung kann gegenwärtig belasten.',
        questions: ['Was bemerkt Mira im Körper, bevor sie eine Erklärung findet?', 'Braucht sie gerade Orientierung, Verlässlichkeit, Nähe oder etwas anderes?'],
      },
      other: {
        title: 'Alex’ mögliche Sicht',
        text: 'Alex’ Sicht liegt nicht vor. Vielleicht wurde die Nachricht noch nicht gelesen, vielleicht fehlt Zeit oder eine Antwort ist schwer. Auch ein anderer Kontaktwunsch wäre möglich. Diese Perspektive öffnet Fragen; sie liefert Alex’ Antwort nicht stellvertretend.',
        questions: ['Welche Auskunft könnte nur Alex selbst geben?', 'Welche Absprachen über Antworten gibt es tatsächlich?'],
      },
      observer: {
        title: 'Was sich beobachten lässt',
        text: 'Eine Frage wurde geschickt; nach vier Stunden fehlt eine Antwort. Mira schaut häufig aufs Handy. Daraus folgen weder Alex’ Absicht noch Miras Wert. Ob eine feste Absprache verletzt wurde, gehört als weitere beobachtbare Information dazu.',
        questions: ['Was wäre auf einem Gesprächsprotokoll sichtbar?', 'Was wurde ausdrücklich vereinbart und was nur erwartet?'],
      },
      alternatives: {
        title: 'Mehrere Erklärungen offenhalten',
        text: 'Mögliche Hypothesen: Alex ist beschäftigt; die Nachricht wurde übersehen; Alex braucht länger zum Entscheiden; die Erwartungen an Erreichbarkeit passen nicht zusammen; es gibt eine aktuelle Spannung. Frühere Erfahrungen könnten Miras Reaktion mitprägen. Keine dieser Möglichkeiten ist durch die Wartezeit bewiesen.',
        questions: ['Welche zweite Erklärung passt zu denselben Beobachtungen?', 'Welche Information würde eine Vermutung stützen oder schwächen?'],
      },
      unknown: {
        title: 'Was hier unbekannt bleibt',
        text: 'Wir wissen nicht, ob Alex die Nachricht gesehen hat, warum keine Antwort kommt oder wie sich frühere Erfahrungen auf Mira auswirken. Aus Brustenge lässt sich keine bestimmte Ursache oder verborgene Erinnerung ableiten. „Ich weiß es noch nicht“ darf stehen bleiben.',
        questions: ['Welche Lücke lässt sich später durch eine offene Frage klären?', 'Welche Lücke muss Mira gerade nicht schließen?'],
      },
      actions: {
        title: 'Mögliche nächste Schritte',
        text: 'Mira kann anerkennen: „Das Warten macht mich gerade unsicher“, das Handy eine selbst gewählte Zeit weglegen und den Abend zunächst für sich planen. Wenn Kontakt möglich ist, kann sie später konkret nach der Verabredung fragen. Eine gemeinsam besprochene Antwortregel ist hilfreicher als wiederholtes Nachfragen unter Druck.',
        questions: ['Welcher kleine Schritt gibt Mira jetzt Handlungsspielraum?', 'Wie könnte eine spätere Bitte klar und ohne Vorwurf klingen?'],
      },
    },
  },
  {
    id: 'absage',
    title: 'Ein gemeinsamer Plan wird abgesagt',
    scene: 'Fiktives Beispiel: Noor freut sich auf einen Kinoabend. Kurz vorher sagt Kim: „Ich bin erschöpft und schaffe es heute nicht.“ Noor ist traurig und wütend. Es ist die zweite kurzfristige Absage in diesem Monat; ob es einen neuen Termin gibt, ist offen.',
    views: {
      person: {
        title: 'Noors Erleben',
        text: 'Noor verliert etwas Erwartetes und hat Zeit freigehalten. Enttäuschung kann eine verständliche Antwort auf die aktuelle Absage sein. Möglicherweise berührt sie zusätzlich ältere Erfahrungen. Beides darf geprüft werden, ohne die heutige Unzuverlässigkeit kleinzureden oder eine Vorgeschichte vorauszusetzen.',
        questions: ['Was tut an dieser konkreten Absage weh?', 'Welche Erwartung oder praktische Folge möchte Noor benennen?'],
      },
      other: {
        title: 'Kims mitgeteilte Grenze',
        text: 'Kim nennt Erschöpfung und sagt für heute ab. Das ist die mitgeteilte Sicht. Wie Kim die Beziehung erlebt, ist damit nicht erklärt. Die eigene Belastungsgrenze darf gelten; zugleich lässt sich Verantwortung für die Folgen einer kurzfristigen Absage besprechen.',
        questions: ['Was hat Kim tatsächlich über den heutigen Abend gesagt?', 'Was könnte Kim freiwillig zu einem verlässlicheren Plan beitragen?'],
      },
      observer: {
        title: 'Ereignis und Muster unterscheiden',
        text: 'Es gibt eine Verabredung, eine kurzfristige Absage mit benanntem Grund und bereits eine frühere Absage. Ein wiederholtes Problem verdient Klärung. Zwei Absagen verraten jedoch weder einen festen Charakter noch eine Diagnose oder den gesamten Zustand der Beziehung.',
        questions: ['Welche Häufigkeit und Folgen sind konkret bekannt?', 'Welche gelungenen Absprachen gehören ebenfalls ins Bild?'],
      },
      alternatives: {
        title: 'Mögliche Zusammenhänge',
        text: 'Vielleicht ist Kims Belastung schwer planbar; vielleicht werden Zusagen zu schnell gegeben; vielleicht unterscheiden sich die Erwartungen an Verbindlichkeit; vielleicht besteht eine unausgesprochene Spannung. Noors Enttäuschung kann sowohl eine heutige Grenze anzeigen als auch durch frühere Enttäuschungen verstärkt sein.',
        questions: ['Welche Erklärung berücksichtigt beide Personen, ohne für sie zu sprechen?', 'Welche konkrete Veränderung wäre unabhängig von der Ursache hilfreich?'],
      },
      unknown: {
        title: 'Die offene Stelle',
        text: 'Wir können Kims Erschöpfung nicht von außen messen und kennen Noors Lebensgeschichte nicht. Ob ein Beziehungsmuster vorliegt, braucht mehr Zusammenhang und beide Sichtweisen. Auch ohne sichere Erklärung dürfen die Absage und ihre Folgen ernst genommen werden.',
        questions: ['Was braucht noch eine tatsächliche Auskunft?', 'Welche eigene Grenze kann Noor schon ohne diese Auskunft formulieren?'],
      },
      actions: {
        title: 'Enttäuschung und Grenze zugleich ausdrücken',
        text: 'Eine Möglichkeit lautet: „Ich höre, dass du heute Ruhe brauchst. Ich bin enttäuscht und brauche bei unseren Plänen mehr Verlässlichkeit.“ Noor kann den eigenen Abend anders gestalten. Später können beide frühere Rückmeldung, kleinere Verabredungen oder einen freiwilligen neuen Termin besprechen; eine Zusage wird nicht eingefordert.',
        questions: ['Welche Formulierung erkennt Kims Grenze und Noors Erfahrung an?', 'Was möchte Noor künftig zusagen und unter welchen Bedingungen?'],
      },
    },
  },
  {
    id: 'hilfe',
    title: 'Hilfe wird als Verpflichtung erlebt',
    scene: 'Fiktives Beispiel: Lena bietet Tom an, einen Behördentermin für ihn zu organisieren. Tom lehnt ab. Lena sagt: „Nach allem, was ich für dich tue, könntest du wenigstens meine Hilfe annehmen.“ Tom fühlt Druck, wird still und möchte gehen.',
    views: {
      person: {
        title: 'Toms Erleben',
        text: 'Tom erlebt ein Nein, dem eine Forderung folgt. Stillwerden kann vieles bedeuten; im Beispiel berichtet er selbst Druck und den Wunsch zu gehen. Sein Bedürfnis nach Selbstbestimmung darf gelten. Er muss keine Vergangenheit offenlegen, um Unterstützung abzulehnen.',
        questions: ['Welche konkrete Formulierung erzeugt hier Druck?', 'Welche Entscheidung möchte Tom selbst behalten?'],
      },
      other: {
        title: 'Lenas mögliche Sicht',
        text: 'Vielleicht wollte Lena entlasten, wünscht Anerkennung oder ist selbst überfordert. Das sind Möglichkeiten, keine festgestellten Motive. Unabhängig davon macht der gesprochene Satz frühere Hilfe zur Gegenleistung und erschwert ein freies Nein. Lena kann Verantwortung für diese Formulierung übernehmen.',
        questions: ['Was könnte Lena über ihr eigenes Bedürfnis sagen, ohne Tom zu verpflichten?', 'Wie ließe sich ihr Hilfsangebot wirklich ablehnbar machen?'],
      },
      observer: {
        title: 'Wunsch, Angebot und Forderung',
        text: 'Zunächst wird Hilfe angeboten, dann abgelehnt. Danach wird vergangene Unterstützung als Grund genannt, die heutige Entscheidung zu ändern. Das ist eine erkennbare Druckformulierung. Diese Beobachtung beschreibt eine Handlung und macht aus Lena keinen festgelegten Menschentyp.',
        questions: ['An welcher Stelle verändert sich das Angebot zur Forderung?', 'Bleibt Tom ausdrücklich die Freiheit, Nein zu sagen?'],
      },
      alternatives: {
        title: 'Wirkung prüfen, Motive offenlassen',
        text: 'Mögliche Hintergründe sind Sorge, ein unklarer Wunsch nach Anerkennung, Gewohnheiten in der Familie oder der Wunsch, Einfluss zu behalten. Vielleicht fehlen konkrete Absprachen über frühere Hilfe. Solche Hypothesen entschuldigen den Druck nicht und beweisen keine bestimmte Familiengeschichte.',
        questions: ['Welche Erklärung bleibt eine Vermutung über Lena?', 'Was lässt sich an der heutigen Formulierung unabhängig davon ändern?'],
      },
      unknown: {
        title: 'Was nicht aus der Szene folgt',
        text: 'Wir kennen frühere Vereinbarungen und die übrige Beziehung nicht. Toms Stillwerden beweist weder Zustimmung noch eine bestimmte Schutzreaktion. Aus dem Satz lassen sich keine Diagnose und keine sichere Absicht ableiten. Eine bestehende konkrete Verpflichtung müsste gesondert geklärt werden.',
        questions: ['Welche Vereinbarung müsste tatsächlich nachgesehen oder besprochen werden?', 'Was sollte eine beobachtende Person Tom selbst fragen, statt sein Schweigen zu deuten?'],
      },
      actions: {
        title: 'Ein Nein ermöglichen und Verantwortung benennen',
        text: 'Tom könnte sagen: „Ich möchte den Termin selbst organisieren. Bitte lass mein Nein gelten.“ Er darf das Gespräch unterbrechen. Lena könnte antworten: „Mein Satz hat dich unter Druck gesetzt. Du entscheidest selbst. Wenn ich Anerkennung brauche, muss ich das getrennt ansprechen.“ Unterstützung kann erneut angeboten werden, wenn sie freiwillig bleibt.',
        questions: ['Welcher Satz schützt Toms Entscheidung ohne eine Rechtfertigungsschleife?', 'Welche sichtbare Veränderung würde Lenas Verantwortung erkennbar machen?'],
      },
    },
  },
  {
    id: 'grenze',
    title: 'Eine Kontaktpause wird benannt',
    scene: 'Fiktives Beispiel: Nach einem anstrengenden Gespräch schreibt Sam: „Bitte schreib mir bis Sonntag nicht. Ich brauche eine Pause.“ Ela hat Angst, die Verbindung zu verlieren, und sendet am selben Abend zwei weitere Nachrichten. Eine Antwort erhält sie nicht.',
    views: {
      person: {
        title: 'Elas Kontaktwunsch',
        text: 'Ela berichtet Angst und den Wunsch, das Gespräch sofort zu klären. Dieses Erleben kann anerkannt werden. Es gibt ihr jedoch keinen Anspruch auf Sams Erreichbarkeit. Ihr Einfluss liegt jetzt darin, mit dem eigenen Impuls umzugehen und andere Unterstützung zu suchen.',
        questions: ['Was braucht Ela, ohne dass Sam es jetzt leisten muss?', 'Woran merkt sie den Moment zwischen Kontaktimpuls und Handlung?'],
      },
      other: {
        title: 'Sams ausgesprochene Grenze',
        text: 'Sam hat eine konkrete Pause benannt. Wir wissen nicht, was Sam darüber hinaus fühlt oder beabsichtigt. Um die Grenze zu respektieren, ist dieses Wissen nicht erforderlich. Auch eine liebevolle Erklärung oder Entschuldigung wäre während der Pause eine weitere Nachricht.',
        questions: ['Welche Bitte steht ausdrücklich im Wortlaut?', 'Welche Fragen können bis zu einem beidseitig möglichen Gespräch warten?'],
      },
      observer: {
        title: 'Gefühl und Handlung getrennt sehen',
        text: 'Die Bitte betrifft einen Zeitraum ohne Nachrichten. Danach wurden dennoch zwei Nachrichten gesendet. Sie überschreiten die benannte Kontaktgrenze. Elas Angst erklärt einen möglichen Handlungsdruck; sie hebt Sams Nein nicht auf. Über Sams Schweigen wissen wir darüber hinaus nichts.',
        questions: ['Welche Handlung lässt sich konkret verändern?', 'Wie bleibt Mitgefühl für Ela mit Sams Selbstbestimmung vereinbar?'],
      },
      alternatives: {
        title: 'Was eine Pause bedeuten könnte',
        text: 'Eine Pause könnte Erholung, Schutz vor weiterer Verletzung oder Zeit zum Nachdenken ermöglichen. Sie könnte auch auf grundsätzliche Schwierigkeiten hinweisen. Welche Bedeutung sie für Sam hat, bleibt offen. Ela muss diese Alternativen nicht sofort entscheiden, um die Pause einzuhalten.',
        questions: ['Welche Geschichte erzählt Ela sich gerade über das Schweigen?', 'Welche anderen Möglichkeiten bleiben bestehen, ohne eine weitere Nachricht zu senden?'],
      },
      unknown: {
        title: 'Keine Zusage über den Ausgang',
        text: 'Die Pause garantiert weder eine spätere Versöhnung noch einen Kontaktabbruch. Wir kennen den weiteren Verlauf nicht. Auch der genannte Sonntag ist keine automatische Einladung zu unbegrenztem Kontakt. Maßgeblich bleiben die tatsächlichen Absprachen und die Bereitschaft beider Personen.',
        questions: ['Welche Ungewissheit muss vorerst ausgehalten werden?', 'Welche spätere Kontaktbedingung ist vereinbart und welche noch offen?'],
      },
      actions: {
        title: 'Die Pause einhalten',
        text: 'Ela kann jetzt keine weitere Nachricht senden, einen Entwurf nur für sich speichern und den Kontaktimpuls mit einer vertrauten Person besprechen. Benachrichtigungen lassen sich vorübergehend stummschalten. Ein späteres Gespräch kann den eigenen Grenzübertritt anerkennen, sofern Kontakt wieder beidseitig möglich ist. Sam muss die Pause nicht zur Beruhigung Elas unterbrechen.',
        questions: ['Welche erreichbare Unterstützung kann Ela heute unabhängig von Sam nutzen?', 'Wie kann sie Verantwortung übernehmen, ohne während der Pause erneut Kontakt aufzunehmen?'],
      },
    },
  },
];

// Originalpfade und der vollständige Dossier-Link nur nach bewusstem Öffnen
// der technischen Herkunftsdetails anzeigen. Kein privater Rohtext eingearbeitet.
export const atlasSources = [
  {
    name: 'Beziehungswerkstatt im Phänomenatlas',
    url: 'https://phaenomenautik-koharenz.x99t4dyxr9.chatgpt.site/beziehungswerkstatt.html',
    kind: 'Geprüfte Werkpassagen · redaktionelle Orientierung',
    incorporated: 'Passagen geprüft: Beobachtung und Deutung, Validierung, mehrere mögliche Innenwelten, eigener Anteil, aktuelle Grenzen und Kontextfragen (Zeilen 25–34 und 53–57). Diese Unterscheidungen fließen in die fiktiven Fälle ein.',
    limit: 'Fassung 0.1; regelbasierte Sprachhinweise und redaktionelle Übertragung von Fachquellen. Keine klinische Validierung, keine Gedankenleserei und keine Abnahme der neuen Beispiele durch die ursprüngliche Redaktion. Konkrete Autorenschaft hier nicht zusätzlich verifiziert.',
    path: 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.',
  },
  {
    name: 'Neuroatlas · Atlas des Erlebens',
    kind: 'Geprüfte Werkpassagen · Quellenkatalog',
    incorporated: 'Passagen geprüft: Erfahrungsdimensionen, offener Borderline-Kontext und ausdrückliche Phänomenverbindungen (Katalogzeilen 42–61 und 248–250). Sie unterstützen die Unterscheidung von Erleben, Erklärung und Diagnose.',
    limit: 'Redaktioneller Katalog vom 7. September 2026, ohne medizinische Fachabnahme. Eine Verbindung beschreibt eine Aussage der benannten Quelle; sie ist keine individuelle Diagnose, Ursache oder Wahrscheinlichkeit. Keine vollständige Werklektüre und kein erneuter Beleg aller klinischen Aussagen durch diese Übernahme.',
    path: 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.',
  },
  {
    name: 'Traumaatlas · vorhandene Lesekopie',
    kind: 'Geprüfte Werkpassagen · historischer Arbeitsbestand',
    incorporated: 'Passagen geprüft: vorhandene Anschlüsse an Schematherapie und DBT (Zeilen 141–158). Als Werkverbindung für Muster, Akzeptanz, Handlungsmöglichkeiten und Unterstützungswege berücksichtigt.',
    limit: 'Lokale Lesekopie einer vorhandenen Fassung. Therapie- und Wirksamkeitsaussagen benötigen aktuelle unabhängige Quellenprüfung. Vereinfachte Aussagen über das Nervensystem werden daraus nicht als Erklärung einer persönlichen Reaktion übernommen. Originalautorenschaft hier nicht abschließend geklärt.',
    path: 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.',
  },
  {
    name: 'Dein Phänomenatlas: Borderline, Neurodivergenz und Trauma · 20. Oktober 2026',
    kind: 'Wiedergefundenes Originaldossier · strukturierte Bestandslesung',
    incorporated: 'Das Original wurde am 2. November 2026 aus dem bestehenden Bibliotheksverweis heruntergeladen. 96 Phänomene in 13 Themenfeldern, 17 Forschungsbefunde und 91 Quellfassungen sind unter Erleben durchsuchbar und vollständig aufklappbar. Die Beziehungskarte führt von ihren Begriffen in diesen Bestand.',
    limit: 'Forschungsdossier aus vier Arbeitsaufträgen innerhalb derselben ChatGPT/Codex-Laufzeit; keine vier unabhängigen Anbieter. Historischer Stand vom 20. Oktober 2026. Die Erschließung ist keine erneute vollständige medizinische Validierung. Damalige offene Rechercheschritte bleiben von der später tatsächlich ausgeführten NotebookLM-Recherche unterscheidbar.',
    path: 'Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten.',
    url: 'https://chatgpt.com/library?file_id=libfile_61607c09980c81919d15f6033e47c0d8&account_id=personal',
  },
];

export const developmentNodes = [
  {
    id: 'sensitivitaet',
    title: 'Temperament und individuelle Empfindsamkeit',
    summary: 'Menschen unterscheiden sich darin, wie intensiv oder schnell sie Reize und Gefühle erleben. Solche Unterschiede können mit den Bedingungen einer Umgebung zusammenspielen. Empfindsamkeit ist kein persönlicher Fehler und legt keinen Entwicklungsweg fest.',
    example: 'Fiktives Beispiel: Jona ist nach einem lauten Familienfest erschöpft. In einem ruhigen Raum und mit einer vorher vereinbarten Pause kann Jona wieder teilnehmen. Das Beispiel zeigt eine veränderbare Passung, keine Diagnose.',
    question: 'Welche Bedingungen verändern das Erleben, und welche Unterstützung passt zu dieser Person?',
    limit: 'Ein heftiges Gefühl beweist weder ein angeborenes Temperament noch eine bestimmte Störung. Veranlagung, Lernen, Körperzustand und aktuelle Belastung lassen sich aus einer einzelnen Szene nicht auseinanderrechnen.',
  },
  {
    id: 'resonanz',
    title: 'Verfügbarkeit und Resonanz',
    summary: 'Gehört werden, Trost erhalten und nach Unterbrechungen wieder zueinanderfinden können Orientierung und Vertrauen unterstützen. Entscheidend ist der Zusammenhang über die Zeit. Niemand ist jederzeit verfügbar; wiederkehrend fehlende Antwort verdient dennoch Aufmerksamkeit.',
    example: 'Fiktives Beispiel: Nia zeigt Angst vor dem Schulweg. Eine Bezugsperson hat gerade keine Zeit, hört später aber zu, benennt die Angst und plant mit Nia einen nächsten Schritt. Die Rückkehr zur Begegnung wird erfahrbar.',
    question: 'Wird ein geäußertes Bedürfnis wahrgenommen, und gibt es nach verpassten Momenten eine verlässliche Rückkehr?',
    limit: 'Eine einzelne unaufmerksame Reaktion belegt keine Vernachlässigung. Auch verlässliche Fürsorge schützt nicht vor jeder Belastung. Aus einer heutigen Beziehungsschwierigkeit lässt sich die frühere Verfügbarkeit anderer nicht rückwärts beweisen.',
  },
  {
    id: 'kontrolle',
    title: 'Inkonsistenz, Kontrolle und Abwertung',
    summary: 'Wechselnde Regeln, bedingte Zuwendung, Kontrolle und wiederholte Abwertung können Beziehungen schwer vorhersehbar machen. Konkrete Handlungen und ihre Folgen dürfen benannt werden. Eine Erklärung möglicher Belastung nimmt der handelnden Person ihre Verantwortung nicht ab.',
    example: 'Fiktives Beispiel: Emil soll selbst entscheiden, wird anschließend aber für jede Wahl verspottet. „Du bist zu dumm dafür“ ist eine Abwertung. Emil darf Unterstützung erhalten, ohne erst die Motive der erwachsenen Person erklären zu müssen.',
    question: 'Welche konkrete Regel oder Äußerung erzeugt Unsicherheit, und welche verlässliche Alternative wäre möglich?',
    limit: 'Das Beispiel beschreibt belastende Handlungen, keine Diagnose der Bezugsperson. Einzelfälle, wiederkehrende Muster, Machtverhältnisse und Auswirkungen müssen unterschieden werden; sie beweisen keine individuelle Ursache einer späteren Diagnose.',
  },
  {
    id: 'verletzung',
    title: 'Vernachlässigung, Gewalt und andere Belastungen',
    summary: 'Fehlende notwendige Versorgung, Drohungen, körperliche oder sexualisierte Gewalt sind konkrete Verletzungen von Schutz und Selbstbestimmung. Sie dürfen deutlich benannt werden. Schutz, Unterstützung und das Ende aktueller Gewalt haben Vorrang vor einer Erklärung ihrer langfristigen Bedeutung.',
    example: 'Fiktives Beispiel: Ein Kind wird geschlagen und anschließend für das Schlagen verantwortlich gemacht. Die Verantwortung für die Gewalt liegt bei der erwachsenen Person. Das Kind braucht Schutz und Unterstützung; es muss die Situation nicht durch angepasstes Verhalten lösen.',
    question: 'Was geschieht tatsächlich, wer trägt Verantwortung, und welche Unterstützung erhöht jetzt Sicherheit?',
    limit: 'Belastungserfahrungen erhöhen nicht bei allen Menschen dieselben Risiken und legen keine Diagnose fest. Körperreaktionen beweisen keine konkrete frühere Gewalterfahrung oder verborgene Erinnerung. Das Beispiel ist erfunden und keine Aussage über RAKis Familie.',
  },
  {
    id: 'rollen',
    title: 'Familiäre Rollen und wiederkehrende Muster',
    summary: 'Menschen können Aufgaben und Erwartungen übernehmen, die in einer Familie wiederkehren: vermitteln, beruhigen, funktionieren oder Konflikte tragen. Eine Rolle beschreibt eine Beziehungskonstellation. Sie ist keine unveränderliche Eigenschaft und muss nicht die ganze Person erfassen.',
    example: 'Fiktives Beispiel: Die zwölfjährige Lio soll nach jedem Streit die Erwachsenen versöhnen. Lio fühlt sich für deren Stimmung verantwortlich. Erwachsene können diese Aufgabe zurücknehmen und eine andere Unterstützung für ihre Konflikte suchen.',
    question: 'Welche Verantwortung gehört wirklich zu dieser Person, und welche Aufgabe muss bei den Erwachsenen bleiben?',
    limit: 'Mithelfen und Mitgefühl sind nicht automatisch Überforderung. Alter, Freiwilligkeit, Umfang und Folgen zählen. Ein heutiger Fürsorgeimpuls belegt keine bestimmte frühere Familienrolle; mehrere Beschreibungen dürfen nebeneinander offenbleiben.',
  },
  {
    id: 'schutz',
    title: 'Schützende Beziehungen und Veränderung',
    summary: 'Verlässliche Beziehungen, ernst genommene Grenzen, praktische Entlastung und passende professionelle Unterstützung können neue Handlungsmöglichkeiten eröffnen. Veränderung kann auch bedeuten, schädigenden Kontakt zu begrenzen. Entwicklung verläuft individuell und muss nicht geradlinig sein.',
    example: 'Fiktives Beispiel: Nach wiederholten Abwertungen findet Ada bei einer Beratungsstelle und einer verlässlichen Freundin Unterstützung. Ada übt, eigene Grenzen auszusprechen, und entscheidet selbst, welche Kontakte möglich bleiben. Rückschritte nehmen diesen Schritten ihren Wert nicht.',
    question: 'Welche Person, Bedingung oder kleine Veränderung erweitert heute den eigenen Handlungsspielraum?',
    limit: 'Eine unterstützende Beziehung garantiert keine bestimmte Wirkung. Versöhnung, Familienkontakt oder eine einzelne Methode sind keine Pflicht. Welche Hilfe passt, muss mit der betroffenen Person geklärt werden; die Beispiele sind keine individuelle Behandlungsempfehlung.',
  },
];
