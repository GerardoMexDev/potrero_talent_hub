import { useState, useEffect } from 'react';
import { CalendarDays, Users, ArrowRight, Search, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Tournament } from '../App';
import { FOLLOWED_PLAYERS, FollowedPlayer } from '../constants/players';
import { parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { getMatches } from '../lib/api';

const countryTimezones: Record<string, string> = {
  'Bolivia': 'America/La_Paz',
  'Paraguay': 'America/Asuncion',
  'Uruguay': 'America/Montevideo',
  'Venezuela': 'America/Caracas',
  'Peru': 'America/Lima',
  'Ecuador': 'America/Guayaquil',
  'Chile': 'America/Santiago',
  'Colombia': 'America/Bogota',
  'Brazil': 'America/Sao_Paulo',
  'Argentina': 'America/Argentina/Buenos_Aires',
  'Mexico': 'America/Mexico_City',
  'Russia': 'Europe/Moscow',
  'Australia': 'Australia/Sydney',
};

interface HomeProps {
  onNavigate: (view: 'home' | 'groups' | 'matches' | 'players', tournament?: Tournament, player?: FollowedPlayer) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [upcomingMatches, setUpcomingMatches] = useState<(FollowedPlayer & { fixture?: any })[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    const loadUpcomingMatches = async () => {
      setLoadingMatches(true);
      try {
        const tournaments: Tournament[] = ['libertadores', 'sudamericana', 'uru.1', 'uru.2', 'chi.1', 'rus.1', 'per.1', 'per.2', 'aus.1', 'mex.1', 'mex.2'];
        const allMatches: any[] = [];
        for (const t of tournaments) {
          try { const m = await getMatches(t); allMatches.push(...m); } catch (e) {}
        }

        const results = FOLLOWED_PLAYERS.map((player) => {
          const teamMatches = allMatches.filter(m => {
            const comps = m.competitions?.[0]?.competitors || [];
            return comps.some((c: any) => {
              const teamName = c.team?.displayName || '';
              return teamName.toLowerCase().includes(player.teamName.toLowerCase()) ||
                     player.teamName.toLowerCase().includes(teamName.toLowerCase());
            });
          });

          if (teamMatches.length === 0) return player;

          let nextMatch = teamMatches
            .filter(m => m.status?.type?.state === 'pre' || m.status?.type?.state === 'in')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

          if (!nextMatch) {
            nextMatch = teamMatches
              .filter(m => m.status?.type?.state === 'post')
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          }

          if (nextMatch) {
            const comps = nextMatch.competitions?.[0]?.competitors || [];
            const homeComp = comps.find((c: any) => c.homeAway === 'home') || comps[0];
            const awayComp = comps.find((c: any) => c.homeAway === 'away') || comps[1];
            if (!homeComp || !awayComp) return player;

            const isHome = (homeComp.team?.displayName || '').toLowerCase().includes(player.teamName.toLowerCase()) ||
                           player.teamName.toLowerCase().includes((homeComp.team?.displayName || '').toLowerCase());

            return {
              ...player,
              fixture: {
                fixture: { date: nextMatch.date, venue: { name: nextMatch.competitions?.[0]?.venue?.fullName || 'Estadio por definir' } },
                teams: {
                  home: { id: isHome ? player.teamId : 'home-id', name: homeComp.team?.shortDisplayName || homeComp.team?.displayName || 'Local', logo: homeComp.team?.logo },
                  away: { id: !isHome ? player.teamId : 'away-id', name: awayComp.team?.shortDisplayName || awayComp.team?.displayName || 'Visitante', logo: awayComp.team?.logo },
                },
              },
            };
          }
          return player;
        });

        const filtered = (results.filter(p => 'fixture' in p) as (FollowedPlayer & { fixture: any })[])
          .sort((a, b) => new Date(a.fixture.fixture.date).getTime() - new Date(b.fixture.fixture.date).getTime());
        setUpcomingMatches(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMatches(false);
      }
    };
    loadUpcomingMatches();
  }, []);

  const formatMatchTime = (dateString: string, country?: string) => {
    try {
      const date = parseISO(dateString);
      const tz = country && countryTimezones[country] ? countryTimezones[country] : 'America/Montevideo';
      return {
        day: formatInTimeZone(date, tz, "EEEE d 'de' MMMM", { locale: es }),
        localTime: formatInTimeZone(date, tz, 'HH:mm'),
        uruguayTime: formatInTimeZone(date, 'America/Montevideo', 'HH:mm'),
      };
    } catch {
      return { day: 'Fecha por definir', localTime: '--:--', uruguayTime: '--:--' };
    }
  };

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  // Clases completas para que Tailwind JIT las incluya en el bundle
  const tournaments = [
    { id: 'libertadores' as Tournament, title: 'Copa Libertadores', colorClass: 'text-brand-magenta', img: '/libertadores.jpg' },
    { id: 'sudamericana' as Tournament, title: 'Copa Sudamericana', colorClass: 'text-brand-lime',    img: '/sudamericana.jpg' },
    { id: 'uru.1'        as Tournament, title: 'Liga Uruguaya',     colorClass: 'text-brand-lime',    img: '/uruguay.jpg' },
    { id: 'mex.2'        as Tournament, title: 'Liga Expansión MX', colorClass: 'text-brand-orange',  img: '/expansion.webp' },
    { id: 'rus.1'        as Tournament, title: 'Liga Rusa',          colorClass: 'text-white',         img: '/Rusia.jpg' },
    { id: 'chi.1'        as Tournament, title: 'Liga Chilena',       colorClass: 'text-brand-orange',  img: '/Chile.jpg' },
    { id: 'per.1'        as Tournament, title: 'Liga Peruana',       colorClass: 'text-brand-magenta', img: '/peru.jpg' },
    { id: 'aus.1'        as Tournament, title: 'A-League (AUS)',     colorClass: 'text-brand-orange',  img: '/australia.jpg' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      variants={container}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12"
    >
      {/* ── BANNER DE SCOUTING ─────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto mb-10">
        <motion.button
          type="button"
          variants={item}
          onClick={() => onNavigate('players')}
          className="w-full relative overflow-hidden rounded-3xl border border-brand-magenta/30 group bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all duration-500 text-left shadow-[0_0_40px_rgba(255,1,152,0.12)]"
        >
          {/* Textura houndstooth — decorativa */}
          <div className="absolute inset-0 bg-texture-houndstooth opacity-[0.04] rounded-3xl pointer-events-none" />
          {/* Spotlight hover */}
          <div className="absolute inset-0 bg-linear-to-r from-brand-magenta/0 via-brand-magenta/5 to-brand-magenta/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

          <div className="p-8 sm:p-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between z-10 relative">
            <div className="flex items-start sm:items-center gap-6">
              <div className="w-20 h-20 bg-brand-magenta/10 rounded-2xl flex items-center justify-center border border-brand-magenta/30 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-brand-magenta/20 transition-all duration-500 shadow-[0_0_30px_rgba(255,1,152,0.15)]">
                <Search className="w-10 h-10 text-brand-magenta group-hover:drop-shadow-[0_0_10px_rgba(255,1,152,0.8)] transition-all duration-300" />
              </div>
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-black italic uppercase tracking-tight mb-2 text-white group-hover:text-brand-magenta transition-colors duration-500">
                  Scouting Inteligente
                </h2>
                <p className="text-gray-400 text-lg max-w-xl">
                  Analiza el rendimiento de los jugadores bajo seguimiento. Datos purificados, sin contaminación estadística.
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-magenta transition-all duration-500 shrink-0 border border-white/10 group-hover:border-brand-magenta shadow-xl">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* ── PRÓXIMOS PARTIDOS ──────────────────────────────────── */}
      <motion.div variants={item} className="w-full max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-magenta/10 rounded-xl flex items-center justify-center border border-brand-magenta/30">
            <CalendarDays className="w-5 h-5 text-brand-magenta" />
          </div>
          <h2 className="font-display text-2xl font-black italic uppercase tracking-tight text-white">
            Próximos Juegos (Seguimiento)
          </h2>
        </div>

        <div className="flex bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-x-auto shadow-xl p-4 gap-4 hide-scrollbar">
          {loadingMatches ? (
            <div className="w-full py-8 flex flex-col items-center justify-center text-gray-500 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-brand-magenta animate-spin" />
              <p className="text-sm">Buscando próximos juegos...</p>
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="w-full py-8 flex flex-col items-center justify-center text-gray-500 gap-3">
              <CalendarDays className="w-8 h-8 opacity-50" />
              <p className="text-sm">No hay partidos próximos disponibles.</p>
            </div>
          ) : (
            upcomingMatches.map((player) => {
              const match = player.fixture;
              const dateInfo = formatMatchTime(match.fixture.date, player.country);
              const isHome = match.teams.home.id.toString() === player.teamId;
              const opponent = isHome ? match.teams.away : match.teams.home;

              return (
                <div key={player.id} className="min-w-75 shrink-0 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-brand-magenta/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => onNavigate('players', undefined, player)}
                      className="flex items-center gap-3 group/player text-left"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 border border-white/10 group-hover/player:border-brand-magenta transition-colors duration-300">
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML =
                              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-gray-500 m-auto mt-3"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm group-hover/player:text-brand-magenta transition-colors">{player.name}</p>
                        <p className="text-xs text-gray-400">{player.teamName}</p>
                      </div>
                    </button>
                    <img src={player.teamLogo} alt={player.teamName} className="w-8 h-8 object-contain opacity-80" />
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">vs {opponent.name}</span>
                      <img src={opponent.logo} alt={opponent.name} className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-brand-orange" />
                        <span>{dateInfo.day}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Local: <strong className="text-white">{dateInfo.localTime}</strong></span>
                        <span className="text-gray-400">URU: <strong className="text-brand-magenta">{dateInfo.uruguayTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-magenta/60" />
                        <span className="truncate">{match.fixture.venue.name || 'Estadio por definir'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* ── GRID DE TORNEOS ────────────────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-brand-magenta/25 transition-all duration-300 backdrop-blur-md"
          >
            <div className="relative h-32 rounded-2xl overflow-hidden shadow-inner mb-2">
              <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/40 transition-colors duration-500" />
              <img
                src={t.img}
                alt={t.title}
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end">
                <h3 className={`font-display font-black italic text-xl uppercase tracking-tighter drop-shadow-md ${t.colorClass}`}>
                  {t.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('groups', t.id)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-brand-navy/60 hover:border-brand-magenta/30 transition-all duration-300 group/btn"
              >
                <Users className={`w-5 h-5 mb-2 opacity-80 group-hover/btn:opacity-100 transition-opacity ${t.colorClass}`} />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Tablas</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('matches', t.id)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-brand-navy/60 hover:border-brand-magenta/30 transition-all duration-300 group/btn"
              >
                <CalendarDays className={`w-5 h-5 mb-2 opacity-80 group-hover/btn:opacity-100 transition-opacity ${t.colorClass}`} />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Partidos</span>
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
