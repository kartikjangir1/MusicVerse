import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { getUserData, saveUserData } from "../services/api";

const PlayerContext = createContext();
const emptyData = {
  likedSongs: [],
  recentlyPlayed: [],
  playlists: [],
};

export function PlayerProvider({ children }) {
  const { user } = useAuth();

  // =========================
  // USER STORAGE
  // =========================

  const storageKey = user
    ? `musicverse_${user.id}`
    : null;

  // =========================
  // USER DATA
  // =========================

  const [likedSongs, setLikedSongs] =
    useState([]);

  const [recentlyPlayed, setRecentlyPlayed] =
    useState([]);

  const [playlists, setPlaylists] =
    useState([]);

  const [dataLoaded, setDataLoaded] =
    useState(false);

  // =========================
  // PLAYER
  // =========================

  const [currentSong, setCurrentSong] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [queue, setQueue] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [isShuffle, setIsShuffle] =
    useState(false);

  const [repeatMode, setRepeatMode] =
    useState("off");

  // =========================
  // LOAD USER DATA
  // =========================

  useEffect(() => {
    setDataLoaded(false);
    if (!storageKey) {
      setLikedSongs([]);
      setRecentlyPlayed([]);
      setPlaylists([]);
      setDataLoaded(true);
    } else {
      getUserData()
        .then((data) => {
          setLikedSongs(data.likedSongs || []);
          setRecentlyPlayed(data.recentlyPlayed || []);
          setPlaylists(data.playlists || []);
          setDataLoaded(true);
        })
        .catch(() => {
          setLikedSongs(emptyData.likedSongs);
          setRecentlyPlayed(emptyData.recentlyPlayed);
          setPlaylists(emptyData.playlists);
          setDataLoaded(true);
        });
    }

    // New user / logout
    setCurrentSong(null);
    setIsPlaying(false);
    setQueue([]);
    setCurrentIndex(-1);
  }, [storageKey]);

  // =========================
  // SAVE USER DATA
  // =========================

  useEffect(() => {
    if (!storageKey || !dataLoaded) return;

    saveUserData({ likedSongs, recentlyPlayed, playlists }).catch((error) => {
      console.error("SAVE USER DATA ERROR:", error);
    });
  }, [storageKey, dataLoaded, likedSongs, recentlyPlayed, playlists]);

  // =========================
  // LIKED SONGS
  // =========================

  const toggleLike = (song) => {
    if (!song) return;

    setLikedSongs((prev) => {
      const exists = prev.some(
        (item) => item.id === song.id
      );

      if (exists) {
        return prev.filter(
          (item) => item.id !== song.id
        );
      }

      return [...prev, song];
    });
  };

  const isSongLiked = (songId) => {
    return likedSongs.some(
      (song) => song.id === songId
    );
  };

  // =========================
  // RECENTLY PLAYED
  // =========================

  const addToRecentlyPlayed = (song) => {
    if (!song) return;

    setRecentlyPlayed((prev) => {
      const filtered = prev.filter(
        (item) => item.id !== song.id
      );

      return [
        song,
        ...filtered,
      ].slice(0, 10);
    });
  };

  const clearRecentlyPlayed = () => {
    setRecentlyPlayed([]);
  };

  // =========================
  // PLAYLISTS
  // =========================

  const createPlaylist = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return null;
    }

    const newPlaylist = {
      id: crypto.randomUUID(),
      name: trimmedName,
      songs: [],
    };

    setPlaylists((prev) => [
      ...prev,
      newPlaylist,
    ]);

    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter(
        (playlist) =>
          String(playlist.id) !==
          String(playlistId)
      )
    );
  };

  const renamePlaylist = (
    playlistId,
    newName
  ) => {
    const trimmedName =
      newName.trim();

    if (!trimmedName) return;

    setPlaylists((prev) =>
      prev.map((playlist) =>
        String(playlist.id) ===
        String(playlistId)
          ? {
              ...playlist,
              name: trimmedName,
            }
          : playlist
      )
    );
  };

  const addSongToPlaylist = (
    playlistId,
    song
  ) => {
    if (!song) return;

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (
          String(playlist.id) !==
          String(playlistId)
        ) {
          return playlist;
        }

        const exists =
          playlist.songs?.some(
            (item) => item.id === song.id
          );

        if (exists) {
          return playlist;
        }

        return {
          ...playlist,
          songs: [
            ...(playlist.songs || []),
            song,
          ],
        };
      })
    );
  };

  const removeSongFromPlaylist = (
    playlistId,
    songId
  ) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (
          String(playlist.id) !==
          String(playlistId)
        ) {
          return playlist;
        }

        return {
          ...playlist,
          songs: (
            playlist.songs || []
          ).filter(
            (song) =>
              song.id !== songId
          ),
        };
      })
    );
  };

  // =========================
  // PLAY SONG
  // =========================

  const playSong = (
    song,
    songs = []
  ) => {
    if (!song) return;

    setCurrentSong(song);

    if (songs.length > 0) {
      setQueue(songs);

      const index =
        songs.findIndex(
          (item) => item.id === song.id
        );

      setCurrentIndex(index);
    }

    addToRecentlyPlayed(song);

    setIsPlaying(true);
  };

  // =========================
  // PLAY QUEUE SONG
  // =========================

  const playQueueSong = (index) => {
    if (
      index < 0 ||
      index >= queue.length
    ) {
      return;
    }

    const song = queue[index];

    setCurrentIndex(index);
    setCurrentSong(song);

    addToRecentlyPlayed(song);

    setIsPlaying(true);
  };

  // =========================
  // ADD TO QUEUE
  // =========================

  const addToQueue = (song) => {
    if (!song) return;

    setQueue((prev) => {
      const exists = prev.some(
        (item) => item.id === song.id
      );

      if (exists) {
        return prev;
      }

      return [...prev, song];
    });
  };

  // =========================
  // PLAY NEXT
  // =========================

  const playNext = (song) => {
    if (!song) return;

    setQueue((prev) => {
      const exists =
        prev.some(
          (item) => item.id === song.id
        );

      if (exists) {
        return prev;
      }

      if (
        currentIndex < 0 ||
        currentIndex >= prev.length
      ) {
        return [...prev, song];
      }

      const updatedQueue = [
        ...prev,
      ];

      updatedQueue.splice(
        currentIndex + 1,
        0,
        song
      );

      return updatedQueue;
    });
  };

  // =========================
  // REMOVE FROM QUEUE
  // =========================

  const removeFromQueue = (songId) => {
    setQueue((prev) => {
      const removeIndex =
        prev.findIndex(
          (song) => song.id === songId
        );

      if (removeIndex === -1) {
        return prev;
      }

      return prev.filter(
        (song) => song.id !== songId
      );
    });

    setCurrentIndex((prevIndex) => {
      const removedIndex =
        queue.findIndex(
          (song) => song.id === songId
        );

      if (removedIndex === -1) {
        return prevIndex;
      }

      if (removedIndex < prevIndex) {
        return prevIndex - 1;
      }

      if (
        removedIndex === prevIndex &&
        prevIndex === queue.length - 1
      ) {
        return Math.max(
          0,
          prevIndex - 1
        );
      }

      return prevIndex;
    });
  };

  // =========================
  // CLEAR QUEUE
  // =========================

  const clearQueue = () => {
    if (!currentSong) {
      setQueue([]);
      setCurrentIndex(-1);
      return;
    }

    setQueue([currentSong]);
    setCurrentIndex(0);
  };

  // =========================
  // NEXT SONG
  // =========================

  const nextSong = () => {
    if (queue.length === 0) {
      return;
    }

    if (repeatMode === "one") {
      setIsPlaying(false);

      setTimeout(() => {
        setIsPlaying(true);
      }, 100);

      return;
    }

    let nextIndex;

    if (isShuffle) {
      if (queue.length === 1) {
        nextIndex = 0;
      } else {
        do {
          nextIndex =
            Math.floor(
              Math.random() *
                queue.length
            );
        } while (
          nextIndex === currentIndex
        );
      }
    } else {
      nextIndex =
        currentIndex + 1;
    }

    if (
      nextIndex >= queue.length
    ) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    const song = queue[nextIndex];

    setCurrentIndex(nextIndex);
    setCurrentSong(song);

    addToRecentlyPlayed(song);

    setIsPlaying(true);
  };

  // =========================
  // PREVIOUS SONG
  // =========================

  const previousSong = () => {
    if (queue.length === 0) {
      return;
    }

    const previousIndex =
      currentIndex - 1;

    if (previousIndex < 0) {
      return;
    }

    const song =
      queue[previousIndex];

    setCurrentIndex(
      previousIndex
    );

    setCurrentSong(song);

    addToRecentlyPlayed(song);

    setIsPlaying(true);
  };

  // =========================
  // PLAY / PAUSE
  // =========================

  const togglePlay = () => {
    setIsPlaying(
      (prev) => !prev
    );
  };

  // =========================
  // SHUFFLE
  // =========================

  const toggleShuffle = () => {
    setIsShuffle(
      (prev) => !prev
    );
  };

  // =========================
  // REPEAT
  // =========================

  const toggleRepeat = () => {
    setRepeatMode((mode) => {
      if (mode === "off") {
        return "all";
      }

      if (mode === "all") {
        return "one";
      }

      return "off";
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,

        queue,
        currentIndex,

        isShuffle,
        repeatMode,

        likedSongs,
        recentlyPlayed,
        playlists,

        playSong,
        playQueueSong,

        nextSong,
        previousSong,

        addToQueue,
        playNext,
        removeFromQueue,
        clearQueue,

        togglePlay,
        toggleShuffle,
        toggleRepeat,

        toggleLike,
        isSongLiked,

        clearRecentlyPlayed,

        createPlaylist,
        deletePlaylist,
        renamePlaylist,

        addSongToPlaylist,
        removeSongFromPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(
    PlayerContext
  );
}