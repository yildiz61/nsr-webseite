/**
 * Stammdaten der Seite – hier zentral pflegen.
 * Bewusst ohne Telefonnummer, Geburtsdatum und Wohnanschrift.
 */
export const site = {
  name: 'Nossair Ouladali',
  firstName: 'Nossair',
  role: 'Senior Software Engineer & Architekt',
  employer: 'DZ BANK AG',
  location: 'Frankfurt am Main',
  email: 'n.ouladali@hotmail.de',
  linkedin: 'https://www.linkedin.com/in/nossair-ouladali-831b931a4',
  /** Seit wann professionell Code geschrieben wird (Werkstudent Nterra) */
  codingSince: 2017,
  languages: [
    { code: 'DE', name: 'Deutsch', level: 'Muttersprache', value: 1 },
    { code: 'EN', name: 'Englisch', level: 'C1', value: 0.85 },
    { code: 'ES', name: 'Spanisch', level: 'B1', value: 0.55 },
  ],
  /**
   * Optional für ein vollständiges Impressum (§ 5 DDG).
   * Leer gelassen wird die Anschrift nicht angezeigt.
   */
  legalAddress: {
    street: '',
    zipCity: '',
  },
} as const
