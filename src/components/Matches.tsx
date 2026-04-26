import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, MapPin, Clock } from 'lucide-react';
import { parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { getMatches, MatchEvent } from '../lib/api';
import { Tournament } from '../App';

interface MatchesProps {
  tournament: Tournament;
  onBack: () => void;
}

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

export default function Matches({ tournament, onBack }: MatchesProps) {
  const [matches, setMatches] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'jugados' | 'proximos'>('proximos');
  const [teamFilter, setTeamFilter] = useState<'all' | '2683' | '2673' | '8416' | '9999' | '10000' | '9903' | '4817' | '20721' | '22271' | '2688' | '7312' | '10318' | '5327'>('all');

  const fetchMatchesData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getMatches(tournament);
      setMatches(data);
      if (isInitial) setError(null);
    } catch (err) {
      console.error(err);
      if (isInitial) setError('Error al cargar los partidos. Intenta nuevamente más tarde.');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    setTeamFilter('all');
    fetchMatchesData(true);
    const intervalId = setInterval(() => fetchMatchesData(false), 30000);
    return () => clearInterval(intervalId);
  }, [tournament]);

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

  const filteredMatches = matches.filter(match => {
    const isFinished = match.status.type.completed;
    if (activeTab === 'jugados' ? !isFinished : isFinished) return false;
    if (teamFilter !== 'all') {
      const hasTeam = match.competitions[0].competitors.some(c => c.team.id === teamFilter);
      if (!hasTeam) return false;
    }
    return true;
  });

  // Clase activa/inactiva reutilizable
  const tabActive = 'bg-white/20 text-white shadow-lg shadow-white/5 scale-[1.02] border border-white/10';
  const tabInactive = 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent';

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20 }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="w-full max-w-5xl mx-auto px-4 py-8"
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver al inicio"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-brand-magenta/50 transition-all duration-300 mr-4 shadow-lg group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-magenta group-hover:-translate-x-1 transition-all duration-300" />
          </button>
          <h2 className="font-display text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white drop-shadow-md">
            Partidos
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por equipo */}
          {!loading && !error && (
            <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 overflow-x-auto shadow-xl hide-scrollbar">
              <button type="button" onClick={() => setTeamFilter('all')}
                className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === 'all' ? 'bg-brand-navy text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                Todos
              </button>

              {tournament === 'libertadores' && (<>
                <button type="button" onClick={() => setTeamFilter('2683')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '2683' ? 'bg-brand-magenta text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Peñarol
                </button>
                <button type="button" onClick={() => setTeamFilter('2673')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '2673' ? 'bg-brand-lime text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  S. Cristal
                </button>
              </>)}

              {tournament === 'sudamericana' && (<>
                <button type="button" onClick={() => setTeamFilter('9999')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '9999' ? 'bg-brand-magenta text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Boston River
                </button>
                <button type="button" onClick={() => setTeamFilter('8416')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '8416' ? 'bg-brand-lime text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Juventud
                </button>
              </>)}

              {tournament === 'mex.2' && (
                <button type="button" onClick={() => setTeamFilter('20721')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '20721' ? 'bg-brand-orange text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Tepatitlán FC
                </button>
              )}

              {tournament === 'rus.1' && (
                <button type="button" onClick={() => setTeamFilter('22271')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '22271' ? 'bg-brand-magenta text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Akron Tolyatti
                </button>
              )}

              {tournament === 'chi.1' && (
                <button type="button" onClick={() => setTeamFilter('2688')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '2688' ? 'bg-brand-orange text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Colo Colo
                </button>
              )}

              {tournament === 'per.1' && (<>
                <button type="button" onClick={() => setTeamFilter('7312')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '7312' ? 'bg-brand-magenta text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Melgar
                </button>
                <button type="button" onClick={() => setTeamFilter('10318')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '10318' ? 'bg-brand-lime text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Sport Huancayo
                </button>
                <button type="button" onClick={() => setTeamFilter('2673')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '2673' ? 'bg-brand-lime text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Sporting Cristal
                </button>
              </>)}

              {tournament === 'aus.1' && (
                <button type="button" onClick={() => setTeamFilter('5327')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '5327' ? 'bg-brand-orange text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Sydney FC
                </button>
              )}

              {/* Liga Uruguaya y resto: filtros default */}
              {(tournament === 'uru.1' || tournament === 'uru.2') && (<>
                <button type="button" onClick={() => setTeamFilter('2683')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '2683' ? 'bg-brand-magenta text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Peñarol
                </button>
                <button type="button" onClick={() => setTeamFilter('10000')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '10000' ? 'bg-brand-orange text-white shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Dep. Maldonado
                </button>
                <button type="button" onClick={() => setTeamFilter('8416')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '8416' ? 'bg-brand-lime text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Juventud
                </button>
                <button type="button" onClick={() => setTeamFilter('9903')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '9903' ? 'bg-brand-lime text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Racing
                </button>
                <button type="button" onClick={() => setTeamFilter('4817')}
                  className={`flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${teamFilter === '4817' ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  Danubio
                </button>
              </>)}
            </div>
          )}

          {/* Tabs jugados/próximos */}
          {!loading && !error && (
            <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-xl">
              <button type="button" onClick={() => setActiveTab('jugados')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'jugados' ? tabActive : tabInactive}`}>
                Jugados
              </button>
              <button type="button" onClick={() => setActiveTab('proximos')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'proximos' ? tabActive : tabInactive}`}>
                Próximos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── ESTADOS ─────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 relative z-10">
          <Loader2 className="w-12 h-12 text-brand-magenta animate-spin mb-4" />
          <p className="text-gray-400 font-medium tracking-wide">Cargando partidos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-3xl p-6 text-center backdrop-blur-md max-w-lg mx-auto relative z-10">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && filteredMatches.length === 0 && (
        <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative z-10">
          <p className="text-gray-400 text-lg">
            No hay partidos {activeTab === 'jugados' ? 'jugados' : 'próximos'} en este momento.
          </p>
        </div>
      )}

      {/* ── LISTA DE PARTIDOS ───────────────────────────────────── */}
      {!loading && !error && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 gap-6 relative z-10">
          {filteredMatches.map((match) => {
            const comp = match.competitions[0];
            const homeTeam = comp.competitors.find(c => c.homeAway === 'home');
            const awayTeam = comp.competitors.find(c => c.homeAway === 'away');
            const { day, localTime, uruguayTime } = formatMatchTime(match.date, comp.venue?.address?.country);
            const isFinished = match.status.type.completed;
            const isLive = match.status.type.state === 'in';

            return (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                }}
                key={match.id}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-brand-magenta/30 hover:bg-black/60 transition-all duration-500 shadow-xl group"
              >
                {/* Cabecera: fecha y hora */}
                <div className="bg-linear-to-r from-white/5 to-transparent px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5">
                  <span className="text-sm font-bold text-brand-magenta uppercase tracking-wider">{day}</span>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <Clock className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Local: {localTime} | UY: {uruguayTime}</span>
                    </div>
                  </div>
                </div>

                {/* Cuerpo: equipos y marcador */}
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Local */}
                  <div className="flex-1 flex flex-col items-center md:items-end gap-4 w-full">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/5 group-hover:border-brand-magenta/20 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                      <img
                        src={homeTeam?.team.logo || homeTeam?.team.logos?.[0]?.href || 'https://picsum.photos/seed/team1/60/60'}
                        alt={homeTeam?.team.displayName}
                        className="w-full h-full object-contain drop-shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xl font-black text-white text-center md:text-right group-hover:text-brand-magenta transition-colors">
                      {homeTeam?.team.displayName}
                    </span>
                  </div>

                  {/* Marcador central */}
                  <div className="flex flex-col items-center justify-center px-8 min-w-40">
                    {isFinished || isLive ? (
                      <div className="flex items-center gap-6">
                        <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{homeTeam?.score || '0'}</span>
                        <span className="text-xl font-bold text-gray-600">-</span>
                        <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{awayTeam?.score || '0'}</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-black text-white/20 italic tracking-widest">VS</span>
                    )}

                    {/* Badge de estado */}
                    <span className={`text-xs font-black uppercase tracking-widest mt-4 px-4 py-1.5 rounded-full shadow-lg ${
                      isLive
                        ? 'bg-brand-lime text-black animate-live-lime'
                        : isFinished
                          ? 'bg-white/10 text-gray-300 border border-white/10'
                          : 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
                    }`}>
                      {match.status.type.shortDetail}
                    </span>
                  </div>

                  {/* Visitante */}
                  <div className="flex-1 flex flex-col items-center md:items-start gap-4 w-full">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/5 group-hover:border-brand-magenta/20 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                      <img
                        src={awayTeam?.team.logo || awayTeam?.team.logos?.[0]?.href || 'https://picsum.photos/seed/team2/60/60'}
                        alt={awayTeam?.team.displayName}
                        className="w-full h-full object-contain drop-shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xl font-black text-white text-center md:text-left group-hover:text-brand-magenta transition-colors">
                      {awayTeam?.team.displayName}
                    </span>
                  </div>
                </div>

                {/* Pie: estadio */}
                {comp.venue && (
                  <div className="bg-linear-to-r from-transparent via-white/5 to-transparent px-6 py-4 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                    <MapPin className="w-4 h-4 text-brand-magenta/60" />
                    <span>
                      {comp.venue.fullName}
                      {comp.venue.address?.city && `, ${comp.venue.address.city}`}
                      {comp.venue.address?.country && ` (${comp.venue.address.country})`}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
