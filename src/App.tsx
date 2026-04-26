import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Home from './components/Home';
import Groups from './components/Groups';
import Matches from './components/Matches';
import PlayerSearch from './components/PlayerSearch';

export type Tournament = 'libertadores' | 'sudamericana' | 'uru.1' | 'uru.2' | 'mex.1' | 'mex.2' | 'rus.1' | 'chi.1' | 'per.1' | 'per.2' | 'aus.1';
type View = 'home' | 'groups' | 'matches' | 'players';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [tournament, setTournament] = useState<Tournament>('libertadores');

  const handleNavigate = (view: View, selectedTournament?: Tournament) => {
    if (selectedTournament) setTournament(selectedTournament);
    setCurrentView(view);
  };

  // Blob superior izquierdo — varía por torneo dentro de la paleta Potrero
  const getBgColor1 = (t: Tournament) => {
    switch (t) {
      case 'libertadores':  return 'bg-brand-magenta/10';
      case 'sudamericana':  return 'bg-brand-lime/10';
      case 'uru.1':         return 'bg-brand-lime/10';
      case 'uru.2':         return 'bg-brand-lime/10';
      case 'mex.1':         return 'bg-brand-orange/10';
      case 'mex.2':         return 'bg-brand-orange/10';
      case 'rus.1':         return 'bg-brand-magenta/10';
      case 'chi.1':         return 'bg-brand-orange/10';
      case 'per.1':         return 'bg-brand-lime/10';
      case 'per.2':         return 'bg-brand-lime/10';
      case 'aus.1':         return 'bg-brand-magenta/10';
      default:              return 'bg-brand-magenta/10';
    }
  };

  // Blob inferior derecho — complementario al primario
  const getBgColor2 = (t: Tournament) => {
    switch (t) {
      case 'libertadores':  return 'bg-brand-orange/8';
      case 'sudamericana':  return 'bg-brand-magenta/8';
      case 'uru.1':         return 'bg-brand-magenta/8';
      case 'uru.2':         return 'bg-brand-magenta/8';
      case 'mex.1':         return 'bg-brand-lime/8';
      case 'mex.2':         return 'bg-brand-lime/8';
      case 'rus.1':         return 'bg-brand-orange/8';
      case 'chi.1':         return 'bg-brand-magenta/8';
      case 'per.1':         return 'bg-brand-orange/8';
      case 'per.2':         return 'bg-brand-orange/8';
      case 'aus.1':         return 'bg-brand-orange/8';
      default:              return 'bg-brand-orange/8';
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans">

      {/* Efectos de ambiente — blobs de color detrás del contenido */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${getBgColor1(tournament)}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${getBgColor2(tournament)}`} />
        {/* Resplandor navy central — refuerza la identidad de marca */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] rounded-full blur-[160px] bg-brand-navy/20" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/5 bg-brand-navy/30 backdrop-blur-md">
          <button
            type="button"
            aria-label="Ir al inicio"
            className="flex items-center gap-4 group"
            onClick={() => setCurrentView('home')}
          >
            {/* Logo mark — intenta cargar el SVG generado; usar /logo-potrero-mark.png para el PNG oficial */}
            <div className="h-11 sm:h-13 w-auto flex items-center justify-center animate-logo-float">
              <img
                src="/logo-mark.svg"
                alt="Potrero Talent Hub"
                className="h-full w-auto object-contain brightness-0 invert drop-shadow-[0_0_12px_rgba(255,1,152,0.30)] transition-transform duration-300 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            {/* Wordmark compuesto con CSS — funciona sobre fondos oscuros */}
            <div className="flex flex-col leading-none">
              <span className="font-display font-black italic text-xl sm:text-2xl tracking-[-0.01em] text-white uppercase group-hover:text-brand-magenta transition-colors duration-300">
                POTRERO
              </span>
              <span className="text-[10px] font-bold tracking-[0.35em] text-brand-magenta uppercase mt-0.5">
                TALENT•HUB
              </span>
            </div>
          </button>
        </header>

        {/* ── VISTAS ─────────────────────────────────────────────── */}
        <div className="flex-1 w-full flex flex-col">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <div key="home" className="flex-1 flex flex-col">
                <Home onNavigate={handleNavigate} />
              </div>
            )}
            {currentView === 'groups' && (
              <div key="groups" className="flex-1 flex flex-col">
                <Groups tournament={tournament} onBack={() => setCurrentView('home')} />
              </div>
            )}
            {currentView === 'matches' && (
              <div key="matches" className="flex-1 flex flex-col">
                <Matches tournament={tournament} onBack={() => setCurrentView('home')} />
              </div>
            )}
            {currentView === 'players' && (
              <div key="players" className="flex-1 flex flex-col">
                <PlayerSearch onBack={() => setCurrentView('home')} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer className="w-full px-4 sm:px-6 py-6 border-t border-white/5 bg-brand-navy/20 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Marca en footer */}
            <div className="flex items-center gap-3">
              <img
                src="/logo-mark.svg"
                alt="Potrero"
                className="h-8 w-auto brightness-0 invert opacity-50"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-display font-black italic tracking-tight text-white/50 uppercase">
                  POTRERO
                </span>
                <span className="text-[9px] font-bold tracking-[0.3em] text-brand-magenta/50 uppercase">
                  TALENT•HUB
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 font-medium text-center">
              &copy; 2026 Potrero Talent Hub. Todos los derechos reservados.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
