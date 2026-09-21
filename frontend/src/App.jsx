import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";

function MainLayout() {
  const location = useLocation();

  // Search Navbar sirf Home aur Search page par dikhega
  const showNavbar =
    location.pathname === "/" ||
    location.pathname === "/search";

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden">

      {/* Sidebar / Mobile Header */}
      <Sidebar />

      <main
        className="
          md:ml-64
          pb-28
          pt-16
          md:pt-0
        "
      >
        {/* Search Navbar only on Home and Search */}
        {showNavbar && <Navbar />}

        <Routes>
          {/* ========================= */}
          {/* HOME */}
          {/* ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* ========================= */}
          {/* SEARCH */}
          {/* ========================= */}

          <Route
            path="/search"
            element={<Search />}
          />

          {/* ========================= */}
          {/* LIBRARY */}
          {/* ========================= */}

          <Route
            path="/library"
            element={<Library />}
          />

          {/* ========================= */}
          {/* LIKED SONGS */}
          {/* ========================= */}

          <Route
            path="/liked"
            element={<LikedSongs />}
          />

          {/* ========================= */}
          {/* PLAYLIST */}
          {/* ========================= */}

          <Route
            path="/playlist/:id"
            element={<Playlist />}
          />

          {/* ========================= */}
          {/* PROFILE */}
          {/* ========================= */}

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Routes>
      </main>

      {/* Music Player */}
      <MusicPlayer />

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>

          <Routes>
            {/* ========================= */}
            {/* PUBLIC ROUTES */}
            {/* ========================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* ========================= */}
            {/* PROTECTED ROUTES */}
            {/* ========================= */}

            <Route element={<ProtectedRoute />}>
              <Route
                path="/*"
                element={<MainLayout />}
              />
            </Route>
          </Routes>

        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;