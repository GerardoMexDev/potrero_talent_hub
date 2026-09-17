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

const DATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 días hacia atrás y hacia adelante

const toYmd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');

/**
 * Función para obtener todos los partidos (fixture y resultados).
 *
 * IMPORTANTE: el scoreboard de ESPN para fútbol NO acepta un rango de fechas
 * (`dates=YYYYMMDD-YYYYMMDD`) — devuelve 400 "Failed to get events endpoint."
 * sin importar el torneo ni el tamaño del rango. Solo acepta una fecha exacta
 * por pedido (`dates=YYYYMMDD`), así que hay que pedir día por día y combinar
 * los resultados.
 *
 * @param tournament - El torneo seleccionado
 */
export async function getMatches(tournament: Tournament = 'libertadores'): Promise<MatchEvent[]> {
  const prefix = (tournament === 'libertadores' || tournament === 'sudamericana') ? 'conmebol.' : '';
  const base = `https://site.api.espn.com/apis/site/v2/sports/soccer/${prefix}${tournament}/scoreboard`;

  const todayStr = toYmd(new Date());

  // Pedimos el día de hoy primero: además de sus partidos, trae el calendario
  // de fechas válidas de la temporada (cuando el torneo es de tipo "día" / liga).
  const seedRes = await fetch(`${base}?dates=${todayStr}&limit=1000`);
  if (!seedRes.ok) throw new Error('Failed to fetch matches');
  const seedData = await seedRes.json();
  const league = seedData.leagues?.[0];

  const now = Date.now();
  let datesToFetch: string[];

  if (league?.calendarType === 'day' && Array.isArray(league.calendar)) {
    // Ligas de todos contra todos: el calendario ya trae solo las fechas con partidos.
    datesToFetch = league.calendar
      .map((iso: string) => new Date(iso))
      .filter((d: Date) => Math.abs(d.getTime() - now) <= DATE_WINDOW_MS)
      .map(toYmd);
  } else {
    // Copas por fases (Libertadores/Sudamericana): no hay calendario plano,
    // recorremos día por día la ventana de fechas cercanas a hoy.
    datesToFetch = [];
    for (let t = now - DATE_WINDOW_MS; t <= now + DATE_WINDOW_MS; t += 24 * 60 * 60 * 1000) {
      datesToFetch.push(toYmd(new Date(t)));
    }
  }

  const uniqueDates = Array.from(new Set(datesToFetch));

  const dayResults = await Promise.all(
    uniqueDates.map(async (d) => {
      if (d === todayStr) return (seedData.events || []) as MatchEvent[];
      try {
        const res = await fetch(`${base}?dates=${d}&limit=1000`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.events || []) as MatchEvent[];
      } catch {
        return [];
      }
    })
  );

  // Combinamos y quitamos duplicados (un mismo partido puede aparecer si se
  // solapan fechas del calendario con la ventana de días).
  const merged = new Map<string, MatchEvent>();
  for (const events of dayResults) {
    for (const ev of events) merged.set(ev.id, ev);
  }
  return Array.from(merged.values());
}
