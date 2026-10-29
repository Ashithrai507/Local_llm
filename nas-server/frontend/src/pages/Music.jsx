import { useEffect, useMemo, useState } from "react";
import { ARTISTS, GENRES, TRACKS } from "../data/music";

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

  .music-card {
    background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 10px; overflow: hidden; cursor: pointer;
    transition: border-color 0.12s, transform 0.12s;
    display: flex; flex-direction: column;
  }
  .music-card:hover { border-color: ${C.borderLight}; transform: translateY(-2px); }
  .music-card.selected { border-color: ${C.accent}; }

  .music-cover {
    width: 100%; aspect-ratio: 1/1; object-fit: cover;
    background: ${C.toolbar}; display: block;
  }

  .music-info { padding: 10px 12px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .music-title { font-size: 13px; font-weight: 500; color: ${C.text}; line-height: 1.3; }
  .music-meta { font-size: 11px; color: ${C.muted}; }
  .genre-pill {
    display: inline-block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    padding: 2px 6px; border-radius: 4px; margin: 1px 2px 0 0;
    background: ${C.bg}; color: ${C.muted}; border: 1px solid ${C.border};
  }

  .list-header {
    display: flex; align-items: center; gap: 12px;
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
    width: 36px; height: 36px; object-fit: cover;
    border-radius: 4px; background: ${C.toolbar}; flex-shrink: 0;
  }

  .player-overlay {
    position: fixed; inset: 0; background: #000000cc;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 24px;
  }
  .player-modal {
    background: ${C.surface}; border: 1px solid ${C.borderLight};
    border-radius: 14px; width: min(100%, 560px);
    box-shadow: 0 24px 64px #00000088;
    display: flex; flex-direction: column; overflow: hidden;
    max-height: calc(100vh - 48px);
  }
  .player-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid ${C.border}; flex-shrink: 0;
  }
  .player-audio { width: 100%; display: block; padding: 1px; }
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
  Electronic: "#0a84ff",
  Synthwave: "#c084fc",
  Ambient: "#34d399",
  Chill: "#38bdf8",
  Indie: "#fb923c",
};

function GenrePill({ genre }) {
  const color = GENRE_COLORS[genre];
  return (
    <span
      className="genre-pill"
      style={color ? { background: color + "22", color, borderColor: color + "44" } : {}}
    >
      {genre}
    </span>
  );
}

export default function Music() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({ type: "all", value: "All" });
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    document.title = "Music — Personal Server";
  }, []);

  const filtered = useMemo(() => {
    let list = TRACKS;

    if (filter.type === "artist") {
      list = list.filter((track) => track.artist === filter.value);
    } else if (filter.type === "genre") {
      list = list.filter((track) => track.genres.includes(filter.value));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (track) =>
          track.title.toLowerCase().includes(q) ||
          track.artist.toLowerCase().includes(q) ||
          track.album.toLowerCase().includes(q) ||
          track.genres.some((genre) => genre.toLowerCase().includes(q))
      );
    }

    return [...list].sort(
      (a, b) =>
        a.artist.localeCompare(b.artist) ||
        a.album.localeCompare(b.album) ||
        a.title.localeCompare(b.title)
    );
  }, [filter, query]);

  function isActive(type, value) {
    if (value === "All") return filter.type === "all";
    return filter.type === type && filter.value === value;
  }

  function applyFilter(type, value) {
    setFilter(value === "All" ? { type: "all", value: "All" } : { type, value });
  }

  function openPlayer(track) {
    setSelected(track);
    setPlaying(track);
  }

  function closePlayer() {
    setPlaying(null);
  }

  const filterLabel =
    filter.type === "all" ? "" : filter.type === "genre" ? ` in ${filter.value}` : ` by ${filter.value}`;

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
          <span style={{ fontSize: "15px" }}>🎵</span>
          <span style={{ fontWeight: "500", fontSize: "14px", color: C.text }}>Music</span>
          <div style={{ flex: 1 }} />
          <input
            type="text"
            data-testid="music-search"
            placeholder="🔍  Search music"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "200px" }}
          />
          <button
            className={`toolbar-btn${viewMode === "grid" ? " active" : ""}`}
            data-testid="view-grid"
            onClick={() => setViewMode("grid")}
            title="Grid"
          >
            ⊞
          </button>
          <button
            className={`toolbar-btn${viewMode === "list" ? " active" : ""}`}
            data-testid="view-list"
            onClick={() => setViewMode("list")}
            title="List"
          >
            ≡
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Sidebar ── */}
          <div className="layout-sidebar" style={{
            width: "175px", background: C.sidebar,
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
          }}>
            <div className="sidebar-label">Artists</div>
            {["All", ...ARTISTS].map((artist) => (
              <div
                key={artist}
                className={`sidebar-item${isActive("artist", artist) ? " active" : ""}`}
                onClick={() => applyFilter("artist", artist)}
              >
                <span style={{ fontSize: "13px" }}>{artist === "All" ? "⊞" : "👤"}</span>
                {artist}
              </div>
            ))}

            <div className="sidebar-label" style={{ marginTop: "8px" }}>Genres</div>
            {GENRES.map((genre) => (
              <div
                key={genre}
                className={`sidebar-item${isActive("genre", genre) ? " active" : ""}`}
                onClick={() => applyFilter("genre", genre)}
              >
                <span style={{ fontSize: "13px" }}>🎭</span>
                {genre}
              </div>
            ))}

            {selected && (
              <>
                <div className="sidebar-label" style={{ marginTop: "8px" }}>Selected</div>
                <div style={{ padding: "0 14px 8px", color: C.muted, fontSize: "11px", lineHeight: 1.5 }}>
                  {selected.title}
                  <div style={{ color: C.text, marginTop: "2px" }}>{selected.artist}</div>
                </div>
                <div className="sidebar-item" onClick={() => openPlayer(selected)}>
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
                <span>Tracks</span>
                <strong style={{ color: C.text }}>{filtered.length}</strong>
              </div>
            </div>
          </div>

          {/* ── Main ── */}
          <div
            style={{ flex: 1, overflow: "auto", background: C.bg }}
            onClick={() => setSelected(null)}
          >
            {/* Action bar */}
            <div style={{
              padding: "7px 16px", borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: "8px",
              background: C.bg, position: "sticky", top: 0, zIndex: 5,
            }}>
              <span style={{ fontSize: "12px", color: C.muted }}>
                {`${filtered.length} track${filtered.length !== 1 ? "s" : ""}${filterLabel}`}
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

            {filtered.length === 0 && (
              <div className="empty">
                <div style={{ fontSize: "40px" }}>🎵</div>
                <div style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>No tracks found</div>
                <div>Try a different search, artist or genre</div>
              </div>
            )}

            {/* ── Grid view ── */}
            {filtered.length > 0 && viewMode === "grid" && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px", padding: "16px",
              }}>
                {filtered.map((track) => (
                  <div
                    key={track.id}
                    data-testid="music-track-card"
                    className={`music-card${selected?.id === track.id ? " selected" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setSelected(track); }}
                    onDoubleClick={() => openPlayer(track)}
                  >
                    <img className="music-cover" src={track.cover} alt={`${track.album} cover`} />
                    <div className="music-info">
                      <div className="music-title">{track.title}</div>
                      <div className="music-meta">{track.artist}</div>
                      <div className="music-meta">{track.album}</div>
                      <div style={{ marginTop: "4px" }}>
                        {track.genres.slice(0, 2).map((genre) => <GenrePill key={genre} genre={genre} />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── List view ── */}
            {filtered.length > 0 && viewMode === "list" && (
              <div>
                <div className="list-header">
                  <div style={{ width: "36px", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>Title</span>
                  <span style={{ width: "110px" }}>Artist</span>
                  <span style={{ width: "130px" }}>Album</span>
                  <span style={{ width: "80px" }}>Genres</span>
                  <span style={{ width: "42px", textAlign: "right" }}>Time</span>
                </div>
                {filtered.map((track) => (
                  <div
                    key={track.id}
                    data-testid="music-track-row"
                    className={`list-row${selected?.id === track.id ? " selected" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setSelected(track); }}
                    onDoubleClick={() => openPlayer(track)}
                  >
                    <img className="list-thumb" src={track.cover} alt="" />
                    <span style={{ flex: 1, color: selected?.id === track.id ? C.accent : C.text, fontWeight: "500" }}>
                      {track.title}
                    </span>
                    <span style={{ width: "110px", color: C.muted, fontSize: "12px" }}>{track.artist}</span>
                    <span style={{ width: "130px", color: C.muted, fontSize: "12px" }}>{track.album}</span>
                    <span style={{ width: "80px" }}>
                      {track.genres.slice(0, 1).map((genre) => <GenrePill key={genre} genre={genre} />)}
                    </span>
                    <span style={{ width: "42px", color: C.muted, fontSize: "12px", textAlign: "right" }}>{track.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Detail panel ── */}
          {selected && !playing && (
            <div style={{
              width: "220px", background: C.sidebar,
              borderLeft: `1px solid ${C.border}`,
              display: "flex", flexDirection: "column", flexShrink: 0,
              overflowY: "auto",
            }}>
              <img
                src={selected.cover}
                alt={`${selected.album} cover`}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "14px" }}>
                <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "4px" }}>{selected.title}</div>
                <div style={{ fontSize: "12px", color: C.muted, marginBottom: "2px" }}>{selected.artist}</div>
                <div style={{ fontSize: "12px", color: C.muted, marginBottom: "10px" }}>
                  {selected.album} · {selected.year} · {selected.duration}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  {selected.genres.map((genre) => <GenrePill key={genre} genre={genre} />)}
                </div>
                <div style={{ fontSize: "12px", color: C.muted, lineHeight: 1.6, marginBottom: "16px" }}>
                  {selected.description}
                </div>
                <button
                  data-testid="music-play"
                  onClick={() => openPlayer(selected)}
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
          <div className="player-modal" onClick={(e) => e.stopPropagation()}>
            <div className="player-header">
              <div>
                <div style={{ fontWeight: "500", fontSize: "15px" }}>{playing.title}</div>
                <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>
                  {playing.artist} · {playing.album} · {playing.year}
                </div>
              </div>
              <button className="player-close" onClick={closePlayer}>✕ Close</button>
            </div>
            <audio
              className="player-audio"
              data-testid="music-audio"
              controls
              autoPlay
              src={playing.audio}
            />
            <div className="player-body">
              <div style={{ marginBottom: "10px" }}>
                {playing.genres.map((genre) => <GenrePill key={genre} genre={genre} />)}
              </div>
              <div style={{ fontSize: "12px", color: C.muted, lineHeight: 1.6 }}>
                {playing.description}
              </div>
              <div style={{ fontSize: "11px", color: C.muted, marginTop: "10px" }}>
                From {playing.album} · {playing.albumDescription}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
