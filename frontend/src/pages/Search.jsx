import { useEffect, useState } from "react";

import {
  Play,
  Heart,
  Plus,
  X,
  MoreVertical,
  ListPlus,
  SkipForward,
  Search as SearchIcon,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import { searchSongs } from "../services/api";
import { usePlayer } from "../context/PlayerContext";

function Search() {
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedSong, setSelectedSong] = useState(null);
  const [menuSongId, setMenuSongId] = useState(null);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");

  const {
    playSong,
    toggleLike,
    isSongLiked,
    playlists,
    addSongToPlaylist,
    addToQueue,
    playNext,
  } = usePlayer();

  // =========================
  // READ QUERY FROM URL
  // =========================

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );

    const urlQuery = params.get("q") || "";

    setQuery(urlQuery);

    if (urlQuery.trim()) {
      performSearch(urlQuery);
    } else {
      setSongs([]);
      setError("");
      setLastSearchedQuery("");
    }
  }, [location.search]);

  // =========================
  // SEARCH
  // =========================

  const performSearch = async (searchText) => {
    const cleanQuery = searchText.trim();

    if (!cleanQuery) {
      setSongs([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSongs([]);
      setLastSearchedQuery(cleanQuery);

      const data = await searchSongs(cleanQuery);

      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("SEARCH ERROR:", err);

      setSongs([]);

      const apiMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "";

      const lowerMessage =
        String(apiMessage).toLowerCase();

      if (lowerMessage.includes("quota")) {
        setError(
          "YouTube search limit has been reached. Please try again later."
        );
      } else if (lowerMessage.includes("api key")) {
        setError(
          "YouTube API is currently unavailable. Please check the API configuration."
        );
      } else {
        setError(
          "We couldn't load search results right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RETRY
  // =========================

  const handleRetry = () => {
    if (!lastSearchedQuery) {
      return;
    }

    performSearch(lastSearchedQuery);
  };

  // =========================
  // PLAY SONG
  // =========================

  const handlePlaySong = (e, song) => {
    e.stopPropagation();

    playSong(song, songs);
  };

  // =========================
  // LIKE
  // =========================

  const handleLike = (e, song) => {
    e.stopPropagation();

    toggleLike(song);
    setMenuSongId(null);
  };

  // =========================
  // OPEN PLAYLIST
  // =========================

  const handleOpenPlaylist = (e, song) => {
    e.stopPropagation();

    setSelectedSong(song);
    setMenuSongId(null);
  };

  // =========================
  // ADD TO PLAYLIST
  // =========================

  const handleAddToPlaylist = (playlistId) => {
    if (!selectedSong) {
      return;
    }

    addSongToPlaylist(
      playlistId,
      selectedSong
    );

    setSelectedSong(null);
  };

  // =========================
  // CLOSE MENU
  // =========================

  const closeMenu = () => {
    setMenuSongId(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-8">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="mb-6 md:mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold">
          Search Results
        </h1>

        {query && (
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Results for{" "}
            <span className="text-white font-medium break-words">
              "{query}"
            </span>
          </p>
        )}

      </div>

      {/* ========================= */}
      {/* EMPTY SEARCH */}
      {/* ========================= */}

      {!query && !loading && (
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4">

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#181818] flex items-center justify-center mb-5">
            <SearchIcon
              size={30}
              className="text-gray-500"
            />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Search for your music
          </h2>

          <p className="text-gray-500 text-sm max-w-md">
            Use the search bar above to find songs,
            artists and music from YouTube.
          </p>

        </div>
      )}

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}

      {loading && (
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-[#333] border-t-green-500 animate-spin mb-5" />

          <h2 className="text-base sm:text-lg font-semibold mb-2">
            Searching for music...
          </h2>

          <p className="text-gray-500 text-sm">
            Finding the best results for "{query}"
          </p>

        </div>
      )}

      {/* ========================= */}
      {/* ERROR */}
      {/* ========================= */}

      {!loading && error && (
        <div className="min-h-[55vh] flex items-center justify-center px-2">

          <div className="w-full max-w-lg bg-[#181818] border border-red-500/20 rounded-2xl p-6 sm:p-8 text-center">

            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertCircle
                size={28}
                className="text-red-400"
              />
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Search unavailable
            </h2>

            <p className="text-gray-400 text-sm leading-6 mb-6">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* RESULTS */}
      {/* ========================= */}

      {!loading &&
        !error &&
        query &&
        songs.length > 0 && (
          <>

            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <p className="text-sm text-gray-500">
                {songs.length} results found
              </p>
            </div>

            <div className="space-y-2">

              {songs.map((song) => {
                const liked = isSongLiked(song.id);
                const menuOpen = menuSongId === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() =>
                      playSong(song, songs)
                    }
                    className="relative flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 rounded-xl hover:bg-[#282828] transition cursor-pointer group"
                  >

                    {/* IMAGE */}

                    <div className="relative flex-shrink-0">

                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg object-cover"
                      />

                      <button
                        type="button"
                        onClick={(e) =>
                          handlePlaySong(e, song)
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        title="Play"
                      >
                        <Play
                          size={18}
                          fill="white"
                        />
                      </button>

                    </div>

                    {/* SONG INFO */}

                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {song.title}
                      </h3>

                      <p className="text-gray-400 text-xs sm:text-sm truncate mt-0.5">
                        {song.artist}
                      </p>

                    </div>

                    {/* LIKE */}

                    <button
                      type="button"
                      onClick={(e) =>
                        handleLike(e, song)
                      }
                      className={`p-2 sm:p-2.5 transition flex-shrink-0 ${
                        liked
                          ? "text-green-500"
                          : "text-gray-400 hover:text-white"
                      }`}
                      title={
                        liked
                          ? "Remove from Liked Songs"
                          : "Add to Liked Songs"
                      }
                    >
                      <Heart
                        size={18}
                        className="sm:w-5 sm:h-5"
                        fill={
                          liked
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    {/* MORE */}

                    <div className="relative flex-shrink-0">

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setMenuSongId(
                            menuOpen
                              ? null
                              : song.id
                          );
                        }}
                        className="p-2 sm:p-2.5 text-gray-400 hover:text-white transition"
                        title="More"
                      >
                        <MoreVertical size={19} />
                      </button>

                      {menuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={closeMenu}
                          />

                          <div
                            className="absolute right-0 top-10 w-48 bg-[#282828] border border-[#3a3a3a] rounded-xl shadow-2xl p-1 z-50"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              onClick={() => {
                                playSong(
                                  song,
                                  songs
                                );

                                closeMenu();
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                            >
                              <Play size={17} />
                              Play Now
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playNext(song);
                                closeMenu();
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                            >
                              <SkipForward size={17} />
                              Play Next
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                addToQueue(song);
                                closeMenu();
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                            >
                              <ListPlus size={17} />
                              Add to Queue
                            </button>

                            <button
                              type="button"
                              onClick={(e) =>
                                handleOpenPlaylist(
                                  e,
                                  song
                                )
                              }
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                            >
                              <Plus size={17} />
                              Add to Playlist
                            </button>

                            <button
                              type="button"
                              onClick={(e) =>
                                handleLike(
                                  e,
                                  song
                                )
                              }
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-[#3a3a3a]"
                            >
                              <Heart
                                size={17}
                                fill={
                                  liked
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                              {liked
                                ? "Unlike"
                                : "Like"}
                            </button>

                          </div>
                        </>
                      )}

                    </div>

                    {/* PLAY BUTTON */}

                    <button
                      type="button"
                      onClick={(e) =>
                        handlePlaySong(e, song)
                      }
                      className="hidden sm:flex bg-white text-black rounded-full w-9 h-9 md:w-10 md:h-10 items-center justify-center hover:scale-105 transition flex-shrink-0"
                      title="Play"
                    >
                      <Play
                        size={15}
                        fill="black"
                      />
                    </button>

                  </div>
                );
              })}

            </div>
          </>
        )}

      {/* ========================= */}
      {/* NO RESULTS */}
      {/* ========================= */}

      {!loading &&
        !error &&
        query &&
        songs.length === 0 && (
          <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4">

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#181818] flex items-center justify-center mb-5">

              <SearchIcon
                size={30}
                className="text-gray-500"
              />

            </div>

            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              No results found
            </h2>

            <p className="text-gray-500 text-sm max-w-md">
              We couldn't find anything for "{query}".
              Try another song, artist or a different spelling.
            </p>

          </div>
        )}

      {/* ========================= */}
      {/* ADD TO PLAYLIST MODAL */}
      {/* ========================= */}

      {selectedSong && (
        <div className="fixed inset-0 z-[10000]">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setSelectedSong(null)
            }
          />

          <div className="absolute inset-0 flex items-end sm:items-center justify-center p-2 sm:p-4">

            <div
              className="w-full max-w-md max-h-[85vh] bg-[#181818] rounded-2xl border border-[#333] shadow-2xl p-5 sm:p-6 overflow-hidden"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="flex items-center justify-between gap-3 mb-5">

                <div className="min-w-0">

                  <h2 className="text-lg sm:text-xl font-bold">
                    Add to Playlist
                  </h2>

                  <p className="text-gray-400 text-sm mt-1 truncate">
                    {selectedSong.title}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSong(null)
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828] flex-shrink-0"
                >
                  <X size={20} />
                </button>

              </div>

              {playlists.length === 0 ? (
                <div className="text-center py-8">

                  <Plus
                    size={38}
                    className="mx-auto text-gray-600 mb-3"
                  />

                  <p className="text-gray-400 mb-2">
                    No playlists found.
                  </p>

                  <p className="text-sm text-gray-500">
                    Create a playlist first.
                  </p>

                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">

                  {playlists.map((playlist) => {
                    const alreadyAdded =
                      playlist.songs?.some(
                        (song) =>
                          song.id ===
                          selectedSong.id
                      );

                    return (
                      <button
                        type="button"
                        key={playlist.id}
                        disabled={alreadyAdded}
                        onClick={() =>
                          handleAddToPlaylist(
                            playlist.id
                          )
                        }
                        className={`w-full flex items-center gap-3 sm:gap-4 p-3 rounded-lg text-left transition ${
                          alreadyAdded
                            ? "opacity-50 cursor-not-allowed bg-[#222]"
                            : "hover:bg-[#282828]"
                        }`}
                      >

                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Plus
                            size={21}
                            className="text-white"
                          />
                        </div>

                        <div className="flex-1 min-w-0">

                          <h3 className="font-semibold truncate text-sm sm:text-base">
                            {playlist.name}
                          </h3>

                          <p className="text-gray-400 text-xs sm:text-sm">
                            {alreadyAdded
                              ? "Already added"
                              : `${playlist.songs?.length || 0} songs`}
                          </p>

                        </div>

                        {alreadyAdded && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            Added
                          </span>
                        )}

                      </button>
                    );
                  })}

                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setSelectedSong(null)
                }
                className="w-full mt-4 py-3 rounded-full bg-[#303030] hover:bg-[#404040] transition font-semibold"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Search;