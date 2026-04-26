import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getStandings, Group } from '../lib/api';
import { Tournament } from '../App';

interface GroupsProps {
  tournament: Tournament;
  onBack: () => void;
}

export default function Groups({ tournament, onBack }: GroupsProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getStandings(tournament)
      .then(data => { setGroups(data); setLoading(false); })
      .catch(err => {
        console.error(err);
        setError('Error al cargar los grupos. Intenta nuevamente más tarde.');
        setLoading(false);
      });
  }, [tournament]);

  const getStat = (stats: any[] | undefined, name: string) =>
    stats?.find(s => s.name === name)?.displayValue || '0';

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20 }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="w-full max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center mb-8 relative z-10">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-brand-magenta/50 transition-all duration-300 mr-4 shadow-lg group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-magenta group-hover:-translate-x-1 transition-all duration-300" />
        </button>
        <h2 className="font-display text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white drop-shadow-md">
          Tabla de Posiciones
        </h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-brand-magenta animate-spin mb-4" />
          <p className="text-gray-400 font-medium tracking-wide">Cargando clasificación oficial...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-center backdrop-blur-md max-w-lg mx-auto">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Vacío */}
      {!loading && !error && groups.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md max-w-lg mx-auto">
          <p className="text-gray-400">No hay datos de posiciones disponibles para este torneo.</p>
        </div>
      )}

      {/* Tablas */}
      {!loading && !error && groups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {groups.map((group, groupIdx) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
              }}
              key={group.name || groupIdx}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-brand-magenta/20 transition-colors duration-500"
            >
              {/* Cabecera del grupo — textura chevron sutil */}
              <div className="relative bg-linear-to-r from-white/10 to-transparent px-6 py-5 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-texture-chevron opacity-[0.04] pointer-events-none" />
                <h3 className="font-display text-xl font-black italic uppercase tracking-tight text-white relative z-10">
                  {group.name || 'Grupo Único'}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-gray-400 bg-black/40">
                      <th className="px-6 py-4 font-bold">Club</th>
                      <th className="px-3 py-4 font-bold text-center">PTS</th>
                      <th className="px-3 py-4 font-bold text-center">PJ</th>
                      <th className="px-3 py-4 font-bold text-center">G</th>
                      <th className="px-3 py-4 font-bold text-center">E</th>
                      <th className="px-3 py-4 font-bold text-center">P</th>
                      <th className="px-3 py-4 font-bold text-center">GF</th>
                      <th className="px-3 py-4 font-bold text-center">GC</th>
                      <th className="px-3 py-4 font-bold text-center">DIF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {group.standings?.entries?.map((entry, idx) => (
                      <tr key={entry.team?.id || idx} className="hover:bg-white/10 transition-colors group/row">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <span className="text-gray-500 font-mono text-sm w-4 font-bold group-hover/row:text-white transition-colors">
                            {idx + 1}
                          </span>
                          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center p-1 border border-white/5 group-hover/row:border-brand-magenta/30 group-hover/row:scale-110 transition-all duration-300 shadow-lg">
                            <img
                              src={entry.team?.logo || entry.team?.logos?.[0]?.href || 'https://picsum.photos/seed/team/40/40'}
                              alt={entry.team?.displayName || 'Equipo'}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-bold text-white whitespace-nowrap group-hover/row:text-brand-magenta transition-colors">
                            {entry.team?.shortDisplayName || entry.team?.displayName || 'Equipo'}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-center font-black text-brand-magenta text-lg drop-shadow-md">
                          {getStat(entry.stats, 'points')}
                        </td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'gamesPlayed')}</td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'wins')}</td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'ties')}</td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'losses')}</td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'pointsFor')}</td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'pointsAgainst')}</td>
                        <td className="px-3 py-4 text-center font-medium text-gray-300">{getStat(entry.stats, 'pointDifferential')}</td>
                      </tr>
                    ))}
                    {(!group.standings?.entries || group.standings.entries.length === 0) && (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-gray-500 font-medium">
                          Fase sin datos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
