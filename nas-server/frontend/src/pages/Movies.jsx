import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const C = {
  bg: "#1c1c1e",
  sidebar: "#242426",
  toolbar: "#2c2c2e",
  surface: "#2c2c2e",
  surfaceHover: "#3a3a3c",
  border: "#3a3a3c",
  borderLight: "#48484a",
  accent: "#0a84ff",
  accentHover: "#409cff",
  text: "#f5f5f7",
  muted: "#8e8e93",
  danger: "#ff453a",
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    background: ${C.bg}; color: ${C.text};
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
    font-size: 13px;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #48484a; border-radius: 3px; }

  input[type=text] {
    background: ${C.bg}; border: 1px solid ${C.borderLight};
    border-radius: 6px; color: ${C.text}; font-size: 13px;
    padding: 6px 10px; outline: none;
  }
  input[type=text]:focus { border-color: ${C.accent}; }

  .sidebar-label {
    font-size: 10px; font-weight: 600; color: ${C.muted};
    padding: 14px 14px 5px; letter-spacing: 0.07em; text-transform: uppercase;
  }
  .sidebar-item {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 14px; border-radius: 7px; cursor: pointer;
    color: ${C.muted}; font-size: 13px; margin: 0 6px;
    transition: background 0.1s, color 0.1s;
  }
  .sidebar-item:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .sidebar-item.active { background: ${C.accent}22; color: ${C.accent}; }

  .toolbar-btn {
    background: transparent; color: ${C.muted}; border: none;
    border-radius: 6px; padding: 5px 9px;
    display: flex; align-items: center; gap: 5px; font-size: 15px;
    cursor: pointer; transition: background 0.1s, color 0.1s;
    font-family: inherit;
  }
  .toolbar-btn:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .toolbar-btn.active { color: ${C.accent}; }

  .movie-card {
    background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 10px; overflow: hidden; cursor: pointer;
    transition: border-color 0.12s, transform 0.12s;
    display: flex; flex-direction: column;
  }
  .movie-card:hover { border-color: ${C.borderLight}; transform: translateY(-2px); }
  .movie-card.selected { border-color: ${C.accent}; }

  .movie-poster {
    width: 100%; aspect-ratio: 2/3; object-fit: cover;
    background: ${C.toolbar}; display: block;
  }

  .movie-info { padding: 10px 12px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .movie-title { font-size: 13px; font-weight: 500; color: ${C.text}; line-height: 1.3; }
  .movie-meta { font-size: 11px; color: ${C.muted}; }
  .genre-pill {
    display: inline-block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    padding: 2px 6px; border-radius: 4px; margin: 1px 2px 0 0;
    background: ${C.bg}; color: ${C.muted}; border: 1px solid ${C.border};
  }

  /* List view */
  .list-header {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 16px; border-bottom: 1px solid ${C.border};
    background: ${C.toolbar}; position: sticky; top: 0; z-index: 5;
    font-size: 11px; color: ${C.muted};
  }
  .list-row {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 16px; border-bottom: 1px solid ${C.border};
    cursor: pointer; transition: background 0.1s;
  }
  .list-row:hover { background: ${C.surfaceHover}; }
  .list-row.selected { background: ${C.accent}11; }
  .list-thumb {
    width: 36px; height: 52px; object-fit: cover;
    border-radius: 4px; background: ${C.toolbar}; flex-shrink: 0;
  }

  /* Player modal */
  .player-overlay {
    position: fixed; inset: 0; background: #000000cc;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 24px;
  }
  .player-modal {
    background: ${C.surface}; border: 1px solid ${C.borderLight};
    border-radius: 14px; width: min(100%, 960px);
    box-shadow: 0 24px 64px #00000088;
    display: flex; flex-direction: column; overflow: hidden;
    max-height: calc(100vh - 48px);
  }
  .player-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid ${C.border}; flex-shrink: 0;
  }
  .player-video {
    width: 100%; background: #000; display: block; flex-shrink: 0;
    max-height: 60vh;
  }
  .player-body { padding: 16px 18px 20px; overflow-y: auto; }
  .player-close {
    background: ${C.surfaceHover}; border: 1px solid ${C.borderLight};
    color: ${C.text}; border-radius: 6px; padding: 5px 12px;
    cursor: pointer; font-size: 13px; font-family: inherit;
    transition: background 0.1s;
  }
  .player-close:hover { background: ${C.bg}; }

  .empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 10px; color: ${C.muted};
    padding: 60px 24px; text-align: center;
  }

  @media (max-width: 600px) {
    .layout-sidebar { display: none !important; }
  }
`;

const GENRE_COLORS = {
  Action:    "#ff6b35", Adventure: "#f7b731", Animation: "#a29bfe",
  Comedy:    "#fdcb6e", Crime:     "#e17055", Documentary: "#74b9ff",
  Drama:     "#81ecec", Fantasy:   "#fd79a8", Horror:    "#636e72",
  Romance:   "#fab1d3", "Sci-Fi":  "#0984e3", Thriller:  "#6c5ce7",
};

function GenrePill({ genre }) {
  const color = GENRE_COLORS[genre];
  return (
    <span className="genre-pill" style={color ? { background: color + "22", color, borderColor: color + "44" } : {}}>
      {genre}
    </span>
  );
}

export default function Movies() {
  const [data, setData] = useState({ movies: [] });
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    document.title = "Movies — Personal Server";
    fetch(`${API_BASE}/movies`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allGenres = useMemo(() => {
    const set = new Set();
    data.movies.forEach(m => m.genres?.forEach(g => set.add(g)));
    return ["All", ...Array.from(set).sort()];
  }, [data.movies]);

  const filtered = useMemo(() => {
    let list = data.movies;
    if (activeGenre !== "All") list = list.filter(m => m.genres?.includes(activeGenre));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.genres?.some(g => g.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  }, [data.movies, query, activeGenre]);

  function openPlayer(movie) { setPlaying(movie); }
  function closePlayer() { setPlaying(null); }

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* ── Toolbar ── */}
        <div style={{
          background: C.toolbar, borderBottom: `1px solid ${C.border}`,
          padding: "8px 16px", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0,
        }}>
          <button className="toolbar-btn" onClick={() => window.history.back()} title="Back">‹</button>
          <span style={{ fontSize: "15px" }}>🎬</span>
          <span style={{ fontWeight: "500", fontSize: "14px", color: C.text }}>Movies</span>
          <div style={{ flex: 1 }} />
          <input
            type="text"
            placeholder="🔍  Search movies"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: "200px" }}
          />
          <button className={`toolbar-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")} title="Grid">⊞</button>
          <button className={`toolbar-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")} title="List">≡</button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Sidebar ── */}
          <div className="layout-sidebar" style={{
            width: "175px", background: C.sidebar,
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
          }}>
            <div className="sidebar-label">Genres</div>
            {allGenres.map(genre => (
              <div
                key={genre}
                className={`sidebar-item${activeGenre === genre ? " active" : ""}`}
                onClick={() => setActiveGenre(genre)}
              >
                <span style={{ fontSize: "13px" }}>
                  {genre === "All" ? "⊞" : "🎭"}
                </span>
                {genre}
              </div>
            ))}

            {selectedMovie && (
              <>
                <div className="sidebar-label" style={{ marginTop: "8px" }}>Selected</div>
                <div style={{ padding: "0 14px 8px", color: C.muted, fontSize: "11px", lineHeight: 1.5 }}>
                  {selectedMovie.title}
                </div>
                <div
                  className="sidebar-item"
                  onClick={() => openPlayer(selectedMovie)}
                >
                  <span>▶</span> Play
                </div>
              </>
            )}

            <div style={{ flex: 1 }} />
            <div style={{
              padding: "12px 14px", borderTop: `1px solid ${C.border}`,
              fontSize: "11px", color: C.muted,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Movies</span>
                <strong style={{ color: C.text }}>{filtered.length}</strong>
              </div>
            </div>
          </div>

          {/* ── Main ── */}
          <div style={{ flex: 1, overflow: "auto", background: C.bg }}
            onClick={() => setSelectedMovie(null)}
          >
            {/* Action bar */}
            <div style={{
              padding: "7px 16px", borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: "8px",
              background: C.bg, position: "sticky", top: 0, zIndex: 5,
            }}>
              <span style={{ fontSize: "12px", color: C.muted }}>
                {loading ? "Loading…" : `${filtered.length} movie${filtered.length !== 1 ? "s" : ""}${activeGenre !== "All" ? ` in ${activeGenre}` : ""}`}
              </span>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "13px", marginLeft: "4px" }}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {loading && (
              <div className="empty">
                <div style={{ fontSize: "36px" }}>🎬</div>
                <div>Loading movies…</div>
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="empty">
                <div style={{ fontSize: "40px" }}>🎬</div>
                <div style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>No movies found</div>
                <div>Try a different search or genre</div>
              </div>
            )}

            {/* ── Grid view ── */}
            {!loading && filtered.length > 0 && viewMode === "grid" && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px", padding: "16px",
              }}>
                {filtered.map(movie => (
                  <div
                    key={movie.id}
                    className={`movie-card${selectedMovie?.id === movie.id ? " selected" : ""}`}
                    onClick={e => { e.stopPropagation(); setSelectedMovie(movie); }}
                    onDoubleClick={() => openPlayer(movie)}
                  >
                    <img className="movie-poster" src={`${API_BASE}${movie.poster}`} alt={movie.title} />
                    <div className="movie-info">
                      <div className="movie-title">{movie.title}</div>
                      <div className="movie-meta">{movie.year}</div>
                      <div style={{ marginTop: "4px" }}>
                        {movie.genres?.slice(0, 2).map(g => <GenrePill key={g} genre={g} />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── List view ── */}
            {!loading && filtered.length > 0 && viewMode === "list" && (
              <div>
                <div className="list-header">
                  <div style={{ width: "36px", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>Title</span>
                  <span style={{ width: "50px" }}>Year</span>
                  <span style={{ width: "140px" }}>Genres</span>
                </div>
                {filtered.map(movie => (
                  <div
                    key={movie.id}
                    className={`list-row${selectedMovie?.id === movie.id ? " selected" : ""}`}
                    onClick={e => { e.stopPropagation(); setSelectedMovie(movie); }}
                    onDoubleClick={() => openPlayer(movie)}
                  >
                    <img className="list-thumb" src={`${API_BASE}${movie.poster}`} alt={movie.title} />
                    <span style={{ flex: 1, color: selectedMovie?.id === movie.id ? C.accent : C.text, fontWeight: "500" }}>
                      {movie.title}
                    </span>
                    <span style={{ width: "50px", color: C.muted, fontSize: "12px" }}>{movie.year}</span>
                    <span style={{ width: "140px" }}>
                      {movie.genres?.slice(0, 2).map(g => <GenrePill key={g} genre={g} />)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Detail panel (when movie selected, no player open) ── */}
          {selectedMovie && !playing && (
            <div style={{
              width: "220px", background: C.sidebar,
              borderLeft: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", flexShrink: 0,
              overflowY: "auto",
            }}>
              <img
                src={`${API_BASE}${selectedMovie.poster}`}
                alt={selectedMovie.title}
                style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "14px" }}>
                <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "4px" }}>{selectedMovie.title}</div>
                <div style={{ fontSize: "12px", color: C.muted, marginBottom: "10px" }}>{selectedMovie.year}</div>
                <div style={{ marginBottom: "10px" }}>
                  {selectedMovie.genres?.map(g => <GenrePill key={g} genre={g} />)}
                </div>
                <div style={{ fontSize: "12px", color: C.muted, lineHeight: 1.6, marginBottom: "16px" }}>
                  {selectedMovie.description}
                </div>
                <button
                  onClick={() => openPlayer(selectedMovie)}
                  style={{
                    width: "100%", background: C.accent, color: "#fff",
                    border: "none", borderRadius: "8px", padding: "10px",
                    fontWeight: "500", fontSize: "14px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                    fontFamily: "inherit",
                  }}
                >
                  ▶ Play
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Player modal ── */}
      {playing && (
        <div className="player-overlay" onClick={closePlayer}>
          <div className="player-modal" onClick={e => e.stopPropagation()}>
            <div className="player-header">
              <div>
                <div style={{ fontWeight: "500", fontSize: "15px" }}>{playing.title}</div>
                <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>
                  {playing.year} · {playing.genres?.join(", ")}
                </div>
              </div>
              <button className="player-close" onClick={closePlayer}>✕ Close</button>
            </div>
            <video
              className="player-video"
              controls
              autoPlay
              controlsList="nodownload"
              poster={`${API_BASE}${playing.poster}`}
              src={`${API_BASE}${playing.video}`}
            />
            <div className="player-body">
              <div style={{ fontSize: "12px", color: C.muted, lineHeight: 1.6 }}>{playing.description}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}