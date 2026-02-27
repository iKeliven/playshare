// src/services/lastfm.js
// Usando API pública do Last.fm para obter imagens de artistas
// Nota: Sem chave de API, usaremos dados públicos

const LASTFM_API = "https://ws.audioscrobbler.com/2.0/";

const artistImageCache = new Map();

function getApiKey() {
  const key = import.meta?.env?.VITE_LASTFM_API_KEY;
  return typeof key === "string" && key.trim() ? key.trim() : "";
}

export async function getArtistImage(artistName) {
  if (!artistName) return null;

  const cached = artistImageCache.get(artistName);
  if (cached !== undefined) return cached;

  const apiKey = getApiKey();
  if (!apiKey) {
    artistImageCache.set(artistName, null);
    return null;
  }

  try {
    const params = new URLSearchParams({
      method: "artist.getinfo",
      artist: artistName,
      api_key: apiKey,
      format: "json",
    });

    const res = await fetch(`${LASTFM_API}?${params.toString()}`);
    if (!res.ok) return null;

    const data = await res.json();

    if (data.artist?.image) {
      // Pega a maior imagem disponível
      const images = data.artist.image;
      const largeImage = images.find((img) => img.size === "extralarge");
      const mediumImage = images.find((img) => img.size === "large");

      const url = largeImage?.["#text"] || mediumImage?.["#text"] || null;
      artistImageCache.set(artistName, url);
      return url;
    }
    artistImageCache.set(artistName, null);
    return null;
  } catch (error) {
    console.error("Erro Last.fm:", error);
    artistImageCache.set(artistName, null);
    return null;
  }
}

export async function getTopArtists(country = "BR", limit = 50) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return [];

    const params = new URLSearchParams({
      method: "geo.gettopartists",
      country: country,
      api_key: apiKey,
      format: "json",
      limit: String(limit),
    });

    const res = await fetch(`${LASTFM_API}?${params.toString()}`);
    if (!res.ok) return [];

    const data = await res.json();

    return (data.topartists?.artist ?? []).map((a) => ({
      id: a.name,
      name: a.name,
      playcount: a.playcount,
      image: a.image?.[a.image.length - 1]?.["#text"] || null,
    }));
  } catch (error) {
    console.error("Erro Last.fm:", error);
    return [];
  }
}
