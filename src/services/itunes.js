// src/services/itunes.js
import { searchCache } from "./cache";

const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";
let abortControllers = new Map();

function abortPrevious(entity) {
  const prev = abortControllers.get(entity);
  if (prev) prev.abort();
}

function setController(entity, controller) {
  abortControllers.set(entity, controller);
}

export function msToMinSec(ms) {
  if (!ms && ms !== 0) return "--:--";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function searchSongs(term, { limit = 25, country = "BR" } = {}) {
  const clean = (term ?? "").trim();
  if (!clean) return [];

  // Verifica cache
  const cached = searchCache.get(clean, "song");
  if (cached) return cached;

  // Cancela a requisição anterior de músicas (evita race condition)
  abortPrevious("song");

  const controller = new AbortController();
  setController("song", controller);

  try {
    const params = new URLSearchParams({
      term: clean,
      entity: "song",
      media: "music",
      limit: String(limit),
      country,
    });

    const res = await fetch(`${ITUNES_SEARCH_URL}?${params.toString()}`, {
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Erro iTunes: ${res.status}`);

    const data = await res.json();

    const results = (data.results ?? []).map((r) => ({
      id: r.trackId,
      title: r.trackName,
      artist: r.artistName,
      album: r.collectionName,
      duration: msToMinSec(r.trackTimeMillis),
      artwork: r.artworkUrl100,
      previewUrl: r.previewUrl,
      artistId: r.artistId,
    }));

    // Armazena no cache
    searchCache.set(clean, results, "song");
    return results;
  } catch (error) {
    // AbortError é esperado quando cancela requisição
    if (error.name === "AbortError") {
      return [];
    }
    throw error;
  } finally {
    if (abortControllers.get("song") === controller) {
      abortControllers.delete("song");
    }
  }
}

export async function searchArtists(term, { limit = 10, country = "BR" } = {}) {
  const clean = (term ?? "").trim();
  if (!clean) return [];

  const cached = searchCache.get(clean, "artist");
  if (cached) return cached;

  abortPrevious("artist");

  const controller = new AbortController();
  setController("artist", controller);

  try {
    const params = new URLSearchParams({
      term: clean,
      entity: "artist",
      limit: String(limit),
      country,
    });

    const res = await fetch(`${ITUNES_SEARCH_URL}?${params.toString()}`, {
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Erro iTunes: ${res.status}`);

    const data = await res.json();

    const results = (data.results ?? []).map((r) => ({
      id: r.artistId,
      name: r.artistName,
      link: r.artistLinkUrl,
    }));

    searchCache.set(clean, results, "artist");
    return results;
  } catch (error) {
    if (error.name === "AbortError") {
      return [];
    }
    throw error;
  } finally {
    if (abortControllers.get("artist") === controller) {
      abortControllers.delete("artist");
    }
  }
}

export function clearCache() {
  searchCache.clear();
}