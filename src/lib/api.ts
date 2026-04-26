// ============================================================================
// ARCHIVO: api.ts
// PROPÓSITO: Manejar toda la comunicación con la API externa (ESPN) para
// obtener los datos de posiciones y partidos.
// ============================================================================

// Interfaces TypeScript: Definen la "forma" que tendrán los datos que recibimos.
// Esto nos ayuda a evitar errores y tener autocompletado en el código.

import { Tournament } from '../App';

export interface Team {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  isActive: boolean;
  logo?: string;
  logos?: { href: string; width: number; height: number; alt: string; rel: string[] }[];
}

export interface StandingEntry {
  team: Team;
  stats: {
    name: string;
    displayName: string;
    shortDisplayName: string;
    description: string;
    abbreviation: string;
    type: string;
    value: number;
    displayValue: string;
  }[];
}

export interface Group {
  name: string;
  abbreviation: string;
  standings: {
    id: string;
    name: string;
    displayName: string;
    links: any[];
    entries: StandingEntry[];
  };
}

export interface MatchEvent {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string;
      state: 'pre' | 'in' | 'post'; // pre = próximo, in = en vivo, post = finalizado
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
  competitions: {
    id: string;
    date: string;
    attendance: number;
    venue: {
      id: string;
      fullName: string;
      address: {
        city: string;
        country: string;
      };
    };
    competitors: {
      id: string;
      uid: string;
      type: string;
      order: number;
      homeAway: 'home' | 'away';
      winner: boolean;
      team: Team;
      score: string;
    }[];
  }[];
}

/**
 * Función para obtener la tabla de posiciones (Grupos o Liga).
 * @param tournament - El torneo seleccionado
 */
export async function getStandings(tournament: Tournament = 'libertadores'): Promise<Group[]> {
  // Construimos la URL dependiendo del torneo. Las ligas locales no llevan el prefijo "conmebol."
  const prefix = (tournament === 'libertadores' || tournament === 'sudamericana') ? 'conmebol.' : '';
  const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${prefix}${tournament}/standings`);
  
  if (!res.ok) throw new Error('Failed to fetch standings');
  
  const data = await res.json();
  // Retornamos los "children" que contienen los grupos o la tabla general
  return data.children || [];
}

/**
 * Función para obtener todos los partidos (fixture y resultados).
 * @param tournament - El torneo seleccionado
 */
export async function getMatches(tournament: Tournament = 'libertadores'): Promise<MatchEvent[]> {
  const currentYear = new Date().getFullYear();
  const prefix = (tournament === 'libertadores' || tournament === 'sudamericana') ? 'conmebol.' : '';
  
  // Pedimos los partidos de todo el año actual (01/01 al 31/12)
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${prefix}${tournament}/scoreboard?dates=${currentYear}0101-${currentYear}1231&limit=1000`);
  
  if (!res.ok) throw new Error('Failed to fetch matches');
  
  const data = await res.json();
  // Retornamos los eventos (partidos)
  return data.events || [];
}
