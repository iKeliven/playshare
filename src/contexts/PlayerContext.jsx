import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const queueRef = useRef([]);
  const queueIndexRef = useRef(-1);
  const repeatRef = useRef(false);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  // Sincroniza progresso
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrent(audio.currentTime);
      const d = audio.duration;
      setTotal(Number.isFinite(d) ? d : 0);
    };

    const handleLoaded = () => {
      const d = audio.duration;
      setTotal(Number.isFinite(d) ? d : 0);
    };

    const handleEnded = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        const p = audio.play();
        if (p && typeof p.catch === "function") {
          p.catch(() => {
            setIsPlaying(false);
          });
        }
        return;
      }

      const q = queueRef.current || [];
      const i = queueIndexRef.current;
      if (Array.isArray(q) && q.length > 0 && Number.isFinite(i) && i >= 0 && i < q.length - 1) {
        const nextTrack = q[i + 1];
        if (nextTrack?.previewUrl) {
          setQueueIndex(i + 1);
          setTrack(nextTrack);
          audio.src = nextTrack.previewUrl;
          audio.currentTime = 0;
          setCurrent(0);
          setTotal(0);

          const p = audio.play();
          if (p && typeof p.catch === "function") {
            p.catch(() => {
              setIsPlaying(false);
            });
          }
          return;
        }
      }

      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("durationchange", handleLoaded);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("durationchange", handleLoaded);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const setQueueAndPlay = useCallback(
    (tracks, startIndex = 0) => {
      const list = (Array.isArray(tracks) ? tracks : []).filter((t) => t?.previewUrl);
      if (list.length === 0) return;

      const i = Math.min(Math.max(0, Number(startIndex) || 0), list.length - 1);
      const nextTrack = list[i];

      setQueue(list);
      setQueueIndex(i);

      const audio = audioRef.current;
      setTrack(nextTrack);
      audio.src = nextTrack.previewUrl;
      audio.currentTime = 0;
      setCurrent(0);
      setTotal(0);

      const p = audio.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          setIsPlaying(false);
        });
      }
    },
    []
  );

  const play = useCallback(
    (newTrack) => {
      const audio = audioRef.current;
      if (!newTrack?.previewUrl) return;

      const isSame = track?.id != null && newTrack?.id != null && String(track.id) === String(newTrack.id);
      if (!isSame) {
        setTrack(newTrack);
        audio.src = newTrack.previewUrl;
        audio.currentTime = 0;
        setCurrent(0);
        setTotal(0);
      }

      const p = audio.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          setIsPlaying(false);
        });
      }
    },
    [track]
  );

  const next = useCallback(() => {
    const q = queueRef.current || [];
    const i = queueIndexRef.current;
    if (!Array.isArray(q) || q.length === 0) return;
    if (!Number.isFinite(i) || i < 0 || i >= q.length - 1) return;

    const nextTrack = q[i + 1];
    if (!nextTrack?.previewUrl) return;

    const audio = audioRef.current;
    setQueueIndex(i + 1);
    setTrack(nextTrack);
    audio.src = nextTrack.previewUrl;
    audio.currentTime = 0;
    setCurrent(0);
    setTotal(0);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const prev = useCallback(() => {
    const q = queueRef.current || [];
    const i = queueIndexRef.current;
    if (!Array.isArray(q) || q.length === 0) return;
    if (!Number.isFinite(i) || i <= 0 || i >= q.length) return;

    const prevTrack = q[i - 1];
    if (!prevTrack?.previewUrl) return;

    const audio = audioRef.current;
    setQueueIndex(i - 1);
    setTrack(prevTrack);
    audio.src = prevTrack.previewUrl;
    audio.currentTime = 0;
    setCurrent(0);
    setTotal(0);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const seekBy = useCallback(
    (deltaSeconds) => {
      const audio = audioRef.current;
      const nextTime = audio.currentTime + Number(deltaSeconds || 0);
      audio.currentTime = Math.max(0, nextTime);
    },
    []
  );

  const toggleRepeat = useCallback(() => {
    setRepeat((r) => !r);
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    const p = audioRef.current.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const seek = useCallback(
    (seconds) => {
      const next = Number(seconds);
      if (!Number.isFinite(next)) return;
      audioRef.current.currentTime = Math.max(0, next);
    },
    []
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setTrack(null);
    setCurrent(0);
    setTotal(0);
    setIsPlaying(false);
    setQueue([]);
    setQueueIndex(-1);
    setRepeat(false);
  }, []);

  const value = useMemo(
    () => ({
      track,
      isPlaying,
      current,
      total,
      queue,
      queueIndex,
      repeat,
      setQueueAndPlay,
      play,
      pause,
      resume,
      seek,
      seekBy,
      next,
      prev,
      toggleRepeat,
      stop,
    }),
    [
      track,
      isPlaying,
      current,
      total,
      queue,
      queueIndex,
      repeat,
      setQueueAndPlay,
      play,
      pause,
      resume,
      seek,
      seekBy,
      next,
      prev,
      toggleRepeat,
      stop,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export default PlayerContext;
