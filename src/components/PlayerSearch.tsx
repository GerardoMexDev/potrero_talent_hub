import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ArrowLeft, Trophy, Calendar, Shirt, X } from 'lucide-react';

interface FollowedPlayersProps {
  onBack: () => void;
}

const FOLLOWED_PLAYERS = [
  { id: 'batista',    name: 'Facundo Batista',    searchApi: 'Batista',    teamId: '2348',  teamName: 'Peñarol',            photo: 'https://media.api-sports.io/football/players/9723.png',   teamLogo: 'https://media.api-sports.io/football/teams/2348.png' },
  { id: 'mendez',     name: 'Javier Méndez',      searchApi: 'Mendez',     teamId: '2315',  teamName: 'Colo Colo',          photo: 'https://media.api-sports.io/football/players/6122.png',   teamLogo: 'https://media.api-sports.io/football/teams/2315.png' },
  { id: 'arevalo',    name: 'Kevin Arevalo',       searchApi: 'Arevalo',    teamId: '6786',  teamName: 'Akron Tolyatti',     photo: 'https://media.api-sports.io/football/players/513371.png', teamLogo: 'https://media.api-sports.io/football/teams/6786.png' },
  { id: 'cruz',       name: 'Alejo Cruz',          searchApi: 'Cruz',       teamId: '2353',  teamName: 'Juventud',           photo: 'https://media.api-sports.io/football/players/288763.png', teamLogo: 'https://media.api-sports.io/football/teams/2353.png' },
  { id: 'salas',      name: 'Javier Salas',        searchApi: 'Salas',      teamId: '2554',  teamName: 'FBC Melgar',         photo: 'https://media.api-sports.io/football/players/35577.png',  teamLogo: 'https://media.api-sports.io/football/teams/2554.png' },
  { id: 'villar',     name: 'Edu Villar',          searchApi: 'Villar',     teamId: '2555',  teamName: 'Sport Huancayo',     photo: 'https://media.api-sports.io/football/players/63977.png',  teamLogo: 'https://media.api-sports.io/football/teams/2555.png' },
  { id: 'amasifuen',  name: 'Nicolas Amasifuen',   searchApi: 'Amasifuen',  teamId: '22489', teamName: 'Dep. Moquegua',      photo: 'https://media.api-sports.io/football/players/402845.png', teamLogo: 'https://media.api-sports.io/football/teams/22489.png' },
  { id: 'quispe',     name: 'Piero Quispe',        searchApi: 'Quispe',     teamId: '943',   teamName: 'Sydney FC',          photo: 'https://media.api-sports.io/football/players/307513.png', teamLogo: 'https://media.api-sports.io/football/teams/943.png' },
];

export default function PlayerSearch({ onBack }: FollowedPlayersProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPlayer = async (playerParams: { searchApi: string; teamId: string }) => {
    setSelectedPlayer(playerParams);
    setLoading(true);
    setError('');
    setPlayerStats(null);

    try {
      const res = await fetch(`/api/player?search=${playerParams.searchApi}&team=${playerParams.teamId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.statistics?.length > 0) {
        const maxSeason = Math.max(...data.statistics.map((s: any) => parseInt(s.league?.season || '0', 10)));
        data.statistics = data.statistics
          .filter((s: any) => parseInt(s.league?.season || '0', 10) === maxSeason)
          .sort((a: any, b: any) => (b.league?.season || 0) - (a.league?.season || 0));
      }

      setPlayerStats(data);
    } catch (err: any) {
      setError(err.message || 'Error obteniendo los datos del jugador.');
    } finally {
      setLoading(false);
    }
  };

  const closePlayer = () => {
    setSelectedPlayer(null);
    setPlayerStats(null);
    setError('');
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20 }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="max-w-6xl mx-auto w-full p-4 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center mb-4 relative z-10">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-brand-magenta/50 transition-all duration-300 mr-4 shadow-lg group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-magenta group-hover:-translate-x-1 transition-all duration-300" />
        </button>
        <h2 className="font-display text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white drop-shadow-md">
          Jugadores
        </h2>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        }}
        className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden"
      >
        {/* Textura decorativa en la cabecera de la sección */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-texture-chevron opacity-[0.03] pointer-events-none rounded-t-3xl" />

        <div className="relative z-10">
          <h2 className="font-display text-2xl sm:text-3xl font-black italic mb-2 text-brand-magenta flex items-center gap-3 drop-shadow-md">
            <User className="w-8 h-8" />
            Seguimiento Oficial
          </h2>
          <p className="text-gray-400 mb-8 border-b border-white/10 pb-6 font-medium">
            Selecciona un jugador para cargar su historial táctico y analíticas de rendimiento actualizadas.
          </p>

          {error && (
            <div className="text-red-400 bg-red-500/10 p-5 rounded-2xl border border-red-500/20 mb-8 max-w-2xl backdrop-blur-md">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-brand-magenta/80 mb-8 bg-brand-magenta/5 px-4 py-3 rounded-xl border border-brand-magenta/10 max-w-sm">
              <div className="w-4 h-4 border-2 border-brand-magenta border-t-transparent rounded-full animate-spin" />
              <p className="font-medium animate-pulse">Analizando telemetría...</p>
            </div>
          )}

          {/* Mosaico de jugadores */}
          {!selectedPlayer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FOLLOWED_PLAYERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlayer({ searchApi: p.searchApi, teamId: p.teamId })}
                  className="group flex flex-col items-start bg-linear-to-br from-white/5 to-white/0 border border-white/10 p-6 rounded-3xl hover:bg-white/10 hover:border-brand-magenta/50 hover:shadow-[0_0_30px_rgba(255,1,152,0.10)] transition-all duration-500 text-left overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-brand-magenta/0 via-brand-magenta/0 to-brand-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-center justify-between w-full relative z-10 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-magenta group-hover:scale-105 transition-all duration-500 bg-black/50 shadow-xl">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=001c56&color=FF0198&size=150`;
                        }}
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-magenta text-gray-400 group-hover:text-white transition-all duration-500 shadow-lg group-hover:rotate-45">
                      <ArrowLeft className="w-4 h-4 rotate-135" />
                    </div>
                  </div>

                  <div className="relative z-10 w-full">
                    <h3 className="text-xl font-black text-white group-hover:text-brand-magenta transition-colors drop-shadow-md">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-3 bg-black/40 w-fit px-3 py-1.5 rounded-full border border-white/5">
                      <img src={p.teamLogo} alt={p.teamName} className="w-5 h-5 object-contain drop-shadow" referrerPolicy="no-referrer" />
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{p.teamName}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Detalle del jugador */}
          <AnimatePresence mode="wait">
            {selectedPlayer && playerStats && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mt-6"
              >
                <button
                  type="button"
                  onClick={closePlayer}
                  aria-label="Cerrar detalle del jugador"
                  className="absolute top-6 right-6 p-3 bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/30 rounded-full transition-all duration-300 text-white z-20 hover:rotate-90 group"
                >
                  <X className="w-5 h-5 group-hover:text-brand-magenta transition-colors" />
                </button>

                {/* Perfil del jugador */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/10 pb-8 mb-8 relative">
                  <div className="absolute -inset-4 bg-linear-to-r from-brand-magenta/5 via-transparent to-transparent opacity-50 blur-2xl rounded-[3rem]" />

                  <div className="w-40 h-40 rounded-4xl overflow-hidden border border-white/20 bg-linear-to-br from-white/10 to-transparent p-1 shrink-0 shadow-2xl relative z-10">
                    <div className="w-full h-full rounded-3xl overflow-hidden bg-black/50">
                      <img
                        src={playerStats.player.photo}
                        alt={playerStats.player.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/150'; }}
                      />
                    </div>
                  </div>

                  <div className="text-center md:text-left flex flex-col items-center md:items-start relative z-10 w-full">
                    <h3 className="font-display text-4xl sm:text-5xl font-black italic tracking-tighter drop-shadow-lg">
                      {playerStats.player.name}
                    </h3>
                    <p className="text-xl sm:text-2xl text-brand-magenta font-bold tracking-tight mt-1 mb-4">
                      {playerStats.player.firstname} {playerStats.player.lastname}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                      <div className="flex flex-col bg-black/40 px-4 py-2 rounded-2xl border border-white/10">
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Edad</span>
                        <span className="text-lg font-black">{playerStats.player.age || '?'}</span>
                      </div>
                      <div className="flex flex-col bg-black/40 px-4 py-2 rounded-2xl border border-white/10">
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">País</span>
                        <span className="text-lg font-black">{playerStats.player.nationality || '?'}</span>
                      </div>
                      {playerStats.player.height && (
                        <div className="flex flex-col bg-black/40 px-4 py-2 rounded-2xl border border-white/10">
                          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Altura</span>
                          <span className="text-lg font-black text-brand-magenta">{playerStats.player.height}</span>
                        </div>
                      )}
                      {playerStats.player.weight && (
                        <div className="flex flex-col bg-black/40 px-4 py-2 rounded-2xl border border-white/10">
                          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Peso</span>
                          <span className="text-lg font-black text-brand-orange">{playerStats.player.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Historial táctico */}
                <h4 className="font-display text-2xl font-black italic mb-6 flex items-center gap-3 drop-shadow-md">
                  <Trophy className="w-6 h-6 text-brand-magenta drop-shadow-[0_0_10px_rgba(255,1,152,0.5)]" />
                  Historial Táctico
                </h4>

                {playerStats.statistics?.length > 0 ? (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    {playerStats.statistics.map((stat: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-6 hover:border-brand-magenta/30 hover:shadow-[0_0_20px_rgba(255,1,152,0.05)] transition-all duration-500 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 rounded-full blur-3xl group-hover:bg-brand-magenta/10 transition-colors" />

                        {/* Encabezado torneo/equipo */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-4 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl p-2 border border-white/5 shadow-inner">
                              {stat.league?.logo
                                ? <img src={stat.league.logo} alt={stat.league.name} className="w-full h-full object-contain drop-shadow" referrerPolicy="no-referrer" />
                                : <Trophy className="w-full h-full text-gray-500" />}
                            </div>
                            <div>
                              <p className="font-black text-xl tracking-tight">{stat.league?.name || 'Torneo Desconocido'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.league?.country}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-xs font-bold text-brand-magenta bg-brand-magenta/10 px-2 py-0.5 rounded border border-brand-magenta/20">
                                  TEMPORADA {stat.league?.season}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                            {stat.team?.logo
                              ? <img src={stat.team.logo} alt={stat.team.name} className="w-8 h-8 object-contain drop-shadow" referrerPolicy="no-referrer" />
                              : <Shirt className="w-6 h-6 text-gray-400" />}
                            <span className="text-sm font-black uppercase tracking-wider">{stat.team?.name || 'Equipo'}</span>
                          </div>
                        </div>

                        {/* Grid de estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">

                          {stat.games && (
                            <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-lg group-hover:border-white/10 transition-colors">
                              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                                <Calendar className="w-3 h-3 text-brand-lime" /> Participación
                              </p>
                              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                {stat.games.appearences > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Jugados</span><span className="font-black text-lg">{stat.games.appearences}</span></div>}
                                {stat.games.lineups > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Titular</span><span className="font-black text-lg">{stat.games.lineups}</span></div>}
                                {stat.games.minutes > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Minutos</span><span className="font-black text-lg text-white/80">{stat.games.minutes}'</span></div>}
                                {stat.games.position && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Posición</span><span className="font-black text-lg text-brand-magenta">{stat.games.position}</span></div>}
                                {stat.games.rating && <div className="flex flex-col col-span-2"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Valoración AI</span><span className="font-black text-2xl text-brand-lime mt-1">{Number(stat.games.rating).toFixed(1)}</span></div>}
                              </div>
                            </div>
                          )}

                          {stat.goals && (
                            <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-lg group-hover:border-white/10 transition-colors">
                              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                                Ofensiva & Arco
                              </p>
                              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                {(stat.goals.total !== null && stat.goals.total > 0) && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Goles</span><span className="font-black text-2xl text-brand-lime">{stat.goals.total}</span></div>}
                                {(stat.goals.assists !== null && stat.goals.assists > 0) && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Asist.</span><span className="font-black text-2xl text-brand-orange">{stat.goals.assists}</span></div>}
                                {(stat.goals.saves !== null && stat.goals.saves > 0) && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Atrapadas</span><span className="font-black text-xl">{stat.goals.saves}</span></div>}
                                {(stat.goals.conceded !== null && stat.goals.conceded > 0) && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Recibidos</span><span className="font-black text-xl text-red-400">{stat.goals.conceded}</span></div>}
                              </div>
                            </div>
                          )}

                          {(stat.passes || stat.tackles) && (
                            <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-lg group-hover:border-white/10 transition-colors">
                              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                                Distribución
                              </p>
                              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                {stat.passes?.total > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Totales</span><span className="font-black text-lg">{stat.passes.total}</span></div>}
                                {stat.passes?.key > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Clave</span><span className="font-black text-lg text-brand-magenta">{stat.passes.key}</span></div>}
                                {stat.passes?.accuracy > 0 && <div className="flex flex-col col-span-2"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Precisión</span><span className="font-black text-xl text-white/90">{stat.passes.accuracy}%</span></div>}
                                {stat.tackles?.total > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Quites</span><span className="font-black text-lg">{stat.tackles.total}</span></div>}
                                {stat.tackles?.interceptions > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Intercep.</span><span className="font-black text-lg">{stat.tackles.interceptions}</span></div>}
                              </div>
                            </div>
                          )}

                          {(stat.cards || stat.fouls) && (
                            <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-lg group-hover:border-white/10 transition-colors">
                              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                                Disciplina
                              </p>
                              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                {stat.cards?.yellow > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Amarillas</span><span className="font-black text-2xl text-brand-orange">{stat.cards.yellow}</span></div>}
                                {stat.cards?.red > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Rojas</span><span className="font-black text-2xl text-red-500">{stat.cards.red}</span></div>}
                                {stat.fouls?.drawn > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Faltas Rec.</span><span className="font-black text-lg">{stat.fouls.drawn}</span></div>}
                                {stat.fouls?.committed > 0 && <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase tracking-wider">Faltas Com.</span><span className="font-black text-lg">{stat.fouls.committed}</span></div>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-10 text-center backdrop-blur-sm">
                    <p className="text-gray-400 font-editorial italic text-lg">Historial estadístico clasificado o en proceso de recolección.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
