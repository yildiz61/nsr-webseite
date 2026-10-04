export interface WorkPiece {
  id: string
  title: string
  context: string
  text: string
  tags: string[]
}

/** „Werkstücke“ aus Job und Studium */
export const workPieces: WorkPiece[] = [
  {
    id: 'WO-01',
    title: 'Optionspreis-Applikation',
    context: 'DZ BANK',
    text: 'Objektorientierte Applikation zur Optionspreisbestimmung – tief drin in komplexen Finanzmodellen.',
    tags: ['OOP', 'Finanzmodelle'],
  },
  {
    id: 'WO-02',
    title: 'Krypto-Fixing & Roll',
    context: 'DZ BANK',
    text: 'Service, der potenzielle Preise für intern gehandelte Kryptowährungen wie Bitcoin und Ether ermittelt.',
    tags: ['Service', 'Pricing'],
  },
  {
    id: 'WO-03',
    title: 'CI/CD in die Google Cloud',
    context: 'DZ BANK',
    text: 'Umzug der Build-, Test- und Analyse-Pipelines von On-Premise in die skalierbare Google Cloud.',
    tags: ['GCP', 'Pipelines'],
  },
  {
    id: 'WO-04',
    title: 'Entwicklerumgebung',
    context: 'DZ BANK',
    text: 'VSCode, Python und Docker-Container – mit direkter Anbindung an die Entwicklerdatenbanken.',
    tags: ['Docker', 'DevEx'],
  },
  {
    id: 'WO-05',
    title: 'Anonymisierungsprozess',
    context: 'DZ BANK',
    text: 'Datenschutzkonforme Anonymisierung von Entwicklerdaten im Einklang mit den Compliance-Richtlinien.',
    tags: ['DSGVO', 'Compliance'],
  },
  {
    id: 'WO-06',
    title: 'ML gegen Produktionsstörungen',
    context: 'Masterarbeit · Note 1,0',
    text: 'Quantifiziert Störungen in einer Achsmontage und schlägt passende Fehlerbehebungen vor.',
    tags: ['Machine Learning'],
  },
  {
    id: 'WO-07',
    title: 'Data Warehouse & Prognosen',
    context: 'GIZS',
    text: 'Enterprise Data Warehouse, ETL-Strecken und ein Zeitreihen-Prognosemodell für Transaktionen.',
    tags: ['ETL', 'Forecasting'],
  },
  {
    id: 'WO-08',
    title: 'Transaktions-Monitoring',
    context: 'Nterra',
    text: 'Webbasiertes Monitoring-Tool für ein ESB-System, entwickelt nach Test Driven Development.',
    tags: ['Spring Boot', 'Angular'],
  },
]

/** Alle Technologien – als Bit-Satz im Werkzeugkoffer */
export const techBits: string[] = [
  'Python',
  'Java',
  'REST',
  'FastAPI',
  'Spring Boot',
  'React',
  'Angular',
  'Docker',
  'GitLab',
  'Jenkins',
  'SonarQube',
  'Google Cloud',
  'Shell',
  'MSSQL',
  'MySQL',
  'PostgreSQL',
  'Pentaho',
  'Tableau',
  'Automic',
  'Jira',
  'Confluence',
  'Raspberry Pi',
]
