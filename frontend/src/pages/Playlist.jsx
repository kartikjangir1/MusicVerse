import {
  Play,
  Heart,
  Trash2,
  X,
  Pencil,
} from "lucide-react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { usePlayer } from "../context/PlayerContext";

function Playlist() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showRenameModal, setShowRenameModal] =
    useState(false);

  const [newPlaylistName, setNewPlaylistName] =
    useState("");

  const {
    playlists,
    playSong,
    removeSongFromPlaylist,
    deletePlaylist,
    renamePlaylist,
  } = usePlayer();

  // =========================
  // FIND PLAYLIST
  // =========================

  const playlist = playlists.find(
    (item) =>
      String(item.id) ===
      String(id)
  );

  // =========================
  // NOT FOUND
  // =========================

  if (!playlist) {
    return (
      <div className="p-4 sm:p-6 md:p-8">

        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center mb-5">

            <Heart
              size={30}
              className="text-gray-600"
            />

          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-3">
            Playlist not found
          </h1>

          <p className="text-gray-400 text-sm mb-6">
            This playlist may have been deleted.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/library")
            }
            className="bg-green-500 text-black px-5 py-2.5 rounded-full font-semibold hover:bg-green-400 transition"
          >
            Go to Library
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // PLAY ALL
  // =========================

  const handlePlayAll = () => {
    if (
      playlist.songs.length ===
      0
    ) {
      return;
    }

    playSong(
      playlist.songs[0],
      playlist.songs
    );
  };

  // =========================
  // DELETE PLAYLIST
  // =========================

  const handleDeletePlaylist = () => {
    deletePlaylist(
      playlist.id
    );

    setShowDeleteModal(false);

    navigate("/library");
  };

  // =========================
  // OPEN RENAME
  // =========================

  const handleOpenRename = () => {
    setNewPlaylistName(
      playlist.name
    );

    setShowRenameModal(true);
  };

  // =========================
  // RENAME
  // =========================

  const handleRenamePlaylist = () => {
    const name =
      newPlaylistName.trim();

    if (!name) {
      return;
    }

    renamePlaylist(
      playlist.id,
      name
    );

    setShowRenameModal(false);
    setNewPlaylistName("");
  };

  return (
    <>
      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="p-4 sm:p-6 md:p-8 pb-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          gap-5
          sm:gap-6
          mb-7
          md:mb-8
        ">

          {/* COVER */}

          <div className="
            w-32
            h-32
            sm:w-40
            sm:h-40
            md:w-48
            md:h-48
            bg-gradient-to-br
            from-green-700
            to-blue-500
            rounded-xl
            flex
            items-center
            justify-center
            shadow-xl
            flex-shrink-0
          ">

            <Heart
              size={56}
              className="text-white sm:w-[65px] sm:h-[65px] md:w-[70px] md:h-[70px]"
              fill="white"
            />

          </div>

          {/* INFO */}

          <div className="min-w-0">

            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              PLAYLIST
            </p>

            <h1 className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-bold
              mb-2
              sm:mb-3
              break-words
            ">
              {playlist.name}
            </h1>

            <p className="text-gray-400 text-sm sm:text-base">
              {playlist.songs.length} songs
            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div className="
          flex
          flex-wrap
          items-center
          gap-2
          sm:gap-3
          mb-7
          md:mb-8
        ">

          {/* PLAY ALL */}

          {playlist.songs.length >
            0 && (

            <button
              type="button"
              onClick={
                handlePlayAll
              }
              className="
                bg-green-500
                text-black
                rounded-full
                w-11
                h-11
                sm:w-12
                sm:h-12
                flex
                items-center
                justify-center
                hover:scale-105
                transition
                shadow-lg
              "
              title="Play All"
            >
              <Play
                size={20}
                fill="black"
              />
            </button>

          )}

          {/* RENAME */}

          <button
            type="button"
            onClick={
              handleOpenRename
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-full
              text-gray-300
              hover:text-white
              hover:bg-[#282828]
              transition
              text-sm
              sm:text-base
            "
          >
            <Pencil
              size={17}
            />

            Rename
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              setShowDeleteModal(
                true
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-full
              text-gray-300
              hover:text-red-500
              hover:bg-[#282828]
              transition
              text-sm
              sm:text-base
            "
          >
            <Trash2
              size={17}
            />

            Delete
          </button>

        </div>

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {playlist.songs.length ===
          0 && (

          <div className="py-14 sm:py-20 text-center px-4">

            <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center mx-auto mb-5">

              <Heart
                size={34}
                className="text-gray-600"
              />

            </div>

            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              This playlist is empty
            </h2>

            <p className="text-gray-400 text-sm max-w-md mx-auto leading-6">
              Add songs from Search, Home or Music Player.
            </p>

          </div>

        )}

        {/* ================================================= */}
        {/* SONGS */}
        {/* ================================================= */}

        {playlist.songs.length >
          0 && (

          <div className="space-y-2">

            {playlist.songs.map(
              (song, index) => (

                <div
                  key={`${song.id}-${index}`}
                  onClick={() =>
                    playSong(
                      song,
                      playlist.songs
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    sm:gap-4
                    p-2.5
                    sm:p-3
                    rounded-lg
                    hover:bg-[#282828]
                    cursor-pointer
                    transition
                    group
                  "
                >

                  {/* NUMBER */}

                  <div className="
                    w-5
                    sm:w-8
                    text-gray-500
                    text-center
                    text-xs
                    sm:text-sm
                    flex-shrink-0
                  ">
                    {index + 1}
                  </div>

                  {/* IMAGE */}

                  <img
                    src={song.image}
                    alt={song.title}
                    className="
                      w-11
                      h-11
                      sm:w-14
                      sm:h-14
                      rounded
                      object-cover
                      flex-shrink-0
                    "
                  />

                  {/* INFO */}

                  <div className="flex-1 min-w-0">

                    <h3 className="font-semibold truncate text-sm sm:text-base">
                      {song.title}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm truncate mt-0.5">
                      {song.artist}
                    </p>

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      removeSongFromPlaylist(
                        playlist.id,
                        song.id
                      );
                    }}
                    className="
                      p-2
                      sm:p-3
                      text-gray-400
                      hover:text-red-500
                      transition
                      flex-shrink-0
                    "
                    title="Remove Song"
                  >
                    <Trash2
                      size={17}
                      className="sm:w-[19px] sm:h-[19px]"
                    />
                  </button>

                  {/* PLAY */}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      playSong(
                        song,
                        playlist.songs
                      );
                    }}
                    className="
                      bg-white
                      text-black
                      rounded-full
                      w-9
                      h-9
                      sm:w-10
                      sm:h-10
                      flex
                      items-center
                      justify-center
                      hover:scale-105
                      transition
                      flex-shrink-0
                    "
                    title="Play"
                  >
                    <Play
                      size={15}
                      fill="black"
                    />
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-[10000]">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setShowDeleteModal(
                false
              )
            }
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">

            <div
              className="
                w-full
                max-w-[420px]
                bg-[#181818]
                rounded-2xl
                border
                border-[#333]
                shadow-2xl
                p-5
                sm:p-6
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-3 mb-5">

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">

                    <Trash2
                      size={20}
                      className="text-red-500"
                    />

                  </div>

                  <h2 className="text-lg sm:text-xl font-bold">
                    Delete playlist?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition flex-shrink-0"
                >
                  <X size={20} />
                </button>

              </div>

              {/* MESSAGE */}

              <p className="text-gray-400 text-sm leading-6 mb-7">

                Are you sure you want to
                delete{" "}

                <span className="text-white font-semibold break-words">
                  "{playlist.name}"
                </span>
                ?

                <br />

                All songs inside this
                playlist will also be
                removed.

                <br />

                <span className="text-red-400">
                  This action cannot be undone.
                </span>

              </p>

              {/* BUTTONS */}

              <div className="
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-2
                sm:gap-3
              ">

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#303030] text-white hover:bg-[#404040] transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleDeletePlaylist
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Delete Playlist
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* RENAME MODAL */}
      {/* ================================================= */}

      {showRenameModal && (

        <div className="fixed inset-0 z-[9999]">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setShowRenameModal(
                false
              )
            }
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">

            <div
              className="
                w-full
                max-w-[420px]
                bg-[#181818]
                rounded-2xl
                border
                border-[#333]
                shadow-2xl
                p-5
                sm:p-6
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-3 mb-6">

                <div className="min-w-0">

                  <h2 className="text-lg sm:text-xl font-bold">
                    Rename Playlist
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Enter a new playlist name
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowRenameModal(
                      false
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition flex-shrink-0"
                >
                  <X size={20} />
                </button>

              </div>

              {/* INPUT */}

              <input
                autoFocus
                value={
                  newPlaylistName
                }
                onChange={(e) =>
                  setNewPlaylistName(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleRenamePlaylist();
                  }

                  if (
                    e.key ===
                    "Escape"
                  ) {
                    setShowRenameModal(
                      false
                    );
                  }

                }}
                placeholder="Playlist name"
                className="
                  w-full
                  bg-[#282828]
                  border
                  border-[#444]
                  text-white
                  px-4
                  py-3
                  rounded-lg
                  outline-none
                  focus:border-green-500
                  mb-6
                "
              />

              {/* BUTTONS */}

              <div className="
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-2
                sm:gap-3
              ">

                <button
                  type="button"
                  onClick={() =>
                    setShowRenameModal(
                      false
                    )
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#303030] text-white hover:bg-[#404040] transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleRenamePlaylist
                  }
                  disabled={
                    !newPlaylistName.trim()
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-40 transition"
                >
                  Save
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Playlist;