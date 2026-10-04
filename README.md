# Nossair Ouladali · Portfolio

Persönliche Portfolio-Webseite von Nossair Ouladali – Senior Software Engineer & Architekt, Smart-Home-Tüftler, Heimwerker und Japan-Fan.

**Stack:** Vue 3 · TypeScript · Vite · selbst gehostete Schriften (Inter, Space Grotesk, JetBrains Mono) · Lucide-Icons. Kein CSS-Framework, keine Cookies, kein Tracking.

## Konzept

Technisches Design im Werkstatt-Look (Graphit, Blaupausen-Raster, Lochwand), Akzente in Stirnlampen-Amber und Blaupausen-Cyan. Jeder Skill hat sein eigenes Werkzeug, das animiert zeigt, worum es geht:

| Skill | Werkzeug | Animation |
|---|---|---|
| Software Engineering | Mechanische Tastatur | Tippt einen Pricing-Service, jede Taste wird sichtbar gedrückt (`ToolKeyboard.vue`) |
| Software-Architektur | Zollstock | Klappt Glied für Glied auf und vermisst eine Systemarchitektur (`ToolRuler.vue`) |
| CI/CD & Cloud | Schraubendreher | Verschraubt die Pipeline-Stufen, dann läuft ein Build von On-Prem in die Cloud (`ToolScrewdriver.vue`) |
| Code-Qualität & Testing | Akku-Laubbläser | Pustet Bugs und Code Smells vom Code, bis das Quality Gate grün ist (`ToolLeafBlower.vue`) |
| Data & Machine Learning | Stirnlampe | Leuchtet in eine Punktwolke, findet den Trend und zeichnet die Prognose (`ToolHeadlamp.vue`) |
| Teams & Mentoring | Wasserwaage | Pendelt sich ein, bis das Team im Lot ist (`ToolLevel.vue`) |

Weitere Highlights:

- **Laptop-Intro**: Der Laptop klappt auf, bootet die „Werkbank“, und die Kamera fährt in den Bildschirm (`IntroLaptop.vue`). Überspringbar, läuft einmal pro Sitzung und entfällt bei `prefers-reduced-motion`.
- **Stirnlampe im Hero**: Ein Lichtkegel folgt der Maus über das Blaupausen-Raster, das Porträt steckt in einem „Datenblatt“.
- **Werdegang als `git log --graph`**: Beruf (`main`) und Studium (`edu`) als zwei Branches inklusive Merges (`CareerSection.vue`, Daten in `config/career.ts`).
- **„Das Haus als Werkstatt“**: Eine scrollgesteuerte Szene (wie die Hebebühne bei ayvaz) begleitet einen Nachmittag bis in den Abend. Der Akkuschrauber montiert ein Regal, der Mähroboter mäht den Rasen, der Raspberry Pi verbindet das Smart Home, Rollläden und Licht schalten automatisch. Auf dem Handy mit Kamerafahrt (`HomeScene.vue`).
- **Japan**: Ein Shinkansen fährt beim Scrollen am Fuji vorbei, mit Tacho bis 320 km/h (`TravelSection.vue`).
- **Skizzenbuch**: Statt Fotos selbst gezeichnete Blaupausen-Skizzen (Werkzeugwand, Smart-Home-Schaltplan, Hochbeet, Tokyo Tower, Fushimi Inari, Shinkansen, Puerta de Alcalá), die sich beim Scrollen Strich für Strich aufzeichnen (`ui/SketchCard.vue`, `sketches/`).
- **Kontakt per Enter-Taste**: Eine große mechanische Taste öffnet das Mailprogramm.

## Inhalte ändern

- Stammdaten (E-Mail, LinkedIn, Rolle …): `src/config/site.ts`
- Werdegang: `src/config/career.ts`
- Projekte & Tech-Stack: `src/config/projects.ts`
- Skills: `src/components/SkillsSection.vue`
- Fotos: `src/assets/img/` (WebP, ohne EXIF/GPS)
- Skizzen: `src/components/sketches/` – jede Skizze ist ein SVG und lässt sich später durch ein echtes Foto ersetzen

Telefonnummer, Geburtsdatum und Wohnanschrift aus dem Lebenslauf sind bewusst **nicht** auf der Seite. Für ein vollständiges Impressum kann die Anschrift in `site.ts` unter `legalAddress` ergänzt werden.

## Entwicklung

```bash
npm install
npm run dev        # lokaler Dev-Server
npm run build      # Typecheck + Produktions-Build nach dist/
npm run preview    # gebauten Stand lokal ansehen
```

## Branches & Deployment (GitHub Pages)

| Branch   | Inhalt |
|----------|--------|
| `main`   | Quellcode |
| `deploy` | Fertig gebaute Seite (Inhalt von `dist/`) – das, was über GitHub Pages ausgeliefert wird |

Jeder Push auf `main` startet `.github/workflows/deploy.yml`: Die Seite wird gebaut und der Build auf `deploy` gelegt. Der Branch `deploy` wird also bei jeder Änderung automatisch neu befüllt und ausgeliefert, bitte nicht von Hand darauf committen.

Der Build nutzt relative Pfade (`base: './'`) und läuft daher unverändert unter `https://yildiz61.github.io/nsr-webseite/`, unter einer eigenen Domain oder in einem Unterordner beim Webhoster.

**GitHub Pages einschalten (einmalig):** Repository → *Settings* → *Pages* → *Build and deployment* → Source „Deploy from a branch“ → Branch `deploy` / `(root)` → *Save*.
