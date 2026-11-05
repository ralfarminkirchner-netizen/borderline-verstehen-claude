// Erzeugt von baue-daten.mjs am 2026-11-05T10:43:41.747Z – nicht von Hand ändern.
// Quelle: Lesebestand ../../data-readonly/karte.json und ../../data-readonly/texte.json (nur lesend).
window.SCHLOSS_DATEN = {
 "format": "schloss-schluessel-probe",
 "version": 5,
 "herkunft": {
  "erzeugt": "2026-11-05T10:43:41.747Z",
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
 "schloss": 1031,
 "orte": {
  "219": {
   "titel": "Unterstützung und versteckte Kosten",
   "gebiet": "Phänomenatlas",
   "ortsart": "Begriff",
   "kurz": "Vorhandenes Forschungsthema als Bezugspunkt. Sein Name bezeichnet keine bestätigte Diagnose oder Ursache.",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Welche Beobachtung ist nötig, und wie viel zusätzliche Organisationsarbeit erzeugt ihre Erhebung? Bezug zur Forschung: Häufigere Befragungen erhöhten in einem Experiment die empfundene Last, ohne die Teilnahmequote entsprechend zu verändern. Eine längere Befragung zeigte ein anderes Wirkungsprofil.: Dieser Anschluss eröffnet einen Vergleich; er validiert keine Behandlung und keine Entstehungsursache des vorhandenen Begriffs. Studierende sind keine klinische ADHS- oder Autismus-Stichprobe. Mehr Fragen sind nicht stets schädlicher. Teilnahme, Belastung und Aussagekraft müssen getrennt geprüft werden. Forschungsbezug auf den genannten Befund; vorhandener Begriff aus der Zeitblind-Forschung Konzeptioneller Anschluss nach Befundstand vom 27. Oktober 2026"
    }
   ],
   "quellen": [
    {
     "titel": "The effects of assessment intensity on participant burden, compliance, within-person variance, and within-person relationships in ambulatory assessment",
     "kurz": "The effects of assessment intensity on participant burden, compliance, within-person variance, and within-person relationships in ambulatory assessment",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "fundus-source:anschluss-ema-2022",
      "url": "https://link.springer.com/article/10.3758/s13428-021-01683-6",
      "titelBestand": "The effects of assessment intensity on participant burden, compliance, within-person variance, and within-person relationships in ambulatory assessment"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Vorhandenes Forschungsthema als Bezugspunkt. Sein Name bezeichnet keine bestätigte Diagnose oder Ursache."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Neurodiversität: Gene, Umwelt und Entwicklung",
   "technisch": {
    "ortIndex": 219,
    "textKennung": "fundus:bezug-unterstutzung-und-versteckte-kosten",
    "herkunftPfad": "atlas-source/wissensfundus/neurodiversitaet-genetik-umwelt-20261027"
   },
   "feld": {
    "x": 8.005,
    "y": 3.94
   }
  },
  "274": {
   "titel": "Dissoziative Störungsbilder",
   "gebiet": "Neuroatlas",
   "ortsart": "Kontext",
   "kurz": "Unterschiedliche Formen von Entfremdung, Erinnerungslücken und Diskontinuität des Selbsterlebens. Einzelne Erlebnisse bestimmen keine Unterform.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Dissociative disorders",
     "kurz": "Dissociative disorders",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nhs-dissociation",
      "url": "https://www.nhs.uk/mental-health/conditions/dissociative-disorders/",
      "titelBestand": "Dissociative disorders"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Unterschiedliche Formen von Entfremdung, Erinnerungslücken und Diskontinuität des Selbsterlebens. Einzelne Erlebnisse bestimmen keine Unterform."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Neuroatlas · Atlas des Erlebens",
   "technisch": {
    "ortIndex": 274,
    "textKennung": "context:dissociation",
    "herkunftPfad": "packages/atlas/src/catalog.ts"
   },
   "feld": {
    "x": 1.132,
    "y": 9.416
   }
  },
  "339": {
   "titel": "Scham oder Schuld",
   "gebiet": "Neuroatlas",
   "ortsart": "Phänomen",
   "kurz": "Beschämung oder Selbstvorwürfe belasten.",
   "mehr": [
    {
     "titel": "Im Eintrag",
     "text": "Posttraumatische Belastungsstörung: Anhaltende Scham oder Selbstbeschuldigung. Nur im berichteten Traumabezug einordnen; Dauer und Beeinträchtigung sind entscheidend. Komplexe posttraumatische Belastungsstörung: Traumabezogene tiefe Scham oder Schuld. Die ICD-11-Einordnung setzt PTBS voraus; diese zusätzlichen Merkmale allein ergeben keine komplexe PTBS. Depressive Störungsbilder: Belastende Schuldgefühle. Veränderung, Dauer und Beeinträchtigung beachten; körperliche und andere Erklärungen bleiben offen. Anorexie, Bulimie & Binge-Eating: Schuld oder Scham nach Essanfällen. Die Unterformen haben unterschiedliche Bedingungen; Essverhalten und körperlichen Zustand gemeinsam einordnen."
    }
   ],
   "quellen": [
    {
     "titel": "Post-Traumatic Stress Disorder",
     "kurz": "Post-Traumatic Stress Disorder",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nimh-ptsd",
      "url": "https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd",
      "titelBestand": "Post-Traumatic Stress Disorder"
     }
    },
    {
     "titel": "Post-traumatic stress disorder · NG116",
     "kurz": "Post-traumatic stress disorder · NG116",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nice-ptsd",
      "url": "https://www.nice.org.uk/guidance/ng116/chapter/recommendations",
      "titelBestand": "Post-traumatic stress disorder · NG116"
     }
    },
    {
     "titel": "Depression",
     "kurz": "Depression",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nimh-depression",
      "url": "https://www.nimh.nih.gov/health/publications/depression",
      "titelBestand": "Depression"
     }
    },
    {
     "titel": "Eating Disorders: What You Need to Know",
     "kurz": "Eating Disorders: What You Need to Know",
     "art": "Gesundheitsinformation",
     "zitat": "",
     "technisch": {
      "schluessel": "neuro-source:nimh-eating",
      "url": "https://www.nimh.nih.gov/health/publications/eating-disorders",
      "titelBestand": "Eating Disorders: What You Need to Know"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Beschämung oder Selbstvorwürfe belasten."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Neuroatlas · Atlas des Erlebens",
   "technisch": {
    "ortIndex": 339,
    "textKennung": "neuro:shame-guilt",
    "herkunftPfad": "packages/atlas/src/catalog.ts"
   },
   "feld": {
    "x": 0.031,
    "y": 9.496
   }
  },
  "560": {
   "titel": "Beobachtung und Deutung",
   "gebiet": "Beziehungswerkstatt",
   "ortsart": "Perspektive",
   "kurz": "Eine Episode hat einen Wortlaut, einen Zeitpunkt und einen Zusammenhang. Deine Interpretation ist eine eigene, veränderbare Ebene. Beides darf nebeneinander sichtbar bleiben.",
   "mehr": [],
   "quellen": [
    {
     "titel": "National Center for PTSD · Kommunikation in Familien",
     "kurz": "National Center for PTSD · Kommunikation in Familien",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "relationship-source:va",
      "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
      "titelBestand": "National Center for PTSD · Kommunikation in Familien"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Eine Episode hat einen Wortlaut, einen Zeitpunkt und einen Zusammenhang. Deine Interpretation ist eine eigene, veränderbare Ebene. Beides darf nebeneinander sichtbar bleiben."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Beziehungswerkstatt",
   "technisch": {
    "ortIndex": 560,
    "textKennung": "relationship:beobachtung",
    "herkunftPfad": "dist/relationship-model.mjs"
   },
   "feld": {
    "x": -3.849,
    "y": 9.969
   }
  },
  "561": {
   "titel": "Nähe, Freiheit und Grenzen",
   "gebiet": "Beziehungswerkstatt",
   "ortsart": "Perspektive",
   "kurz": "Nähe kann gewünscht und gleichzeitig als Druck erlebt werden. Bindungstheorie ist ein Zugang zu Beziehungserfahrungen; eine einzelne Reaktion begründet keinen festen Bindungstyp.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Traumainformierte Praxis · Sicherheit und Wahlmöglichkeiten",
     "kurz": "Traumainformierte Praxis · Sicherheit und Wahlmöglichkeiten",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "relationship-source:gov",
      "url": "https://www.gov.uk/government/publications/working-definition-of-trauma-informed-practice/working-definition-of-trauma-informed-practice",
      "titelBestand": "Traumainformierte Praxis · Sicherheit und Wahlmöglichkeiten"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Nähe kann gewünscht und gleichzeitig als Druck erlebt werden. Bindungstheorie ist ein Zugang zu Beziehungserfahrungen; eine einzelne Reaktion begründet keinen festen Bindungstyp."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "wenn jemand gerade Abstand braucht?",
     "satz": "Bleibt die Beziehung freiwillig, auch wenn jemand gerade Abstand braucht?",
     "abschnitt": "Weiterfragen"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Beziehungswerkstatt",
   "technisch": {
    "ortIndex": 561,
    "textKennung": "relationship:autonomie",
    "herkunftPfad": "dist/relationship-model.mjs"
   },
   "feld": {
    "x": -3.329,
    "y": 9.001
   }
  },
  "562": {
   "titel": "Anspannung und Handlungsspielraum",
   "gebiet": "Beziehungswerkstatt",
   "ortsart": "Perspektive",
   "kurz": "Unter hoher Anspannung kann eine Pause helfen, die nächste Handlung bewusster zu wählen. Unterstützung darf angeboten werden; die andere Person muss sie nicht annehmen.",
   "mehr": [],
   "quellen": [
    {
     "titel": "National Center for PTSD · Kommunikation in Familien",
     "kurz": "National Center for PTSD · Kommunikation in Familien",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "relationship-source:va",
      "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
      "titelBestand": "National Center for PTSD · Kommunikation in Familien"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Unter hoher Anspannung kann eine Pause helfen, die nächste Handlung bewusster zu wählen. Unterstützung darf angeboten werden; die andere Person muss sie nicht annehmen."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "bei dir",
     "satz": "Woran merkst du Anspannung bei dir, und welche Pause kannst du selbst gestalten?",
     "abschnitt": "Weiterfragen"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Beziehungswerkstatt",
   "technisch": {
    "ortIndex": 562,
    "textKennung": "relationship:regulation",
    "herkunftPfad": "dist/relationship-model.mjs"
   },
   "feld": {
    "x": -4.226,
    "y": 8.366
   }
  },
  "563": {
   "titel": "Erleben anerkennen",
   "gebiet": "Beziehungswerkstatt",
   "ortsart": "Perspektive",
   "kurz": "Du kannst anerkennen, dass eine Erfahrung schmerzt, und deine Sicht auf die Tatsachen offenhalten. Anerkennung verpflichtet weder zur Zustimmung noch zur Aufgabe eigener Grenzen.",
   "mehr": [],
   "quellen": [
    {
     "titel": "National Center for PTSD · Kommunikation in Familien",
     "kurz": "National Center for PTSD · Kommunikation in Familien",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "relationship-source:va",
      "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
      "titelBestand": "National Center for PTSD · Kommunikation in Familien"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Du kannst anerkennen, dass eine Erfahrung schmerzt, und deine Sicht auf die Tatsachen offenhalten. Anerkennung verpflichtet weder zur Zustimmung noch zur Aufgabe eigener Grenzen."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Beziehungswerkstatt",
   "technisch": {
    "ortIndex": 563,
    "textKennung": "relationship:validierung",
    "herkunftPfad": "dist/relationship-model.mjs"
   },
   "feld": {
    "x": -4.222,
    "y": 11.847
   }
  },
  "565": {
   "titel": "Mehr als eine mögliche Innenwelt",
   "gebiet": "Beziehungswerkstatt",
   "ortsart": "Perspektive",
   "kurz": "Du kennst dein Erleben unmittelbar. Was jemand anderes denkt oder beabsichtigt, bleibt ohne dessen Auskunft eine Hypothese. Auch eine plausible Erklärung kann falsch sein.",
   "mehr": [],
   "quellen": [
    {
     "titel": "National Center for PTSD · Kommunikation in Familien",
     "kurz": "National Center for PTSD · Kommunikation in Familien",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "relationship-source:va",
      "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
      "titelBestand": "National Center for PTSD · Kommunikation in Familien"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Du kennst dein Erleben unmittelbar. Was jemand anderes denkt oder beabsichtigt, bleibt ohne dessen Auskunft eine Hypothese. Auch eine plausible Erklärung kann falsch sein."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Phänomenatlas · Beziehungswerkstatt",
   "technisch": {
    "ortIndex": 565,
    "textKennung": "relationship:mentalisieren",
    "herkunftPfad": "dist/relationship-model.mjs"
   },
   "feld": {
    "x": -4.589,
    "y": 10.794
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
    "x": -8.837,
    "y": -1.231
   }
  },
  "1025": {
   "titel": "Gefühle überrollen mich",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Das Gefühl ist schon sehr groß, bevor ein nächster Schritt klar wird. Erleben, Handlungsdruck und tatsächliche Handlung lassen sich getrennt betrachten.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
     "kurz": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "cochrane-2020",
      "url": "https://www.cochrane.org/evidence/CD012955_psychological-therapies-people-borderline-personality-disorder",
      "titelBestand": "Psychologische Therapien bei Borderline · Cochrane-Übersicht"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Eine Verabredung wird kurzfristig abgesagt. Mira spürt Druck im Brustkorb und tippt sofort eine lange Nachricht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die Nachricht zunächst als eigenen Entwurf behalten. Einen bereits vertrauten, sicheren Schritt zur Pause nutzen und erst später über den Kontakt entscheiden. Was fühle ich, was möchte ich gerade tun, und welchen Teil davon will ich tatsächlich ausführen?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1025,
    "textKennung": "relationship-original:gefuehlswelle",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -1.056,
    "y": -1.953
   }
  },
  "1026": {
   "titel": "Wut wird laut",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Ärger kann auf eine Verletzung hinweisen. Was jemand im Ärger tut, bleibt eine eigene Frage von Verantwortung und Schutz.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einer spöttischen Bemerkung erhebt Jan die Stimme und schlägt eine Tür zu. Die andere Person erschrickt."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die einschüchternde Handlung unterbrechen. Später den eigenen Anteil konkret benennen und die ursprüngliche Verletzung gesondert besprechen, soweit Kontakt möglich ist. Welches Verhalten muss jetzt aufhören, und welches Anliegen bleibt danach zu klären?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1026,
    "textKennung": "relationship-original:wut",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -0.352,
    "y": -4.785
   }
  },
  "1027": {
   "titel": "Innen fühlt es sich leer an",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Leere ist ein beschreibbares Erleben und keine vollständige Erklärung. Es verdient Aufmerksamkeit, ohne es aus einer einzelnen Situation zu etikettieren.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einem intensiven Wochenende sagt Alex: „Jetzt ist alles weg. Ich weiß gar nicht, was ich will.“"
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "In eigenen Worten genauer beschreiben: leer, taub, erschöpft, orientierungslos? Bei anhaltender oder stark belastender Erfahrung passende fachliche Unterstützung suchen. Was fehlt gerade am ehesten: Gefühl, Verbindung, Orientierung, Kraft oder etwas anderes?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei anhaltender oder stark belastender Erfahrung passende fachliche Unterstützung suchen",
     "satz": "Bei anhaltender oder stark belastender Erfahrung passende fachliche Unterstützung suchen.",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1027,
    "textKennung": "relationship-original:leere",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 2.811,
    "y": 3.058
   }
  },
  "1028": {
   "titel": "Rückzug hat mehrere mögliche Bedeutungen",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Wenig sprechen oder weggehen kann verschiedenes bedeuten. Der ähnliche äußere Eindruck ersetzt die Auskunft der Person und den Verlauf nicht.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Bei einem Gespräch verstummt Lou, schaut auf den Boden und verlässt den Raum."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Eine ausdrücklich gewünschte Pause respektieren. Wenn Kontakt möglich ist, später offen nach Erleben und hilfreichen Bedingungen fragen; keine Erklärung erzwingen. Was weiß ich aus Lous eigener Auskunft, und was ergänze ich nur?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei einem Gespräch verstummt Lou",
     "satz": "Bei einem Gespräch verstummt Lou, schaut auf den Boden und verlässt den Raum.",
     "abschnitt": "Im Alltag"
    },
    {
     "klausel": "Wenn Kontakt möglich ist",
     "satz": "Wenn Kontakt möglich ist, später offen nach Erleben und hilfreichen Bedingungen fragen; keine Erklärung erzwingen.",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1028,
    "textKennung": "relationship-original:rueckzug",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 0.855,
    "y": 0.311
   }
  },
  "1029": {
   "titel": "Mir selbst oder der Welt fremd",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "„Ich stehe neben mir“ und „alles wirkt unwirklich“ beschreiben Erleben. Sie bestimmen für sich genommen weder Ursache noch eine bestimmte Diagnose.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einer angespannten Begegnung sagt Kim, der Raum habe weit entfernt gewirkt und die eigene Stimme fremd."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Beschreiben, wann es anfängt und aufhört, ohne eine verborgene Geschichte zu suchen. Bei neuem, wiederkehrendem oder beunruhigendem Erleben fachlich abklären lassen. Was war anders an mir, an der Umgebung oder an meiner Erinnerung — und was ist mir sicher bekannt?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei neuem",
     "satz": "Bei neuem, wiederkehrendem oder beunruhigendem Erleben fachlich abklären lassen.",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1029,
    "textKennung": "relationship-original:entfremdung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -0.212,
    "y": 4.436
   }
  },
  "1030": {
   "titel": "Eine Antwort bleibt aus",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Eine offene Nachricht kann viel Bedeutung bekommen. Zeitablauf, eigener Wunsch und unbekannte Gründe des Gegenübers bleiben verschiedene Ebenen.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Seit gestern ist eine Nachricht unbeantwortet. Deniz schaut immer wieder aufs Telefon und möchte nachlegen."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Kontaktvereinbarungen prüfen. Die nächste Nachricht nicht allein zur sofortigen Beruhigung benutzen; den eigenen Unterstützungsbedarf zunächst unabhängig versorgen. Welche Information fehlt mir, und welche Gewissheit versuche ich durch eine weitere Nachricht zu bekommen?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1030,
    "textKennung": "relationship-original:antwort-aus",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -0.135,
    "y": -3.323
   }
  },
  "1031": {
   "titel": "Die Angst vor Verlust ist groß",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Die Angst ist als Erleben ernst zu nehmen. Sie beweist nicht, dass eine Trennung bevorsteht, und verpflichtet das Gegenüber nicht zu unbegrenzter Rückversicherung.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Beim Abschied sagt Pat: „Wenn du gehst, bin ich dir wohl nicht wichtig.“ Dabei ist nur ein Abend allein geplant."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Den Wunsch ohne Loyalitätsprüfung formulieren: „Abschiede fallen mir heute schwer. Ich kümmere mich um meinen Abend; was wir vereinbart haben, bleibt bestehen.“ Kann ich meine Angst zeigen und zugleich die Freiheit der anderen Person bestehen lassen?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1031,
    "textKennung": "relationship-original:verlustangst",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 2.691,
    "y": -1.958
   }
  },
  "1032": {
   "titel": "Wenn Nähe zur Verpflichtung wird",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Verbundenheit kann gewünscht sein und trotzdem Druck erzeugen. Entscheidend ist, ob eine andere Antwort oder ein Nein praktisch möglich bleibt.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "„Nach allem, was ich für dich getan habe, kannst du wenigstens vorbeikommen.“ Die angesprochene Person hatte abgesagt."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Konkrete Vereinbarung, eigenen Wunsch und Beziehung voneinander trennen. Einen Besuch nicht als Beweis von Liebe oder Dankbarkeit verlangen. Welche freie Entscheidung bleibt der anderen Person, ohne dafür abgewertet zu werden?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1032,
    "textKennung": "relationship-original:naehe-druck",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -1.14,
    "y": 0.038
   }
  },
  "1033": {
   "titel": "Abstand wünschen",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Ein Wunsch nach Abstand kann konkret gelten, ohne die ganze Beziehung zu erklären. Weder eine Diagnosevermutung noch ein eigener Kontaktwunsch hebt ihn auf.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Robin sagt: „Diese Woche möchte ich keine Nachrichten. Ich melde mich selbst.“ Sam möchte sofort fragen, ob noch Hoffnung besteht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die benannte Pause gelten lassen und einen Entwurf für die eigene Reflexion behalten. Unterstützung an anderer erreichbarer Stelle organisieren. Wie kann ich die offene Frage aushalten, ohne die gerade klare Grenze wieder zu öffnen?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1033,
    "textKennung": "relationship-original:abstand",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -2.864,
    "y": -2.288
   }
  },
  "1034": {
   "titel": "Auch meine Grenze gilt",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Anteilnahme und begrenzte Verfügbarkeit können zusammengehören. Anerkennung eines Bedürfnisses verlangt keine Aufgabe der eigenen Entscheidung.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Family Connections · Unterstützung für Angehörige",
     "kurz": "Family Connections · Unterstützung für Angehörige",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "family-2024",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11659101/",
      "titelBestand": "Family Connections · Unterstützung für Angehörige"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Ein Freund möchte, dass Toni nachts immer erreichbar ist. Toni braucht Schlaf und möchte trotzdem unterstützen."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Eine tragbare Zusage machen, etwa zu einem vereinbarten Gespräch. Nicht mehr anbieten, als tatsächlich gehalten werden kann; ergänzende fachliche Unterstützung gemeinsam erwägen. Welche Unterstützung ist verlässlich möglich, ohne dass sie meine eigene Versorgung aufzehrt?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1034,
    "textKennung": "relationship-original:eigene-grenze",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 3.456,
    "y": 1.715
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
    "x": 4.303,
    "y": 0.409
   }
  },
  "1036": {
   "titel": "Eine Rückmeldung trifft sehr tief",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Eine Bemerkung kann sich wie ein Urteil über den ganzen Menschen anfühlen. Die konkrete Rückmeldung und ihre Bedeutung für das Selbstbild lassen sich auseinanderhalten.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Eine Kollegin sagt: „Die Datei war zu spät fertig.“ Fin hört darin: „Auf dich ist kein Verlass.“"
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die konkrete Sache klären und die Wirkung gesondert benennen. Bei globaler Abwertung darf eine Grenze gesetzt werden, statt sich vollständig zu erklären. Was wurde tatsächlich kritisiert, und welchen zusätzlichen Satz über mich höre ich mit?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei globaler Abwertung darf eine Grenze gesetzt werden",
     "satz": "Bei globaler Abwertung darf eine Grenze gesetzt werden, statt sich vollständig zu erklären.",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1036,
    "textKennung": "relationship-original:kritik",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -2.865,
    "y": 0.424
   }
  },
  "1037": {
   "titel": "Vom Fehler zum ganzen Selbst",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Eine konkrete Verantwortung kann untersucht werden, ohne daraus ein umfassendes Werturteil über die eigene Person zu machen.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einem scharfen Satz denkt Iman: „Ich mache alles kaputt. Mit mir kann niemand sein.“"
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Eine konkrete Handlung und deren Wirkung benennen. Einen nächsten veränderbaren Schritt wählen; zusätzliche Unterstützung für die eigene Scham suchen. Was muss ich verantworten, und welches pauschale Urteil über meinen Wert füge ich hinzu?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1037,
    "textKennung": "relationship-original:scham-schuld",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -1.476,
    "y": 3.628
   }
  },
  "1038": {
   "titel": "Mein Bild von mir wechselt",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Wie jemand sich erlebt, kann über Situationen und Beziehungen wechseln. Die eigene Beschreibung ist ein Anfang; ein einzelner Wechsel erklärt noch kein längerfristiges Muster.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einem guten Treffen fühlt Jule sich liebenswert und sicher. Nach einer unbeantworteten Einladung erscheint dieselbe Person sich plötzlich unerwünscht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die verschiedenen Selbstbeschreibungen nebeneinander halten. Nach eigenen Werten, Interessen und tragenden Erfahrungen fragen, die in beiden Situationen zugänglich bleiben können. Was sehe ich in der einen Situation an mir, das mir in der anderen völlig verloren geht?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1038,
    "textKennung": "relationship-original:selbstbild",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 1.126,
    "y": -5.323
   }
  },
  "1039": {
   "titel": "Ich bin mehr als die Rolle, in der du mich siehst",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Selbstverständnis, Fremdzuschreibung und situative Rolle sind verschiedene Beziehungen. Keine davon umfasst einen Menschen vollständig.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "In der Familie gilt Mara als „die Schwierige“. Bei der Arbeit wird sie als verlässlich erlebt; selbst beschreibt sie sich gerade als erschöpft."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Fragen: Wer sieht wen in welcher Situation als was — und mit welcher Folge? Die eigene Beschreibung neben der Zuschreibung stehen lassen. Welche Erwartung hängt an diesem Namen, und was wird dadurch an mir übersehen?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei der Arbeit wird sie als verlässlich erlebt",
     "satz": "Bei der Arbeit wird sie als verlässlich erlebt; selbst beschreibt sie sich gerade als erschöpft.",
     "abschnitt": "Im Alltag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1039,
    "textKennung": "relationship-original:mensch-rolle",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 1.582,
    "y": -0.939
   }
  },
  "1040": {
   "titel": "Welche Erwartung gilt hier eigentlich?",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "„Normal“ kann häufig, zweckmäßig, institutionell erwartet oder moralisch geboten bedeuten. Diese Maßstäbe entscheiden nicht alle dieselbe Frage.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Bei einem Familienessen soll jede Person lange bleiben. Ari braucht eine frühe Pause und wird deshalb als unhöflich bezeichnet."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die konkrete Funktion der Regel besprechen und eine tragbare Alternative suchen. Den Wert einer Person nicht daran messen, ob sie eine Gewohnheit erfüllt. Geht es gerade um praktische Abstimmung, Gewohnheit, Macht oder eine moralische Forderung?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei einem Familienessen soll jede Person lange bleiben",
     "satz": "Bei einem Familienessen soll jede Person lange bleiben.",
     "abschnitt": "Im Alltag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1040,
    "textKennung": "relationship-original:normen",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -1.756,
    "y": 1.385
   }
  },
  "1041": {
   "titel": "Was geschah — und was bedeutet es für mich?",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Wortlaut und Handlung können festgehalten werden. Die Bedeutung, die jemand ihnen gibt, darf sichtbar bleiben und zugleich veränderbar sein.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "„Sie hat mich demonstrativ ignoriert“, sagt Ben. Auf Nachfrage: Sie blickte beim Vorbeigehen auf ihr Telefon und grüßte nicht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Zuerst Handlung und Wortlaut notieren, dann die eigene Bedeutung. Wenn eine Klärung möglich und willkommen ist, offen nachfragen. Welcher Teil meines Satzes beschreibt etwas Wahrnehmbares, welcher Teil meine Schlussfolgerung?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Wenn eine Klärung möglich und willkommen ist",
     "satz": "Wenn eine Klärung möglich und willkommen ist, offen nachfragen.",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1041,
    "textKennung": "relationship-original:beobachtung-deutung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -2.238,
    "y": -0.937
   }
  },
  "1042": {
   "titel": "Die andere Innenwelt bleibt eine Hypothese",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Auch eine sehr plausible Vermutung ist keine unmittelbare Kenntnis fremder Gedanken. Die Person darf etwas anderes meinen als erwartet.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
     "kurz": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "cochrane-2020",
      "url": "https://www.cochrane.org/evidence/CD012955_psychological-therapies-people-borderline-personality-disorder",
      "titelBestand": "Psychologische Therapien bei Borderline · Cochrane-Übersicht"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "„Du willst doch nur, dass ich mich schlecht fühle“, sagt Nika nach einer kritischen Nachfrage."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die eigene Erfahrung als eigene benennen. Eine zweite Erklärung zulassen und prüfen, welche Information sie stützen oder widerlegen würde. Welche Aussage über das Gegenüber behandle ich gerade wie eine sichere Tatsache?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "während die vermutete Absicht falsch bleibt",
     "satz": "Eine verletzende Wirkung kann real sein, während die vermutete Absicht falsch bleibt.",
     "abschnitt": "Mögliche Deutung"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1042,
    "textKennung": "relationship-original:andere-innenwelt",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -0.272,
    "y": 1.234
   }
  },
  "1043": {
   "titel": "Wirkung hören, Absicht getrennt erklären",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Eine Erklärung der eigenen Absicht kann wichtig sein. Sie ersetzt nicht die Auseinandersetzung damit, was konkret geschehen ist und wie es ankam.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einem Witz sagt Eli: „Das hat mich vor allen bloßgestellt.“ Die Antwort lautet: „War doch nur Spaß.“"
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Den konkreten eigenen Beitrag anerkennen: „Ich habe das vor den anderen gesagt.“ Die Absicht anschließend gesondert erklären, ohne die Wirkung zurückzunehmen. Bleibt meine Anerkennung auch dann stehen, wenn ich anschließend meine Absicht beschreibe?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "wenn ich anschließend meine Absicht beschreibe?",
     "satz": "Bleibt meine Anerkennung auch dann stehen, wenn ich anschließend meine Absicht beschreibe?",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1043,
    "textKennung": "relationship-original:wirkung-absicht",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -3.93,
    "y": -0.627
   }
  },
  "1044": {
   "titel": "Erleben anerkennen, ohne alles zu bestätigen",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Dass etwas schmerzt, kann anerkannt werden, während die Deutung der Tatsachen offenbleibt. Auch die eigene Grenze darf bestehen.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "„Du hast mich absichtlich stehen lassen“, sagt eine Person. Die andere möchte den Schmerz ernst nehmen, teilt aber die behauptete Absicht nicht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Zunächst das Verstandene in eigenen Worten zurückgeben; bei Bedarf nachfragen. Die eigene Sicht und eine bestehende Grenze klar danebenstellen. Was kann ich ehrlich anerkennen, ohne Zustimmung vorzutäuschen oder mich selbst aufzugeben?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "bei Bedarf nachfragen",
     "satz": "Zunächst das Verstandene in eigenen Worten zurückgeben; bei Bedarf nachfragen.",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1044,
    "textKennung": "relationship-original:validierung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -0.315,
    "y": 2.716
   }
  },
  "1045": {
   "titel": "Mein Anteil hat eine konkrete Form",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Verantwortung wird an einer Handlung und ihrer Veränderung bearbeitbar. Sie ist weder totale Selbstschuld noch eine automatische Halbierung zwischen zwei Personen.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Zwei Menschen streiten. Eine Person hat beleidigt; die andere hat eine Verabredung ohne Nachricht ausfallen lassen."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Den eigenen konkreten Beitrag und eine Veränderung benennen. Für das Verhalten der anderen Person eine eigene Klärung oder Schutzentscheidung treffen. Welche Handlung kann ich verändern, und welche Zuständigkeit gehört ausdrücklich jemand anderem?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1045,
    "textKennung": "relationship-original:verantwortung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -0.005,
    "y": -0.913
   }
  },
  "1046": {
   "titel": "Missverständnis und Macht sind zwei Fragen",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Verständigung kann an unterschiedlichen Erfahrungsweisen scheitern. Gegenseitiges Missverstehen bedeutet trotzdem keine gleiche Freiheit oder gleiche Folgen.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Ein Vorgesetzter hält eine Bitte um klare schriftliche Absprachen für Misstrauen. Die Mitarbeiterin erlebt spontane mündliche Änderungen als schwer bewältigbar."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Eine konkrete Kommunikationsform erproben und ihre Folgen gemeinsam prüfen. Zusätzlich benennen, wer Entscheidungen trifft und wer Nachteile tragen muss. Was braucht bessere Übersetzung — und was braucht eine veränderte Entscheidung oder Grenze?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1046,
    "textKennung": "relationship-original:passung-macht",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 1.226,
    "y": 1.868
   }
  },
  "1047": {
   "titel": "Eine Pause bekommt eine tragbare Form",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Unterbrechen kann einen Handlungsspielraum eröffnen. Eine Pause braucht keine sofortige Lösung; Rückkehr und Grenzen dürfen konkret vereinbart werden.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Ein Gespräch wird immer lauter. Eine Person sagt: „Ich brauche eine Pause. Morgen kann ich überlegen, ob ich weiterreden möchte.“"
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Die Unterbrechung tatsächlich einhalten. Eigene Anspannung anders versorgen; nur die Rückkehr vereinbaren, der beide freiwillig zustimmen können. Welche Zusage wurde wirklich gemacht, und was wünsche ich mir zusätzlich?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei Bedrohung oder Übergriffen reicht ein Gesprächsformat allein nicht als Schutz",
     "satz": "Bei Bedrohung oder Übergriffen reicht ein Gesprächsformat allein nicht als Schutz.",
     "abschnitt": "Offene Fragen"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1047,
    "textKennung": "relationship-original:pause",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 0.878,
    "y": -2.254
   }
  },
  "1048": {
   "titel": "Wiedergutmachung gewährt keinen Anspruch auf Antwort",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Ein veränderter Umgang wird durch Handlungen sichtbar. Eine Entschuldigung kann Verantwortung ausdrücken und lässt dem Gegenüber seine Entscheidung.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Nach einer Grenzüberschreitung schreibt eine Person eine überarbeitete Entschuldigung. Die andere hatte ausdrücklich keinen weiteren Kontakt gewünscht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Den Text für die eigene Arbeit behalten und die benannte Grenze respektieren. Die Veränderung am eigenen Verhalten beginnen, auch ohne Rückmeldung. Was will ich ändern, das ich auch dann verantworten kann, wenn keine Versöhnung folgt?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "wenn keine Versöhnung folgt?",
     "satz": "Was will ich ändern, das ich auch dann verantworten kann, wenn keine Versöhnung folgt?",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1048,
    "textKennung": "relationship-original:reparatur",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -1.744,
    "y": -3.283
   }
  },
  "1049": {
   "titel": "Eine Geschichte hat mehrere Einflüsse",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Entwicklung lässt sich nicht auf eine Person oder ein Ereignis reduzieren. Konkrete verletzende Handlungen bleiben benennbar, während die Erklärung eines ganzen Verlaufs offen ist.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Kindheitsbelastungen und Borderline · Metaanalyse",
     "kurz": "Kindheitsbelastungen und Borderline · Metaanalyse",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "adversity-2020",
      "url": "https://pubmed.ncbi.nlm.nih.gov/31630389/",
      "titelBestand": "Kindheitsbelastungen und Borderline · Metaanalyse"
     }
    },
    {
     "titel": "Prospektive Risikofaktoren · Was zeitlich vorausgeht",
     "kurz": "Prospektive Risikofaktoren · Was zeitlich vorausgeht",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "prospective-2016",
      "url": "https://pubmed.ncbi.nlm.nih.gov/27709988/",
      "titelBestand": "Prospektive Risikofaktoren · Was zeitlich vorausgeht"
     }
    },
    {
     "titel": "Entwicklung im Zusammenspiel · mehrstufige Metaanalyse",
     "kurz": "Entwicklung im Zusammenspiel · mehrstufige Metaanalyse",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "development-2024",
      "url": "https://pubmed.ncbi.nlm.nih.gov/39243819/",
      "titelBestand": "Entwicklung im Zusammenspiel · mehrstufige Metaanalyse"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Eine erwachsene Person möchte verstehen, wie frühe Belastungen, eigene Voraussetzungen und spätere Beziehungen mit heutigen Schwierigkeiten zusammenhängen."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Bekanntes, Berichtetes und Vermutetes trennen. Für die heutige Unterstützung fragen, was konkret verändert werden kann, ohne eine vollständige Ursprungsgeschichte zu erzwingen. Was ist als Erfahrung belegt, was als Zusammenhang vermutet, und was bleibt offen?"
     }
    ]
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1049,
    "textKennung": "relationship-original:entwicklung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -4.32,
    "y": 0.813
   }
  },
  "1050": {
   "titel": "Ähnliches Erleben, verschiedene Zusammenhänge",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Überforderung, Rückzug oder schwankendes Erleben können Vergleichsfragen öffnen. Ähnlichkeit allein setzt Borderline, Trauma und Neurodivergenz nicht gleich.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Zwei Personen berichten, in Gesprächen „dichtzumachen“. Bei einer stehen Reize im Vordergrund, bei der anderen Erinnerungsbezüge; beide wissen noch nicht genau, was geschieht."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Von der eigenen Erfahrung ausgehen: Seit wann, in welchen Situationen, mit welchem Verlauf und welcher Beeinträchtigung? Diese Beobachtungen können ein fachliches Gespräch vorbereiten. Was sieht nur ähnlich aus, und welche Unterschiede zeigt die eigene Geschichte?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "Bei einer stehen Reize im Vordergrund",
     "satz": "Bei einer stehen Reize im Vordergrund, bei der anderen Erinnerungsbezüge; beide wissen noch nicht genau, was geschieht.",
     "abschnitt": "Im Alltag"
    },
    {
     "klausel": "bei der anderen Erinnerungsbezüge",
     "satz": "Bei einer stehen Reize im Vordergrund, bei der anderen Erinnerungsbezüge; beide wissen noch nicht genau, was geschieht.",
     "abschnitt": "Im Alltag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1050,
    "textKennung": "relationship-original:ueberlappung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": -2.584,
    "y": 2.623
   }
  },
  "1051": {
   "titel": "Was kostet das scheinbare Gelingen?",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Ein ruhiges Gespräch ist ein Ergebnis; geringe Erschöpfung ein anderes. Unterstützung wird verständlicher, wenn auch Vorbereitung, Erholung und Verteilung der Arbeit sichtbar werden.",
   "mehr": [],
   "quellen": [],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Ein Treffen verlief ohne Streit. Danach braucht eine Person zwei Tage Erholung; die andere hatte währenddessen ständig vermittelt."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Neben dem Ergebnis auch die Kosten besprechen: Wer hat vorbereitet, verzichtet, beruhigt, begleitet und sich erholt? Eine veränderte Bedingung ausprobieren. Was würde Erfolg bedeuten, wenn die Belastung beider Personen mitgezählt wird?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "wenn die Belastung beider Personen mitgezählt wird?",
     "satz": "Was würde Erfolg bedeuten, wenn die Belastung beider Personen mitgezählt wird?",
     "abschnitt": "Handlungsspielraum"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1051,
    "textKennung": "relationship-original:unterstuetzungskosten",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 6.065,
    "y": 3.125
   }
  },
  "1052": {
   "titel": "Unterstützung gemeinsam passend machen",
   "gebiet": "Beziehungen & Borderline",
   "ortsart": "Phänomen",
   "kurz": "Strukturierte Psychotherapie, persönliche Ziele und verlässliche Absprachen gehören in eine fachliche Behandlungsplanung. Eine einzelne Reflexion in der App ersetzt diesen Rahmen nicht.",
   "mehr": [],
   "quellen": [
    {
     "titel": "APA-Leitlinie zur Behandlung der Borderline-Persönlichkeitsstörung",
     "kurz": "APA-Leitlinie zur Behandlung der Borderline-Persönlichkeitsstörung",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "apa-2024",
      "url": "https://psychiatryonline.org/doi/10.1176/appi.ajp.24181010",
      "titelBestand": "APA-Leitlinie zur Behandlung der Borderline-Persönlichkeitsstörung"
     }
    },
    {
     "titel": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
     "kurz": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "cochrane-2020",
      "url": "https://www.cochrane.org/evidence/CD012955_psychological-therapies-people-borderline-personality-disorder",
      "titelBestand": "Psychologische Therapien bei Borderline · Cochrane-Übersicht"
     }
    },
    {
     "titel": "Psychotherapien für Erwachsene mit Borderline · systematische Übersicht",
     "kurz": "Psychotherapien für Erwachsene mit Borderline · systematische Übersicht",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "psychotherapy-2024",
      "url": "https://pubmed.ncbi.nlm.nih.gov/37902689/",
      "titelBestand": "Psychotherapien für Erwachsene mit Borderline · systematische Übersicht"
     }
    },
    {
     "titel": "BOOTS · DBT und Schematherapie im direkten Vergleich",
     "kurz": "BOOTS · DBT und Schematherapie im direkten Vergleich",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "boots-2026",
      "url": "https://jamanetwork.com/journals/jamapsychiatry/article-abstract/2848044",
      "titelBestand": "BOOTS · DBT und Schematherapie im direkten Vergleich"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Im Alltag",
      "text": "Eine Person möchte weniger unter Gefühlswechseln leiden und Beziehungen tragbarer gestalten. Sie fragt, welches Verfahren zu ihren Zielen und Umständen passt."
     }
    ],
    "aussen": [],
    "spielraum": [
     {
      "abschnitt": "Handlungsspielraum",
      "text": "Mit einer qualifizierten Fachperson Ziele, Rahmen, Sicherheit, Begleiterkrankungen und Präferenzen besprechen. Fortlaufend prüfen, was im eigenen Alltag tatsächlich besser oder schwerer wird. Welche konkrete Veränderung wäre für mich bedeutsam, und woran würden wir sie gemeinsam erkennen?"
     }
    ]
   },
   "bedingungen": [
    {
     "klausel": "unter Gefühlswechseln leiden und Beziehungen tragbarer gestalten",
     "satz": "Eine Person möchte weniger unter Gefühlswechseln leiden und Beziehungen tragbarer gestalten.",
     "abschnitt": "Im Alltag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Borderline verstehen · Beziehungskarte",
   "technisch": {
    "ortIndex": 1052,
    "textKennung": "relationship-original:behandlung",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 2.271,
    "y": 0.797
   }
  },
  "1053": {
   "titel": "Verlassenheitsangst und Vermeidungsbemühungen",
   "gebiet": "Diagnose & Differenzierung",
   "ortsart": "Phänomen",
   "kurz": "Starke Reaktionen auf tatsächliches oder befürchtetes Verlassenwerden.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Borderline Personality Disorder – NIMH",
     "kurz": "Borderline Personality Disorder – NIMH",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:ae3d3e3e08a0aad",
      "url": "https://www.nimh.nih.gov/health/publications/borderline-personality-disorder",
      "titelBestand": "Borderline Personality Disorder – NIMH"
     }
    },
    {
     "titel": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
     "kurz": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:58630727af716c7",
      "url": "https://register.awmf.org/de/leitlinien/detail/038-015",
      "titelBestand": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Starke Reaktionen auf tatsächliches oder befürchtetes Verlassenwerden."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Paraphrase einer Domäne; keine vollständige Diagnoseregel.",
     "abschnitt": "Aussagegrenze"
    }
   ],
   "herkunft": "Phänomenatlas · Borderline, Neurodivergenz und Trauma · Dossier vom 20. Oktober",
   "technisch": {
    "ortIndex": 1053,
    "textKennung": "dossier:phenomenon:bpd:bps-ph-001",
    "herkunftPfad": "Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten."
   },
   "feld": {
    "x": 0.968,
    "y": -9.289
   }
  },
  "1055": {
   "titel": "Identitätsunsicherheit",
   "gebiet": "Diagnose & Differenzierung",
   "ortsart": "Phänomen",
   "kurz": "Deutlich instabiles Selbstbild oder Selbstgefühl.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Borderline Personality Disorder – NIMH",
     "kurz": "Borderline Personality Disorder – NIMH",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:ae3d3e3e08a0aad",
      "url": "https://www.nimh.nih.gov/health/publications/borderline-personality-disorder",
      "titelBestand": "Borderline Personality Disorder – NIMH"
     }
    },
    {
     "titel": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
     "kurz": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:58630727af716c7",
      "url": "https://register.awmf.org/de/leitlinien/detail/038-015",
      "titelBestand": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Deutlich instabiles Selbstbild oder Selbstgefühl."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Paraphrase einer Domäne; keine vollständige Diagnoseregel.",
     "abschnitt": "Aussagegrenze"
    }
   ],
   "herkunft": "Phänomenatlas · Borderline, Neurodivergenz und Trauma · Dossier vom 20. Oktober",
   "technisch": {
    "ortIndex": 1055,
    "textKennung": "dossier:phenomenon:bpd:bps-ph-003",
    "herkunftPfad": "Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten."
   },
   "feld": {
    "x": 0.285,
    "y": -10.162
   }
  },
  "1060": {
   "titel": "Intensive schwer regulierbare Wut",
   "gebiet": "Diagnose & Differenzierung",
   "ortsart": "Phänomen",
   "kurz": "Übermäßige Wut oder Schwierigkeiten ihrer Regulation.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Borderline Personality Disorder – NIMH",
     "kurz": "Borderline Personality Disorder – NIMH",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:ae3d3e3e08a0aad",
      "url": "https://www.nimh.nih.gov/health/publications/borderline-personality-disorder",
      "titelBestand": "Borderline Personality Disorder – NIMH"
     }
    },
    {
     "titel": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
     "kurz": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:58630727af716c7",
      "url": "https://register.awmf.org/de/leitlinien/detail/038-015",
      "titelBestand": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Übermäßige Wut oder Schwierigkeiten ihrer Regulation."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Paraphrase einer Domäne; keine vollständige Diagnoseregel.",
     "abschnitt": "Aussagegrenze"
    }
   ],
   "herkunft": "Phänomenatlas · Borderline, Neurodivergenz und Trauma · Dossier vom 20. Oktober",
   "technisch": {
    "ortIndex": 1060,
    "textKennung": "dossier:phenomenon:bpd:bps-ph-008",
    "herkunftPfad": "Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten."
   },
   "feld": {
    "x": 1.026,
    "y": -11.992
   }
  },
  "1072": {
   "titel": "Schwankender Selbstwert",
   "gebiet": "Diagnose & Differenzierung",
   "ortsart": "Phänomen",
   "kurz": "Selbstbewertung kann mit negativer Erregung stark wechseln.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Negative affective arousal precedes lower self-esteem in BPD: experience sampling",
     "kurz": "Negative affective arousal precedes lower self-esteem in BPD: experience sampling",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "source:bpd:6b39efc6d9b8635",
      "url": "https://link.springer.com/article/10.1186/s40479-023-00229-w",
      "titelBestand": "Negative affective arousal precedes lower self-esteem in BPD: experience sampling"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Selbstbewertung kann mit negativer Erregung stark wechseln."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [
    {
     "satz": "Keine Bewertung des tatsächlichen persönlichen Werts.",
     "abschnitt": "Aussagegrenze"
    }
   ],
   "herkunft": "Phänomenatlas · Borderline, Neurodivergenz und Trauma · Dossier vom 20. Oktober",
   "technisch": {
    "ortIndex": 1072,
    "textKennung": "dossier:phenomenon:bpd:bps-ph-020",
    "herkunftPfad": "Lokale Originalquelle · vollständige Herkunft im lokalen Provenienzarchiv erhalten."
   },
   "feld": {
    "x": 1.383,
    "y": -10.312
   }
  },
  "1193": {
   "titel": "Digitale Kontrolle ist ein Beziehungsgeschehen",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Überwachung kann über Nachrichten, Kontozugänge, Geräte oder Standortfreigaben fortgesetzt werden. Woodlocks Befragung von 152 Fachkräften und 46 Betroffenen beschreibt, wie Technik zur Einschüchterung und Isolation eingesetzt wurde.",
   "mehr": [],
   "quellen": [
    {
     "titel": "The Abuse of Technology in Domestic Violence and Stalking",
     "kurz": "The Abuse of Technology in Domestic Violence and Stalking",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:woodlock-2017-abstract",
      "url": "https://pubmed.ncbi.nlm.nih.gov/27178564/",
      "titelBestand": "The Abuse of Technology in Domestic Violence and Stalking"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Überwachung kann über Nachrichten, Kontozugänge, Geräte oder Standortfreigaben fortgesetzt werden. Woodlocks Befragung von 152 Fachkräften und 46 Betroffenen beschreibt, wie Technik zur Einschüchterung und Isolation eingesetzt wurde."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "bei der handelnden Person",
     "satz": "Verantwortung für Überwachung und Drohungen liegt bei der handelnden Person.",
     "abschnitt": "Eintrag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1193,
    "textKennung": "verified-section:wave2-digital-control",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 6.623,
    "y": 12.033
   }
  },
  "1194": {
   "titel": "Schutz braucht einen passenden nächsten Schritt",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Bei möglicher digitaler Überwachung kann ein Gerät, auf das die kontrollierende Person keinen Zugriff hat, den Zugang zu Unterstützung erleichtern. Die australische eSafety-Behörde empfiehlt, Sicherheitsänderungen an die konkrete Lage anzupassen und möglichst mit spezialisierter Beratung zu planen.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Online safety checklist",
     "kurz": "Online safety checklist",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:esafety-online-safety-2026",
      "url": "https://www.esafety.gov.au/key-topics/domestic-family-violence/online-safety-checklist",
      "titelBestand": "Online safety checklist"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Bei möglicher digitaler Überwachung kann ein Gerät, auf das die kontrollierende Person keinen Zugriff hat, den Zugang zu Unterstützung erleichtern. Die australische eSafety-Behörde empfiehlt, Sicherheitsänderungen an die konkrete Lage anzupassen und möglichst mit spezialisierter Beratung zu planen."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "Bei möglicher digitaler Überwachung kann ein Gerät",
     "satz": "Bei möglicher digitaler Überwachung kann ein Gerät, auf das die kontrollierende Person keinen Zugriff hat, den Zugang zu Unterstützung erleichtern.",
     "abschnitt": "Eintrag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1194,
    "textKennung": "verified-section:wave2-digital-safety",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 8.894,
    "y": 12.18
   }
  },
  "1201": {
   "titel": "Ein Zusammenhang ist keine Gewaltprognose",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Eine Metaanalyse fand Zusammenhänge zwischen Narzissmus und Aggression auch ohne Provokation. Daraus lässt sich weder die Häufigkeit eines konkreten Übergriffs noch eine notwendige Schamreaktion ableiten.",
   "mehr": [],
   "quellen": [
    {
     "titel": "The Link between Narcissism and Aggression: A Meta-Analytic Review",
     "kurz": "The Link between Narcissism and Aggression: A Meta-Analytic Review",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:kjaervik-2021-aggression-review-abstract",
      "url": "https://pubmed.ncbi.nlm.nih.gov/34292012/",
      "titelBestand": "The Link between Narcissism and Aggression: A Meta-Analytic Review"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Eine Metaanalyse fand Zusammenhänge zwischen Narzissmus und Aggression auch ohne Provokation. Daraus lässt sich weder die Häufigkeit eines konkreten Übergriffs noch eine notwendige Schamreaktion ableiten."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1201,
    "textKennung": "verified-section:wave2-aggression-korrelationsgrenze",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 6.953,
    "y": 13.085
   }
  },
  "1202": {
   "titel": "Rückzug braucht eine genaue Frage",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Rückzug kann unterschiedliche Funktionen haben. Für eine festgestellte soziale Angststörung empfiehlt NICE Erwachsenen eine spezifische individuelle KVT.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Social Anxiety Disorder: Recognition, Assessment and Treatment — Recommendations",
     "kurz": "Social Anxiety Disorder: Recognition, Assessment and Treatment — Recommendations",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:nice-cg159-social-anxiety",
      "url": "https://www.nice.org.uk/guidance/cg159/chapter/recommendations",
      "titelBestand": "Social Anxiety Disorder: Recognition, Assessment and Treatment — Recommendations"
     }
    },
    {
     "titel": "Autism spectrum disorder in adults: diagnosis and management · NICE CG142",
     "kurz": "Autism spectrum disorder in adults: diagnosis and management · NICE CG142",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:nice-cg142",
      "url": "https://www.nice.org.uk/guidance/cg142",
      "titelBestand": "Autism spectrum disorder in adults: diagnosis and management · NICE CG142"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Rückzug kann unterschiedliche Funktionen haben. Für eine festgestellte soziale Angststörung empfiehlt NICE Erwachsenen eine spezifische individuelle KVT."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1202,
    "textKennung": "verified-section:wave2-rueckzug-behandlungskontext",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 5.751,
    "y": 17.838
   }
  },
  "1209": {
   "titel": "Angehörigenhilfe und die Bedeutung eines aktiven Vergleichs",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Family Connections bietet Angehörigen einen strukturierten Zugang zu Fertigkeiten und Unterstützung. In der geprüften randomisierten Studie mit 121 Angehörigen ergaben sich gegenüber einer aktiven Vergleichsversorgung keine statistisch signifikanten Gruppenunterschiede.",
   "mehr": [],
   "quellen": [
    {
     "titel": "“Family Connections”, a program for relatives of people with borderline personality disorder: A randomized controlled trial",
     "kurz": "“Family Connections”, a program for relatives of people with borderline personality disorder: A randomized controlled trial",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:guillen-2024-abstract",
      "url": "https://pubmed.ncbi.nlm.nih.gov/39624006/",
      "titelBestand": "“Family Connections”, a program for relatives of people with borderline personality disorder: A randomized controlled trial"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Family Connections bietet Angehörigen einen strukturierten Zugang zu Fertigkeiten und Unterstützung. In der geprüften randomisierten Studie mit 121 Angehörigen ergaben sich gegenüber einer aktiven Vergleichsversorgung keine statistisch signifikanten Gruppenunterschiede."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1209,
    "textKennung": "verified-section:wave2-family-connections-comparison",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 14.421,
    "y": 9.716
   }
  },
  "1212": {
   "titel": "Unterstützung hat einen Kontext",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "In drei Experimenten mit insgesamt 257 Frauen wirkte unauffällige Unterstützung vor einer belastenden Redeaufgabe günstiger auf die emotionale Stressreaktion als sichtbare oder fehlende Unterstützung. Der Befund betrifft ein spezifisches Laborarrangement.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Effects of Social Support Visibility on Adjustment to Stress: Experimental Evidence",
     "kurz": "Effects of Social Support Visibility on Adjustment to Stress: Experimental Evidence",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:bolger-amarel-2007-abstract",
      "url": "https://www.columbia.edu/~nb2229/docs/bolger-amarel-support-experiments-2006.pdf",
      "titelBestand": "Effects of Social Support Visibility on Adjustment to Stress: Experimental Evidence"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "In drei Experimenten mit insgesamt 257 Frauen wirkte unauffällige Unterstützung vor einer belastenden Redeaufgabe günstiger auf die emotionale Stressreaktion als sichtbare oder fehlende Unterstützung. Der Befund betrifft ein spezifisches Laborarrangement."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1212,
    "textKennung": "verified-section:wave2-support-context",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 15.292,
    "y": 10.393
   }
  },
  "1221": {
   "titel": "Selbstmitgefühl: wofür ein Versuch spricht",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Selbstmitgefühl kann eine erlernbare Form des Umgangs mit belastenden Gefühlen sein. Ein kurzes Experiment bei 48 Menschen mit Depression zeigte einen Vorteil gegenüber Warten.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Self-compassion as an emotion regulation strategy in major depressive disorder",
     "kurz": "Self-compassion as an emotion regulation strategy in major depressive disorder",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:diedrich-2014-self-compassion",
      "url": "https://pubmed.ncbi.nlm.nih.gov/24929927/",
      "titelBestand": "Self-compassion as an emotion regulation strategy in major depressive disorder"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Selbstmitgefühl kann eine erlernbare Form des Umgangs mit belastenden Gefühlen sein. Ein kurzes Experiment bei 48 Menschen mit Depression zeigte einen Vorteil gegenüber Warten."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "bei 48 Menschen mit Depression zeigte einen Vorteil gegenüber Warten",
     "satz": "Ein kurzes Experiment bei 48 Menschen mit Depression zeigte einen Vorteil gegenüber Warten.",
     "abschnitt": "Eintrag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1221,
    "textKennung": "verified-section:wave2-self-compassion-outcome",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 8.233,
    "y": 11.298
   }
  },
  "1223": {
   "titel": "Schutz hängt nicht an einem Grenzwert",
   "gebiet": "Forschung & Einordnung",
   "ortsart": "Kapitel",
   "kurz": "Kontrollverhalten wird verständlicher, wenn konkrete Einschränkungen sichtbar werden: Überwachung, erschwerter Zugang zu Geld oder Unterstützung, Drohungen und Angst vor Konsequenzen. Eine untersuchte Skalen-Grenze aus einer Scheidungsstichprobe legt keine universelle Sicherheitsgrenze fest.",
   "mehr": [],
   "quellen": [
    {
     "titel": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types",
     "kurz": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types",
     "art": "Quelle",
     "zitat": "",
     "technisch": {
      "schluessel": "verified:hardesty-2015-coercive-control",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4553695/",
      "titelBestand": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types"
     }
    }
   ],
   "blick": {
    "innen": [
     {
      "abschnitt": "Kurztext",
      "text": "Kontrollverhalten wird verständlicher, wenn konkrete Einschränkungen sichtbar werden: Überwachung, erschwerter Zugang zu Geld oder Unterstützung, Drohungen und Angst vor Konsequenzen. Eine untersuchte Skalen-Grenze aus einer Scheidungsstichprobe legt keine universelle Sicherheitsgrenze fest."
     }
    ],
    "aussen": [],
    "spielraum": []
   },
   "bedingungen": [
    {
     "klausel": "wenn konkrete Einschränkungen sichtbar werden",
     "satz": "Kontrollverhalten wird verständlicher, wenn konkrete Einschränkungen sichtbar werden: Überwachung, erschwerter Zugang zu Geld oder Unterstützung, Drohungen und Angst vor Konsequenzen.",
     "abschnitt": "Eintrag"
    }
   ],
   "grenzSaetze": [],
   "herkunft": "Atlasintegration · öffentlich geprüfte Quellen",
   "technisch": {
    "ortIndex": 1223,
    "textKennung": "verified-section:wave2-control-safety-thresholds",
    "herkunftPfad": ""
   },
   "feld": {
    "x": 7.7,
    "y": 12.262
   }
  }
 },
 "paare": [
  {
   "a": 1031,
   "b": 1034,
   "fugen": [
    {
     "richtung": "Die Angst vor Verlust ist groß → Auch meine Grenze gilt",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Bedürfnis trifft begrenzte Verfügbarkeit",
     "grund": "der Originalbezeichnung „Bedürfnis trifft begrenzte Verfügbarkeit“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ein starkes Bedürfnis und die Grenze des Gegenübers dürfen zugleich ernst genommen werden.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1660,
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
       "satz": "Bedürfnis trifft begrenzte Verfügbarkeit",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1031,
   "b": 1030,
   "fugen": [
    {
     "richtung": "Eine Antwort bleibt aus → Die Angst vor Verlust ist groß",
     "vomSchloss": false,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Eine mögliche Bedeutung des Wartens",
     "grund": "der Originalbezeichnung „Eine mögliche Bedeutung des Wartens“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine unbeantwortete Nachricht kann in einer erfundenen Situation als drohender Verlust erlebt werden. Der Zeitablauf beweist diese Bedeutung nicht.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1657,
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
       "satz": "Eine mögliche Bedeutung des Wartens",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1031,
   "b": 1032,
   "fugen": [
    {
     "richtung": "Die Angst vor Verlust ist groß → Wenn Nähe zur Verpflichtung wird",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Wenn Beruhigung eingefordert wird",
     "grund": "der Originalbezeichnung „Wenn Beruhigung eingefordert wird“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Aus eigener Angst kann eine Forderung nach Kontakt entstehen. Die Angst begründet keinen Anspruch auf Verfügbarkeit.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1659,
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
       "satz": "Wenn Beruhigung eingefordert wird",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1031,
   "b": 1053,
   "fugen": [
    {
     "richtung": "Verlassenheitsangst und Vermeidungsbemühungen → Die Angst vor Verlust ist groß",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet Symptomdomäne und Alltagsszene",
     "grund": "der belegten Originalaussage „unterscheidet Symptomdomäne und Alltagsszene“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Die Szene belegt weder einen Bindungstyp noch Borderline. Ein klassifikatorischer Bezug ist kein Ursachenbeleg und keine Diagnose einer in einer Szene beschriebenen Person.",
     "detail": "Das Dossier bezeichnet Verlassenheitsangst als klinische Symptomdomäne. Die fiktive Abschiedsszene zeigt dagegen nur einen Satz, berichtete Angst und einen Kontaktwunsch. Nebeneinander wird sichtbar, wie viel mehr als eine einzelne Episode eine diagnostische Beurteilung benötigt.",
     "quellen": [
      {
       "titel": "Borderline Personality Disorder – NIMH",
       "kurz": "Borderline Personality Disorder – NIMH",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:ae3d3e3e08a0aad",
        "url": "https://www.nimh.nih.gov/health/publications/borderline-personality-disorder",
        "titelBestand": "Borderline Personality Disorder – NIMH"
       }
      },
      {
       "titel": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
       "kurz": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:58630727af716c7",
        "url": "https://register.awmf.org/de/leitlinien/detail/038-015",
        "titelBestand": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1749,
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
       "satz": "unterscheidet Symptomdomäne und Alltagsszene",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1031,
   "b": 1033,
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
   "a": 1031,
   "b": 1028,
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
   "a": 1030,
   "b": 1041,
   "fugen": [
    {
     "richtung": "Eine Antwort bleibt aus → Was geschah — und was bedeutet es für mich?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Zeitablauf von Erklärung trennen",
     "grund": "der Originalbezeichnung „Zeitablauf von Erklärung trennen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die fehlende Antwort ist bekannt; ihr Grund bleibt ohne weitere Auskunft offen.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1658,
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
       "satz": "Zeitablauf von Erklärung trennen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1032,
   "b": 1039,
   "fugen": [
    {
     "richtung": "Wenn Nähe zur Verpflichtung wird → Ich bin mehr als die Rolle, in der du mich siehst",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Die Rolle verpflichtet nicht zu allem",
     "grund": "der Originalbezeichnung „Die Rolle verpflichtet nicht zu allem“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Familien- oder Partnerschaftsrollen können Erwartungen tragen. Sie ersetzen keine konkrete Vereinbarung oder Zustimmung.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1661,
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
       "satz": "Die Rolle verpflichtet nicht zu allem",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1032,
   "b": 1040,
   "fugen": [
    {
     "richtung": "Wenn Nähe zur Verpflichtung wird → Welche Erwartung gilt hier eigentlich?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Welche Pflicht wird behauptet?",
     "grund": "der Originalbezeichnung „Welche Pflicht wird behauptet?“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Der Vergleich fragt nach der Herkunft einer Erwartung: Gewohnheit, Sachvereinbarung oder moralische Forderung.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1662,
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
       "satz": "Welche Pflicht wird behauptet?",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1033,
   "b": 1048,
   "fugen": [
    {
     "richtung": "Abstand wünschen → Wiedergutmachung gewährt keinen Anspruch auf Antwort",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Kontaktgrenze bleibt bestehen",
     "grund": "der Originalbezeichnung „Kontaktgrenze bleibt bestehen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ein Entwurf kann der eigenen Klärung dienen. Eine Entschuldigung hebt ein ausdrücklich benanntes Kontakt-Nein nicht auf.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1663,
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
       "satz": "Kontaktgrenze bleibt bestehen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1033,
   "b": 1047,
   "fugen": [
    {
     "richtung": "Abstand wünschen → Eine Pause bekommt eine tragbare Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Eine konkrete Unterbrechung",
     "grund": "der Originalbezeichnung „Eine konkrete Unterbrechung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Zeitpunkt und Bedingungen einer Pause ergeben sich aus tatsächlichen Zusagen; der eigene Wunsch ergänzt keine Zustimmung.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1664,
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
       "satz": "Eine konkrete Unterbrechung",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1033,
   "b": 1028,
   "fugen": [
    {
     "richtung": "Abstand wünschen → Rückzug hat mehrere mögliche Bedeutungen",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Grenze und vermutete Erklärung trennen",
     "grund": "der Originalbezeichnung „Grenze und vermutete Erklärung trennen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ein ausdrücklich gewünschter Abstand ist eine Information. Die Erklärung des Rückzugs bleibt eine andere Frage.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1665,
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
       "satz": "Grenze und vermutete Erklärung trennen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1034,
   "b": 1044,
   "fugen": [
    {
     "richtung": "Auch meine Grenze gilt → Erleben anerkennen, ohne alles zu bestätigen",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Anerkennen und Nein sagen",
     "grund": "der Originalbezeichnung „Anerkennen und Nein sagen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die Erfahrung einer anderen Person kann anerkannt werden, während die eigene Verfügbarkeit begrenzt bleibt.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1666,
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
       "satz": "Anerkennen und Nein sagen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1034,
   "b": 1051,
   "fugen": [
    {
     "richtung": "Auch meine Grenze gilt → Was kostet das scheinbare Gelingen?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Was ist dauerhaft tragbar?",
     "grund": "der Originalbezeichnung „Was ist dauerhaft tragbar?“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Bei einer Zusage zählen auch Vorbereitung, Erholung und Arbeit der unterstützenden Person.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1667,
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
       "satz": "Was ist dauerhaft tragbar?",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1035,
   "b": 1034,
   "fugen": [
    {
     "richtung": "Unterstützung bleibt ein Angebot → Auch meine Grenze gilt",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Freiwillige Unterstützung",
     "grund": "der Originalbezeichnung „Freiwillige Unterstützung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ein Angebot bleibt Unterstützung, wenn es abgelehnt und seine Form gemeinsam begrenzt werden kann.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1668,
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
       "satz": "Freiwillige Unterstützung",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1035,
   "b": 1051,
   "fugen": [
    {
     "richtung": "Unterstützung bleibt ein Angebot → Was kostet das scheinbare Gelingen?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Wirkung und Aufwand getrennt prüfen",
     "grund": "der Originalbezeichnung „Wirkung und Aufwand getrennt prüfen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Gemeinsame Hilfe wird nicht allein an sichtbarer Ruhe beurteilt. Ihre Bedingungen und Kosten gehören zur Rückschau.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1669,
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
       "satz": "Wirkung und Aufwand getrennt prüfen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1025,
   "b": 1047,
   "fugen": [
    {
     "richtung": "Gefühle überrollen mich → Eine Pause bekommt eine tragbare Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Zwischen Impuls und Handlung",
     "grund": "der Originalbezeichnung „Zwischen Impuls und Handlung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Reflexionsangebot, kein Wirkversprechen und kein Ersatz für einen persönlich passenden Krisen- oder Behandlungsplan.",
     "detail": "Eine gewählte Unterbrechung kann Raum für die Entscheidung über eine nächste Handlung anbieten.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1670,
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
       "satz": "Zwischen Impuls und Handlung",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1025,
   "b": 1041,
   "fugen": [
    {
     "richtung": "Gefühle überrollen mich → Was geschah — und was bedeutet es für mich?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Gefühl und Bedeutung nebeneinander",
     "grund": "der Originalbezeichnung „Gefühl und Bedeutung nebeneinander“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ein Gefühl ist berichtetes Erleben; die Erklärung der auslösenden Situation bleibt zusätzlich prüfbar.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1671,
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
       "satz": "Gefühl und Bedeutung nebeneinander",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1026,
   "b": 1045,
   "fugen": [
    {
     "richtung": "Wut wird laut → Mein Anteil hat eine konkrete Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Gefühl und Verhalten unterscheiden",
     "grund": "der Originalbezeichnung „Gefühl und Verhalten unterscheiden“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ärger kann ernst genommen werden, während eine verletzende oder einschüchternde Handlung konkret verantwortet wird.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1672,
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
       "satz": "Gefühl und Verhalten unterscheiden",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1026,
   "b": 1047,
   "fugen": [
    {
     "richtung": "Wut wird laut → Eine Pause bekommt eine tragbare Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Einschüchternde Handlung unterbrechen",
     "grund": "der Originalbezeichnung „Einschüchternde Handlung unterbrechen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine Unterbrechung richtet sich auf konkretes Verhalten. Bei Bedrohung braucht Schutz eine eigenständige Entscheidung.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1673,
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
       "satz": "Einschüchternde Handlung unterbrechen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1027,
   "b": 1051,
   "fugen": [
    {
     "richtung": "Innen fühlt es sich leer an → Was kostet das scheinbare Gelingen?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Ruhig aussehen ist nicht entlastet sein",
     "grund": "der Originalbezeichnung „Ruhig aussehen ist nicht entlastet sein“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine ruhige Außenwirkung sagt noch nicht, wie viel Kraft, Verbindung oder Orientierung eine Person erlebt.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1674,
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
       "satz": "Ruhig aussehen ist nicht entlastet sein",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1028,
   "b": 1029,
   "fugen": [
    {
     "richtung": "Rückzug hat mehrere mögliche Bedeutungen → Mir selbst oder der Welt fremd",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Ähnlicher Eindruck, verschiedene Fragen",
     "grund": "der Originalbezeichnung „Ähnlicher Eindruck, verschiedene Fragen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Wenig sprechen, weggehen und ein fremdes Selbsterleben können nebeneinander beschrieben werden, ohne sie gleichzusetzen.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1675,
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
       "satz": "Ähnlicher Eindruck, verschiedene Fragen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1028,
   "b": 1042,
   "fugen": [
    {
     "richtung": "Rückzug hat mehrere mögliche Bedeutungen → Die andere Innenwelt bleibt eine Hypothese",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Keine Absicht aus Schweigen ableiten",
     "grund": "der Originalbezeichnung „Keine Absicht aus Schweigen ableiten“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Ohne eigene Auskunft bleibt die Erklärung eines Rückzugs offen. Eine ausdrücklich gesetzte Grenze gilt dennoch.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1676,
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
       "satz": "Keine Absicht aus Schweigen ableiten",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1029,
   "b": 1050,
   "fugen": [
    {
     "richtung": "Mir selbst oder der Welt fremd → Ähnliches Erleben, verschiedene Zusammenhänge",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Verlauf statt Etikett vergleichen",
     "grund": "der Originalbezeichnung „Verlauf statt Etikett vergleichen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Beginn, Dauer und eigenes Erleben öffnen genauere Fragen als die äußere Ähnlichkeit.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1677,
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
       "satz": "Verlauf statt Etikett vergleichen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1036,
   "b": 1037,
   "fugen": [
    {
     "richtung": "Eine Rückmeldung trifft sehr tief → Vom Fehler zum ganzen Selbst",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Von einer Episode zum ganzen Selbst",
     "grund": "der Originalbezeichnung „Von einer Episode zum ganzen Selbst“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Der Vergleich fragt, ob aus einer konkreten Rückmeldung ein umfassendes negatives Selbsturteil entsteht.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1678,
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
       "satz": "Von einer Episode zum ganzen Selbst",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1036,
   "b": 1043,
   "fugen": [
    {
     "richtung": "Eine Rückmeldung trifft sehr tief → Wirkung hören, Absicht getrennt erklären",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Rückmeldung und Verletzung gesondert hören",
     "grund": "der Originalbezeichnung „Rückmeldung und Verletzung gesondert hören“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine Sachfrage kann geklärt und eine verletzende Wirkung zugleich anerkannt werden.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1679,
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
       "satz": "Rückmeldung und Verletzung gesondert hören",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1036,
   "b": 1041,
   "fugen": [
    {
     "richtung": "Eine Rückmeldung trifft sehr tief → Was geschah — und was bedeutet es für mich?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Den zusätzlichen Satz erkennen",
     "grund": "der Originalbezeichnung „Den zusätzlichen Satz erkennen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Was gesagt wurde und welches Urteil über sich selbst jemand daraus hört, bleiben gesondert sichtbar.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1680,
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
       "satz": "Den zusätzlichen Satz erkennen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1037,
   "b": 1045,
   "fugen": [
    {
     "richtung": "Vom Fehler zum ganzen Selbst → Mein Anteil hat eine konkrete Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Konkreter Anteil statt Totalurteil",
     "grund": "der Originalbezeichnung „Konkreter Anteil statt Totalurteil“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine veränderbare Handlung ist genauer als das Urteil, als ganzer Mensch falsch oder an allem schuld zu sein.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1681,
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
       "satz": "Konkreter Anteil statt Totalurteil",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1038,
   "b": 1039,
   "fugen": [
    {
     "richtung": "Mein Bild von mir wechselt → Ich bin mehr als die Rolle, in der du mich siehst",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Mehrere Perspektiven auf dieselbe Person",
     "grund": "der Originalbezeichnung „Mehrere Perspektiven auf dieselbe Person“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Selbstbewertung, Fremdzuschreibung und situative Rolle dürfen nebeneinander stehen, ohne einen Menschen darauf zu reduzieren.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1682,
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
       "satz": "Mehrere Perspektiven auf dieselbe Person",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1038,
   "b": 1030,
   "fugen": [
    {
     "richtung": "Mein Bild von mir wechselt → Eine Antwort bleibt aus",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Eine offene Vergleichsfrage",
     "grund": "der Originalbezeichnung „Eine offene Vergleichsfrage“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die erfundene Situation lädt dazu ein, Selbstbewertung in unterschiedlichen Beziehungssituationen zu vergleichen.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1683,
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
       "satz": "Eine offene Vergleichsfrage",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1039,
   "b": 1040,
   "fugen": [
    {
     "richtung": "Ich bin mehr als die Rolle, in der du mich siehst → Welche Erwartung gilt hier eigentlich?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Rollen tragen Erwartungen",
     "grund": "der Originalbezeichnung „Rollen tragen Erwartungen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die Betrachtung fragt, welche Erwartung eine Rolle auslöst und welche Folgen eine Abweichung hat.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1684,
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
       "satz": "Rollen tragen Erwartungen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1039,
   "b": 1046,
   "fugen": [
    {
     "richtung": "Ich bin mehr als die Rolle, in der du mich siehst → Missverständnis und Macht sind zwei Fragen",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Wer darf wen definieren?",
     "grund": "der Originalbezeichnung „Wer darf wen definieren?“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine Zuschreibung und die Macht, Folgen daran zu knüpfen, sind verschiedene und gemeinsam relevante Ebenen.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1685,
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
       "satz": "Wer darf wen definieren?",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1041,
   "b": 1042,
   "fugen": [
    {
     "richtung": "Was geschah — und was bedeutet es für mich? → Die andere Innenwelt bleibt eine Hypothese",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Wissen und Vermutung kennzeichnen",
     "grund": "der Originalbezeichnung „Wissen und Vermutung kennzeichnen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine beobachtete Handlung erlaubt mehrere Deutungen; vermutete Gedanken sollen als Vermutung erkennbar bleiben.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1686,
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
       "satz": "Wissen und Vermutung kennzeichnen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1042,
   "b": 1043,
   "fugen": [
    {
     "richtung": "Die andere Innenwelt bleibt eine Hypothese → Wirkung hören, Absicht getrennt erklären",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Fremde Absicht bleibt fremde Auskunft",
     "grund": "der Originalbezeichnung „Fremde Absicht bleibt fremde Auskunft“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die bekannte Wirkung ist kein unmittelbarer Beweis einer Absicht; eine erklärte Absicht beseitigt die Wirkung nicht.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1687,
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
       "satz": "Fremde Absicht bleibt fremde Auskunft",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1043,
   "b": 1044,
   "fugen": [
    {
     "richtung": "Wirkung hören, Absicht getrennt erklären → Erleben anerkennen, ohne alles zu bestätigen",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Erfahrung ernst nehmen",
     "grund": "der Originalbezeichnung „Erfahrung ernst nehmen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine Wirkung kann anerkannt werden, ohne jede Interpretation zu bestätigen oder eine bestimmte Gegenreaktion zu erwarten.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1688,
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
       "satz": "Erfahrung ernst nehmen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1044,
   "b": 1045,
   "fugen": [
    {
     "richtung": "Erleben anerkennen, ohne alles zu bestätigen → Mein Anteil hat eine konkrete Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Anerkennung bekommt eine Handlung",
     "grund": "der Originalbezeichnung „Anerkennung bekommt eine Handlung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Wenn ein eigener Beitrag bekannt ist, kann er konkret benannt und verändert werden.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1689,
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
       "satz": "Anerkennung bekommt eine Handlung",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1045,
   "b": 1048,
   "fugen": [
    {
     "richtung": "Mein Anteil hat eine konkrete Form → Wiedergutmachung gewährt keinen Anspruch auf Antwort",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Verändern ohne Gegenleistung",
     "grund": "der Originalbezeichnung „Verändern ohne Gegenleistung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die eigene Veränderung darf nicht davon abhängig gemacht werden, dass eine andere Person sofort antwortet oder versöhnt ist.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1690,
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
       "satz": "Verändern ohne Gegenleistung",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1046,
   "b": 1040,
   "fugen": [
    {
     "richtung": "Missverständnis und Macht sind zwei Fragen → Welche Erwartung gilt hier eigentlich?",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Verständigung und Entscheidungsrecht",
     "grund": "der Originalbezeichnung „Verständigung und Entscheidungsrecht“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Nicht jede Schwierigkeit ist durch bessere Übersetzung lösbar. Wer Regeln setzt und Nachteile trägt, bleibt eine zusätzliche Frage.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1691,
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
       "satz": "Verständigung und Entscheidungsrecht",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1047,
   "b": 1035,
   "fugen": [
    {
     "richtung": "Eine Pause bekommt eine tragbare Form → Unterstützung bleibt ein Angebot",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Später gemeinsam prüfen",
     "grund": "der Originalbezeichnung „Später gemeinsam prüfen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Wenn beide wieder Kontakt möchten, kann besprochen werden, welche Unterstützung in einer angespannten Situation willkommen ist.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1692,
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
       "satz": "Später gemeinsam prüfen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1049,
   "b": 1050,
   "fugen": [
    {
     "richtung": "Eine Geschichte hat mehrere Einflüsse → Ähnliches Erleben, verschiedene Zusammenhänge",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Geschichten nicht vereinheitlichen",
     "grund": "der Originalbezeichnung „Geschichten nicht vereinheitlichen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Beziehungsgeschichte, Entwicklungsprofil und heutige Belastung werden gemeinsam betrachtet, ohne einander vollständig zu erklären.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1693,
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
       "satz": "Geschichten nicht vereinheitlichen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1049,
   "b": 1045,
   "fugen": [
    {
     "richtung": "Eine Geschichte hat mehrere Einflüsse → Mein Anteil hat eine konkrete Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Entstehung und aktuelle Handlung trennen",
     "grund": "der Originalbezeichnung „Entstehung und aktuelle Handlung trennen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Offene Fragen zur Entwicklung verhindern nicht, dass eine heutige verletzende Handlung konkret benannt wird.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1694,
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
       "satz": "Entstehung und aktuelle Handlung trennen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1050,
   "b": 1052,
   "fugen": [
    {
     "richtung": "Ähnliches Erleben, verschiedene Zusammenhänge → Unterstützung gemeinsam passend machen",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Beobachtungen in die fachliche Klärung mitnehmen",
     "grund": "der Originalbezeichnung „Beobachtungen in die fachliche Klärung mitnehmen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eigene Beschreibungen zu Beginn, Verlauf und Beeinträchtigung können das Gespräch vorbereiten; sie ersetzen keine Diagnostik.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1695,
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
       "satz": "Beobachtungen in die fachliche Klärung mitnehmen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1051,
   "b": 1052,
   "fugen": [
    {
     "richtung": "Was kostet das scheinbare Gelingen? → Unterstützung gemeinsam passend machen",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Alltagsfolgen als gemeinsame Frage",
     "grund": "der Originalbezeichnung „Alltagsfolgen als gemeinsame Frage“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Die Planung kann neben Beschwerden auch Autonomie, Belastung und die Tragbarkeit konkreter Unterstützung besprechen.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1696,
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
       "satz": "Alltagsfolgen als gemeinsame Frage",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1052,
   "b": 1045,
   "fugen": [
    {
     "richtung": "Unterstützung gemeinsam passend machen → Mein Anteil hat eine konkrete Form",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Ziele als konkrete Veränderungen",
     "grund": "der Originalbezeichnung „Ziele als konkrete Veränderungen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Eine persönliche Zielvereinbarung kann benennen, welches Verhalten und welcher Alltag sich verändern sollen.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1697,
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
       "satz": "Ziele als konkrete Veränderungen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1052,
   "b": 1035,
   "fugen": [
    {
     "richtung": "Unterstützung gemeinsam passend machen → Unterstützung bleibt ein Angebot",
     "vomSchloss": true,
     "art": "einordnung",
     "artWort": "Einordnung",
     "label": "Beziehungshilfe hat einen eigenen Rahmen",
     "grund": "der Originalbezeichnung „Beziehungshilfe hat einen eigenen Rahmen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "",
     "statusWort": "",
     "grenze": "Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.",
     "detail": "Freiwillige Unterstützung im Alltag und strukturierte Behandlung können nebeneinander stehen. Freundschaft wird damit nicht zum Therapieauftrag.",
     "quellen": [],
     "herkunft": "Vorhandene Beziehungskarte · redaktionelle Lesebeziehung",
     "technisch": {
      "fugeIndex": 1698,
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
       "satz": "Beziehungshilfe hat einen eigenen Rahmen",
       "geltung": "redaktionell zugeordnet",
       "status": ""
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1035,
   "b": 1013,
   "fugen": [
    {
     "richtung": "Body Doubling → Unterstützung bleibt ein Angebot",
     "vomSchloss": false,
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
   "a": 1025,
   "b": 562,
   "fugen": [
    {
     "richtung": "Gefühle überrollen mich → Anspannung und Handlungsspielraum",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "illustriert einen wählbaren Handlungsspielraum",
     "grund": "der belegten Originalaussage „illustriert einen wählbaren Handlungsspielraum“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Die Szene ist keine persönliche Fallbeschreibung und kein Wirksamkeitsnachweis. Eine Pause muss zur Situation passen und verpflichtet die andere Person nicht, alles auszuhalten.",
     "detail": "Die fiktive Absageszene trennt körperlichen Druck, die Bedeutung einer Nachricht und den Impuls zu antworten. Die Werkstattkarte öffnet die Frage nach einer selbst gewählten Pause bei hoher Erregung. Die Verbindung macht aus der allgemeinen Frage einen konkreten, frei prüfbaren Ablauf.",
     "quellen": [
      {
       "titel": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
       "kurz": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "cochrane-2020",
        "url": "https://www.cochrane.org/evidence/CD012955_psychological-therapies-people-borderline-personality-disorder",
        "titelBestand": "Psychologische Therapien bei Borderline · Cochrane-Übersicht"
       }
      },
      {
       "titel": "National Center for PTSD · Kommunikation in Familien",
       "kurz": "National Center for PTSD · Kommunikation in Familien",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "relationship-source:va",
        "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
        "titelBestand": "National Center for PTSD · Kommunikation in Familien"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1741,
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
       "satz": "illustriert einen wählbaren Handlungsspielraum",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1041,
   "b": 560,
   "fugen": [
    {
     "richtung": "Was geschah — und was bedeutet es für mich? → Beobachtung und Deutung",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "illustriert dieselbe Unterscheidung",
     "grund": "der belegten Originalaussage „illustriert dieselbe Unterscheidung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Mehrere mögliche Erklärungen sind nicht automatisch gleich wahrscheinlich. Die Unterscheidung hebt tatsächliche Wirkungen und überprüfbare Grenzverletzungen nicht auf.",
     "detail": "Die fiktive Szene unterscheidet ein ausgebliebenes Grüßen und den Blick aufs Telefon von der Zuschreibung einer demonstrativen Absicht. Die Werkstattkarte fragt allgemeiner, was eine Kamera erfassen könnte und was eine veränderbare Deutung bleibt.",
     "quellen": [
      {
       "titel": "National Center for PTSD · Kommunikation in Familien",
       "kurz": "National Center for PTSD · Kommunikation in Familien",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "relationship-source:va",
        "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
        "titelBestand": "National Center for PTSD · Kommunikation in Familien"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1742,
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
       "satz": "illustriert dieselbe Unterscheidung",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1042,
   "b": 565,
   "fugen": [
    {
     "richtung": "Die andere Innenwelt bleibt eine Hypothese → Mehr als eine mögliche Innenwelt",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "illustriert vorsichtige Perspektivübernahme",
     "grund": "der belegten Originalaussage „illustriert vorsichtige Perspektivübernahme“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Die mögliche Unkenntnis einer Absicht entkräftet die erlebte Wirkung nicht. Mentalisieren bedeutet weder Gedankenlesen noch die Pflicht, trotz Gefährdung weiter im Kontakt zu bleiben.",
     "detail": "Die Szene zeigt eine verletzende Kritik und die darüber hinausgehende Zuschreibung einer Verletzungsabsicht. Die Werkstattkarte behandelt fremde Absichten als Hypothesen und fragt nach Alternativen sowie Gegenbelegen. Beide Zugänge verbinden Selbstbericht, Wirkung und offene Innenperspektive.",
     "quellen": [
      {
       "titel": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
       "kurz": "Psychologische Therapien bei Borderline · Cochrane-Übersicht",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "cochrane-2020",
        "url": "https://www.cochrane.org/evidence/CD012955_psychological-therapies-people-borderline-personality-disorder",
        "titelBestand": "Psychologische Therapien bei Borderline · Cochrane-Übersicht"
       }
      },
      {
       "titel": "National Center for PTSD · Kommunikation in Familien",
       "kurz": "National Center for PTSD · Kommunikation in Familien",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "relationship-source:va",
        "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
        "titelBestand": "National Center for PTSD · Kommunikation in Familien"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1743,
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
       "satz": "illustriert vorsichtige Perspektivübernahme",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1044,
   "b": 563,
   "fugen": [
    {
     "richtung": "Erleben anerkennen, ohne alles zu bestätigen → Erleben anerkennen",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "illustriert Anerkennung ohne Zustimmung",
     "grund": "der belegten Originalaussage „illustriert Anerkennung ohne Zustimmung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Anerkennung beweist die behauptete Absicht nicht und verlangt keine Zustimmung oder Grenzaufgabe. Sie ist kein Verfahren, mit dem sich eine bestimmte Reaktion der anderen Person garantieren lässt.",
     "detail": "Die Szene trennt den Schmerz über ein Stehengelassenwerden von einer behaupteten Absicht. Die Werkstattkarte zeigt denselben Raum zwischen dem Anerkennen von Erleben, offenen Fakten und eigenen Grenzen.",
     "quellen": [
      {
       "titel": "National Center for PTSD · Kommunikation in Familien",
       "kurz": "National Center for PTSD · Kommunikation in Familien",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "relationship-source:va",
        "url": "https://www.ptsd.va.gov/family/how_family_member.asp",
        "titelBestand": "National Center for PTSD · Kommunikation in Familien"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1744,
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
       "satz": "illustriert Anerkennung ohne Zustimmung",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1034,
   "b": 561,
   "fugen": [
    {
     "richtung": "Auch meine Grenze gilt → Nähe, Freiheit und Grenzen",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "verbindet Nähe mit freiwilliger Verfügbarkeit",
     "grund": "der belegten Originalaussage „verbindet Nähe mit freiwilliger Verfügbarkeit“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Eine Kapazitätsgrenze ist kein Beweis mangelnder Bindung. Die Texte bestimmen keine allgemeine richtige Menge an Nähe und weisen keiner Person eine Pflicht zu dauernder Verfügbarkeit zu.",
     "detail": "Die Nachtszene behandelt den Wunsch nach Unterstützung und den eigenen Schlafbedarf. Die Werkstattkarte fragt nach freiwilliger Nähe und dem Recht auf Abstand. Der gemeinsame Blick macht konkrete Zusagen und Belastungsgrenzen besprechbar.",
     "quellen": [
      {
       "titel": "Family Connections · Unterstützung für Angehörige",
       "kurz": "Family Connections · Unterstützung für Angehörige",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "family-2024",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11659101/",
        "titelBestand": "Family Connections · Unterstützung für Angehörige"
       }
      },
      {
       "titel": "Traumainformierte Praxis · Sicherheit und Wahlmöglichkeiten",
       "kurz": "Traumainformierte Praxis · Sicherheit und Wahlmöglichkeiten",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "relationship-source:gov",
        "url": "https://www.gov.uk/government/publications/working-definition-of-trauma-informed-practice/working-definition-of-trauma-informed-practice",
        "titelBestand": "Traumainformierte Praxis · Sicherheit und Wahlmöglichkeiten"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1745,
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
       "satz": "verbindet Nähe mit freiwilliger Verfügbarkeit",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1037,
   "b": 339,
   "fugen": [
    {
     "richtung": "Vom Fehler zum ganzen Selbst → Scham oder Schuld",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "stellt Verantwortung und Selbsturteil gegenüber",
     "grund": "der belegten Originalaussage „stellt Verantwortung und Selbsturteil gegenüber“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Ein Schamgefühl diagnostiziert weder PTSD, komplexe PTSD, Depression noch eine Essstörung. Konkrete Verantwortung und eine pauschale Selbstverurteilung sind unterschiedliche Fragen.",
     "detail": "Die fiktive Szene unterscheidet einen konkreten scharfen Satz von einem Urteil über den ganzen persönlichen Wert. Der Neuroatlas ordnet Scham und Schuld unterschiedlichen möglichen Kontexten zu. Die Verbindung erlaubt, Verantwortungsübernahme, berichtetes Erleben und diagnostische Fragen getrennt zu halten.",
     "quellen": [
      {
       "titel": "Post-Traumatic Stress Disorder",
       "kurz": "Post-Traumatic Stress Disorder",
       "art": "Gesundheitsinformation",
       "zitat": "",
       "technisch": {
        "schluessel": "neuro-source:nimh-ptsd",
        "url": "https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd",
        "titelBestand": "Post-Traumatic Stress Disorder"
       }
      },
      {
       "titel": "Post-traumatic stress disorder · NG116",
       "kurz": "Post-traumatic stress disorder · NG116",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "neuro-source:nice-ptsd",
        "url": "https://www.nice.org.uk/guidance/ng116/chapter/recommendations",
        "titelBestand": "Post-traumatic stress disorder · NG116"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1746,
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
       "satz": "stellt Verantwortung und Selbsturteil gegenüber",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1029,
   "b": 274,
   "fugen": [
    {
     "richtung": "Mir selbst oder der Welt fremd → Dissoziative Störungsbilder",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "öffnet differenzierende Fragen",
     "grund": "der belegten Originalaussage „öffnet differenzierende Fragen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Die fiktive Szene beweist weder eine dissoziative Störung noch eine verborgene Traumageschichte. Neue, wiederkehrende oder auffällige Zustände können eine passende fachliche und körperliche Abklärung brauchen.",
     "detail": "Die Szene beschreibt einen fremd wirkenden Raum und eine fremd klingende eigene Stimme nach Stress. Der Neuroatlas-Kontext unterscheidet Selbst-, Umwelt- und Erinnerungserleben und fragt nach Beginn, Verlauf und anderen Erklärungen.",
     "quellen": [
      {
       "titel": "Dissociative disorders",
       "kurz": "Dissociative disorders",
       "art": "Gesundheitsinformation",
       "zitat": "",
       "technisch": {
        "schluessel": "neuro-source:nhs-dissociation",
        "url": "https://www.nhs.uk/mental-health/conditions/dissociative-disorders/",
        "titelBestand": "Dissociative disorders"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1747,
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
       "satz": "öffnet differenzierende Fragen",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1051,
   "b": 219,
   "fugen": [
    {
     "richtung": "Was kostet das scheinbare Gelingen? → Unterstützung und versteckte Kosten",
     "vomSchloss": true,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "vergleicht Ergebnis und zusätzlichen Aufwand",
     "grund": "der belegten Originalaussage „vergleicht Ergebnis und zusätzlichen Aufwand“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Eine Befragungsstudie mit Studierenden ist kein Beleg für die Ursache individueller Beziehungskosten und keine klinische ADHS- oder Autismusstudie. Dies ist ein ausdrücklich konzeptioneller Vergleich, keine gemeinsame Wirkungsmessung.",
     "detail": "Die fiktive Szene macht den Unterschied zwischen einem von außen gelungenen Treffen und berichteten Erholungskosten sichtbar. Der Fundus-Anschluss fragt nach der zusätzlichen Last von Erhebungen und trennt Teilnahme, Belastung und Aussagekraft. Beide richten den Blick auf Kosten, die ein sichtbares Ergebnis allein nicht beschreibt.",
     "quellen": [
      {
       "titel": "The effects of assessment intensity on participant burden, compliance, within-person variance, and within-person relationships in ambulatory assessment",
       "kurz": "The effects of assessment intensity on participant burden, compliance, within-person variance, and within-person relationships in ambulatory assessment",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "fundus-source:anschluss-ema-2022",
        "url": "https://link.springer.com/article/10.3758/s13428-021-01683-6",
        "titelBestand": "The effects of assessment intensity on participant burden, compliance, within-person variance, and within-person relationships in ambulatory assessment"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1748,
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
       "satz": "vergleicht Ergebnis und zusätzlichen Aufwand",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1038,
   "b": 1055,
   "fugen": [
    {
     "richtung": "Identitätsunsicherheit → Mein Bild von mir wechselt",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet diagnostischen Begriff und situatives Erleben",
     "grund": "der belegten Originalaussage „unterscheidet diagnostischen Begriff und situatives Erleben“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Schwankende Selbstbewertung in einer einzelnen Szene ist nicht gleichbedeutend mit einer anhaltenden Identitätsstörung. Der Vergleich vervollständigt kein Diagnosekriterium und erklärt keine Ursache.",
     "detail": "Der Dossierbegriff Identitätsunsicherheit gehört zu einem klinischen Kriterienkontext. Die fiktive Szene zeigt unterschiedliche eigene Selbstbewertungen nach zwei Begegnungen und lässt Dauer, andere Lebensbereiche und Beeinträchtigung ausdrücklich offen.",
     "quellen": [
      {
       "titel": "Borderline Personality Disorder – NIMH",
       "kurz": "Borderline Personality Disorder – NIMH",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:ae3d3e3e08a0aad",
        "url": "https://www.nimh.nih.gov/health/publications/borderline-personality-disorder",
        "titelBestand": "Borderline Personality Disorder – NIMH"
       }
      },
      {
       "titel": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
       "kurz": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:58630727af716c7",
        "url": "https://register.awmf.org/de/leitlinien/detail/038-015",
        "titelBestand": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1750,
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
       "satz": "unterscheidet diagnostischen Begriff und situatives Erleben",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1026,
   "b": 1060,
   "fugen": [
    {
     "richtung": "Intensive schwer regulierbare Wut → Wut wird laut",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet Gefühl und verantwortbares Verhalten",
     "grund": "der belegten Originalaussage „unterscheidet Gefühl und verantwortbares Verhalten“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Ein einzelner Wutausbruch erlaubt keine Persönlichkeitsdiagnose. Eine Verletzungserfahrung rechtfertigt keine Einschüchterung; Schutz und das Stoppen gefährdender Handlungen bleiben eigenständige Aufgaben.",
     "detail": "Der klinische Dossierbegriff beschreibt intensive, schwer regulierbare Wut. Die fiktive Szene trennt die berichtete Kränkung von lautem Sprechen, Türschlagen und der Angst anderer. Der Vergleich erlaubt, emotionales Erleben und die Verantwortung für konkrete Handlungen zugleich zu betrachten.",
     "quellen": [
      {
       "titel": "Borderline Personality Disorder – NIMH",
       "kurz": "Borderline Personality Disorder – NIMH",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:ae3d3e3e08a0aad",
        "url": "https://www.nimh.nih.gov/health/publications/borderline-personality-disorder",
        "titelBestand": "Borderline Personality Disorder – NIMH"
       }
      },
      {
       "titel": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
       "kurz": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:58630727af716c7",
        "url": "https://register.awmf.org/de/leitlinien/detail/038-015",
        "titelBestand": "S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1752,
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
       "satz": "unterscheidet Gefühl und verantwortbares Verhalten",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1038,
   "b": 1072,
   "fugen": [
    {
     "richtung": "Schwankender Selbstwert → Mein Bild von mir wechselt",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet Selbstwert und Situationsbewertung",
     "grund": "der belegten Originalaussage „unterscheidet Selbstwert und Situationsbewertung“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Schwankender Selbstwert ist keine Bewertung des tatsächlichen persönlichen Werts. Eine fiktive Alltagsszene validiert kein Konstrukt und belegt keine Persönlichkeitsstörung.",
     "detail": "Der Dossierbegriff schwankender Selbstwert beschreibt ein transdiagnostisch untersuchtes Konstrukt. Die fiktive Szene stellt Selbstbewertungen nach verschiedenen Beziehungssituationen gegenüber. Damit lässt sich fragen, ob ein momentanes Urteil, ein längerer Verlauf oder andere Aspekte des Selbstbilds gemeint sind.",
     "quellen": [
      {
       "titel": "Negative affective arousal precedes lower self-esteem in BPD: experience sampling",
       "kurz": "Negative affective arousal precedes lower self-esteem in BPD: experience sampling",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "source:bpd:6b39efc6d9b8635",
        "url": "https://link.springer.com/article/10.1186/s40479-023-00229-w",
        "titelBestand": "Negative affective arousal precedes lower self-esteem in BPD: experience sampling"
       }
      }
     ],
     "herkunft": "Redaktionelle Verbindung vorhandener Atlasinhalte",
     "technisch": {
      "fugeIndex": 1756,
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
       "satz": "unterscheidet Selbstwert und Situationsbewertung",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1046,
   "b": 1193,
   "fugen": [
    {
     "richtung": "Digitale Kontrolle ist ein Beziehungsgeschehen → Missverständnis und Macht sind zwei Fragen",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet Verständigungsfragen und tatsächliche Kontrolle",
     "grund": "der belegten Originalaussage „unterscheidet Verständigungsfragen und tatsächliche Kontrolle“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke zwischen den angegebenen Texten. Quellen belegen nur ihren jeweils bezeichneten Inhalt und Prüfstand. Keine Gleichsetzung von Populationen, Diagnose, individuelle Ursache oder bestätigte Wirksamkeit einer Methode.",
     "detail": "Die Beziehungsszene hält kommunikative Passung und Entscheidungsmacht auseinander. Die neue Quelle beschreibt tatsächlich eingesetzte Technik zur Einschüchterung und Isolation. Die Verbindung macht deutlich, weshalb bessere Übersetzung eine Frage sein kann, ohne ausgeübte Kontrolle zum bloßen Missverständnis oder alten Trigger umzudeuten.",
     "quellen": [
      {
       "titel": "The Abuse of Technology in Domestic Violence and Stalking",
       "kurz": "The Abuse of Technology in Domestic Violence and Stalking",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:woodlock-2017-abstract",
        "url": "https://pubmed.ncbi.nlm.nih.gov/27178564/",
        "titelBestand": "The Abuse of Technology in Domestic Violence and Stalking"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke aus geprüften Wave-2-Abschnitten und vorhandenem Atlas",
     "technisch": {
      "fugeIndex": 1779,
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
       "satz": "unterscheidet Verständigungsfragen und tatsächliche Kontrolle",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1034,
   "b": 1194,
   "fugen": [
    {
     "richtung": "Schutz braucht einen passenden nächsten Schritt → Auch meine Grenze gilt",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet persönliche Zusage und technischen Schutzplan",
     "grund": "der belegten Originalaussage „unterscheidet persönliche Zusage und technischen Schutzplan“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke zwischen den angegebenen Texten. Quellen belegen nur ihren jeweils bezeichneten Inhalt und Prüfstand. Keine Gleichsetzung von Populationen, Diagnose, individuelle Ursache oder bestätigte Wirksamkeit einer Methode.",
     "detail": "Die Alltagsszene fragt, welche Erreichbarkeit freiwillig und tragbar zugesagt werden kann. Bei möglicher technischer Überwachung kommt eine eigenständige Schutzfrage hinzu: sichere Kommunikation und Änderungen an Zugängen müssen zur konkreten Lage passen. Die allgemeine Grenzkarte ersetzt diesen technischen und gegebenenfalls spezialisierten Schutzplan nicht.",
     "quellen": [
      {
       "titel": "Online safety checklist",
       "kurz": "Online safety checklist",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:esafety-online-safety-2026",
        "url": "https://www.esafety.gov.au/key-topics/domestic-family-violence/online-safety-checklist",
        "titelBestand": "Online safety checklist"
       }
      },
      {
       "titel": "Family Connections · Unterstützung für Angehörige",
       "kurz": "Family Connections · Unterstützung für Angehörige",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "family-2024",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11659101/",
        "titelBestand": "Family Connections · Unterstützung für Angehörige"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke aus geprüften Wave-2-Abschnitten und vorhandenem Atlas",
     "technisch": {
      "fugeIndex": 1781,
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
       "satz": "unterscheidet persönliche Zusage und technischen Schutzplan",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1046,
   "b": 1201,
   "fugen": [
    {
     "richtung": "Ein Zusammenhang ist keine Gewaltprognose → Missverständnis und Macht sind zwei Fragen",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "unterscheidet Erklärung von Macht und Schutz",
     "grund": "der belegten Originalaussage „unterscheidet Erklärung von Macht und Schutz“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke. Die Quellen belegen nur die jeweils bezeichneten Endpunktinhalte und ihren dokumentierten Prüfstand. Die Verbindung ist kein Ursachen-, Diagnose-, Häufigkeits- oder Wirksamkeitsnachweis und erweitert den Prüfstand historischer Quellen nicht.",
     "detail": "Die Metaanalyse liefert keine individuelle Gewaltprognose. Der bestehende Lerntext fragt getrennt nach kommunikativer Passung und Entscheidungsmacht. Eine mögliche Erklärung von Reaktionen beantwortet deshalb nicht, wer Handlungsspielraum hat oder wer Nachteile trägt.",
     "quellen": [
      {
       "titel": "The Link between Narcissism and Aggression: A Meta-Analytic Review",
       "kurz": "The Link between Narcissism and Aggression: A Meta-Analytic Review",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:kjaervik-2021-aggression-review-abstract",
        "url": "https://pubmed.ncbi.nlm.nih.gov/34292012/",
        "titelBestand": "The Link between Narcissism and Aggression: A Meta-Analytic Review"
       }
      }
     ],
     "herkunft": "Lesebrücke aus Batch B und vorhandenem Atlas",
     "technisch": {
      "fugeIndex": 1790,
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
       "satz": "unterscheidet Erklärung von Macht und Schutz",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1028,
   "b": 1202,
   "fugen": [
    {
     "richtung": "Rückzug braucht eine genaue Frage → Rückzug hat mehrere mögliche Bedeutungen",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "vergleicht ähnliche Erscheinungen mit verschiedenen Bedeutungen",
     "grund": "der belegten Originalaussage „vergleicht ähnliche Erscheinungen mit verschiedenen Bedeutungen“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke. Die Quellen belegen nur die jeweils bezeichneten Endpunktinhalte und ihren dokumentierten Prüfstand. Die Verbindung ist kein Ursachen-, Diagnose-, Häufigkeits- oder Wirksamkeitsnachweis und erweitert den Prüfstand historischer Quellen nicht.",
     "detail": "Der neue Abschnitt begrenzt die Übertragung einer Angstbehandlung auf jeden Rückzug. Der bestehende Lerntext unterscheidet beobachtbares Weggehen von vermuteter Absicht oder Diagnose. Erholung, Angst, Überlastung und eine gewählte Pause sind Fragen an den Kontext, keine automatische Zuordnung.",
     "quellen": [
      {
       "titel": "Social Anxiety Disorder: Recognition, Assessment and Treatment — Recommendations",
       "kurz": "Social Anxiety Disorder: Recognition, Assessment and Treatment — Recommendations",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:nice-cg159-social-anxiety",
        "url": "https://www.nice.org.uk/guidance/cg159/chapter/recommendations",
        "titelBestand": "Social Anxiety Disorder: Recognition, Assessment and Treatment — Recommendations"
       }
      },
      {
       "titel": "Autism spectrum disorder in adults: diagnosis and management · NICE CG142",
       "kurz": "Autism spectrum disorder in adults: diagnosis and management · NICE CG142",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:nice-cg142",
        "url": "https://www.nice.org.uk/guidance/cg142",
        "titelBestand": "Autism spectrum disorder in adults: diagnosis and management · NICE CG142"
       }
      }
     ],
     "herkunft": "Lesebrücke aus Batch B und vorhandenem Atlas",
     "technisch": {
      "fugeIndex": 1792,
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
       "satz": "vergleicht ähnliche Erscheinungen mit verschiedenen Bedeutungen",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1035,
   "b": 1209,
   "fugen": [
    {
     "richtung": "Angehörigenhilfe und die Bedeutung eines aktiven Vergleichs → Unterstützung bleibt ein Angebot",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "ordnet Angehörigenhilfe als freiwilliges Angebot ein",
     "grund": "der belegten Originalaussage „ordnet Angehörigenhilfe als freiwilliges Angebot ein“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke, kein neuer Studienbefund. Quellen tragen nur die jeweils bezeichneten Endpunktinhalte; ihre Vereinigung belegt keine geprüfte Kausalität, persönliche Diagnose oder Wirksamkeit des Atlaswerkzeugs.",
     "detail": "Das Angehörigenprogramm untersucht Unterstützung unter strukturierten Bedingungen. Die Alltagsszene macht dagegen das Recht sichtbar, ein Hilfsangebot abzulehnen. Ein nicht überlegener aktiver Vergleichsarm begründet weder eine Pflicht zur Teilnahme noch eine Pflicht zur Verfügbarkeit des Gegenübers.",
     "quellen": [
      {
       "titel": "“Family Connections”, a program for relatives of people with borderline personality disorder: A randomized controlled trial",
       "kurz": "“Family Connections”, a program for relatives of people with borderline personality disorder: A randomized controlled trial",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:guillen-2024-abstract",
        "url": "https://pubmed.ncbi.nlm.nih.gov/39624006/",
        "titelBestand": "“Family Connections”, a program for relatives of people with borderline personality disorder: A randomized controlled trial"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke aus Batch C und vorhandenem Atlas",
     "technisch": {
      "fugeIndex": 1801,
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
       "satz": "ordnet Angehörigenhilfe als freiwilliges Angebot ein",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1035,
   "b": 1212,
   "fugen": [
    {
     "richtung": "Unterstützung hat einen Kontext → Unterstützung bleibt ein Angebot",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "stellt Laborunterstützung und vereinbarte Alltagshilfe gegenüber",
     "grund": "der belegten Originalaussage „stellt Laborunterstützung und vereinbarte Alltagshilfe gegenüber“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke, kein neuer Studienbefund. Quellen tragen nur die jeweils bezeichneten Endpunktinhalte; ihre Vereinigung belegt keine geprüfte Kausalität, persönliche Diagnose oder Wirksamkeit des Atlaswerkzeugs.",
     "detail": "Der Laborbefund zu unauffälliger Unterstützung vor einer Redeaufgabe erklärt nicht, was eine Person in einer Beziehung braucht. Die Alltagsszene stellt deshalb die ausgesprochene Bitte, Zustimmung und das Recht zur Ablehnung in den Mittelpunkt. Aus dem Befund folgt keine Erlaubnis zu heimlicher Steuerung.",
     "quellen": [
      {
       "titel": "Effects of Social Support Visibility on Adjustment to Stress: Experimental Evidence",
       "kurz": "Effects of Social Support Visibility on Adjustment to Stress: Experimental Evidence",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:bolger-amarel-2007-abstract",
        "url": "https://www.columbia.edu/~nb2229/docs/bolger-amarel-support-experiments-2006.pdf",
        "titelBestand": "Effects of Social Support Visibility on Adjustment to Stress: Experimental Evidence"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke aus Batch C und vorhandenem Atlas",
     "technisch": {
      "fugeIndex": 1805,
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
       "satz": "stellt Laborunterstützung und vereinbarte Alltagshilfe gegenüber",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1037,
   "b": 1221,
   "fugen": [
    {
     "richtung": "Selbstmitgefühl: wofür ein Versuch spricht → Vom Fehler zum ganzen Selbst",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "ergänzt die Lernszene um eine Methodenfrage",
     "grund": "der belegten Originalaussage „ergänzt die Lernszene um eine Methodenfrage“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke zwischen den benannten Texten; keine zusätzliche Studie und kein Beleg einer kausalen Wirkung. Quellen und Lesegrade gelten jeweils für ihren Endpunkt.",
     "detail": "Die erfundene Beziehungsszene trennt konkrete Verantwortung vom pauschalen Urteil über den eigenen Wert. Der neue Abschnitt eröffnet dazu eine freiwillige Erkundung des inneren Umgangstons. Die Szene ist kein Versuchsergebnis, und die Studie bestätigt nicht den Verlauf dieser erfundenen Situation.",
     "quellen": [
      {
       "titel": "Self-compassion as an emotion regulation strategy in major depressive disorder",
       "kurz": "Self-compassion as an emotion regulation strategy in major depressive disorder",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:diedrich-2014-self-compassion",
        "url": "https://pubmed.ncbi.nlm.nih.gov/24929927/",
        "titelBestand": "Self-compassion as an emotion regulation strategy in major depressive disorder"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke · Prüfgruppe D",
     "technisch": {
      "fugeIndex": 1822,
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
       "satz": "ergänzt die Lernszene um eine Methodenfrage",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1046,
   "b": 1223,
   "fugen": [
    {
     "richtung": "Schutz hängt nicht an einem Grenzwert → Missverständnis und Macht sind zwei Fragen",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "trennt Verständigung von Handlungsmacht",
     "grund": "der belegten Originalaussage „trennt Verständigung von Handlungsmacht“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke zwischen den benannten Texten; keine zusätzliche Studie und kein Beleg einer kausalen Wirkung. Quellen und Lesegrade gelten jeweils für ihren Endpunkt.",
     "detail": "Die vorhandene Lernszene fragt nach unterschiedlicher Entscheidungsmacht bei Missverständnissen. Der neue Abschnitt erweitert den Blick auf Kontrolle und Schutz. Der Zusammenhang behauptet nicht, dass die erfundene Arbeitsszene bereits eine Gewalttypologie erfüllt.",
     "quellen": [
      {
       "titel": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types",
       "kurz": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:hardesty-2015-coercive-control",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4553695/",
        "titelBestand": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke · Prüfgruppe D",
     "technisch": {
      "fugeIndex": 1825,
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
       "satz": "trennt Verständigung von Handlungsmacht",
       "geltung": "redaktionell zugeordnet",
       "status": "redaktionelle Zuordnung"
      }
     ]
    }
   ],
   "saetzeOhneFuge": []
  },
  {
   "a": 1034,
   "b": 1223,
   "fugen": [
    {
     "richtung": "Schutz hängt nicht an einem Grenzwert → Auch meine Grenze gilt",
     "vomSchloss": false,
     "art": "aussage",
     "artWort": "Aussage",
     "label": "verbindet Grenzen mit Handlungsspielraum",
     "grund": "der belegten Originalaussage „verbindet Grenzen mit Handlungsspielraum“",
     "geltung": "redaktionell",
     "geltungWort": "redaktionell zugeordnet",
     "status": "redaktionelle-zuordnung",
     "statusWort": "redaktionelle Zuordnung",
     "grenze": "Redaktionelle Lesebrücke zwischen den benannten Texten; keine zusätzliche Studie und kein Beleg einer kausalen Wirkung. Quellen und Lesegrade gelten jeweils für ihren Endpunkt.",
     "detail": "Die vorhandene Szene beschreibt eine tragbare persönliche Zusage. Der neue Abschnitt eröffnet zusätzlich die Frage, ob Nein-Sagen tatsächlich möglich ist und welche Konsequenzen drohen. Nicht jede Verfügbarkeitsfrage wird dadurch zu Zwangskontrolle erklärt.",
     "quellen": [
      {
       "titel": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types",
       "kurz": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "verified:hardesty-2015-coercive-control",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4553695/",
        "titelBestand": "Toward a Standard Approach to Operationalizing Coercive Control and Classifying Violence Types"
       }
      },
      {
       "titel": "Family Connections · Unterstützung für Angehörige",
       "kurz": "Family Connections · Unterstützung für Angehörige",
       "art": "Quelle",
       "zitat": "",
       "technisch": {
        "schluessel": "family-2024",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11659101/",
        "titelBestand": "Family Connections · Unterstützung für Angehörige"
       }
      }
     ],
     "herkunft": "Redaktionelle Lesebrücke · Prüfgruppe D",
     "technisch": {
      "fugeIndex": 1826,
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
       "satz": "verbindet Grenzen mit Handlungsspielraum",
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
  "1025": [
   46,
   16,
   17
  ],
  "1026": [
   19,
   55,
   18
  ],
  "1027": [
   20
  ],
  "1028": [
   22,
   21,
   60
  ],
  "1029": [
   23,
   52
  ],
  "1030": [
   6
  ],
  "1031": [
   0,
   1,
   2,
   3,
   4,
   5
  ],
  "1032": [
   7,
   8
  ],
  "1033": [
   10,
   11,
   9
  ],
  "1034": [
   12,
   50,
   58,
   65,
   13
  ],
  "1035": [
   61,
   14,
   45,
   62,
   15
  ],
  "1036": [
   24,
   26,
   25
  ],
  "1037": [
   27,
   51,
   63
  ],
  "1038": [
   29,
   28,
   54,
   56
  ],
  "1039": [
   31,
   30
  ],
  "1041": [
   47,
   32
  ],
  "1042": [
   48,
   33
  ],
  "1043": [
   34
  ],
  "1044": [
   49,
   35
  ],
  "1045": [
   36
  ],
  "1046": [
   57,
   59,
   64,
   37
  ],
  "1047": [
   38
  ],
  "1049": [
   39,
   40
  ],
  "1050": [
   41
  ],
  "1051": [
   42,
   53
  ],
  "1052": [
   43,
   44
  ]
 },
 "feld": {
  "orte": [
   1025,
   1026,
   1027,
   1028,
   1029,
   1030,
   1031,
   1032,
   1033,
   1034,
   1035,
   1036,
   1037,
   1038,
   1039,
   1040,
   1041,
   1042,
   1043,
   1044,
   1045,
   1046,
   1047,
   1048,
   1049,
   1050,
   1051,
   1052,
   1223,
   1209,
   562,
   560,
   1013,
   1193,
   274,
   1201,
   563,
   1055,
   1060,
   565,
   561,
   1202,
   339,
   1194,
   1072,
   1221,
   1212,
   219,
   1053
  ],
  "paare": [
   1,
   6,
   2,
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
   26,
   27,
   28,
   29,
   30,
   31,
   32,
   33,
   34,
   35,
   36,
   37,
   38,
   39,
   40,
   41,
   42,
   43,
   44,
   45,
   46,
   47,
   48,
   49,
   50,
   51,
   52,
   53,
   3,
   54,
   55,
   56,
   57,
   58,
   59,
   60,
   61,
   62,
   63,
   64,
   65
  ],
  "gebiete": [
   {
    "name": "Beziehungen & Borderline",
    "mitte": {
     "x": 0,
     "y": 0
    },
    "radius": 7.422,
    "heim": true
   },
   {
    "name": "Forschung & Einordnung",
    "mitte": {
     "x": 9.234,
     "y": 12.351
    },
    "radius": 7.099,
    "heim": false
   },
   {
    "name": "Beziehungswerkstatt",
    "mitte": {
     "x": -4.043,
     "y": 9.995
    },
    "radius": 2.46,
    "heim": false
   },
   {
    "name": "ADHS · Randphänomene",
    "mitte": {
     "x": -8.837,
     "y": -1.231
    },
    "radius": 0.6,
    "heim": false
   },
   {
    "name": "Neuroatlas",
    "mitte": {
     "x": 0.581,
     "y": 9.456
    },
    "radius": 1.152,
    "heim": false
   },
   {
    "name": "Diagnose & Differenzierung",
    "mitte": {
     "x": 0.916,
     "y": -10.439
    },
    "radius": 2.157,
    "heim": false
   },
   {
    "name": "Phänomenatlas",
    "mitte": {
     "x": 8.005,
     "y": 3.94
    },
    "radius": 0.6,
    "heim": false
   }
  ],
  "regel": {
   "text": "Das Feld zeigt alle Orte im Gebiet „Beziehungen & Borderline“, zu dem Die Angst vor Verlust ist groß gehört, dazu jeden Ort, der mit einem von ihnen durch eine Fuge im Lesebestand verbunden ist, und diese Fugen.",
   "begrenzung": "Begrenzt wird erst bei sehr großen Feldern; hier fehlt nichts.",
   "lage": "Innerhalb eines Gebiets folgt die Lage der Karte, gestreckt (das eigene Gebiet in beiden Richtungen auf gleiche Ausdehnung, andere Gebiete enger) und so weit auseinandergeschoben, dass sich Zeichen nicht berühren. Andere Gebiete stehen in der Richtung, in der sie auf der Karte liegen, aber näher herangerückt."
  },
  "technisch": {
   "heimGebiet": 6,
   "orteGesamt": 49,
   "nachbarnGesamt": 21,
   "fugenGesamt": 64,
   "paareGesamt": 64,
   "begrenzt": false,
   "feldMax": 160
  }
 },
 "fehlstellen": [
  {
   "orte": [
    219
   ],
   "gebiet": "Phänomenatlas",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Unterstützung und versteckte Kosten",
    "gebiet": "Phänomenatlas",
    "technisch": {
     "ortIndex": 219
    }
   },
   "detail": "Welche Beobachtung ist nötig, und wie viel zusätzliche Organisationsarbeit erzeugt ihre Erhebung? Bezug zur Forschung: Häufigere Befragungen erhöhten in einem Experiment die empfundene Last, ohne die Teilnahmequote entsprechend zu verändern. Eine längere Befragung zeigte ein anderes Wirkungsprofil.",
   "technisch": {
    "gegen": 219
   }
  },
  {
   "orte": [
    562
   ],
   "gebiet": "Beziehungswerkstatt",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Anspannung und Handlungsspielraum",
    "gebiet": "Beziehungswerkstatt",
    "technisch": {
     "ortIndex": 562
    }
   },
   "detail": "Welches benannte Problem soll Unterstützung verändern, unabhängig von der Frage nach dem Neurotyp? Bezug zur Forschung: Bei ausgewählten autistischen Erwachsenen ohne intellektuelle Beeinträchtigung verbesserte DBT die berichtete Emotionsregulation gegenüber einer Warteliste. Die Verbesserung blieb in der Nachbeobachtung erkennbar.",
   "technisch": {
    "gegen": 562
   }
  },
  {
   "orte": [
    561
   ],
   "gebiet": "Beziehungswerkstatt",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Nähe, Freiheit und Grenzen",
    "gebiet": "Beziehungswerkstatt",
    "technisch": {
     "ortIndex": 561
    }
   },
   "detail": "Welche Anforderung, Angst, sensorische Belastung, Unklarheit oder Autonomieverletzung liegt tatsächlich vor? Bezug zur Forschung: Angst und autistische Merkmale trugen in den Befragungen jeweils zur statistischen Erklärung extremer Anforderungsvermeidung bei. Ein einheitlicher Bedrohungsmechanismus folgt daraus nicht.",
   "technisch": {
    "gegen": 561
   }
  },
  {
   "orte": [
    565
   ],
   "gebiet": "Beziehungswerkstatt",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Mehr als eine mögliche Innenwelt",
    "gebiet": "Beziehungswerkstatt",
    "technisch": {
     "ortIndex": 565
    }
   },
   "detail": "Welche tatsächliche Rückmeldung prüft die vermutete Innenwelt, statt sie aus einem Etikett abzuleiten? Bezug zur Forschung: Die erste Informationskettenstudie fand Vorteile gleich zusammengesetzter Gruppen. Die größere registrierte Replikation fand keinen entsprechenden Unterschied der Informationsübertragung; Beziehungsbewertungen zeigten ein anderes Muster.",
   "technisch": {
    "gegen": 565
   }
  },
  {
   "orte": [
    563
   ],
   "gebiet": "Beziehungswerkstatt",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Erleben anerkennen",
    "gebiet": "Beziehungswerkstatt",
    "technisch": {
     "ortIndex": 563
    }
   },
   "detail": "Welche gemeinsame Handlung wird leichter, und bleibt sie für das Kind bedeutsam und zumutbar? Bezug zur Forschung: PACT zeigt, dass ein gezieltes Kommunikationsangebot bestimmte soziale Kommunikations- und beobachtete Merkmalsendpunkte langfristig beeinflussen kann. Entwicklungsunterstützung ist auch bei erheblicher genetischer Mitwirkung möglich.",
   "technisch": {
    "gegen": 563
   }
  },
  {
   "orte": [
    560
   ],
   "gebiet": "Beziehungswerkstatt",
   "modus": "befund-fehlt",
   "gebildetAus": "Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund",
   "label": "öffnet eine Forschungsfrage zu",
   "gegenueber": {
    "titel": "Beobachtung und Deutung",
    "gebiet": "Beziehungswerkstatt",
    "technisch": {
     "ortIndex": 560
    }
   },
   "detail": "Bleibt der Zusammenhang nach passenden Negativkontrollen und familiären Vergleichen bestehen? Bezug zur Forschung: In der Infektionsstudie veränderten familienbasierte Kontrollen die Deutung beobachteter Autismuszusammenhänge. Eine plausible biologische Geschichte allein reicht deshalb nicht als Nachweis einer Umweltverursachung.",
   "technisch": {
    "gegen": 560
   }
  }
 ]
};
