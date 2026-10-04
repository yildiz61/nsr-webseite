/**
 * Werdegang als `git log --graph` – neueste Einträge zuerst.
 * Zwei Spuren: `main` (Beruf) und `edu` (Studium).
 */
export type MainLane = 'head' | 'dot' | 'line' | 'root'
export type EduLane = 'none' | 'line' | 'dot' | 'fork' | 'merge'

export interface Commit {
  hash: string
  date: string
  refs?: string[]
  title: string
  org: string
  main: MainLane
  edu: EduLane
  bullets?: string[]
  tech?: string[]
}

export const commits: Commit[] = [
  {
    hash: 'a9f3c21',
    date: '02/2022 – heute',
    refs: ['HEAD -> main', 'tag: senior'],
    title: 'Senior Anwendungsentwickler & -architekt',
    org: 'DZ BANK AG · Frankfurt am Main',
    main: 'head',
    edu: 'none',
    bullets: [
      'Pionierarbeit beim Umzug des CI/CD-Prozesses von On-Premise in die Google Cloud',
      'Fachlich verantwortlich für die CI-Pipelines: Build, Test und statische Codeanalyse',
      'Eigenes Testframework für Unittests sowie eine Entwicklerumgebung aus VSCode, Python und Docker',
      'Datenschutzkonformer Anonymisierungsprozess für Entwicklerdaten',
      'Leitung und Unterstützung von Dualen Studenten, Werkstudenten und Trainees',
    ],
    tech: ['Python', 'Java', 'REST', 'Jenkins', 'GitLab', 'SonarQube', 'Docker', 'Google Cloud', 'MSSQL', 'Automic'],
  },
  {
    hash: '7c1e0b4',
    date: '07/2021',
    title: 'Anwendungsentwickler',
    org: 'DZ BANK AG · Frankfurt am Main',
    main: 'dot',
    edu: 'none',
    bullets: [
      'Fachliche Anforderungen agil nach Scrum umgesetzt (Jira, Confluence)',
      'Objektorientierte Applikation zur Optionspreisbestimmung',
      'Pricing-Service für intern gehandelte Kryptowährungen – Fixing- und Rollprozess für Bitcoin und Ether',
    ],
    tech: ['Python', 'Java', 'Shell', 'Jira', 'Confluence'],
  },
  {
    hash: 'e42d9aa',
    date: '10/2020',
    refs: ['tag: m.sc.'],
    title: "Merge branch 'master-wirtschaftsinformatik'",
    org: 'M.Sc. Wirtschaftsinformatik · TU Darmstadt · Note 1,6',
    main: 'dot',
    edu: 'merge',
    bullets: [
      'Masterarbeit (Note 1,0): Machine-Learning-Applikation, die Produktionsstörungen in einer Achsmontage quantifiziert und passende Fehlerbehebungen vorschlägt',
    ],
    tech: ['Machine Learning', 'Python'],
  },
  {
    hash: '3b8f61d',
    date: '08/2020 – 06/2021',
    title: 'BI & Data Warehouse Analyst',
    org: 'GIZS GmbH & Co. KG · Frankfurt am Main',
    main: 'dot',
    edu: 'line',
    bullets: [
      'Aufbau eines Enterprise Data Warehouse inklusive ein- und ausgehender ETL-Strecken',
      'Prognosemodell für Transaktionen mit Zeitreihenanalyse und Machine Learning',
      'Break-Even-Analyse zur Identifikation rentabler Sparkassen',
    ],
    tech: ['Python', 'Java', 'MySQL', 'Pentaho', 'Tableau', 'Git'],
  },
  {
    hash: 'd05a7e9',
    date: '07/2019',
    title: 'Werkstudent BI & Data Warehouse',
    org: 'GIZS GmbH & Co. KG · Frankfurt am Main',
    main: 'dot',
    edu: 'line',
  },
  {
    hash: '91cc3f0',
    date: '01/2019 – 06/2019',
    title: 'Auslandssemester in Madrid',
    org: 'Universidad Politécnica de Madrid',
    main: 'line',
    edu: 'dot',
    bullets: ['Vertiefung in Operations Research und Projektmanagement'],
  },
  {
    hash: '5f2b8c7',
    date: '04/2018',
    title: "checkout -b master-wirtschaftsinformatik",
    org: 'Start M.Sc. Wirtschaftsinformatik · TU Darmstadt',
    main: 'line',
    edu: 'fork',
  },
  {
    hash: 'b7d413e',
    date: '12/2017',
    refs: ['tag: b.sc.'],
    title: "Merge branch 'bachelor-wirtschaftsinformatik'",
    org: 'B.Sc. Wirtschaftsinformatik · TU Darmstadt',
    main: 'dot',
    edu: 'merge',
    bullets: ['Bachelorarbeit (Note 1,7): Erfolgsfaktoren von Webseiten im Kontext der Sharing Economy'],
  },
  {
    hash: '0e6a95b',
    date: '10/2017 – 12/2018',
    title: 'Werkstudent Softwareentwicklung',
    org: 'Nterra Integration GmbH · Griesheim',
    main: 'dot',
    edu: 'line',
    bullets: [
      'Webbasiertes Transaktions-Monitoring für ein ESB-System – Frontend und Backend',
      'Test Driven Development und User Stories gemeinsam mit den Stakeholdern',
      'Demo-Anwendungsfall für den Vertrieb',
    ],
    tech: ['Java', 'Spring Boot', 'JPA', 'REST', 'Angular', 'PostgreSQL', 'Docker'],
  },
  {
    hash: 'c3e19d2',
    date: '10/2013',
    title: 'checkout -b bachelor-wirtschaftsinformatik',
    org: 'Start B.Sc. Wirtschaftsinformatik · TU Darmstadt',
    main: 'line',
    edu: 'fork',
  },
  {
    hash: '1a2b3c4',
    date: '07/2013',
    title: 'Initial commit',
    org: 'Abitur · Friedrich-List-Schule Wiesbaden · LK Mathematik & Wirtschaft',
    main: 'root',
    edu: 'none',
  },
]
