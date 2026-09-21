import {
  User,
  Pencil,
  Heart,
  Music,
  Clock,
  LogOut,
  X,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const {
    likedSongs,
    playlists,
    recentlyPlayed,
  } = usePlayer();

  const {
    user,
    logout,
    updateProfileName,
    deleteAccount,
  } = useAuth();

  const [profileName, setProfileName] =
    useState(user?.name || "");

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [newName, setNewName] =
    useState(user?.name || "");

  const [error, setError] =
    useState("");

  // =========================
  // SYNC USER
  // =========================

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setNewName(user.name);
    }
  }, [user]);

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">

        <User
          size={55}
          className="text-gray-600 mb-5"
        />

        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          You are not logged in
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mb-6">
          Login to view your profile.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:bg-green-400 transition"
        >
          Login
        </button>

      </div>
    );
  }

  // =========================
  // OPEN EDIT
  // =========================

  const handleOpenEdit = () => {
    setNewName(user.name);
    setError("");
    setShowEditModal(true);
  };

  // =========================
  // SAVE NAME
  // =========================

  const handleSaveName = async () => {
    const trimmedName =
      newName.trim();

    if (!trimmedName) {
      setError(
        "Name cannot be empty."
      );
      return;
    }

    const result = await updateProfileName(trimmedName);

    if (!result.success) {
      setError(
        result.message ||
          "Unable to update name."
      );
      return;
    }

    setProfileName(
      trimmedName
    );

    setShowEditModal(false);
    setError("");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();

    if (!result.success) {
      console.error(
        result.message
      );
      return;
    }

    setShowDeleteModal(false);

    navigate("/login");
  };

  // =========================
  // AVATAR
  // =========================

  const avatarLetter =
    profileName
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 pb-10">

        {/* ================================================= */}
        {/* PROFILE HEADER */}
        {/* ================================================= */}

        <div className="
          bg-gradient-to-br
          from-[#282828]
          to-[#181818]
          rounded-2xl
          p-5
          sm:p-6
          md:p-8
          mb-6
          md:mb-8
        ">

          <div className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            gap-5
            sm:gap-6
          ">

            {/* AVATAR */}

            <div className="
              w-24
              h-24
              sm:w-28
              sm:h-28
              md:w-32
              md:h-32
              rounded-full
              bg-green-500
              text-black
              flex
              items-center
              justify-center
              text-4xl
              sm:text-5xl
              font-bold
              shadow-xl
              flex-shrink-0
            ">
              {avatarLetter}
            </div>

            {/* INFO */}

            <div className="flex-1 min-w-0">

              <p className="text-gray-400 text-xs sm:text-sm mb-2">
                PROFILE
              </p>

              <h1 className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-bold
                mb-2
                truncate
              ">
                {profileName}
              </h1>

              <p className="
                text-gray-400
                text-sm
                sm:text-base
                break-all
              ">
                {user.email}
              </p>

              {/* ACTIONS */}

              <div className="
                flex
                flex-wrap
                gap-2
                mt-5
              ">

                <button
                  type="button"
                  onClick={
                    handleOpenEdit
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    bg-white
                    text-black
                    rounded-full
                    font-semibold
                    text-sm
                    hover:scale-105
                    transition
                  "
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    bg-[#303030]
                    text-white
                    rounded-full
                    font-semibold
                    text-sm
                    hover:bg-[#404040]
                    transition
                  "
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <section className="mb-8">

          <h2 className="
            text-lg
            sm:text-xl
            font-bold
            mb-4
          ">
            Your Music
          </h2>

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-3
            sm:gap-4
          ">

            {/* LIKED */}

            <div className="
              bg-[#181818]
              border
              border-[#292929]
              rounded-xl
              p-4
              sm:p-5
            ">

              <Heart
                size={24}
                className="text-green-500 mb-4"
                fill="currentColor"
              />

              <p className="
                text-2xl
                sm:text-3xl
                font-bold
              ">
                {likedSongs.length}
              </p>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Liked Songs
              </p>

            </div>

            {/* PLAYLISTS */}

            <div className="
              bg-[#181818]
              border
              border-[#292929]
              rounded-xl
              p-4
              sm:p-5
            ">

              <Music
                size={24}
                className="text-blue-400 mb-4"
              />

              <p className="
                text-2xl
                sm:text-3xl
                font-bold
              ">
                {playlists.length}
              </p>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Playlists
              </p>

            </div>

            {/* RECENT */}

            <div className="
              bg-[#181818]
              border
              border-[#292929]
              rounded-xl
              p-4
              sm:p-5
              col-span-2
              md:col-span-1
            ">

              <Clock
                size={24}
                className="text-purple-400 mb-4"
              />

              <p className="
                text-2xl
                sm:text-3xl
                font-bold
              ">
                {recentlyPlayed.length}
              </p>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Recently Played
              </p>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* ACCOUNT SETTINGS */}
        {/* ================================================= */}

        <section>

          <div className="
            bg-[#181818]
            border
            border-[#292929]
            rounded-2xl
            p-5
            sm:p-6
          ">

            <h2 className="
              text-lg
              sm:text-xl
              font-bold
              mb-2
            ">
              Account
            </h2>

            <p className="
              text-gray-500
              text-sm
              mb-6
            ">
              Manage your MusicVerse account
            </p>

            {/* EMAIL */}

            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-2
              py-4
              border-b
              border-[#292929]
            ">

              <div>

                <p className="font-medium">
                  Email Address
                </p>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                  break-all
                ">
                  {user.email}
                </p>

              </div>

              <span className="
                text-xs
                text-gray-500
                sm:self-center
              ">
                Cannot be changed
              </span>

            </div>

            {/* DELETE */}

            <div className="
              pt-5
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            ">

              <div>

                <p className="
                  font-medium
                  text-red-400
                ">
                  Delete Account
                </p>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                  leading-5
                ">
                  Permanently remove your account
                  and all associated data.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(
                    true
                  )
                }
                className="
                  w-full
                  sm:w-auto
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-full
                  border
                  border-red-500/30
                  text-red-400
                  hover:bg-red-500/10
                  transition
                  text-sm
                  font-semibold
                "
              >
                <Trash2 size={17} />
                Delete Account
              </button>

            </div>

          </div>

        </section>

      </div>

      {/* ================================================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ================================================= */}

      {showEditModal && (

        <div className="fixed inset-0 z-[10000]">

          <div
            className="
              absolute
              inset-0
              bg-black/80
              backdrop-blur-sm
            "
            onClick={() =>
              setShowEditModal(false)
            }
          />

          <div className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            p-3
            sm:p-4
          ">

            <div
              className="
                w-full
                max-w-md
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

              <div className="
                flex
                items-start
                justify-between
                gap-3
                mb-6
              ">

                <div>

                  <h2 className="
                    text-lg
                    sm:text-xl
                    font-bold
                  ">
                    Edit Profile
                  </h2>

                  <p className="
                    text-gray-500
                    text-sm
                    mt-1
                  ">
                    You can change your name only.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    hover:text-white
                    hover:bg-[#282828]
                    flex-shrink-0
                  "
                >
                  <X size={20} />
                </button>

              </div>

              {/* NAME */}

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Name
              </label>

              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) =>
                  setNewName(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleSaveName();
                  }
                }}
                className="
                  w-full
                  bg-[#282828]
                  border
                  border-[#444]
                  rounded-lg
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-green-500
                  transition
                "
                placeholder="Enter your name"
              />

              {/* EMAIL */}

              <label className="
                block
                text-sm
                font-medium
                mt-5
                mb-2
              ">
                Email
              </label>

              <input
                type="email"
                value={user.email}
                disabled
                className="
                  w-full
                  bg-[#202020]
                  border
                  border-[#333]
                  rounded-lg
                  px-4
                  py-3
                  text-gray-500
                  cursor-not-allowed
                "
              />

              {/* ERROR */}

              {error && (
                <p className="
                  text-red-400
                  text-sm
                  mt-3
                ">
                  {error}
                </p>
              )}

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
                    setShowEditModal(
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
                    hover:bg-[#404040]
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveName
                  }
                  disabled={
                    !newName.trim()
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
                    transition
                  "
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* DELETE ACCOUNT MODAL */}
      {/* ================================================= */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-[10001]">

          <div
            className="
              absolute
              inset-0
              bg-black/80
              backdrop-blur-sm
            "
            onClick={() =>
              setShowDeleteModal(
                false
              )
            }
          />

          <div className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            p-3
            sm:p-4
          ">

            <div
              className="
                w-full
                max-w-[440px]
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

              <div className="
                flex
                items-start
                justify-between
                gap-3
                mb-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                ">

                  <div className="
                    w-10
                    h-10
                    sm:w-11
                    sm:h-11
                    rounded-full
                    bg-red-500/10
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  ">

                    <Trash2
                      size={20}
                      className="text-red-500"
                    />

                  </div>

                  <h2 className="
                    text-lg
                    sm:text-xl
                    font-bold
                  ">
                    Delete account?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    hover:text-white
                    hover:bg-[#282828]
                    flex-shrink-0
                  "
                >
                  <X size={20} />
                </button>

              </div>

              {/* MESSAGE */}

              <p className="
                text-gray-400
                text-sm
                leading-6
                mb-4
              ">
                You're about to permanently
                delete your MusicVerse
                account.
              </p>

              <div className="
                bg-red-500/5
                border
                border-red-500/20
                rounded-lg
                p-4
                mb-7
              ">

                <p className="
                  text-red-400
                  text-sm
                  leading-6
                ">

                  Your account, liked songs,
                  playlists, recently played
                  history and profile data will
                  be permanently removed.

                  <br />

                  <span className="font-semibold">
                    This action cannot be undone.
                  </span>

                </p>

              </div>

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
                    handleDeleteAccount
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
                  Delete Account
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Profile;