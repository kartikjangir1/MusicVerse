import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Menu,
  X,
  User,
  Trash2,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { usePlayer } from "../context/PlayerContext";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    playlists,
    createPlaylist,
    deletePlaylist,
  } = usePlayer();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [playlistName, setPlaylistName] =
    useState("");

  const [playlistToDelete, setPlaylistToDelete] =
    useState(null);

  // =========================
  // ACTIVE ROUTE
  // =========================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =========================
  // CLOSE MOBILE
  // =========================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // =========================
  // OPEN CREATE MODAL
  // =========================

  const handleOpenCreateModal = () => {
    setPlaylistName("");
    setShowCreateModal(true);
  };

  // =========================
  // CREATE PLAYLIST
  // =========================

  const handleCreatePlaylist = () => {
    const name =
      playlistName.trim();

    if (!name) {
      return;
    }

    const playlist =
      createPlaylist(name);

    setPlaylistName("");
    setShowCreateModal(false);

    closeMobileMenu();

    if (playlist) {
      navigate(
        `/playlist/${playlist.id}`
      );
    }
  };

  // =========================
  // ENTER KEY
  // =========================

  const handlePlaylistKeyDown = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreatePlaylist();
    }

    if (e.key === "Escape") {
      setShowCreateModal(false);
    }
  };

  // =========================
  // DELETE PLAYLIST
  // =========================

  const handleDeletePlaylist = () => {
    if (!playlistToDelete) {
      return;
    }

    const deletedId =
      playlistToDelete.id;

    deletePlaylist(deletedId);

    setPlaylistToDelete(null);

    if (
      location.pathname ===
      `/playlist/${deletedId}`
    ) {
      navigate("/library");
    }
  };

  return (
    <>
      {/* ================================================= */}
      {/* MOBILE TOP BAR */}
      {/* ================================================= */}

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-[#222] flex items-center justify-between px-4 z-[1000]">

        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-[#282828] transition"
          title="Open menu"
        >
          <Menu size={23} />
        </button>

        <h1 className="text-lg font-bold">
          🎵 MusicVerse
        </h1>

        <Link
          to="/profile"
          onClick={
            closeMobileMenu
          }
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-[#282828] transition"
        >
          <User size={21} />
        </Link>

      </div>

      {/* ================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================= */}

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[1100]"
          onClick={
            closeMobileMenu
          }
        />
      )}

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          bottom-0
          w-64
          bg-black
          p-6
          z-[1200]
          transition-transform
          duration-300
          overflow-y-auto

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >

        {/* MOBILE CLOSE */}

        <div className="md:hidden flex justify-end mb-4">

          <button
            type="button"
            onClick={
              closeMobileMenu
            }
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828]"
            title="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* LOGO */}

        <h1 className="text-2xl font-bold mb-8">
          🎵 MusicVerse
        </h1>

        {/* ================================================= */}
        {/* MAIN NAV */}
        {/* ================================================= */}

        <nav className="space-y-2">

          {/* HOME */}

          <Link
            to="/"
            onClick={
              closeMobileMenu
            }
            className={`
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-lg
              transition

              ${
                isActive("/")
                  ? "bg-[#282828] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#181818]"
              }
            `}
          >
            <Home size={22} />
            Home
          </Link>

          {/* SEARCH */}

          <Link
            to="/search"
            onClick={
              closeMobileMenu
            }
            className={`
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-lg
              transition

              ${
                isActive(
                  "/search"
                )
                  ? "bg-[#282828] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#181818]"
              }
            `}
          >
            <Search size={22} />
            Search
          </Link>

          {/* LIBRARY */}

          <Link
            to="/library"
            onClick={
              closeMobileMenu
            }
            className={`
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-lg
              transition

              ${
                isActive(
                  "/library"
                )
                  ? "bg-[#282828] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#181818]"
              }
            `}
          >
            <Library size={22} />
            Your Library
          </Link>

        </nav>

        {/* ================================================= */}
        {/* PLAYLIST SECTION */}
        {/* ================================================= */}

        <div className="mt-10">

          <div className="flex items-center justify-between px-3 mb-3">

            <p className="text-gray-400 text-sm">
              PLAYLISTS
            </p>

          </div>

          {/* CREATE PLAYLIST */}

          <button
            type="button"
            onClick={
              handleOpenCreateModal
            }
            className="
              w-full
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-lg
              text-gray-300
              hover:text-white
              hover:bg-[#181818]
              transition
              text-left
            "
          >
            <Plus size={22} />

            <span>
              Create Playlist
            </span>
          </button>

          {/* LIKED SONGS */}

          <Link
            to="/liked"
            onClick={
              closeMobileMenu
            }
            className={`
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-lg
              transition

              ${
                isActive("/liked")
                  ? "bg-[#282828] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#181818]"
              }
            `}
          >
            <Heart
              size={22}
              className={
                isActive("/liked")
                  ? "text-green-500"
                  : ""
              }
            />

            Liked Songs
          </Link>

        </div>

        {/* ================================================= */}
        {/* PLAYLIST LIST */}
        {/* ================================================= */}

        {playlists.length > 0 && (

          <div className="mt-5 space-y-1">

            {playlists.map(
              (playlist) => {

                const active =
                  location.pathname ===
                  `/playlist/${playlist.id}`;

                return (
                  <div
                    key={playlist.id}
                    className={`
                      group
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      transition

                      ${
                        active
                          ? "bg-[#282828]"
                          : "hover:bg-[#181818]"
                      }
                    `}
                  >

                    {/* PLAYLIST LINK */}

                    <Link
                      to={`/playlist/${playlist.id}`}
                      onClick={
                        closeMobileMenu
                      }
                      className={`
                        flex
                        items-center
                        min-w-0
                        flex-1
                        px-3
                        py-2.5

                        ${
                          active
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        }
                      `}
                    >

                      <span className="truncate text-sm">
                        {playlist.name}
                      </span>

                    </Link>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        setPlaylistToDelete(
                          playlist
                        )
                      }
                      className="
                        mr-1
                        w-8
                        h-8
                        flex
                        items-center
                        justify-center
                        rounded-full
                        text-gray-500
                        hover:text-red-500
                        hover:bg-[#303030]
                        opacity-100
                        md:opacity-0
                        md:group-hover:opacity-100
                        transition
                      "
                      title="Delete Playlist"
                    >
                      <Trash2
                        size={15}
                      />
                    </button>

                  </div>
                );
              }
            )}

          </div>

        )}

        {/* ================================================= */}
        {/* PROFILE */}
        {/* ================================================= */}

        <div className="mt-8 pt-6 border-t border-[#282828]">

          <Link
            to="/profile"
            onClick={
              closeMobileMenu
            }
            className={`
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-lg
              transition

              ${
                isActive(
                  "/profile"
                )
                  ? "bg-[#282828] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#181818]"
              }
            `}
          >

            <User size={22} />

            Profile

          </Link>

        </div>

      </aside>

      {/* ================================================= */}
      {/* CREATE PLAYLIST MODAL */}
      {/* ================================================= */}

      {showCreateModal && (

        <div className="fixed inset-0 z-[10000]">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setShowCreateModal(
                false
              )
            }
          />

          {/* MODAL */}

          <div className="absolute inset-0 flex items-center justify-center p-4">

            <div
              className="
                w-full
                max-w-md
                bg-[#181818]
                border
                border-[#333]
                rounded-2xl
                shadow-2xl
                p-5
                sm:p-6
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-xl font-bold">
                    Create Playlist
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Give your playlist a name
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(
                      false
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition"
                  title="Close"
                >
                  <X size={20} />
                </button>

              </div>

              {/* INPUT */}

              <input
                autoFocus
                type="text"
                value={playlistName}
                onChange={(e) =>
                  setPlaylistName(
                    e.target.value
                  )
                }
                onKeyDown={
                  handlePlaylistKeyDown
                }
                placeholder="My Playlist"
                className="
                  w-full
                  bg-[#282828]
                  border
                  border-[#444]
                  text-white
                  placeholder:text-gray-600
                  px-4
                  py-3
                  rounded-lg
                  outline-none
                  focus:border-green-500
                  transition
                "
              />

              {/* ACTIONS */}

              <div className="
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-2
                mt-6
              ">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(
                      false
                    )
                  }
                  className="
                    w-full
                    sm:w-auto
                    px-5
                    py-2.5
                    rounded-full
                    bg-[#303030]
                    text-white
                    hover:bg-[#404040]
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleCreatePlaylist
                  }
                  disabled={
                    !playlistName.trim()
                  }
                  className="
                    w-full
                    sm:w-auto
                    px-5
                    py-2.5
                    rounded-full
                    bg-green-500
                    text-black
                    font-semibold
                    hover:bg-green-400
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                  "
                >
                  Create
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* DELETE PLAYLIST MODAL */}
      {/* ================================================= */}

      {playlistToDelete && (

        <div className="fixed inset-0 z-[10001]">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              setPlaylistToDelete(
                null
              )
            }
          />

          {/* MODAL */}

          <div className="absolute inset-0 flex items-center justify-center p-4">

            <div
              className="
                w-full
                max-w-md
                bg-[#181818]
                border
                border-[#333]
                rounded-2xl
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

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">

                    <Trash2
                      size={21}
                      className="text-red-500"
                    />

                  </div>

                  <h2 className="text-lg sm:text-xl font-bold">
                    Delete Playlist?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPlaylistToDelete(
                      null
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition"
                >
                  <X size={20} />
                </button>

              </div>

              {/* MESSAGE */}

              <p className="text-gray-400 text-sm leading-6 mb-7">

                Are you sure you want to
                delete{" "}

                <span className="text-white font-semibold">
                  "{playlistToDelete.name}"
                </span>
                ?

                <br />

                All songs inside this
                playlist will also be
                removed.

              </p>

              {/* BUTTONS */}

              <div className="
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-2
              ">

                <button
                  type="button"
                  onClick={() =>
                    setPlaylistToDelete(
                      null
                    )
                  }
                  className="
                    w-full
                    sm:w-auto
                    px-5
                    py-2.5
                    rounded-full
                    bg-[#303030]
                    text-white
                    hover:bg-[#404040]
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleDeletePlaylist
                  }
                  className="
                    w-full
                    sm:w-auto
                    px-5
                    py-2.5
                    rounded-full
                    bg-red-500
                    text-white
                    font-semibold
                    hover:bg-red-600
                    transition
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Sidebar;