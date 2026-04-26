import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

const CACHE_FILE = path.join(process.cwd(), 'cache.json');
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

// Clave API. Idealmente en .env como API_SPORTS_KEY, usando la predeterminada si no existe.
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

// Funciones de caché
function readCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function writeCache(data: any) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

function getFromCache(key: string) {
  const cache = readCache();
  if (cache[key]) {
    const age = Date.now() - cache[key].timestamp;
    if (age < CACHE_DURATION_MS) {
      return cache[key].data;
    }
  }
  return null;
}

function saveToCache(key: string, data: any) {
  const cache = readCache();
  cache[key] = {
    timestamp: Date.now(),
    data: data
  };
  writeCache(cache);
}

// Filtra propiedades que sean 0, "0" o null
function removeZeros(obj: any): any {
  if (Array.isArray(obj)) {
    const arr = obj.map(removeZeros).filter(val => val !== null && val !== undefined);
    return arr.length > 0 ? arr : undefined;
  } else if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === 0 || value === "0" || value === null) continue;
      const cleanedValue = removeZeros(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  return obj;
}

// ==========================================
// RUTAS API
// ==========================================

// 1. Buscar Equipo
app.get("/api/teams", async (req, res) => {
  const search = req.query.search as string;
  if (!search) return res.status(400).json({ error: "Missing search" });

  const cacheKey = `team_search_${search.toLowerCase()}`;
  const cached = getFromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(search)}`, { headers });
    const data = await response.json();
    saveToCache(cacheKey, data.response);
    res.json(data.response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener Plantilla (Squad)
app.get("/api/squad", async (req, res) => {
  const teamId = req.query.teamId as string;
  if (!teamId) return res.status(400).json({ error: "Missing teamId" });

  const cacheKey = `squad_${teamId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, { headers });
    const data = await response.json();
    saveToCache(cacheKey, data.response);
    res.json(data.response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Obtener Datos del Jugador (usando el truco sin temporada y filtrando 0s)
app.get("/api/player", async (req, res) => {
  const search = req.query.search as string;
  const teamId = req.query.team as string;
  
  if (!search || !teamId) return res.status(400).json({ error: "Missing search or team" });

  const cacheKey = `player_bypass_${search}_${teamId}`;
  const cached = getFromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Pedimos el jugador SIN año para obtener el historial completo y saltarnos el bloqueo
    // Para que la API-Sports lo permita sin season, DEBEMOS usar search y team juntos.
    const response = await fetch(`https://v3.football.api-sports.io/players?search=${encodeURIComponent(search)}&team=${teamId}`, { headers });
    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ error: JSON.stringify(data.errors) });
    }

    if (data.response && data.response.length > 0) {
      // Tomamos la data base
      const playerObj = data.response[0];
      
      // Limpiamos los ceros de sus estadísticas para cumplir el requerimiento
      const parsedStats = playerObj.statistics.map((stat: any) => removeZeros(stat));
      
      // Agrupamos el jugador con sus stats limpias
      const finalData = {
        player: playerObj.player,
        statistics: parsedStats.filter((s: any) => s !== undefined)
      };

      saveToCache(cacheKey, finalData);
      return res.json(finalData);
    }
    
    res.json({ error: "Not found" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();
