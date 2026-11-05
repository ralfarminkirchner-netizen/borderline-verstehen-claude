// Erzeugt von baue-daten.mjs am 2026-11-05T01:26:51.375Z – nicht von Hand ändern.
// Quelle: Lesebestand ../../data-readonly/karte.json und ../../data-readonly/texte.json (nur lesend).
window.SCHLOSS_DATEN = {
 "format": "schloss-schluessel-probe",
 "version": 5,
 "herkunft": {
  "erzeugt": "2026-11-05T01:26:51.375Z",
  "skript": "baue-daten.mjs",
  "lesebestand": "Borderline verstehen · Fugenland-Lesebestand (nur lesend)",
  "karte": {
   "datei": "../../data-readonly/karte.json",
   "sha256": "1a05edb15efa1dd3dae84b02e0ae3768e05d1511106da170b7228ef880e2f8bc",
   "format": "fugenland-karte",
   "version": 1
  },
  "texte": {
   "datei": "../../data-readonly/texte.json",
   "sha256": "3d83be5220168d7d884d4b0c7d345cd8903c96525d6edd2662cc6790928d7771",
   "format": "fugenland-texte",
   "version": 1
  },
  "fugenraeume": {
   "datei": "../../data-readonly/fugenraeume.json",
   "sha256": "71f68f437d51b1b225dbc532a23c12ef065dc34590a4a6b68a211bbcc6f357ef",
   "format": "fugenraeume",
   "version": 1,
   "hinweis": "Redaktionelle Raumbildung dieser Fassung über unveränderten Originalkanten. Keine fachliche Prüfung, keine Diagnose, kein Wirknachweis."
  },
  "hinweis": "Nur gebrauchte Orte und Fugen. Titel, Kurztexte und Fugenfelder unverändert übernommen. Quellentitel für die Anzeige ohne Abrufvermerke (etwa „NLM-Ask“, „cited_text“ mit Datum); der vollständige Bestandstitel steht unter technisch.titelBestand. Aus Ortstexten nur entfernt: technische Verweise (Pfeil + Kennung), Code-Namen, Fettdruck-Zeichen, PMID/DOI-Angaben und Registernummern (etwa „AWMF 028-045“ → „AWMF-Leitlinie“; vollständig im Bestand und bei Quellen unter technisch). Blickrichtungen ohne Redaktionsnotizen. Lesarten aus Sätzen sind Lesarten dieser Probe und stammen nur aus Sätzen, in denen einer der beiden Orte den anderen nennt.",
  "leseregeln": [
   {
    "art": "spannung",
    "muster": "/Gegenteil|Gegenpol/"
   },
   {
    "art": "annaeherung",
    "muster": "/Nähe, nicht Identität|benannte Nähe|\\bNähe\\b(?! offen)/"
   },
   {
    "art": "zusammenhang",
    "muster": "/[Kk]önnte zusammenhängen/"
   },
   {
    "art": "abstand",
    "muster": "/nicht notwendig|nicht dasselbe|nicht identisch|unterschieden|keine Identität/"
   },
   {
    "art": "offen",
    "muster": "/^Ob .*trennbar/"
   }
  ]
 },
 "schloss": 1012,
 "orte": {
  "152": {
   "titel": "Erblichkeit in Populationen",
   "gebiet": "Phänomenatlas",
   "ortsart": "Begriff",
   "kurz": "Erblichkeit beschreibt Unterschiede einer Population unter bestimmten Bedingungen und ist keine Prozentangabe für eine Person.",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Erblichkeit beschreibt genetisch zuordenbare Varianz unter bestimmten Populations- und Umweltbedingungen.: Sie zerlegt keine einzelne Person in genetische und umweltbedingte Anteile und misst keine Änderbarkeit. Definition für untersuchte Populationen Begriffsrahmen; kein individuelles Zeitfenster Longitudinale Zwillingsanalysen finden genetische Mitwirkung sowohl an stabilen als auch an altersbezogen veränderten ADHS-Merkmalen.: Hohe Erblichkeit liefert keine individuelle Prognose und schließt veränderbare Bedingungen nicht aus. 1.480 Zwillingspaare Mehrere Entwicklungszeitpunkte im Kindes- und Jugendalter"
    }
   ],
   "quellen": [
    {
     "titel": "Visscher, Hill & Wray: Heritability in the genomics era — concepts and misconceptions",
     "kurz": "Visscher, Hill & Wray: Heritability in the genomics era — concepts and misconceptions",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:grundlagen-01",
      "url": "https://doi.org/10.1038/nrg2322",
      "titelBestand": "Visscher, Hill & Wray: Heritability in the genomics era — concepts and misconceptions"
     }
    },
    {
     "titel": "Developmental Twin Study of Attention Problems: High Heritabilities Throughout Development",
     "kurz": "Developmental Twin Study of Attention Problems: High Heritabilities Throughout Development",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:adhs-twin-development-2013",
      "url": "https://jamanetwork.com/journals/jamapsychiatry/fullarticle/1555120",
      "titelBestand": "Developmental Twin Study of Attention Problems: High Heritabilities Throughout Development"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Erblichkeit beschreibt Unterschiede einer Population unter bestimmten Bedingungen und ist keine Prozentangabe für eine Person."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "unter bestimmten Bedingungen",
     "satz": "Erblichkeit beschreibt Unterschiede einer Population unter bestimmten Bedingungen und ist keine Prozentangabe für eine Person. ### Erblichkeit beschreibt genetisch zuordenbare Varianz unter bestimmten Populations- und Umweltbedingungen.",
     "abschnitt": "Eintrag"
    },
    {
     "klausel": "unter bestimmten Populations- und Umweltbedingungen",
     "satz": "Erblichkeit beschreibt Unterschiede einer Population unter bestimmten Bedingungen und ist keine Prozentangabe für eine Person. ### Erblichkeit beschreibt genetisch zuordenbare Varianz unter bestimmten Populations- und Umweltbedingungen.",
     "abschnitt": "Eintrag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Neurodiversität: Gene, Umwelt und Entwicklung",
   "technisch": {
    "ortIndex": 152,
    "textKennung": "fundus:heritabilitaet",
    "herkunftPfad": "atlas-source/wissensfundus/neurodiversitaet-genetik-umwelt-20261027"
   },
   "feld": {
    "x": 4.851,
    "y": 2.416
   }
  },
  "160": {
   "titel": "Gen-Umwelt-Korrelation",
   "gebiet": "Phänomenatlas",
   "ortsart": "Begriff",
   "kurz": "Genetisch mitgeprägte Eigenschaften können mit erlebten, ausgelösten oder ausgewählten Umwelten zusammenhängen.",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Kindliche ADHS-bezogene genetische Profile, Symptome und beobachtetes Erziehungsverhalten hängen statistisch zusammen; dies ist mit evokativer Gen-Umwelt-Korrelation vereinbar.: Die statistische Vermittlung beweist keine einzelne Richtung und weist Kindern keine Verantwortung für elterliches Verhalten zu. 803 Kinder und ihre Familien Genetisches Profil und späteres Verhalten; 2023 Trioanalysen unterscheiden direkte Vererbung von möglichen indirekten Elterneffekten; für elterliche ADHS-Polygenscores wurde kein allgemeiner indirekter Effekt nachgewiesen.: Unvollständige Polygenscores und Stichprobenauswahl begrenzen Nullbefunde; indirekte genetische Effekte sind nicht direkt gemessene Erziehung. Klinische ADHS-Trios und 14.959 Mutter-Vater-Kind-Trios Elterngenotypen und kindliche Merkmale, unter anderem mit acht Jahren Neue Trioverfahren können direkte und bestimmte indirekte genetische Beiträge trennen; ihre jeweilige Identifizierbarkeit ist ausdrücklich zu prüfen.: Die maternale GxE-Anwendung der PGSTRI-Arbeit betrifft orofaziale Spalten, nicht Autismus; sie darf nicht als bestätigte Autismus-GxE dargestellt werden. Methodensimulationen, Autismus-Trios und getrennte Spalten-Trios Methodenentwicklung und Anwendungen; 2026 Transaktionale und ökologische Modelle betrachten Kinder, Bezugspersonen, Institutionen und Zeit gemeinsam; Gen-Umwelt-Korrelation ergänzt eine mögliche statistische Ebene.: Die Rahmen benennen weder eine individuelle Schuld noch eine einheitliche biologische Kausalkette. Allgemeine Entwicklungs- und Kontextmodelle Wiederholte Person-Kontext-Interaktion über Zeit Nischenkonstruktion modelliert, wie Organismen ihre Umwelten mitgestalten und so Selektionsbedingungen verändern können.: Evolutionäres Populationsmodell ist kein Beweis für individuelle Nischenwahl, konkrete ADHS-Ursachen oder eine therapeutische Lebensform. Zwei-Locus-Modell der Nischenkonstruktion Populationsentwicklung über Generationen Welche Reaktion folgt auf welches Verhalten, und welche Unterstützung verändert die konkrete Wechselwirkung? Bezug zur Forschung: Die untersuchte Verbindung von polygenem ADHS-Risiko, kindlichen Symptomen und Erziehungsdimensionen ist mit einer Reaktion des Umfelds auf kindliche Eigenschaften vereinbar.: Dieser Anschluss eröffnet einen Vergleich; er validiert keine Behandlung und keine Entstehungsursache des vorhandenen Begriffs. Statistische Vermittlung beweist keine eindeutige Wirkungsrichtung. Sie begründet weder Schuldzuweisung an Kinder noch die Behauptung, ungünstige Interaktionen seien unveränderbar. Forschungsbezug auf den genannten Befund; vorhandener Begriff aus dem Atlas Konzeptioneller Anschluss nach Befundstand vom 27. Oktober 2026"
    }
   ],
   "quellen": [
    {
     "titel": "Youth Polygenic Scores, Youth ADHD Symptoms, and Parenting Dimensions: An Evocative Gene-Environment Correlation Study",
     "kurz": "Youth Polygenic Scores, Youth ADHD Symptoms, and Parenting Dimensions: An Evocative Gene-Environment Correlation Study",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:adhs-evocative-rge-2023",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10560546/",
      "titelBestand": "Youth Polygenic Scores, Youth ADHD Symptoms, and Parenting Dimensions: An Evocative Gene-Environment Correlation Study"
     }
    },
    {
     "titel": "Joint polygenic and environmental risks for childhood attention-deficit/hyperactivity disorder (ADHD) and ADHD symptom dimensions",
     "kurz": "Joint polygenic and environmental risks for childhood attention-deficit/hyperactivity disorder (ADHD) and ADHD symptom dimensions",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:graph-mooney-2023",
      "url": "https://doi.org/10.1002/jcv2.12152",
      "titelBestand": "Joint polygenic and environmental risks for childhood attention-deficit/hyperactivity disorder (ADHD) and ADHD symptom dimensions"
     }
    },
    {
     "titel": "Investigating Direct and Indirect Genetic Effects in Attention-Deficit/Hyperactivity Disorder Using Parent-Offspring Trios",
     "kurz": "Investigating Direct and Indirect Genetic Effects in Attention-Deficit/Hyperactivity Disorder Using Parent-Offspring Trios",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:adhs-trios-direct-indirect-2023",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10369485/",
      "titelBestand": "Investigating Direct and Indirect Genetic Effects in Attention-Deficit/Hyperactivity Disorder Using Parent-Offspring Trios"
     }
    },
    {
     "titel": "Intergenerational transmission of polygenic predisposition for neuropsychiatric traits on emotional and behavioural difficulties in childhood",
     "kurz": "Intergenerational transmission of polygenic predisposition for neuropsychiatric traits on emotional and behavioural difficulties in childhood",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:graph-allegrini-2025",
      "url": "https://www.nature.com/articles/s41467-025-57694-w",
      "titelBestand": "Intergenerational transmission of polygenic predisposition for neuropsychiatric traits on emotional and behavioural difficulties in childhood"
     }
    },
    {
     "titel": "Estimation of direct and indirect polygenic effects and gene–environment interactions using polygenic scores in case–parent trio studies",
     "kurz": "Estimation of direct and indirect polygenic effects and gene–environment interactions using polygenic scores in case–parent trio studies",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:graph-wang-2026",
      "url": "https://doi.org/10.1038/s41588-026-02601-2",
      "titelBestand": "Estimation of direct and indirect polygenic effects and gene–environment interactions using polygenic scores in case–parent trio studies"
     }
    },
    {
     "titel": "A Unified Theory of Development: A Dialectic Integration of Nature and Nurture",
     "kurz": "A Unified Theory of Development: A Dialectic Integration of Nature and Nurture",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:theorie-04",
      "url": "https://doi.org/10.1111/j.1467-8624.2009.01378.x",
      "titelBestand": "A Unified Theory of Development: A Dialectic Integration of Nature and Nurture"
     }
    },
    {
     "titel": "The Bioecological Model of Human Development",
     "kurz": "The Bioecological Model of Human Development",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:theorie-05",
      "url": "https://doi.org/10.1002/9780470147658.chpsy0114",
      "titelBestand": "The Bioecological Model of Human Development"
     }
    },
    {
     "titel": "The evolutionary consequences of niche construction: a theoretical investigation using two-locus theory",
     "kurz": "The evolutionary consequences of niche construction: a theoretical investigation using two-locus theory",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:theorie-07",
      "url": "https://doi.org/10.1046/j.1420-9101.1996.9030293.x",
      "titelBestand": "The evolutionary consequences of niche construction: a theoretical investigation using two-locus theory"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Genetisch mitgeprägte Eigenschaften können mit erlebten, ausgelösten oder ausgewählten Umwelten zusammenhängen."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Neurodiversität: Gene, Umwelt und Entwicklung",
   "technisch": {
    "ortIndex": 160,
    "textKennung": "fundus:rge",
    "herkunftPfad": "atlas-source/wissensfundus/neurodiversitaet-genetik-umwelt-20261027"
   },
   "feld": {
    "x": 5.179,
    "y": 1.362
   }
  },
  "300": {
   "titel": "Aufgaben bleiben offen",
   "gebiet": "Neuroatlas",
   "ortsart": "Phänomen",
   "kurz": "Begonnenes wird trotz Vorhaben nicht abgeschlossen.",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "ADHS: Aufgabenabschluss und Befolgen von Schritten erschwert. Entwicklungsverlauf und mehrere Lebensbereiche prüfen; dieses einzelne Merkmal ist unspezifisch. Zwanghafte Persönlichkeitsstörung: Starre Standards können Fertigstellen verhindern. Überdauernde Unflexibilität mit Folgen für Alltag und Beziehungen; von unerwünschten Zwangsritualen unterscheiden."
    }
   ],
   "quellen": [
    {
     "titel": "ADHD: What You Need to Know",
     "kurz": "ADHD: What You Need to Know",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nimh-adhd",
      "url": "https://www.nimh.nih.gov/health/publications/attention-deficit-hyperactivity-disorder-what-you-need-to-know",
      "titelBestand": "ADHD: What You Need to Know"
     }
    },
    {
     "titel": "Obsessive-compulsive personality disorder",
     "kurz": "Obsessive-compulsive personality disorder",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:medline-ocpd",
      "url": "https://medlineplus.gov/ency/article/000942.htm",
      "titelBestand": "Obsessive-compulsive personality disorder"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Begonnenes wird trotz Vorhaben nicht abgeschlossen."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Neuroatlas · Atlas des Erlebens",
   "technisch": {
    "ortIndex": 300,
    "textKennung": "neuro:unfinished-tasks",
    "herkunftPfad": "packages/atlas/src/catalog.ts"
   },
   "feld": {
    "x": -0.025,
    "y": 5.005
   }
  },
  "309": {
   "titel": "Reize überfluten mich",
   "gebiet": "Neuroatlas",
   "ortsart": "Phänomen",
   "kurz": "Die Menge oder Intensität von Reizen wird überwältigend.",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Autismus-Spektrum: Intensive sensorische Eindrücke können überwältigen. Sensorische Überforderung ist kontextabhängig; ihr Auftreten allein erlaubt keine diagnostische Zuordnung."
    }
   ],
   "quellen": [
    {
     "titel": "Sensory differences",
     "kurz": "Sensory differences",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nhs-sensory",
      "url": "https://www.autismcentral.nhs.uk/guidance/sensory-differences",
      "titelBestand": "Sensory differences"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Die Menge oder Intensität von Reizen wird überwältigend."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Neuroatlas · Atlas des Erlebens",
   "technisch": {
    "ortIndex": 309,
    "textKennung": "neuro:sensory-overload",
    "herkunftPfad": "packages/atlas/src/catalog.ts"
   },
   "feld": {
    "x": 0.718,
    "y": 5.821
   }
  },
  "816": {
   "titel": "Zeitblindheits-Bericht",
   "gebiet": "Phänomenatlas",
   "ortsart": "Phänomen",
   "kurz": "Community- und Fachbegriff für schwach verfügbares Zeitgefühl",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Bibliografischer Kontakt; kein geprüfter Studienbefund. Auch genannt: time blindness, time-blindness"
    }
   ],
   "quellen": [
    {
     "titel": "The Time We See: ADHD, Neuroqueer Temporality, and Graphic Medicine.",
     "kurz": "The Time We See: ADHD, Neuroqueer Temporality, and Graphic Medicine.",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "research-source:source:pmid:40059708",
      "url": "https://pubmed.ncbi.nlm.nih.gov/40059708/",
      "titelBestand": "The Time We See: ADHD, Neuroqueer Temporality, and Graphic Medicine."
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Community- und Fachbegriff für schwach verfügbares Zeitgefühl"
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · bibliografische Forschungslandkarte",
   "technisch": {
    "ortIndex": 816,
    "textKennung": "research:phenomenon:time:time-blindness",
    "herkunftPfad": "neurodivergenz-gesamtapp-chatgpt/forschung.json"
   },
   "feld": {
    "x": 6.79,
    "y": 2.885
   }
  },
  "860": {
   "titel": "Zurückweisungssensitivität",
   "gebiet": "Phänomenatlas",
   "ortsart": "Phänomen",
   "kurz": "Starke Reaktion auf erwartete oder wahrgenommene Zurückweisung",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Kein verbleibender direkter Literaturkontakt nach der Umfangsbegrenzung. Auch genannt: rejection sensitivity, rejection-sensitive dysphoria"
    }
   ],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Starke Reaktion auf erwartete oder wahrgenommene Zurückweisung"
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · bibliografische Forschungslandkarte",
   "technisch": {
    "ortIndex": 860,
    "textKennung": "research:phenomenon:emotion:rejection-sensitivity",
    "herkunftPfad": "neurodivergenz-gesamtapp-chatgpt/forschung.json"
   },
   "feld": {
    "x": 5.641,
    "y": 3.539
   }
  },
  "939": {
   "titel": "Hyperfokus",
   "gebiet": "Phänomenatlas",
   "ortsart": "Phänomen",
   "kurz": "Sehr intensive und anhaltende Bindung an eine Tätigkeit",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Bibliografischer Kontakt; kein geprüfter Studienbefund. Auch genannt: hyperfocus, hyper-focus"
    }
   ],
   "quellen": [
    {
     "titel": "Determinants of hyperfocus in the context of escapism and gaming motivations, flow, and ADHD symptoms among adult video gamers.",
     "kurz": "Determinants of hyperfocus in the context of escapism and gaming motivations, flow, and ADHD symptoms among adult video gamers.",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "research-source:source:pmid:42229071",
      "url": "https://pubmed.ncbi.nlm.nih.gov/42229071/",
      "titelBestand": "Determinants of hyperfocus in the context of escapism and gaming motivations, flow, and ADHD symptoms among adult video gamers."
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Sehr intensive und anhaltende Bindung an eine Tätigkeit"
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · bibliografische Forschungslandkarte",
   "technisch": {
    "ortIndex": 939,
    "textKennung": "research:phenomenon:strengths:hyperfocus",
    "herkunftPfad": "neurodivergenz-gesamtapp-chatgpt/forschung.json"
   },
   "feld": {
    "x": 6.7,
    "y": 3.986
   }
  },
  "1012": {
   "titel": "Aufgabenstarre",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Der Auftrag ist klar, der Körper startet nicht. Kein Desinteresse im Satz — eher ein Nicht-Hineinkommen. Im deutschsprachigen Forum taucht das als „nicht ins Tun kommen“ und als Folge unklarer Dauer auf („vorher nichts anfangen“).",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Wartemodus (Start wird bis nach dem Termin verschoben) und Body Doubling (Anwesenheit als Anker, Community, ungetestet). Delay Aversion trifft Belohnungsaufschub, nicht notwendig den Start. Hyperfokus ist oft das Gegenteil am Start — Nähe, nicht Identität. Hohe populationsweite Heritabilität schließt Passung/Gerüst für den Start nicht aus."
    }
   ],
   "quellen": [
    {
     "titel": "ADxS-Forum, Mondkatze",
     "kurz": "ADxS-Forum, Mondkatze",
     "art": "Forum",
     "zitat": "dass ich vorher nichts anfangen kann, weil ich einfach nicht einschätzen kann, wie lange ich für etwas brauche",
     "technisch": {
      "schluessel": "adhs-source:d1325eab5cb1",
      "url": "https://adhs-forum.adxs.org/t/adhs-und-zeitblindheit/18778",
      "titelBestand": "ADxS-Forum, Mondkatze"
     }
    },
    {
     "titel": "AWMF-Leitlinie",
     "kurz": "AWMF-Leitlinie",
     "art": "Leitlinie",
     "zitat": "gekennzeichnet durch die drei Kernsymptome: Aufmerksamkeitsstörung und / oder Impulsivität und Hyperaktivität",
     "technisch": {
      "schluessel": "adhs-source:bafe985ae0a3",
      "url": "https://register.awmf.org/de/leitlinien/detail/028-045",
      "titelBestand": "AWMF 028-045 / NLM-Ask"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Der Auftrag ist klar, der Körper startet nicht. Kein Desinteresse im Satz — eher ein Nicht-Hineinkommen. Im deutschsprachigen Forum taucht das als „nicht ins Tun kommen“ und als Folge unklarer Dauer auf („vorher nichts anfangen“)."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht Faulheit. Nicht automatisch Depression, auch wenn Antriebslosigkeit überlappen kann — das ist nicht geprüft."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Wartemodus (Start wird bis nach dem Termin verschoben) und Body Doubling (Anwesenheit als Anker, Community, ungetestet). Delay Aversion trifft Belohnungsaufschub, nicht notwendig den Start. Hyperfokus ist oft das Gegenteil am Start — Nähe, nicht Identität. Hohe populationsweite Heritabilität schließt Passung/Gerüst für den Start nicht aus."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Keine Diagnose und kein Nachweis eines eigenständig validierten Konstrukts.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Das damalige Initiation-Notebook war leer; daraus folgt keine Studienbestätigung und keine belegte Wirkung von Body Doubling.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht Faulheit.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht automatisch Depression, auch wenn Antriebslosigkeit überlappen kann — das ist nicht geprüft.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1012,
    "textKennung": "adhs:aufgabenstarre",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/aufgabenstarre.md"
   },
   "feld": {
    "x": -0.777,
    "y": 1.237
   }
  },
  "1013": {
   "titel": "Body Doubling",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Methode",
   "kurz": "Eine andere Person ist anwesend — im Raum oder am Bildschirm — während eine ungeliebte oder zähe Aufgabe läuft. Das Double muss die Aufgabe nicht lösen. Die Anwesenheit soll im Moment halten.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Aufgabenstarre (Start/Dranbleiben). ICF spricht Umweltfaktoren — das ist ein Rahmen, kein Beleg dass Body Doubling in der ICF steht. Als soziale/räumliche Passung berührt es die These, dass Umwelt Kosten formt, ohne Onset zu „schalten“. Hyperfokus im Kopf genannt, Prosa dünn — Nähe offen."
    }
   ],
   "quellen": [
    {
     "titel": "Medical News Today, Villines",
     "kurz": "Medical News Today, Villines",
     "art": "Bericht",
     "zitat": "There is no recent research testing the effectiveness of body doubling",
     "technisch": {
      "schluessel": "adhs-source:1e91e8390722",
      "url": "https://www.medicalnewstoday.com/articles/body-doubling-adhd",
      "titelBestand": "Medical News Today, Villines"
     }
    },
    {
     "titel": "ICD-11 Portalseite",
     "kurz": "ICD-11 Portalseite",
     "art": "Leitlinie",
     "zitat": "Begriff Body Doubling auf der Uebersicht nicht genannt",
     "technisch": {
      "schluessel": "adhs-source:4d8770a762e3",
      "url": "https://icd.who.int/browse/l-mms/en#/http://id.who.int/icd/entity/828975001",
      "titelBestand": "ICD-11 Portalseite / NLM-Ask"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Eine andere Person ist anwesend — im Raum oder am Bildschirm — während eine ungeliebte oder zähe Aufgabe läuft. Das Double muss die Aufgabe nicht lösen. Die Anwesenheit soll im Moment halten."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht Supervision. Nicht dass man „zu schwach“ ist, allein zu arbeiten. Nicht bewiesene Therapie."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Aufgabenstarre (Start/Dranbleiben). ICF spricht Umweltfaktoren — das ist ein Rahmen, kein Beleg dass Body Doubling in der ICF steht. Als soziale/räumliche Passung berührt es die These, dass Umwelt Kosten formt, ohne Onset zu „schalten“. Hyperfokus im Kopf genannt, Prosa dünn — Nähe offen."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "während eine ungeliebte oder zähe Aufgabe läuft",
     "satz": "Eine andere Person ist anwesend — im Raum oder am Bildschirm — während eine ungeliebte oder zähe Aufgabe läuft.",
     "abschnitt": "Was Menschen beschreiben"
    }
   ],
   "grenzSaetze": [
    {
     "satz": "Community-Methode mit möglicher Passung, keine gesicherte Wirksamkeitszusage und kein Ersatz für Behandlung.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Kontrollierte Studien fehlten in der damals gelesenen Auswahl.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht Supervision.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht dass man „zu schwach“ ist, allein zu arbeiten.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht bewiesene Therapie.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1013,
    "textKennung": "adhs:body-doubling",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/body-doubling.md"
   },
   "feld": {
    "x": -1.786,
    "y": 0.417
   }
  },
  "1014": {
   "titel": "Delay Aversion",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Warten ist nicht neutral. Aufschub einer Belohnung oder eines Endes ist schwer zu ertragen. ADxS fasst Alltagsformen: Warten unerträglich; lieber noch etwas tun als zu früh da sein und stillhalten.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Wartemodus (Vermeidung des Wartens durch leeren Vormittag) und Zeitblindheit (Schätzfehler). Das sind drei Karten, nicht eine Wahrheit. Aufgabenstarre trifft den Start, nicht notwendig Belohnungsaufschub. Delay Aversion ist kein Beleg für „Erziehung verursacht ADHS“ — motivationaler Pfad ≠ rGE-Schuldnarrativ."
    }
   ],
   "quellen": [
    {
     "titel": "Sonuga-Barke 2002",
     "kurz": "Sonuga-Barke 2002",
     "art": "Studie",
     "zitat": "delay aversion and poor inhibitory control are independent co-existing characteristics of AD/HD (combined type)",
     "technisch": {
      "schluessel": "adhs-source:28cfccd9cfd9",
      "url": "https://pubmed.ncbi.nlm.nih.gov/11864715/",
      "titelBestand": "Sonuga-Barke 2002"
     }
    },
    {
     "titel": "Noreika et al. 2013",
     "kurz": "Noreika et al. 2013",
     "art": "Studie",
     "zitat": "The most consistent impairments in ADHD are found in sensorimotor synchronisation, duration discrimination, reproduction and delay discounting",
     "technisch": {
      "schluessel": "adhs-source:cfb32f094c24",
      "url": "https://pubmed.ncbi.nlm.nih.gov/23022430/",
      "titelBestand": "Noreika et al. 2013"
     }
    },
    {
     "titel": "ADxS Zeitaufwand",
     "kurz": "ADxS Zeitaufwand",
     "art": "Ableitung",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:ac6ca4bf60c5",
      "url": "https://www.adxs.org/",
      "titelBestand": "ADxS Zeitaufwand / NLM cited_text"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Warten ist nicht neutral. Aufschub einer Belohnung oder eines Endes ist schwer zu ertragen. ADxS fasst Alltagsformen: Warten unerträglich; lieber noch etwas tun als zu früh da sein und stillhalten."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht dass jemand unhöflich ist, wenn er nicht wartet. Nicht identisch mit Zeitblindheit (Schätzen vs. Ertragen)."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Wartemodus (Vermeidung des Wartens durch leeren Vormittag) und Zeitblindheit (Schätzfehler). Das sind drei Karten, nicht eine Wahrheit. Aufgabenstarre trifft den Start, nicht notwendig Belohnungsaufschub. Delay Aversion ist kein Beleg für „Erziehung verursacht ADHS“ — motivationaler Pfad ≠ rGE-Schuldnarrativ."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Modell zu aversiv erlebtem Aufschub, kein Diagnoseverfahren.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Delay Aversion, zeitliches Diskontieren und Wartemodus bezeichnen unterschiedliche Gegenstände.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht dass jemand unhöflich ist, wenn er nicht wartet.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht identisch mit Zeitblindheit (Schätzen vs. Ertragen).",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1014,
    "textKennung": "adhs:delay-aversion",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/delay-aversion.md"
   },
   "feld": {
    "x": -0.369,
    "y": -1.472
   }
  },
  "1015": {
   "titel": "Differential Susceptibility",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Manche Kinder scheinen von schlechten und guten Kontexten stärker bewegt zu werden als andere — nicht nur „anfällig für Schaden“.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Nicht dasselbe wie rGE (Korrelation ≠ Interaktion). Benannte Nähe zu Heritabilität-ist-kein-Schicksal (hohe h² schließt Ausprägungsabhängigkeit nicht aus). Nicht dasselbe wie Extreme-Umwelt-Kausalität (selten, klarer Quasi-Experiment-Status)."
    }
   ],
   "quellen": [
    {
     "titel": "Belsky & Pluess 2009",
     "kurz": "Belsky & Pluess 2009",
     "art": "Übersicht",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:a3c5c76c6f99",
      "url": "https://doi.org/10.1037/a0017376",
      "titelBestand": "Belsky & Pluess 2009"
     }
    },
    {
     "titel": "Østergaard et al. 2020",
     "kurz": "Østergaard et al. 2020",
     "art": "Studie",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:1763b56b73b9",
      "url": "https://doi.org/10.1038/s41398-020-01019-6",
      "titelBestand": "Østergaard et al. 2020"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Manche Kinder scheinen von schlechten und guten Kontexten stärker bewegt zu werden als andere — nicht nur „anfällig für Schaden“."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Keine Onset-Ursache. Keine Eltern-Schuldformel. Kein Ersatz für Twin-/PRS-Befunde."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Nicht dasselbe wie rGE (Korrelation ≠ Interaktion). Benannte Nähe zu Heritabilität-ist-kein-Schicksal (hohe h² schließt Ausprägungsabhängigkeit nicht aus). Nicht dasselbe wie Extreme-Umwelt-Kausalität (selten, klarer Quasi-Experiment-Status)."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Heritabilität ist ein Populationsmaß und erklärt keine einzelne Biografie.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Genetische Beiträge, Umweltbeiträge und Interaktionen sind nicht gegeneinander austauschbar.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Hohe Heritabilität bedeutet keine Unveränderlichkeit.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Keine Onset-Ursache.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Keine Eltern-Schuldformel.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Kein Ersatz für Twin-/PRS-Befunde.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1015,
    "textKennung": "adhs:differential-susceptibility",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/differential-susceptibility.md"
   },
   "feld": {
    "x": 0.689,
    "y": -2.383
   }
  },
  "1016": {
   "titel": "Gen–Umwelt-Korrelation (rGE)",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Dasselbe Kind „erzeugt“ oft andere Reaktionen in der Umgebung als ein anderes Kind — und man liest das fälschlich als reine Erziehungswirkung auf den Onset.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Verwandt als Voraussetzung: Heritabilität-ist-kein-Schicksal (ACE/rGE lesbar machen). Nicht dasselbe wie extreme Umwelt-Kausalität (ERA/VLBW) und nicht dasselbe wie Differential Susceptibility (Interaktion ≠ Korrelation). Nicht-dasselbe-Pfad zu RSD: soziale Last und Kritikschmerz beweisen keinen Eltern-Onset. Claim Ceiling: keine Kante „Eltern verursachen ADHS“."
    }
   ],
   "quellen": [
    {
     "titel": "Thapar et al. 2013",
     "kurz": "Thapar et al. 2013",
     "art": "Übersicht",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:a0faf51c33f5",
      "url": "https://doi.org/10.1111/j.1469-7610.2012.02611.x",
      "titelBestand": "Thapar et al. 2013"
     }
    },
    {
     "titel": "Østergaard et al. 2020",
     "kurz": "Østergaard et al. 2020",
     "art": "Studie",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:1763b56b73b9",
      "url": "https://doi.org/10.1038/s41398-020-01019-6",
      "titelBestand": "Østergaard et al. 2020"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Dasselbe Kind „erzeugt“ oft andere Reaktionen in der Umgebung als ein anderes Kind — und man liest das fälschlich als reine Erziehungswirkung auf den Onset."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Keine Fawn-/Trauma-Erklärung. Keine Spektrum-Obertheorie."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Verwandt als Voraussetzung: Heritabilität-ist-kein-Schicksal (ACE/rGE lesbar machen). Nicht dasselbe wie extreme Umwelt-Kausalität (ERA/VLBW) und nicht dasselbe wie Differential Susceptibility (Interaktion ≠ Korrelation). Nicht-dasselbe-Pfad zu RSD: soziale Last und Kritikschmerz beweisen keinen Eltern-Onset. Claim Ceiling: keine Kante „Eltern verursachen ADHS“."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Heritabilität ist ein Populationsmaß und erklärt keine einzelne Biografie.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Genetische Beiträge, Umweltbeiträge und Interaktionen sind nicht gegeneinander austauschbar.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Hohe Heritabilität bedeutet keine Unveränderlichkeit.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Keine Fawn-/Trauma-Erklärung.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Keine Spektrum-Obertheorie.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1016,
    "textKennung": "adhs:gen-umwelt-korrelation-rge",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/gen-umwelt-korrelation-rge.md"
   },
   "feld": {
    "x": 1.97,
    "y": -1.245
   }
  },
  "1017": {
   "titel": "Heritabilität ist kein Schicksal",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Menschen hören „ADHS ist zu X Prozent genetisch“ und lesen daraus: unveränderlich, oder umgekehrt: die Umwelt entscheidet allein, ob es „wirklich“ wird.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Verwandt: Gen–Umwelt-Korrelation (rGE) — inherited und noninherited interdependent (Thapar 2013). Gegenbeispiel-Pfad: extreme frühe Umwelt (ERA, VLBW) — Populations-Twin-Samples unterrepräsentieren das. Nicht dasselbe: Differential Susceptibility (Plasticity/Interaktion ≠ Varianzanteil h²). Benannte Nähe zu Aufgabenstarre/Gerüst: hohe h² macht Intervention nicht sinnlos."
    }
   ],
   "quellen": [
    {
     "titel": "Faraone & Larsson 2019 Mol Psychiatry",
     "kurz": "Faraone & Larsson 2019 Mol Psychiatry",
     "art": "Übersicht",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:ca613bf3efe5",
      "url": "https://doi.org/10.1038/s41380-018-0070-0",
      "titelBestand": "Faraone & Larsson 2019 Mol Psychiatry"
     }
    },
    {
     "titel": "Larsson et al. 2014 Psychol Med",
     "kurz": "Larsson et al. 2014 Psychol Med",
     "art": "Studie",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:c5a276db39cd",
      "url": "https://doi.org/10.1017/S0033291713002493",
      "titelBestand": "Larsson et al. 2014 Psychol Med"
     }
    },
    {
     "titel": "Thapar et al. 2013",
     "kurz": "Thapar et al. 2013",
     "art": "Übersicht",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:a0faf51c33f5",
      "url": "https://doi.org/10.1111/j.1469-7610.2012.02611.x",
      "titelBestand": "Thapar et al. 2013"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Menschen hören „ADHS ist zu X Prozent genetisch“ und lesen daraus: unveränderlich, oder umgekehrt: die Umwelt entscheidet allein, ob es „wirklich“ wird."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Keine Erklärung einzelner Biografien. Keine Autismus-h². Keine Beziehungs- oder Eltern-Ursache."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Verwandt: Gen–Umwelt-Korrelation (rGE) — inherited und noninherited interdependent (Thapar 2013). Gegenbeispiel-Pfad: extreme frühe Umwelt (ERA, VLBW) — Populations-Twin-Samples unterrepräsentieren das. Nicht dasselbe: Differential Susceptibility (Plasticity/Interaktion ≠ Varianzanteil h²). Benannte Nähe zu Aufgabenstarre/Gerüst: hohe h² macht Intervention nicht sinnlos."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Heritabilität ist ein Populationsmaß und erklärt keine einzelne Biografie.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Genetische Beiträge, Umweltbeiträge und Interaktionen sind nicht gegeneinander austauschbar.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Hohe Heritabilität bedeutet keine Unveränderlichkeit.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Keine Erklärung einzelner Biografien.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Keine Autismus-h².",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Keine Beziehungs- oder Eltern-Ursache.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1017,
    "textKennung": "adhs:heritabilitaet-nicht-schicksal",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/heritabilitaet-nicht-schicksal.md"
   },
   "feld": {
    "x": 0.84,
    "y": -0.539
   }
  },
  "1018": {
   "titel": "Hyperfokus",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Vollständiges Aufgehen in einer Tätigkeit, oft einer interessanten. Die Umgebung fällt weg. Zeit kann sich anfühlen, als gäbe es sie nicht. Danach: Stunden sind um, der Rest des Tages ist unberührt.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Zeitblindheit (Stunden weg). Aufgabenstarre ist oft das Gegenteil am Start — Nähe, nicht Identität. Flow-Forschung ist nicht eingelesen. Interesse-/Passungskosten können die Erscheinung von Hyperfokus formen, ohne h² zu widerlegen."
    }
   ],
   "quellen": [
    {
     "titel": "ADDitude",
     "kurz": "ADDitude",
     "art": "Klinik",
     "zitat": "Hyperfocus refers to an intense fixation on an interest or activity for an extended period of time",
     "technisch": {
      "schluessel": "adhs-source:22ead006b401",
      "url": "https://www.additudemag.com/understanding-adhd-hyperfocus/",
      "titelBestand": "ADDitude / NLM cited_text 30.08.2026"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Vollständiges Aufgehen in einer Tätigkeit, oft einer interessanten. Die Umgebung fällt weg. Zeit kann sich anfühlen, als gäbe es sie nicht. Danach: Stunden sind um, der Rest des Tages ist unberührt."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht automatisch Produktivität. Nicht dass jemand „sich zusammenreißen“ kann, sobald es langweilig wird, und das Gegenteil beweist fehlenden Willen."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Zeitblindheit (Stunden weg). Aufgabenstarre ist oft das Gegenteil am Start — Nähe, nicht Identität. Flow-Forschung ist nicht eingelesen. Interesse-/Passungskosten können die Erscheinung von Hyperfokus formen, ohne h² zu widerlegen."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "besonders bei belohnenden Tätigkeiten",
     "satz": "Barkley dort zitiert: Schwierigkeiten, die Aufmerksamkeit zu wechseln, besonders bei belohnenden Tätigkeiten.",
     "abschnitt": "Was Berichte sagen"
    }
   ],
   "grenzSaetze": [
    {
     "satz": "Kein eigenständiges DSM-Kriterium.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Ob verschiedene Fachliteraturen dasselbe Konstrukt meinen, bleibt offen.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Eine vereinfachte Dopaminmangel-Erklärung wird nicht als belegt übernommen.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht automatisch Produktivität.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht dass jemand „sich zusammenreißen“ kann, sobald es langweilig wird, und das Gegenteil beweist fehlenden Willen.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1018,
    "textKennung": "adhs:hyperfokus",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/hyperfokus.md"
   },
   "feld": {
    "x": 1.26,
    "y": 1.796
   }
  },
  "1019": {
   "titel": "Reizfilterschwäche",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Zu viel kommt durch. Geräusche, Licht, Etiketten, Stimmen im Raum. Nach Überreizung kann es dauern, bis der Körper wieder still wird. Im deutschsprachigen Forum: kleinste Geräusche wie ein Einschlag.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Überwältigung, die als RSD gelesen wird — das wäre Verwechslung. Schlaf/Chronotyp ist nicht Reizfilter. Sensorische Last in Alltagsumwelten ist nicht dasselbe wie ADHD-ähnliche Symptome nach extremer früher Deprivation/VLBW."
    }
   ],
   "quellen": [
    {
     "titel": "ADxS-Forum",
     "kurz": "ADxS-Forum",
     "art": "Forum",
     "zitat": "Manchmal dauert es Tage, bis ich mich wieder „normal“ fühle",
     "technisch": {
      "schluessel": "adhs-source:dfdfa2683faa",
      "url": "https://adhs-forum.adxs.org/t/hyperakusis-und-misophonie-was-hilft/19841",
      "titelBestand": "ADxS-Forum / NLM cited_text 30.08.2026"
     }
    },
    {
     "titel": "Ghanizadeh Abstract",
     "kurz": "Ghanizadeh Abstract",
     "art": "Studie",
     "zitat": "ADHD and sensory problems may occur together and interact",
     "technisch": {
      "schluessel": "adhs-source:52346ef12a5a",
      "url": "https://pubmed.ncbi.nlm.nih.gov/21852983/",
      "titelBestand": "Ghanizadeh Abstract"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Zu viel kommt durch. Geräusche, Licht, Etiketten, Stimmen im Raum. Nach Überreizung kann es dauern, bis der Körper wieder still wird. Im deutschsprachigen Forum: kleinste Geräusche wie ein Einschlag."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht „zuviel Theater“. Nicht identisch mit Autismus-Sensorik, auch wenn die Literatur überlappt."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Überwältigung, die als RSD gelesen wird — das wäre Verwechslung. Schlaf/Chronotyp ist nicht Reizfilter. Sensorische Last in Alltagsumwelten ist nicht dasselbe wie ADHD-ähnliche Symptome nach extremer früher Deprivation/VLBW."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Keine Diagnose und kein nachgewiesener eigenständiger ADHS-Kern.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Sensorische Überlastung und Misophonie sind zu unterscheiden; Forum- und Selbsttestzahlen sind keine Bevölkerungsprävalenz.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht „zuviel Theater“.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht identisch mit Autismus-Sensorik, auch wenn die Literatur überlappt.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1019,
    "textKennung": "adhs:reizfilterschwaeche",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/reizfilterschwaeche.md"
   },
   "feld": {
    "x": -1.604,
    "y": 2.261
   }
  },
  "1020": {
   "titel": "Rejection Sensitive Dysphoria",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Heftiger emotionaler Schmerz bei tatsächlicher oder vermuteter Zurückweisung, Kritik, Bloßstellung. Stärker und schwerer zu steuern als „das hat wehgetan“.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit allgemeiner emotionaler Dysregulation. Reizfilter ist sensorisch, nicht sozial — Nähe nur wenn beides als Überwältigung erlebt wird, nicht als Identität. ZurückweisungsSchmerz ist kein Beleg dafür, dass Elternschaft ADHS-Onset verursacht; evokative rGE und soziale Last sind zu trennen."
    }
   ],
   "quellen": [
    {
     "titel": "Cleveland Clinic",
     "kurz": "Cleveland Clinic",
     "art": "Klinik",
     "zitat": "Though RSD isn't an officially recognized symptom or diagnosis, it's still a term that experts use",
     "technisch": {
      "schluessel": "adhs-source:5e174fe7afa7",
      "url": "https://my.clevelandclinic.org/health/diseases/24099-rejection-sensitive-dysphoria-rsd",
      "titelBestand": "Cleveland Clinic"
     }
    },
    {
     "titel": "Dodson, ADDitude",
     "kurz": "Dodson, ADDitude",
     "art": "Klinik",
     "zitat": "Individuals with RSD feel “unbearable” pain as a result of perceived or actual rejection, teasing, or criticism",
     "technisch": {
      "schluessel": "adhs-source:977c7ddd8a2c",
      "url": "https://www.additudemag.com/rejection-sensitive-dysphoria-adhd-emotional-dysregulation/",
      "titelBestand": "Dodson, ADDitude / NLM cited_text 30.08.2026"
     }
    },
    {
     "titel": "AWMF-Leitlinie",
     "kurz": "AWMF-Leitlinie",
     "art": "Leitlinie",
     "zitat": "soziale Schwierigkeiten in der Familie, im Kontakt mit Gleichaltrigen und Beziehungspartnern",
     "technisch": {
      "schluessel": "adhs-source:bafe985ae0a3",
      "url": "https://register.awmf.org/de/leitlinien/detail/028-045",
      "titelBestand": "AWMF 028-045 / NLM-Ask"
     }
    },
    {
     "titel": "Hirsch et al., 2018, PubMed-Titel",
     "kurz": "Hirsch et al., 2018, PubMed-Titel",
     "art": "Studie",
     "zitat": "Emotional dysregulation is a primary symptom in adult Attention-Deficit/Hyperactivity Disorder (ADHD)",
     "technisch": {
      "schluessel": "adhs-source:08db2cd93e5a",
      "url": "https://pubmed.ncbi.nlm.nih.gov/29477097/",
      "titelBestand": "Hirsch et al., 2018, PubMed-Titel"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Heftiger emotionaler Schmerz bei tatsächlicher oder vermuteter Zurückweisung, Kritik, Bloßstellung. Stärker und schwerer zu steuern als „das hat wehgetan“."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht identisch mit Borderline. Nicht „zu empfindlich“ als Charakter. Nicht RSQ."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit allgemeiner emotionaler Dysregulation. Reizfilter ist sensorisch, nicht sozial — Nähe nur wenn beides als Überwältigung erlebt wird, nicht als Identität. ZurückweisungsSchmerz ist kein Beleg dafür, dass Elternschaft ADHS-Onset verursacht; evokative rGE und soziale Last sind zu trennen."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "bei tatsächlicher oder vermuteter Zurückweisung",
     "satz": "Heftiger emotionaler Schmerz bei tatsächlicher oder vermuteter Zurückweisung, Kritik, Bloßstellung.",
     "abschnitt": "Was Menschen beschreiben"
    },
    {
     "klausel": "bei Erwachsenen mit ADHS",
     "satz": "Dodson in ADDitude: RSD als häufig einschränkende Form emotionaler Dysregulation bei Erwachsenen mit ADHS; Schmerz durch wahrgenommene oder tatsächliche Zurückweisung, Spott, Kritik.",
     "abschnitt": "Was Berichte sagen"
    },
    {
     "klausel": "nur wenn beides als Überwältigung erlebt wird",
     "satz": "Reizfilter ist sensorisch, nicht sozial — Nähe nur wenn beides als Überwältigung erlebt wird, nicht als Identität.",
     "abschnitt": "Verwandt und zu unterscheiden"
    }
   ],
   "grenzSaetze": [
    {
     "satz": "Keine eigene etablierte Diagnose.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Zurückweisungssensitivität, RSD und allgemeine emotionale Dysregulation dürfen nicht gleichgesetzt werden.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Befunde zu sozialem Schmerz validieren nicht automatisch RSD.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht identisch mit Borderline.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht „zu empfindlich“ als Charakter.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht RSQ.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1020,
    "textKennung": "adhs:rsd",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/rsd.md"
   },
   "feld": {
    "x": 1.664,
    "y": 0.493
   }
  },
  "1021": {
   "titel": "Extreme frühe Umwelt und ADHD-ähnliche Symptome",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Nach schweren frühen Entbehrungen oder sehr früher Frühgeburt bleiben Aufmerksamkeits- und Regulationsprobleme, die ADHD-ähnlich aussehen können.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Gegenbeispiel zur Lesart „hohe h² ⇒ Umwelt egal“: ERA und VP/VLBW. Nicht dasselbe wie Alltags-rGE. Nicht dasselbe wie Differential Susceptibility als allgemeine Alltags-GxE (Empirie oft schwach)."
    }
   ],
   "quellen": [
    {
     "titel": "Franz et al. 2018 Pediatrics",
     "kurz": "Franz et al. 2018 Pediatrics",
     "art": "Studie",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:abc342d972d7",
      "url": "https://doi.org/10.1542/peds.2017-1645",
      "titelBestand": "Franz et al. 2018 Pediatrics"
     }
    },
    {
     "titel": "Rauch/Confounding Sibling-Designs",
     "kurz": "Rauch/Confounding Sibling-Designs",
     "art": "Übersicht",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:e145096be60b",
      "url": "https://doi.org/10.1111/jcpp.12124",
      "titelBestand": "Rauch/Confounding Sibling-Designs"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Nach schweren frühen Entbehrungen oder sehr früher Frühgeburt bleiben Aufmerksamkeits- und Regulationsprobleme, die ADHD-ähnlich aussehen können."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Keine allgemeine Umwelt-Formel. Keine biografische Eltern-Erklärung."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Gegenbeispiel zur Lesart „hohe h² ⇒ Umwelt egal“: ERA und VP/VLBW. Nicht dasselbe wie Alltags-rGE. Nicht dasselbe wie Differential Susceptibility als allgemeine Alltags-GxE (Empirie oft schwach)."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Heritabilität ist ein Populationsmaß und erklärt keine einzelne Biografie.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Genetische Beiträge, Umweltbeiträge und Interaktionen sind nicht gegeneinander austauschbar.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Hohe Heritabilität bedeutet keine Unveränderlichkeit.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Keine allgemeine Umwelt-Formel.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Keine biografische Eltern-Erklärung.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1021,
    "textKennung": "adhs:umwelt-extreme-adhs",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/umwelt-extreme-adhs.md"
   },
   "feld": {
    "x": -0.599,
    "y": -0.274
   }
  },
  "1022": {
   "titel": "Wartemodus",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Ein Termin später am Tag legt den Raum davor still. Nicht unbedingt Angst vor dem Termin — der Block „danach ist Zeit, davor ist keine“. Manche können bis dahin nichts anfangen, weil sie nicht schätzen, wie lange etwas dauert, und das Risiko eingehen, den Termin zu verpassen.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Zeitblindheit (Dauer unklar) und Aufgabenstarre (Start gelingt nicht). Delay Aversion beschreibt, dass Warten schwer ist — Wartemodus kann die Strategie sein, Warten zu vermeiden, indem man den Block leer lässt. Das ist benannte Nähe, nicht Identität. Termin-/Kalenderumwelt moduliert Kosten der Erscheinung; das hebt keine Onset-Ursache."
    }
   ],
   "quellen": [
    {
     "titel": "ADxS-Forum, Mondkatze",
     "kurz": "ADxS-Forum, Mondkatze",
     "art": "Forum",
     "zitat": "Teilweise ist es so schlimm, dass ich vorher nichts anfangen kann, weil ich einfach nicht einschätzen kann, wie lange ich für etwas brauche",
     "technisch": {
      "schluessel": "adhs-source:d1325eab5cb1",
      "url": "https://adhs-forum.adxs.org/t/adhs-und-zeitblindheit/18778",
      "titelBestand": "ADxS-Forum, Mondkatze"
     }
    },
    {
     "titel": "ADxS Zeitaufwand",
     "kurz": "ADxS Zeitaufwand",
     "art": "Ableitung",
     "zitat": "",
     "technisch": {
      "schluessel": "adhs-source:ac6ca4bf60c5",
      "url": "https://www.adxs.org/",
      "titelBestand": "ADxS Zeitaufwand / NLM cited_text"
     }
    },
    {
     "titel": "Sonuga-Barke 2002",
     "kurz": "Sonuga-Barke 2002",
     "art": "Studie",
     "zitat": "delay aversion and poor inhibitory control are independent co-existing characteristics of AD/HD (combined type)",
     "technisch": {
      "schluessel": "adhs-source:28cfccd9cfd9",
      "url": "https://pubmed.ncbi.nlm.nih.gov/11864715/",
      "titelBestand": "Sonuga-Barke 2002"
     }
    },
    {
     "titel": "NICE NG87 Übersicht",
     "kurz": "NICE NG87 Übersicht",
     "art": "Leitlinie",
     "zitat": "waiting mode auf der Uebersichtsseite nicht genannt, NICE spricht dort von service organisation and training",
     "technisch": {
      "schluessel": "adhs-source:167cf4e4c0d9",
      "url": "https://www.nice.org.uk/guidance/ng87",
      "titelBestand": "NICE NG87 Übersicht, NLM-Ask 02.09.2026"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Ein Termin später am Tag legt den Raum davor still. Nicht unbedingt Angst vor dem Termin — der Block „danach ist Zeit, davor ist keine“. Manche können bis dahin nichts anfangen, weil sie nicht schätzen, wie lange etwas dauert, und das Risiko eingehen, den Termin zu verpassen."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht Vorfreude. Nicht dass der Termin unwichtig wäre. Nicht dass jemand den Vormittag „verschwendet“ im moralischen Sinn."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Zeitblindheit (Dauer unklar) und Aufgabenstarre (Start gelingt nicht). Delay Aversion beschreibt, dass Warten schwer ist — Wartemodus kann die Strategie sein, Warten zu vermeiden, indem man den Block leer lässt. Das ist benannte Nähe, nicht Identität. Termin-/Kalenderumwelt moduliert Kosten der Erscheinung; das hebt keine Onset-Ursache."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Alltagsbeschreibung, kein im Original validiertes eigenes Konstrukt.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Mögliche Beiträge von Zeitverarbeitung, Angst, Belohnungsaufschub und Initiation bleiben offen.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht Vorfreude.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht dass der Termin unwichtig wäre.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht dass jemand den Vormittag „verschwendet“ im moralischen Sinn.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1022,
    "textKennung": "adhs:wartemodus",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/wartemodus.md"
   },
   "feld": {
    "x": -1.729,
    "y": -0.977
   }
  },
  "1023": {
   "titel": "Zeitblindheit",
   "gebiet": "ADHS · Randphänomene",
   "ortsart": "Phänomen",
   "kurz": "Die innere Uhr liefert kein brauchbares Gefühl dafür, wie lange etwas dauert oder wie weit ein Termin noch ist. Im Forum: Wege und Tätigkeiten werden in Stundenblöcken geplant, weil Minuten unsicher machen. Manche sind chronisch zu früh, nicht zu spät.",
   "mehr": [
    {
     "titel": "Verwandt und zu unterscheiden",
     "text": "Könnte zusammenhängen mit Wartemodus (der Termin blockiert den Vormittag) und Delay Aversion (Warten ist schwer). Hyperfokus kann Zeit „verschwinden“ lassen — anderes Erleben, keine Identität. Timing-Laborbefunde sind nicht dasselbe wie ADHD-ähnliche Symptome nach extremer früher Umwelt."
    }
   ],
   "quellen": [
    {
     "titel": "Noreika et al. 2013",
     "kurz": "Noreika et al. 2013",
     "art": "Studie",
     "zitat": "ADHD patients are consistently impaired in three major timing domains, in motor timing, perceptual timing and temporal foresight",
     "technisch": {
      "schluessel": "adhs-source:cfb32f094c24",
      "url": "https://pubmed.ncbi.nlm.nih.gov/23022430/",
      "titelBestand": "Noreika et al. 2013"
     }
    },
    {
     "titel": "AWMF-Leitlinie",
     "kurz": "AWMF-Leitlinie",
     "art": "Leitlinie",
     "zitat": "gekennzeichnet durch die drei Kernsymptome: Aufmerksamkeitsstörung und / oder Impulsivität und Hyperaktivität",
     "technisch": {
      "schluessel": "adhs-source:bafe985ae0a3",
      "url": "https://register.awmf.org/de/leitlinien/detail/028-045",
      "titelBestand": "AWMF 028-045 / NLM-Ask"
     }
    },
    {
     "titel": "ADxS-Forum, Mondkatze",
     "kurz": "ADxS-Forum, Mondkatze",
     "art": "Forum",
     "zitat": "es mir total schwer fällt Zeiten einzuschätzen, die ich für bestimmte Wege oder auch Tätigkeiten",
     "technisch": {
      "schluessel": "adhs-source:d1325eab5cb1",
      "url": "https://adhs-forum.adxs.org/t/adhs-und-zeitblindheit/18778",
      "titelBestand": "ADxS-Forum, Mondkatze"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Was Menschen beschreiben",
      "text": "Die innere Uhr liefert kein brauchbares Gefühl dafür, wie lange etwas dauert oder wie weit ein Termin noch ist. Im Forum: Wege und Tätigkeiten werden in Stundenblöcken geplant, weil Minuten unsicher machen. Manche sind chronisch zu früh, nicht zu spät."
     }
    ],
    "aussen": [
     {
      "abschnitt": "Was das nicht ist",
      "text": "Nicht Faulheit, nicht Absicht, andere warten zu lassen. Nicht dass die Wanduhr falsch geht."
     },
     {
      "abschnitt": "Verwandt und zu unterscheiden",
      "text": "Könnte zusammenhängen mit Wartemodus (der Termin blockiert den Vormittag) und Delay Aversion (Warten ist schwer). Hyperfokus kann Zeit „verschwinden“ lassen — anderes Erleben, keine Identität. Timing-Laborbefunde sind nicht dasselbe wie ADHD-ähnliche Symptome nach extremer früher Umwelt."
     }
    ],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Alltagsname und Labor-Timing sind zu unterscheiden.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Das damalige Notebook enthielt Leitlinien-Portalseiten, keine vollständigen Leitlinien; fehlender Begriff auf einer Portalseite belegt keine vollständige Abwesenheit in der Fachliteratur.",
     "abschnitt": "Aussagegrenze"
    },
    {
     "satz": "Nicht Faulheit, nicht Absicht, andere warten zu lassen.",
     "abschnitt": "Was das nicht ist"
    },
    {
     "satz": "Nicht dass die Wanduhr falsch geht.",
     "abschnitt": "Was das nicht ist"
    }
   ],
   "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
   "technisch": {
    "ortIndex": 1023,
    "textKennung": "adhs:zeitblindheit",
    "herkunftPfad": "phaenomenatlas-ernst/daten/karten/zeitblindheit.md"
   },
   "feld": {
    "x": 0.44,
    "y": 0.685
   }
  },
  "1035": {
   "titel": "Unterstützung bleibt ein Angebot",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Gemeinsam ruhiger werden ist ein möglicher Zugang. Das Gegenüber behält seine Entscheidung; Unterstützung wird nicht zum Anspruch auf Anwesenheit.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Noa fragt: „Würde dir ein kurzer Spaziergang zusammen helfen?“ Lee sagt, heute lieber allein sein zu wollen."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Das Angebot ohne Kränkung zurücknehmen. Für einen späteren Zeitpunkt können beide passende Formen und Grenzen freiwilliger Unterstützung besprechen. Darf mein Hilfsangebot abgelehnt werden, ohne dass daraus ein neues Problem entsteht?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1035,
    "textKennung": "relationship-original:gemeinsam-regulieren",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 4.82,
    "y": -0.712
   }
  },
  "1222": {
   "titel": "Aufmerksamkeit braucht einen Verlauf",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Konzentrationsprobleme können verschiedene Bedingungen haben und gleichzeitig auftreten. Sinnvolle Fragen sind: Seit wann bestehen sie, in welchen Lebensbereichen zeigen sie sich und welche Belastungen verändern sie? Die geprüften NICE-Empfehlungen verlangen eine umfassende Entwicklungsgeschichte; einzelne Skalen genüg",
   "mehr": [],
   "quellen": [
    {
     "titel": "Attention deficit hyperactivity disorder: diagnosis and management — selected diagnostic recommendations",
     "kurz": "Attention deficit hyperactivity disorder: diagnosis and management — selected diagnostic recommendations",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:nice-ng87-diagnosis-selected",
      "url": "https://www.nice.org.uk/guidance/ng87/chapter/recommendations",
      "titelBestand": "Attention deficit hyperactivity disorder: diagnosis and management — selected diagnostic recommendations"
     }
    },
    {
     "titel": "The Relationship of Attention-Deficit/Hyperactivity Disorder With Posttraumatic Stress Disorder: A Two-Sample Mendelian Randomization and Population-Based Sibling Comparison Study",
     "kurz": "The Relationship of Attention-Deficit/Hyperactivity Disorder With Posttraumatic Stress Disorder: A Two-Sample Mendelian Randomization and Population-Based Sibling Comparison Study",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:wendt-2023-adhd-ptsd",
      "url": "https://pubmed.ncbi.nlm.nih.gov/36335070/",
      "titelBestand": "The Relationship of Attention-Deficit/Hyperactivity Disorder With Posttraumatic Stress Disorder: A Two-Sample Mendelian Randomization and Population-Based Sibling Comparison Study"
     }
    },
    {
     "titel": "Is Adult ADHD a Childhood-Onset Neurodevelopmental Disorder? Evidence From a Four-Decade Longitudinal Cohort Study",
     "kurz": "Is Adult ADHD a Childhood-Onset Neurodevelopmental Disorder? Evidence From a Four-Decade Longitudinal Cohort Study",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:moffitt-2015-adult-adhd",
      "url": "https://pubmed.ncbi.nlm.nih.gov/25998281/",
      "titelBestand": "Is Adult ADHD a Childhood-Onset Neurodevelopmental Disorder? Evidence From a Four-Decade Longitudinal Cohort Study"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Konzentrationsprobleme können verschiedene Bedingungen haben und gleichzeitig auftreten. Sinnvolle Fragen sind: Seit wann bestehen sie, in welchen Lebensbereichen zeigen sie sich und welche Belastungen verändern sie? Die geprüften NICE-Empfehlungen verlangen eine umfassende Entwicklungsgeschichte; einzelne Skalen genüg"
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1222,
    "textKennung": "verified-section:wave2-attention-development-context",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 2.492,
    "y": 4.187
   }
  }
 },
 "paare": [
  {
   "a": 1012,
   "b": 1018,
   "fugen": [
    {
     "richtung": "Aufgabenstarre → Hyperfokus",
     "vomSchloss": true,
     "art": "spannung",
     "artWort": "Gegenpol",
     "label": "im Original als Gegenpol beschrieben",
     "grund": "dem Originaltyp „Gegenpol“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1616,
      "typ": "gegenteil_am_start",
      "gegen": 1636
     }
    },
    {
     "richtung": "Hyperfokus → Aufgabenstarre",
     "vomSchloss": false,
     "art": "spannung",
     "artWort": "Gegenpol",
     "label": "im Original als Gegenpol beschrieben",
     "grund": "dem Originaltyp „Gegenpol“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1636,
      "typ": "gegenteil_am_start",
      "gegen": 1616
     }
    }
   ],
   "lesarten": [
    {
     "art": "spannung",
     "artWort": "Gegenpol",
     "wort": "Gegenpol",
     "ausBestand": true,
     "auchImSatz": [
      "Nähe, nicht Identität"
     ],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als Gegenpol beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      },
      {
       "woher": "Aufgabenstarre",
       "satz": "Hyperfokus ist oft das Gegenteil am Start — Nähe, nicht Identität.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": [
        "Nähe, nicht Identität"
       ]
      },
      {
       "woher": "Hyperfokus",
       "satz": "Aufgabenstarre ist oft das Gegenteil am Start — Nähe, nicht Identität.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": [
        "Nähe, nicht Identität"
       ]
      }
     ]
    },
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe, nicht Identität",
     "ausBestand": false,
     "auchImSatz": [
      "Gegenteil am Start"
     ],
     "belege": [
      {
       "woher": "Aufgabenstarre",
       "satz": "Hyperfokus ist oft das Gegenteil am Start — Nähe, nicht Identität.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": [
        "Gegenteil am Start"
       ]
      },
      {
       "woher": "Hyperfokus",
       "satz": "Aufgabenstarre ist oft das Gegenteil am Start — Nähe, nicht Identität.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": [
        "Gegenteil am Start"
       ]
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1012,
   "b": 1022,
   "fugen": [
    {
     "richtung": "Aufgabenstarre → Wartemodus",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1612,
      "typ": "benannte_naehe",
      "gegen": 1646
     }
    },
    {
     "richtung": "Wartemodus → Aufgabenstarre",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1646,
      "typ": "benannte_naehe",
      "gegen": 1612
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "zusammenhang",
     "artWort": "Zusammenhang",
     "wort": "könnte zusammenhängen",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Aufgabenstarre",
       "satz": "Könnte zusammenhängen mit Wartemodus (Start wird bis nach dem Termin verschoben) und Body Doubling (Anwesenheit als Anker, Community, ungetestet).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Start wird bis nach dem Termin verschoben",
       "auchImSatz": []
      },
      {
       "woher": "Wartemodus",
       "satz": "Könnte zusammenhängen mit Zeitblindheit (Dauer unklar) und Aufgabenstarre (Start gelingt nicht).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Start gelingt nicht",
       "auchImSatz": []
      }
     ]
    },
    {
     "art": "offen",
     "artWort": "offen",
     "wort": "ob trennbar",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Aufgabenstarre",
       "satz": "Ob Starre, Wartemodus und Prokrastination trennbar sind.",
       "abschnitt": "Offene Fragen",
       "klammer": "",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1012,
   "b": 1013,
   "fugen": [
    {
     "richtung": "Aufgabenstarre → Body Doubling",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1613,
      "typ": "benannte_naehe",
      "gegen": 1617
     }
    },
    {
     "richtung": "Body Doubling → Aufgabenstarre",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1617,
      "typ": "benannte_naehe",
      "gegen": 1613
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "zusammenhang",
     "artWort": "Zusammenhang",
     "wort": "könnte zusammenhängen",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Aufgabenstarre",
       "satz": "Könnte zusammenhängen mit Wartemodus (Start wird bis nach dem Termin verschoben) und Body Doubling (Anwesenheit als Anker, Community, ungetestet).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Anwesenheit als Anker, Community, ungetestet",
       "auchImSatz": []
      },
      {
       "woher": "Body Doubling",
       "satz": "Könnte zusammenhängen mit Aufgabenstarre (Start/Dranbleiben).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Start/Dranbleiben",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1012,
   "b": 1014,
   "fugen": [
    {
     "richtung": "Aufgabenstarre → Delay Aversion",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1614,
      "typ": "nicht_dasselbe",
      "gegen": 1622
     }
    },
    {
     "richtung": "Delay Aversion → Aufgabenstarre",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1622,
      "typ": "nicht_dasselbe",
      "gegen": 1614
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      },
      {
       "woher": "Aufgabenstarre",
       "satz": "Delay Aversion trifft Belohnungsaufschub, nicht notwendig den Start.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": []
      },
      {
       "woher": "Delay Aversion",
       "satz": "Aufgabenstarre trifft den Start, nicht notwendig Belohnungsaufschub.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1012,
   "b": 1023,
   "fugen": [],
   "lesarten": [
    {
     "art": "keine",
     "artWort": "keine",
     "wort": "keine Fuge",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestand",
       "satz": "Im Lesebestand gibt es keine Fuge zwischen beiden Orten."
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1012,
   "b": 300,
   "fugen": [
    {
     "richtung": "Aufgabenstarre → Aufgaben bleiben offen",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "der Originalbezeichnung „muss unterschieden werden von“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Startschwierigkeit und Abschlussproblem sind keine gleichbedeutenden Kriterien und erlauben für sich weder eine ADHS- noch eine andere Diagnose.",
     "detail": "Die Randphänomen-Karte beschreibt den erschwerten Beginn einer beabsichtigten Aufgabe. Der Neuroatlas-Eintrag beschreibt bereits begonnene, aber nicht abgeschlossene Aufgaben. Der Vergleich trennt zwei Momente des Handlungsverlaufs und macht alternative Bedingungen sichtbar.",
     "quellen": [
      {
       "titel": "ADxS-Forum, Mondkatze",
       "kurz": "ADxS-Forum, Mondkatze",
       "art": "Forum",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:d1325eab5cb1",
        "url": "https://adhs-forum.adxs.org/t/adhs-und-zeitblindheit/18778",
        "titelBestand": "ADxS-Forum, Mondkatze"
       }
      },
      {
       "titel": "AWMF-Leitlinie",
       "kurz": "AWMF-Leitlinie",
       "art": "Leitlinie",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:bafe985ae0a3",
        "url": "https://register.awmf.org/de/leitlinien/detail/028-045",
        "titelBestand": "AWMF 028-045 / NLM-Ask"
       }
      },
      {
       "titel": "ADHD: What You Need to Know",
       "kurz": "ADHD: What You Need to Know",
       "art": "Gesundheitsinformation",
       "zitat": "",
       "technisch": {
        "schluessel": "neuro-source:nimh-adhd",
        "url": "https://www.nimh.nih.gov/health/publications/attention-deficit-hyperactivity-disorder-what-you-need-to-know",
        "titelBestand": "ADHD: What You Need to Know"
       }
      },
      {
       "titel": "Obsessive-compulsive personality disorder",
       "kurz": "Obsessive-compulsive personality disorder",
       "art": "Gesundheitsinformation",
       "zitat": "",
       "technisch": {
        "schluessel": "neuro-source:medline-ocpd",
        "url": "https://medlineplus.gov/ency/article/000942.htm",
        "titelBestand": "Obsessive-compulsive personality disorder"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1733,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1012,
   "b": 1017,
   "fugen": [
    {
     "richtung": "Aufgabenstarre → Heritabilität ist kein Schicksal",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1615,
      "typ": "benannte_naehe",
      "gegen": 1634
     }
    },
    {
     "richtung": "Heritabilität ist kein Schicksal → Aufgabenstarre",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1634,
      "typ": "benannte_naehe",
      "gegen": 1615
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      },
      {
       "woher": "Heritabilität ist kein Schicksal",
       "satz": "Benannte Nähe zu Aufgabenstarre/Gerüst: hohe h² macht Intervention nicht sinnlos.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1013,
   "b": 1018,
   "fugen": [
    {
     "richtung": "Body Doubling → Hyperfokus",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1618,
      "typ": "benannte_naehe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1013,
   "b": 1017,
   "fugen": [
    {
     "richtung": "Body Doubling → Heritabilität ist kein Schicksal",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1619,
      "typ": "benannte_naehe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1014,
   "b": 1022,
   "fugen": [
    {
     "richtung": "Delay Aversion → Wartemodus",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1620,
      "typ": "benannte_naehe",
      "gegen": 1647
     }
    },
    {
     "richtung": "Wartemodus → Delay Aversion",
     "vomSchloss": false,
     "art": "uebergang",
     "artWort": "Übergang",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „mögliche Strategie gegen“; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1647,
      "typ": "kann_strategie_sein_gegen",
      "gegen": 1620
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "uebergang",
     "artWort": "Übergang",
     "wort": "Übergang",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge (Gegenrichtung)",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "zusammenhang",
     "artWort": "Zusammenhang",
     "wort": "könnte zusammenhängen",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Delay Aversion",
       "satz": "Könnte zusammenhängen mit Wartemodus (Vermeidung des Wartens durch leeren Vormittag) und Zeitblindheit (Schätzfehler).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Vermeidung des Wartens durch leeren Vormittag",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1014,
   "b": 1023,
   "fugen": [
    {
     "richtung": "Delay Aversion → Zeitblindheit",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1621,
      "typ": "benannte_naehe",
      "gegen": 1650
     }
    },
    {
     "richtung": "Zeitblindheit → Delay Aversion",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1650,
      "typ": "benannte_naehe",
      "gegen": 1621
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "zusammenhang",
     "artWort": "Zusammenhang",
     "wort": "könnte zusammenhängen",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Delay Aversion",
       "satz": "Könnte zusammenhängen mit Wartemodus (Vermeidung des Wartens durch leeren Vormittag) und Zeitblindheit (Schätzfehler).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Schätzfehler",
       "auchImSatz": []
      },
      {
       "woher": "Zeitblindheit",
       "satz": "Könnte zusammenhängen mit Wartemodus (der Termin blockiert den Vormittag) und Delay Aversion (Warten ist schwer).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Warten ist schwer",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1014,
   "b": 1016,
   "fugen": [
    {
     "richtung": "Delay Aversion → Gen–Umwelt-Korrelation (rGE)",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1623,
      "typ": "nicht_dasselbe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1015,
   "b": 1016,
   "fugen": [
    {
     "richtung": "Differential Susceptibility → Gen–Umwelt-Korrelation (rGE)",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1624,
      "typ": "nicht_dasselbe",
      "gegen": 1629
     }
    },
    {
     "richtung": "Gen–Umwelt-Korrelation (rGE) → Differential Susceptibility",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1629,
      "typ": "nicht_dasselbe",
      "gegen": 1624
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      },
      {
       "woher": "Gen–Umwelt-Korrelation (rGE)",
       "satz": "Nicht dasselbe wie extreme Umwelt-Kausalität (ERA/VLBW) und nicht dasselbe wie Differential Susceptibility (Interaktion ≠ Korrelation).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Interaktion ≠ Korrelation",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1015,
   "b": 1017,
   "fugen": [
    {
     "richtung": "Differential Susceptibility → Heritabilität ist kein Schicksal",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1625,
      "typ": "benannte_naehe",
      "gegen": 1633
     }
    },
    {
     "richtung": "Heritabilität ist kein Schicksal → Differential Susceptibility",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1633,
      "typ": "nicht_dasselbe",
      "gegen": 1625
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge (Gegenrichtung)",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1015,
   "b": 1021,
   "fugen": [
    {
     "richtung": "Differential Susceptibility → Extreme frühe Umwelt und ADHD-ähnliche Symptome",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1626,
      "typ": "nicht_dasselbe",
      "gegen": 1644
     }
    },
    {
     "richtung": "Extreme frühe Umwelt und ADHD-ähnliche Symptome → Differential Susceptibility",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1644,
      "typ": "nicht_dasselbe",
      "gegen": 1626
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1016,
   "b": 1017,
   "fugen": [
    {
     "richtung": "Gen–Umwelt-Korrelation (rGE) → Heritabilität ist kein Schicksal",
     "vomSchloss": true,
     "art": "bedingung",
     "artWort": "Bedingung",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „Voraussetzung“; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1627,
      "typ": "voraussetzung",
      "gegen": 1631
     }
    },
    {
     "richtung": "Heritabilität ist kein Schicksal → Gen–Umwelt-Korrelation (rGE)",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1631,
      "typ": "benannte_naehe",
      "gegen": 1627
     }
    }
   ],
   "lesarten": [
    {
     "art": "bedingung",
     "artWort": "Bedingung",
     "wort": "Bedingung",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge (Gegenrichtung)",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1016,
   "b": 1021,
   "fugen": [
    {
     "richtung": "Gen–Umwelt-Korrelation (rGE) → Extreme frühe Umwelt und ADHD-ähnliche Symptome",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1628,
      "typ": "nicht_dasselbe",
      "gegen": 1643
     }
    },
    {
     "richtung": "Extreme frühe Umwelt und ADHD-ähnliche Symptome → Gen–Umwelt-Korrelation (rGE)",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1643,
      "typ": "nicht_dasselbe",
      "gegen": 1628
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1016,
   "b": 1020,
   "fugen": [
    {
     "richtung": "Gen–Umwelt-Korrelation (rGE) → Rejection Sensitive Dysphoria",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1630,
      "typ": "nicht_dasselbe",
      "gegen": 1641
     }
    },
    {
     "richtung": "Rejection Sensitive Dysphoria → Gen–Umwelt-Korrelation (rGE)",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1641,
      "typ": "nicht_dasselbe",
      "gegen": 1630
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1017,
   "b": 1021,
   "fugen": [
    {
     "richtung": "Heritabilität ist kein Schicksal → Extreme frühe Umwelt und ADHD-ähnliche Symptome",
     "vomSchloss": true,
     "art": "widerspruch",
     "artWort": "Widerspruch",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „Gegenbeispiel“; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1632,
      "typ": "gegenbeispiel",
      "gegen": 1642
     }
    },
    {
     "richtung": "Extreme frühe Umwelt und ADHD-ähnliche Symptome → Heritabilität ist kein Schicksal",
     "vomSchloss": false,
     "art": "widerspruch",
     "artWort": "Widerspruch",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „Gegenbeispiel“; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1642,
      "typ": "gegenbeispiel",
      "gegen": 1632
     }
    }
   ],
   "lesarten": [
    {
     "art": "widerspruch",
     "artWort": "Widerspruch",
     "wort": "Widerspruch",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1018,
   "b": 1023,
   "fugen": [
    {
     "richtung": "Hyperfokus → Zeitblindheit",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1635,
      "typ": "benannte_naehe",
      "gegen": 1651
     }
    },
    {
     "richtung": "Zeitblindheit → Hyperfokus",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1651,
      "typ": "benannte_naehe",
      "gegen": 1635
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "zusammenhang",
     "artWort": "Zusammenhang",
     "wort": "könnte zusammenhängen",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Hyperfokus",
       "satz": "Könnte zusammenhängen mit Zeitblindheit (Stunden weg).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Stunden weg",
       "auchImSatz": []
      }
     ]
    },
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "keine Identität",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Zeitblindheit",
       "satz": "Hyperfokus kann Zeit „verschwinden“ lassen — anderes Erleben, keine Identität.",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1018,
   "b": 1017,
   "fugen": [
    {
     "richtung": "Hyperfokus → Heritabilität ist kein Schicksal",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1637,
      "typ": "benannte_naehe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1019,
   "b": 1020,
   "fugen": [
    {
     "richtung": "Reizfilterschwäche → Rejection Sensitive Dysphoria",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „verwechselbar mit“; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1638,
      "typ": "verwechselbar_mit",
      "gegen": 1640
     }
    },
    {
     "richtung": "Rejection Sensitive Dysphoria → Reizfilterschwäche",
     "vomSchloss": false,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „verwechselbar mit“; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1640,
      "typ": "verwechselbar_mit",
      "gegen": 1638
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1019,
   "b": 1021,
   "fugen": [
    {
     "richtung": "Reizfilterschwäche → Extreme frühe Umwelt und ADHD-ähnliche Symptome",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1639,
      "typ": "nicht_dasselbe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1022,
   "b": 1023,
   "fugen": [
    {
     "richtung": "Wartemodus → Zeitblindheit",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1645,
      "typ": "benannte_naehe",
      "gegen": 1649
     }
    },
    {
     "richtung": "Zeitblindheit → Wartemodus",
     "vomSchloss": false,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1649,
      "typ": "benannte_naehe",
      "gegen": 1645
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    },
    {
     "art": "zusammenhang",
     "artWort": "Zusammenhang",
     "wort": "könnte zusammenhängen",
     "ausBestand": false,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Wartemodus",
       "satz": "Könnte zusammenhängen mit Zeitblindheit (Dauer unklar) und Aufgabenstarre (Start gelingt nicht).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "Dauer unklar",
       "auchImSatz": []
      },
      {
       "woher": "Zeitblindheit",
       "satz": "Könnte zusammenhängen mit Wartemodus (der Termin blockiert den Vormittag) und Delay Aversion (Warten ist schwer).",
       "abschnitt": "Verwandt und zu unterscheiden",
       "klammer": "der Termin blockiert den Vormittag",
       "auchImSatz": []
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1022,
   "b": 1017,
   "fugen": [
    {
     "richtung": "Wartemodus → Heritabilität ist kein Schicksal",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "im Original als begrifflich benachbart beschrieben",
     "grund": "dem Originaltyp „benannte Nähe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1648,
      "typ": "benannte_naehe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "im Original als begrifflich benachbart beschrieben",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1023,
   "b": 1021,
   "fugen": [
    {
     "richtung": "Zeitblindheit → Extreme frühe Umwelt und ADHD-ähnliche Symptome",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss unterschieden werden von",
     "grund": "dem Originaltyp „nicht dasselbe“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "proposed",
     "statusWort": "vorgeschlagen",
     "grenze": "",
     "detail": "Vorgeschlagener redaktioneller Bezug; keine identische Ursache oder automatische Diagnose.",
     "quellen": [],
     "herkunft": "Phänomenatlas ernst · vorgeschlagene Karte",
     "technisch": {
      "fugeIndex": 1652,
      "typ": "nicht_dasselbe",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "vorgeschlagen"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1013,
   "b": 1035,
   "fugen": [
    {
     "richtung": "Body Doubling → Unterstützung bleibt ein Angebot",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "stellt Formen freiwilliger Unterstützung gegenüber",
     "grund": "der belegten Originalaussage „stellt Formen freiwilliger Unterstützung gegenüber“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Die Szene prüft keine Body-Doubling-Wirksamkeit. Anekdotische und journalistische Beschreibungen sind keine kontrollierte Behandlungsstudie; Begleitung darf keine Pflicht zur Verfügbarkeit werden.",
     "detail": "Body Doubling beschreibt die Anwesenheit einer anderen Person beim eigenen Arbeiten. Die Beziehungsszene zeigt, dass ein angebotenes gemeinsames Tun auch unpassend sein und abgelehnt werden kann. Beide Einstiege helfen, die gewünschte Rolle der anderen Person konkret und freiwillig zu klären.",
     "quellen": [
      {
       "titel": "Medical News Today, Villines",
       "kurz": "Medical News Today, Villines",
       "art": "Bericht",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:1e91e8390722",
        "url": "https://www.medicalnewstoday.com/articles/body-doubling-adhd",
        "titelBestand": "Medical News Today, Villines"
       }
      },
      {
       "titel": "ICD-11 Portalseite",
       "kurz": "ICD-11 Portalseite",
       "art": "Leitlinie",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:4d8770a762e3",
        "url": "https://icd.who.int/browse/l-mms/en#/http://id.who.int/icd/entity/828975001",
        "titelBestand": "ICD-11 Portalseite / NLM-Ask"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1734,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "aussage",
     "artWort": "Aussage",
     "wort": "Aussage",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "stellt Formen freiwilliger Unterstützung gegenüber",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1016,
   "b": 160,
   "fugen": [
    {
     "richtung": "Gen–Umwelt-Korrelation (rGE) → Gen-Umwelt-Korrelation",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "vertieft denselben Fachbegriff",
     "grund": "der Originalbezeichnung „vertieft denselben Fachbegriff“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Statistische Zusammenhänge rekonstruieren keine persönliche Lebensgeschichte. Evozierende Zusammenhänge begründen weder eine Verantwortung des Kindes für erlittene Behandlung noch eine einzelne gesicherte Entwicklungsursache.",
     "detail": "Die ADHS-Karte trennt passive, aktive und evozierende Gen-Umwelt-Korrelation. Der Fundus erläutert dazu konkrete statistische Befunde und die Grenzen von Trio- und Vermittlungsanalysen. Der Rückweg erweitert einen Begriff um bezeichnete Forschungsdesigns.",
     "quellen": [
      {
       "titel": "Thapar et al. 2013",
       "kurz": "Thapar et al. 2013",
       "art": "Übersicht",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:a0faf51c33f5",
        "url": "https://doi.org/10.1111/j.1469-7610.2012.02611.x",
        "titelBestand": "Thapar et al. 2013"
       }
      },
      {
       "titel": "Østergaard et al. 2020",
       "kurz": "Østergaard et al. 2020",
       "art": "Studie",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:1763b56b73b9",
        "url": "https://doi.org/10.1038/s41398-020-01019-6",
        "titelBestand": "Østergaard et al. 2020"
       }
      },
      {
       "titel": "Youth Polygenic Scores, Youth ADHD Symptoms, and Parenting Dimensions: An Evocative Gene-Environment Correlation Study",
       "kurz": "Youth Polygenic Scores, Youth ADHD Symptoms, and Parenting Dimensions: An Evocative Gene-Environment Correlation Study",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "fundus-source:adhs-evocative-rge-2023",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10560546/",
        "titelBestand": "Youth Polygenic Scores, Youth ADHD Symptoms, and Parenting Dimensions: An Evocative Gene-Environment Correlation Study"
       }
      },
      {
       "titel": "Investigating Direct and Indirect Genetic Effects in Attention-Deficit/Hyperactivity Disorder Using Parent-Offspring Trios",
       "kurz": "Investigating Direct and Indirect Genetic Effects in Attention-Deficit/Hyperactivity Disorder Using Parent-Offspring Trios",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "fundus-source:adhs-trios-direct-indirect-2023",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10369485/",
        "titelBestand": "Investigating Direct and Indirect Genetic Effects in Attention-Deficit/Hyperactivity Disorder Using Parent-Offspring Trios"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1735,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "einordnung",
     "artWort": "Einordnung",
     "wort": "Einordnung",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "vertieft denselben Fachbegriff",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1017,
   "b": 152,
   "fugen": [
    {
     "richtung": "Heritabilität ist kein Schicksal → Erblichkeit in Populationen",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "präzisiert einen Populationsbegriff",
     "grund": "der belegten Originalaussage „präzisiert einen Populationsbegriff“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Heritabilität ist kein genetischer Prozentanteil einer einzelnen Person, kein Maß der Veränderbarkeit und keine individuelle Prognose.",
     "detail": "Beide Einträge behandeln den Unterschied zwischen Heritabilität in einer untersuchten Population und Aussagen über eine einzelne Person. Die Randphänomen-Karte erläutert verbreitete Fehlinterpretationen; der Fundus ergänzt Entwicklungs- und Zwillingsbefunde.",
     "quellen": [
      {
       "titel": "Faraone & Larsson 2019 Mol Psychiatry",
       "kurz": "Faraone & Larsson 2019 Mol Psychiatry",
       "art": "Übersicht",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:ca613bf3efe5",
        "url": "https://doi.org/10.1038/s41380-018-0070-0",
        "titelBestand": "Faraone & Larsson 2019 Mol Psychiatry"
       }
      },
      {
       "titel": "Larsson et al. 2014 Psychol Med",
       "kurz": "Larsson et al. 2014 Psychol Med",
       "art": "Studie",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:c5a276db39cd",
        "url": "https://doi.org/10.1017/S0033291713002493",
        "titelBestand": "Larsson et al. 2014 Psychol Med"
       }
      },
      {
       "titel": "Visscher, Hill & Wray: Heritability in the genomics era — concepts and misconceptions",
       "kurz": "Visscher, Hill & Wray: Heritability in the genomics era — concepts and misconceptions",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "fundus-source:grundlagen-01",
        "url": "https://doi.org/10.1038/nrg2322",
        "titelBestand": "Visscher, Hill & Wray: Heritability in the genomics era — concepts and misconceptions"
       }
      },
      {
       "titel": "Developmental Twin Study of Attention Problems: High Heritabilities Throughout Development",
       "kurz": "Developmental Twin Study of Attention Problems: High Heritabilities Throughout Development",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "fundus-source:adhs-twin-development-2013",
        "url": "https://jamanetwork.com/journals/jamapsychiatry/fullarticle/1555120",
        "titelBestand": "Developmental Twin Study of Attention Problems: High Heritabilities Throughout Development"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1736,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "aussage",
     "artWort": "Aussage",
     "wort": "Aussage",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "präzisiert einen Populationsbegriff",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1018,
   "b": 939,
   "fugen": [
    {
     "richtung": "Hyperfokus → Hyperfokus",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "stellt unterschiedliche Begriffsfassungen gegenüber",
     "grund": "der belegten Originalaussage „stellt unterschiedliche Begriffsfassungen gegenüber“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Der bibliografische Kontakt im Phänomenkatalog ist ausdrücklich kein geprüfter Studienbefund. Die Verbindung belegt weder einen diagnostischen Status noch eine universelle Stärke oder eine einheitliche Ursache.",
     "detail": "Die ADHS-Karte beschreibt anhaltendes Aufgehen in einer Tätigkeit und begrenzte Forschungsabgrenzung. Der Phänomenkatalog führt eine knappe alternative Beschreibung sehr intensiver Bindung an eine Tätigkeit. Beide Fassungen bleiben als unterschiedliche Zugänge zum verwendeten Begriff erkennbar.",
     "quellen": [
      {
       "titel": "ADDitude",
       "kurz": "ADDitude",
       "art": "Klinik",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:22ead006b401",
        "url": "https://www.additudemag.com/understanding-adhd-hyperfocus/",
        "titelBestand": "ADDitude / NLM cited_text 30.08.2026"
       }
      },
      {
       "titel": "Determinants of hyperfocus in the context of escapism and gaming motivations, flow, and ADHD symptoms among adult video gamers.",
       "kurz": "Determinants of hyperfocus in the context of escapism and gaming motivations, flow, and ADHD symptoms among adult video gamers.",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "research-source:source:pmid:42229071",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42229071/",
        "titelBestand": "Determinants of hyperfocus in the context of escapism and gaming motivations, flow, and ADHD symptoms among adult video gamers."
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1737,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "aussage",
     "artWort": "Aussage",
     "wort": "Aussage",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "stellt unterschiedliche Begriffsfassungen gegenüber",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1019,
   "b": 309,
   "fugen": [
    {
     "richtung": "Reizfilterschwäche → Reize überfluten mich",
     "vomSchloss": true,
     "art": "annaeherung",
     "artWort": "Nähe",
     "label": "ähnelt im beschriebenen Erleben",
     "grund": "der Originalbezeichnung „ähnelt im beschriebenen Erleben“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Ähnliches Erleben beweist keine identische Ursache und weder ADHS noch Autismus. Die in der ADHS-Karte beschriebene kleine, überwiegend elternberichtete Studienbasis ist nicht mit einer eindeutigen diagnostischen Zuordnung gleichzusetzen.",
     "detail": "Die ADHS-Randkarte beschreibt Überforderung durch Geräusche, Licht und mehrere gleichzeitige Reize. Der Neuroatlas führt sensorische Überlastung mit einer Autismusperspektive. Der Vergleich erlaubt, Ähnlichkeit des Erlebens und verschiedene Entwicklungs- und Lebenskontexte nebeneinander zu untersuchen.",
     "quellen": [
      {
       "titel": "Ghanizadeh Abstract",
       "kurz": "Ghanizadeh Abstract",
       "art": "Studie",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:52346ef12a5a",
        "url": "https://pubmed.ncbi.nlm.nih.gov/21852983/",
        "titelBestand": "Ghanizadeh Abstract"
       }
      },
      {
       "titel": "Sensory differences",
       "kurz": "Sensory differences",
       "art": "Gesundheitsinformation",
       "zitat": "",
       "technisch": {
        "schluessel": "neuro-source:nhs-sensory",
        "url": "https://www.autismcentral.nhs.uk/guidance/sensory-differences",
        "titelBestand": "Sensory differences"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1738,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "annaeherung",
     "artWort": "Nähe",
     "wort": "Nähe",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "ähnelt im beschriebenen Erleben",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1020,
   "b": 860,
   "fugen": [
    {
     "richtung": "Rejection Sensitive Dysphoria → Zurückweisungssensitivität",
     "vomSchloss": true,
     "art": "abstand",
     "artWort": "Abstand",
     "label": "muss begrifflich unterschieden werden von",
     "grund": "der Originalbezeichnung „muss begrifflich unterschieden werden von“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "RSD ist hier keine eigenständige anerkannte Diagnose. Ein Fragebogen zu Zurückweisungssensitivität validiert nicht automatisch RSD; die Phänomenkarte besitzt nach Umfangsbegrenzung keinen direkten Literaturkontakt.",
     "detail": "Die ADHS-Karte unterscheidet Rejection Sensitive Dysphoria als verbreiteten Ausdruck von etablierteren Konstrukten der Zurückweisungssensitivität und allgemeiner Emotionsdysregulation. Die knappe Phänomenkarte beschreibt Reaktionen auf erwartete oder wahrgenommene Zurückweisung. Der Vergleich hält die unterschiedlichen Begriffsebenen offen.",
     "quellen": [
      {
       "titel": "Cleveland Clinic",
       "kurz": "Cleveland Clinic",
       "art": "Klinik",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:5e174fe7afa7",
        "url": "https://my.clevelandclinic.org/health/diseases/24099-rejection-sensitive-dysphoria-rsd",
        "titelBestand": "Cleveland Clinic"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1739,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "abstand",
     "artWort": "Abstand",
     "wort": "Abstand",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "muss begrifflich unterschieden werden von",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1023,
   "b": 816,
   "fugen": [
    {
     "richtung": "Zeitblindheit → Zeitblindheits-Bericht",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "ordnet einen Alltagsbegriff ein",
     "grund": "der belegten Originalaussage „ordnet einen Alltagsbegriff ein“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Alltagserfahrungen und Laboraufgaben sind keine identischen Messgrößen. Der bibliografische Kontakt der Phänomenkarte ist kein geprüfter Studienbefund; aus dem Begriff folgt keine persönliche Diagnose.",
     "detail": "Die ADHS-Karte trennt Erfahrungen mit Zeitgefühl, Zukunft und rechtzeitigem Beginn von eng operationalisierten Aufgaben zur Zeitverarbeitung. Die Phänomenkarte bewahrt Zeitblindheit als Community- und Fachbegriff. Beide Einstiege führen zu einer präziseren Frage danach, welcher Aspekt von Zeit gerade gemeint ist.",
     "quellen": [
      {
       "titel": "Noreika et al. 2013",
       "kurz": "Noreika et al. 2013",
       "art": "Studie",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:cfb32f094c24",
        "url": "https://pubmed.ncbi.nlm.nih.gov/23022430/",
        "titelBestand": "Noreika et al. 2013"
       }
      },
      {
       "titel": "The Time We See: ADHD, Neuroqueer Temporality, and Graphic Medicine.",
       "kurz": "The Time We See: ADHD, Neuroqueer Temporality, and Graphic Medicine.",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "research-source:source:pmid:40059708",
        "url": "https://pubmed.ncbi.nlm.nih.gov/40059708/",
        "titelBestand": "The Time We See: ADHD, Neuroqueer Temporality, and Graphic Medicine."
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1740,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "aussage",
     "artWort": "Aussage",
     "wort": "Aussage",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "ordnet einen Alltagsbegriff ein",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1018,
   "b": 1222,
   "fugen": [
    {
     "richtung": "Aufmerksamkeit braucht einen Verlauf → Hyperfokus",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "grenzt ein Phänomen von einer Ursachenzuweisung ab",
     "grund": "der belegten Originalaussage „grenzt ein Phänomen von einer Ursachenzuweisung ab“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke zwischen den benannten Texten; keine zusätzliche Studie und kein Beleg einer kausalen Wirkung. Quellen und Lesegrade gelten jeweils für ihren Endpunkt.",
     "detail": "Die vorhandene vorgeschlagene Karte beschreibt Hyperfokus und offene Begriffsfragen. Der neue Abschnitt erläutert, warum ein solches Phänomen keine eigenständige Entscheidung zwischen ADHS und Trauma erlaubt. Der Vorschlagsstatus und die historischen Quellen der Karte bleiben sichtbar.",
     "quellen": [
      {
       "titel": "Attention deficit hyperactivity disorder: diagnosis and management — selected diagnostic recommendations",
       "kurz": "Attention deficit hyperactivity disorder: diagnosis and management — selected diagnostic recommendations",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:nice-ng87-diagnosis-selected",
        "url": "https://www.nice.org.uk/guidance/ng87/chapter/recommendations",
        "titelBestand": "Attention deficit hyperactivity disorder: diagnosis and management — selected diagnostic recommendations"
       }
      },
      {
       "titel": "The Relationship of Attention-Deficit/Hyperactivity Disorder With Posttraumatic Stress Disorder: A Two-Sample Mendelian Randomization and Population-Based Sibling Comparison Study",
       "kurz": "The Relationship of Attention-Deficit/Hyperactivity Disorder With Posttraumatic Stress Disorder: A Two-Sample Mendelian Randomization and Population-Based Sibling Comparison Study",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:wendt-2023-adhd-ptsd",
        "url": "https://pubmed.ncbi.nlm.nih.gov/36335070/",
        "titelBestand": "The Relationship of Attention-Deficit/Hyperactivity Disorder With Posttraumatic Stress Disorder: A Two-Sample Mendelian Randomization and Population-Based Sibling Comparison Study"
       }
      },
      {
       "titel": "Is Adult ADHD a Childhood-Onset Neurodevelopmental Disorder? Evidence From a Four-Decade Longitudinal Cohort Study",
       "kurz": "Is Adult ADHD a Childhood-Onset Neurodevelopmental Disorder? Evidence From a Four-Decade Longitudinal Cohort Study",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:moffitt-2015-adult-adhd",
        "url": "https://pubmed.ncbi.nlm.nih.gov/25998281/",
        "titelBestand": "Is Adult ADHD a Childhood-Onset Neurodevelopmental Disorder? Evidence From a Four-Decade Longitudinal Cohort Study"
       }
      },
      {
       "titel": "ADDitude",
       "kurz": "ADDitude",
       "art": "Klinik",
       "zitat": "",
       "technisch": {
        "schluessel": "adhs-source:22ead006b401",
        "url": "https://www.additudemag.com/understanding-adhd-hyperfocus/",
        "titelBestand": "ADDitude / NLM cited_text 30.08.2026"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke · Prüfgruppe D",
     "technisch": {
      "fugeIndex": 1824,
      "typ": "",
      "gegen": null
     }
    }
   ],
   "lesarten": [
    {
     "art": "aussage",
     "artWort": "Aussage",
     "wort": "Aussage",
     "ausBestand": true,
     "auchImSatz": [],
     "belege": [
      {
       "woher": "Bestandsfuge",
       "satz": "grenzt ein Phänomen von einer Ursachenzuweisung ab",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  }
 ],
 "bunde": {
  "1012": [
   0,
   1,
   2,
   3,
   4,
   5,
   6
  ],
  "1013": [
   8,
   7,
   26
  ],
  "1014": [
   11,
   9,
   10
  ],
  "1015": [
   14,
   12,
   13
  ],
  "1016": [
   16,
   27,
   15,
   17
  ],
  "1017": [
   28,
   18
  ],
  "1018": [
   33,
   20,
   29,
   19
  ],
  "1019": [
   22,
   30,
   21
  ],
  "1020": [
   31
  ],
  "1022": [
   24,
   23
  ],
  "1023": [
   25,
   32
  ]
 },
 "feld": {
  "orte": [
   1012,
   1013,
   1014,
   1015,
   1016,
   1017,
   1018,
   1019,
   1020,
   1021,
   1022,
   1023,
   300,
   1222,
   152,
   160,
   939,
   309,
   1035,
   816,
   860
  ],
  "paare": [
   1,
   2,
   3,
   6,
   0,
   7,
   8,
   9,
   10,
   11,
   12,
   13,
   14,
   15,
   16,
   17,
   18,
   19,
   20,
   21,
   22,
   23,
   24,
   25,
   5,
   26,
   27,
   28,
   29,
   30,
   31,
   32,
   33
  ],
  "gebiete": [
   {
    "name": "ADHS · Randphänomene",
    "mitte": {
     "x": 0,
     "y": 0
    },
    "radius": 3.372,
    "heim": true
   },
   {
    "name": "Neuroatlas",
    "mitte": {
     "x": 0.347,
     "y": 5.413
    },
    "radius": 1.152,
    "heim": false
   },
   {
    "name": "Forschung & Einordnung",
    "mitte": {
     "x": 2.492,
     "y": 4.187
    },
    "radius": 0.6,
    "heim": false
   },
   {
    "name": "Phänomenatlas",
    "mitte": {
     "x": 5.832,
     "y": 2.838
    },
    "radius": 2.214,
    "heim": false
   },
   {
    "name": "Beziehungen & Borderline",
    "mitte": {
     "x": 4.82,
     "y": -0.712
    },
    "radius": 0.6,
    "heim": false
   }
  ],
  "regel": {
   "text": "Das Feld zeigt alle Orte im Gebiet „ADHS · Randphänomene“, zu dem Aufgabenstarre gehört, dazu jeden Ort, der mit einem von ihnen durch eine Fuge im Lesebestand verbunden ist, und diese Fugen.",
   "begrenzung": "Begrenzt wird erst bei sehr großen Feldern; hier fehlt nichts.",
   "lage": "Innerhalb eines Gebiets folgt die Lage der Karte, gleichmäßig gestreckt (andere Gebiete enger) und so weit auseinandergeschoben, dass sich Zeichen nicht berühren. Andere Gebiete stehen in der Richtung, in der sie auf der Karte liegen, aber näher herangerückt."
  },
  "technisch": {
   "heimGebiet": 5,
   "orteGesamt": 21,
   "nachbarnGesamt": 9,
   "fugenGesamt": 50,
   "paareGesamt": 33,
   "begrenzt": false,
   "feldMax": 160
  }
 },
 "fehlstellen": [
  {
   "orte": [
    816,
    939
   ],
   "gebiet": "Phänomenatlas",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "wird im Forschungskontext untersucht mit",
   "gegenueber": {
    "titel": "ADHS / attention-deficit/hyperactivity disorder",
    "gebiet": "Phänomenatlas",
    "technisch": {
     "ortIndex": 1009
    }
   },
   "detail": "Titel/Abstract wurden geprüft. Der Record zeigt Forschungskontakt, nicht Prävalenz, Ursache, individuelle Diagnose oder allgemeine Geltung.",
   "technisch": {
    "gegen": 1009
   }
  },
  {
   "orte": [
    160
   ],
   "gebiet": "Phänomenatlas",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Systemische Therapie",
    "gebiet": "Phänomenatlas",
    "technisch": {
     "ortIndex": 206
    }
   },
   "detail": "Welche Reaktion folgt auf welches Verhalten, und welche Unterstützung verändert die konkrete Wechselwirkung? Bezug zur Forschung: Die untersuchte Verbindung von polygenem ADHS-Risiko, kindlichen Symptomen und Erziehungsdimensionen ist mit einer Reaktion des Umfelds auf kindliche Eigenschaften vereinbar.",
   "technisch": {
    "gegen": 206
   }
  },
  {
   "orte": [
    160
   ],
   "gebiet": "Phänomenatlas",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Systemische Therapie",
    "gebiet": "TraumaAtlas",
    "technisch": {
     "ortIndex": 13
    }
   },
   "detail": "Welche Reaktion folgt auf welches Verhalten, und welche Unterstützung verändert die konkrete Wechselwirkung? Bezug zur Forschung: Die untersuchte Verbindung von polygenem ADHS-Risiko, kindlichen Symptomen und Erziehungsdimensionen ist mit einer Reaktion des Umfelds auf kindliche Eigenschaften vereinbar.",
   "technisch": {
    "gegen": 13
   }
  }
 ]
};
