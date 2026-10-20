import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HorizontalRail from "../../components/HorizontalRail/HorizontalRail";
import GenreCard from "../../components/Cards/GenreCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import TitleArea from "../../components/TitleArea/TitleArea";
import Player from "../../components/Player/Player";
import HomeLayout from "./HomeLayout";
import "./Home.css";
import { fetchGenreSeeds, fetchPlaylistCovers, fetchTopGenres } from "../../services/homeData";
import { msToMinSec } from "../../services/itunes";
import { searchSongs } from "../../services/itunes";
import { usePlayer } from "../../hooks";
import { getArtistImage } from "../../services/lastfm";
import play from "/play-circle.svg";
import pausar from "/pouse-btn.svg";
import playBtn from "/play-btn.svg"

export default function Home() {
  const railGenres = useRef(null);
  const railPlaylists = useRef(null);
  const railTracks = useRef(null);

  const nav = useNavigate();
  const goMusic = (term) => nav(`/musicas?q=${encodeURIComponent(term)}`);

  const [playlists, setPlaylists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingG, setLoadingG] = useState(true);
  const [genreImages, setGenreImages] = useState({});
  const [tracks, setTracks] = useState([]);
  const [loadingT, setLoadingT] = useState(true);

  const { track, isPlaying, current, total, pause, resume, seek, repeat, toggleRepeat, next, prev, seekBy, queue, queueIndex, setQueueAndPlay } =
    usePlayer();

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

  const handlePlay = (t, idx) => {
    if (!t?.previewUrl) return;
    const isSame = track?.id != null && t?.id != null && String(track.id) === String(t.id);
    if (isSame) {
      if (isPlaying) pause();
      else resume();
      return;
    }
    setQueueAndPlay(tracks, idx);
  };

  useEffect(() => {
    let alive = true;

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

    searchSongs("brasil", { limit: 18, country: "BR" })
      .then((list) => alive && setTracks(list))
      .finally(() => alive && setLoadingT(false));

    return () => {
      alive = false;
    };
  }, []);

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

  return (
    <HomeLayout right={<Player track={now} />}>
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

        <TitleArea title="Álbuns musicais " railRef={railPlaylists} />
        <HorizontalRail ref={railPlaylists}>
          {loadingP && <div style={{ padding: 12 }}>Carregando álbuns... 🎶</div>}
          {!loadingP &&
            playlists.map((p) => (
              <PlaylistCard key={p.id} title={p.title} image={p.image} onClick={() => goMusic(p.term)} />
            ))}
        </HorizontalRail>

        <TitleArea title="Músicas" railRef={railTracks} />
        <HorizontalRail ref={railTracks}>
          {loadingT && <div style={{ padding: 12 }}>Carregando músicas... 🎵</div>}
          {!loadingT && tracks.length === 0 && <div style={{ padding: 12 }}>Nenhuma música encontrada 😢</div>}
          {!loadingT &&
            tracks.map((t, idx) => {
              const active = track?.id != null && t?.id != null && String(track.id) === String(t.id);

              return (
                <div key={t.id} className="home-trackCard card-glass">
                  <img className="home-trackCard__img" src={t.artwork || "/music.png"} alt={t.title} />
                  <div className="home-trackCard__meta">
                    <p className="home-trackCard__title">{t.title}</p>
                    <p className="home-trackCard__artist">{t.artist}</p>
                    <p className="home-trackCard__extra">{t.album}</p>
                  </div>
                  <button
                    type="button"
                    className="home-trackCard__btn"
                    onClick={() => handlePlay(t, idx)}
                    disabled={!t.previewUrl}
                    title={active ? (isPlaying ? "Pausar" : "Retomar") : "Reproduzir"}
                  >
                    {active ? (
                      isPlaying ? (
                        <img className="home-trackCard__icon is-control" src={pausar} alt="Pausar" />
                      ) : (
                        <img className="home-trackCard__icon is-control" src={playBtn} alt="Retomar" />
                      )
                    ) : (
                      <img className="home-trackCard__icon" src={play} alt="Reproduzir" />
                    )}
                  </button>
                </div>
              );
            })}
        </HorizontalRail>
      </main>
    </HomeLayout>
  );
}