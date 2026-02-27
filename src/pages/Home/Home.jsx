import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HorizontalRail from "../../components/HorizontalRail/HorizontalRail";
import GenreCard from "../../components/cards/GenreCard";
import ArtistCard from "../../components/cards/ArtistCard";
import PlaylistCard from "../../components/cards/PlaylistCard";
import TitleArea from "../../components/TitleArea/TitleArea";
import NowPlayingArea from "../../components/NowPlayingArea/NowPlayingArea";
import HomeLayout from "./HomeLayout";
import "./Home.css";
import { fetchArtistsSeeds, fetchGenreSeeds, fetchPlaylistCovers, fetchTopGenres } from "../../services/homeData";
import { msToMinSec } from "../../services/itunes";
import { searchSongs } from "../../services/itunes";
import { usePlayer } from "../../hooks";
import { getArtistImage } from "../../services/lastfm";

export default function Home() {
  const railGenres = useRef(null);
  const railArtists = useRef(null);
  const railPlaylists = useRef(null);

  const nav = useNavigate();
  const goMusic = (term) => nav(`/musicas?q=${encodeURIComponent(term)}`);

  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingA, setLoadingA] = useState(true);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingG, setLoadingG] = useState(true);
  const [artistImages, setArtistImages] = useState({});
  const [genreImages, setGenreImages] = useState({});

  useEffect(() => {
    let alive = true;

    fetchArtistsSeeds({ country: "BR", perSeed: 12 })
      .then((list) => alive && setArtists(list))
      .finally(() => alive && setLoadingA(false));

    fetchPlaylistCovers({ country: "BR" })
      .then((list) => alive && setPlaylists(list))
      .finally(() => alive && setLoadingP(false));

    fetchTopGenres({ country: "br", limit: 100, take: 6 })
      .then((list) => {
        if (!alive) return;
        if (Array.isArray(list) && list.length > 0) {
          setGenres(list);
        } else {
          return fetchGenreSeeds({ country: "BR", take: 6 }).then((fallback) => {
            if (alive) setGenres(fallback);
          });
        }
      })
      .catch(() =>
        fetchGenreSeeds({ country: "BR", take: 6 }).then((fallback) => {
          if (alive) setGenres(fallback);
        })
      )
      .finally(() => alive && setLoadingG(false));

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const list = artists ?? [];
    if (list.length === 0) {
      return () => {
        alive = false;
      };
    }

    (async () => {
      const uniqueNames = Array.from(new Set(list.map((a) => a?.name).filter(Boolean)));
      const images = {};
      await Promise.allSettled(
        uniqueNames.map(async (name) => {
          const img = await getArtistImage(name);
          if (img) {
            images[name] = img;
            return;
          }

          try {
            const [song] = await searchSongs(name, { limit: 1, country: "BR" });
            const fallback = song?.artwork;
            if (fallback) images[name] = fallback;
          } catch {
            void 0;
          }
        })
      );
      if (alive) setArtistImages(images);
    })();

    return () => {
      alive = false;
    };
  }, [artists]);

  useEffect(() => {
    let alive = true;
    const list = genres ?? [];
    if (list.length === 0) {
      return () => {
        alive = false;
      };
    }

    (async () => {
      const images = {};
      await Promise.allSettled(
        list.map(async (g) => {
          const img = g?.sampleArtist ? await getArtistImage(g.sampleArtist) : null;
          if (img) images[g.id] = img;
        })
      );
      if (alive) setGenreImages(images);
    })();

    return () => {
      alive = false;
    };
  }, [genres]);

  const { track, isPlaying, current, total, pause, resume, seek, repeat, toggleRepeat, next, prev, seekBy, queue, queueIndex } = usePlayer();

  const canPrev = queueIndex > 0;
  const canNext = queueIndex >= 0 && queueIndex < (queue?.length ?? 0) - 1;

  const progress = total ? current / total : 0;

  const now = track
    ? {
        title: track.title,
        artist: track.artist,
        cover: track.artwork,
        isPlaying,
        current: msToMinSec(current * 1000),
        total: msToMinSec(total * 1000),
        progress,
        canPlay: true,
        onToggle: isPlaying ? pause : resume,
        onSeek: (ratio) => seek(ratio * total),
        repeat,
        onRepeat: toggleRepeat,
        onPrev: canPrev ? prev : null,
        onNext: canNext ? next : null,
        onForward: () => seekBy(10),
      }
    : {
        title: "—",
        artist: "Nenhuma música tocando",
        cover: "",
        isPlaying: false,
        current: "0:00",
        total: "0:00",
        progress: 0,
        canPlay: false,
        onToggle: null,
        onSeek: null,
        repeat: false,
        onRepeat: null,
        onPrev: null,
        onNext: null,
        onForward: null,
      };
  

  return (
    <HomeLayout right={<NowPlayingArea track={now} />}>
      <main className="home__main">
        <TitleArea title="Você pode gostar" railRef={railGenres} />
        <HorizontalRail ref={railGenres}>
          {loadingG && <div style={{ padding: 12 }}>Carregando gêneros... 🎧</div>}
          {!loadingG &&
            genres.map((g) => (
              <GenreCard
                key={g.id}
                title={g.name}
                image={genreImages[g.id] || g.image || "/music.png"}
                onPlay={() => goMusic(g.term)}
              />
            ))}
        </HorizontalRail>

        <TitleArea title="Artistas" railRef={railArtists} />
        <HorizontalRail ref={railArtists}>
          {loadingA && <div style={{ padding: 12 }}>Carregando artistas... 🎤</div>}
          {!loadingA &&
            artists.slice(0, 18).map((a) => (
              <ArtistCard
                key={a.id}
                name={a.name}
                image={artistImages[a.name] || "/music.png"} // ⚠️ iTunes não retorna foto do artista aqui
                onClick={() => goMusic(a.name)}
              />
            ))}
        </HorizontalRail>

        <TitleArea title="Playlists" railRef={railPlaylists} />
        <HorizontalRail ref={railPlaylists}>
          {loadingP && <div style={{ padding: 12 }}>Carregando playlists... 🎶</div>}
          {!loadingP &&
            playlists.map((p) => (
              <PlaylistCard key={p.id} title={p.title} image={p.image} onClick={() => goMusic(p.term)} />
            ))}
        </HorizontalRail>
      </main>
    </HomeLayout>
  );
}