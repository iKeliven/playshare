// src/services/homeData.js
const ITUNES = "https://itunes.apple.com/search";

const APPLE_RSS = "https://rss.applemarketingtools.com/api/v2";

async function itunesSearch(params) {
  const url = `${ITUNES}?${new URLSearchParams(params).toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  return res.json();
}

async function appleTopSongs({ country = "br", limit = 100 } = {}) {
  const url = `${APPLE_RSS}/${country}/music/most-played/${limit}/songs.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Apple RSS ${res.status}`);
  return res.json();
}

export async function fetchGenreSeeds({
  country = "BR",
  take = 6,
  seeds = ["Pop", "Rock", "Hip-Hop/Rap", "Sertanejo", "Funk", "Eletrônica", "MPB", "Indie"],
} = {}) {
  const picked = seeds.slice(0, take);

  const packs = await Promise.all(
    picked.map((name) =>
      itunesSearch({
        term: name,
        entity: "song",
        limit: "1",
        country,
      })
        .then((data) => ({ name, data }))
        .catch(() => ({ name, data: { results: [] } }))
    )
  );

  return packs.map(({ name, data }) => {
    const first = (data.results ?? [])[0];
    return {
      id: name,
      name,
      term: name,
      image: first?.artworkUrl100 || first?.artworkUrl60 || "",
      sampleArtist: first?.artistName || "",
    };
  });
}

export async function fetchArtistsSeeds({
  country = "BR",
  perSeed = 10,
  seeds = ["pop", "rock", "indie", "hip hop", "funk", "sertanejo", "mpb", "electronic"],
} = {}) {
  const results = await Promise.all(
    seeds.map((term) =>
      itunesSearch({
        term,
        entity: "musicArtist",
        limit: String(perSeed),
        country,
      }).catch(() => ({ results: [] }))
    )
  );

  const map = new Map();
  for (const pack of results) {
    for (const a of pack.results ?? []) {
      // artistId/artistName
      if (!a.artistId || !a.artistName) continue;
      if (!map.has(a.artistId)) {
        map.set(a.artistId, {
          id: a.artistId,
          name: a.artistName,
        });
      }
    }
  }
  return Array.from(map.values());
}

export async function fetchPlaylistCovers({
  country = "BR",
  perPlaylist = 1,
  playlists = [
    { id: "pl_pop", title: "Pop Hits", term: "pop hits" },
    { id: "pl_chill", title: "Chill Vibes", term: "chill" },
    { id: "pl_br", title: "Brasil Agora", term: "brasil" },
    { id: "pl_workout", title: "Treino", term: "workout" },
    { id: "pl_rock", title: "Rock", term: "rock" },
    { id: "pl_party", title: "Festa", term: "party" },
  ],
} = {}) {
  const packs = await Promise.all(
    playlists.map((pl) =>
      itunesSearch({
        term: pl.term,
        entity: "song",
        limit: String(perPlaylist),
        country,
      })
        .then((data) => ({ pl, data }))
        .catch(() => ({ pl, data: { results: [] } }))
    )
  );

  return packs
    .map(({ pl, data }) => {
      const first = (data.results ?? [])[0];
      if (!first) return null;
      return {
        id: pl.id,
        title: pl.title,
        term: pl.term,
        image: first.artworkUrl100 || first.artworkUrl60 || "/mock/p2.jpg",
      };
    })
    .filter(Boolean);
}

export async function fetchTopGenres({ country = "br", limit = 100, take = 6 } = {}) {
  const data = await appleTopSongs({ country, limit });
  const songs = data?.feed?.results ?? [];

  const count = new Map();
  const sampleByGenre = new Map();

  for (const s of songs) {
    const genres = s?.genres ?? [];
    for (const g of genres) {
      const name = g?.name;
      if (!name) continue;
      count.set(name, (count.get(name) || 0) + 1);
      if (!sampleByGenre.has(name)) sampleByGenre.set(name, s);
    }
  }

  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, take)
    .map(([name]) => {
      const sample = sampleByGenre.get(name);
      return {
        id: name,
        name,
        term: name,
        image: sample?.artworkUrl100 || sample?.artworkUrl60 || "",
        sampleArtist: sample?.artistName || "",
      };
    });
}