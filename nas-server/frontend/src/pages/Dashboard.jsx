import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    background: ${C.bg};
    color: ${C.text};
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
    font-size: 13px;
    user-select: none;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #48484a; border-radius: 3px; }

  .sidebar-label {
    font-size: 10px; font-weight: 600; color: ${C.muted};
    padding: 14px 14px 5px;
    letter-spacing: 0.07em; text-transform: uppercase;
  }
  .sidebar-item {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 14px; border-radius: 7px; cursor: pointer;
    color: ${C.muted}; font-size: 13px; margin: 0 6px;
    transition: background 0.1s, color 0.1s;
  }
  .sidebar-item:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .sidebar-item.active { background: ${C.accent}22; color: ${C.accent}; }
  .sidebar-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

  .service-card {
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 22px 20px 18px;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s, transform 0.1s;
    display: flex; flex-direction: column; gap: 10px;
    position: relative; overflow: hidden;
  }
  .service-card:hover {
    background: ${C.surfaceHover};
    border-color: ${C.borderLight};
    transform: translateY(-1px);
  }
  .service-card:active { transform: translateY(0); }
  .service-card-icon {
    font-size: 28px; line-height: 1;
    width: 48px; height: 48px;
    display: flex; align-items: center; justify-content: center;
    background: ${C.bg}; border-radius: 10px;
    border: 1px solid ${C.border};
  }
  .service-card-title { font-size: 14px; font-weight: 500; color: ${C.text}; }
  .service-card-desc { font-size: 12px; color: ${C.muted}; line-height: 1.4; }
  .service-card-arrow {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    color: ${C.borderLight}; font-size: 16px;
    transition: color 0.1s, right 0.1s;
  }
  .service-card:hover .service-card-arrow { color: ${C.muted}; right: 14px; }
  .service-card-tag {
    display: inline-block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 4px;
    background: ${C.accent}20; color: ${C.accent};
    margin-top: 4px; width: fit-content;
  }

  .stat-pill {
    display: flex; align-items: center; gap: 6px;
    background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 8px; padding: 8px 14px; font-size: 12px; color: ${C.muted};
  }
  .stat-pill strong { color: ${C.text}; font-weight: 500; }

  .logout-btn {
    background: transparent; border: 1px solid ${C.borderLight};
    color: ${C.muted}; border-radius: 7px; padding: 6px 14px;
    cursor: pointer; font-size: 13px; font-family: inherit;
    transition: background 0.1s, color 0.1s;
    display: flex; align-items: center; gap: 6px;
  }
  .logout-btn:hover { background: ${C.surfaceHover}; color: ${C.danger}; border-color: ${C.danger}44; }

  .section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }

  @media (max-width: 600px) {
    .layout-sidebar { display: none; }
    .section-grid { grid-template-columns: 1fr 1fr; }
  }
`;

const sections = [
  {
    label: "Storage",
    items: [
      { title: "Cloud Storage", description: "Files, folders, uploads", icon: "☁️", route: "/cloud", tag: "NAS" },
    ],
  },
  {
    label: "Media",
    items: [
      { title: "Media Streamer", description: "Movies and shows", icon: "🎬", route: "/movies", tag: "Video" },
      { title: "Music", description: "Albums and playlists", icon: "🎵", route: "/music", tag: "Audio" },
    ],
  },
  {
    label: "AI",
    items: [
      { title: "Local LLM", description: "On-device AI models", icon: "🤖", route: "/llm", tag: "AI" },
    ],
  },
];

const allItems = sections.flatMap(s => s.items);

function ServiceCard({ title, description, icon, route, tag, onClick }) {
  return (
    <div className="service-card" onClick={onClick}>
      <div className="service-card-icon">{icon}</div>
      <div>
        <div className="service-card-title">{title}</div>
        <div className="service-card-desc">{description}</div>
        {tag && <div className="service-card-tag">{tag}</div>}
      </div>
      <span className="service-card-arrow">›</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "you";
  const [activeSection, setActiveSection] = useState("All");

  useEffect(() => { document.title = "Dashboard — Personal Server"; }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  }

  const sidebarSections = ["All", ...sections.map(s => s.label)];

  const visibleItems =
    activeSection === "All"
      ? allItems
      : sections.find(s => s.label === activeSection)?.items ?? [];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* ── Top toolbar ── */}
        <div style={{
          background: C.toolbar, borderBottom: `1px solid ${C.border}`,
          padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0,
        }}>
          <span style={{ fontSize: "15px" }}>🖥</span>
          <span style={{ fontWeight: "500", fontSize: "14px", color: C.text }}>Personal Server</span>
          <div style={{ flex: 1 }} />
          <div className="stat-pill"><span>🟢</span> <strong>Online</strong></div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⏻</span> Logout
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Sidebar ── */}
          <div className="layout-sidebar" style={{
            width: "175px", background: C.sidebar,
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
          }}>
            <div style={{ padding: "16px 14px 8px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: `${C.accent}22`, border: `1px solid ${C.accent}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", marginBottom: "8px",
              }}>👤</div>
              <div style={{ fontWeight: "500", fontSize: "13px", color: C.text }}>{username}</div>
              <div style={{ fontSize: "11px", color: C.muted, marginTop: "1px" }}>Administrator</div>
            </div>

            <div className="sidebar-label">Browse</div>
            {sidebarSections.map(section => (
              <div
                key={section}
                className={`sidebar-item${activeSection === section ? " active" : ""}`}
                onClick={() => setActiveSection(section)}
              >
                <span className="sidebar-icon">
                  {section === "All" ? "⊞" :
                   section === "Storage" ? "" :
                   section === "Media" ? "" :
                   section === "AI" ? "" : "•"}
                </span>
                {section}
              </div>
            ))}

            <div style={{ flex: 1 }} />
            <div style={{
              padding: "12px 14px", borderTop: `1px solid ${C.border}`,
              fontSize: "11px", color: C.muted, lineHeight: 1.6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Services</span>
                <strong style={{ color: C.text }}>{allItems.length}</strong>
              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          <div style={{ flex: 1, overflow: "auto", padding: "28px 28px 40px" }}>

            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "22px", fontWeight: "500", color: C.text, marginBottom: "4px" }}>
                {greeting}, {username}
              </div>
              <div style={{ fontSize: "13px", color: C.muted }}>
                {activeSection === "All"
                  ? `${allItems.length} services available`
                  : `${visibleItems.length} service${visibleItems.length !== 1 ? "s" : ""} in ${activeSection}`}
              </div>
            </div>

            {/* Cards — grouped when showing all, flat otherwise */}
            {activeSection === "All" ? (
              sections.map(section => (
                <div key={section.label} style={{ marginBottom: "28px" }}>
                  <div style={{
                    fontSize: "10px", fontWeight: "600", color: C.muted,
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    marginBottom: "10px",
                  }}>
                    {section.label}
                  </div>
                  <div className="section-grid">
                    {section.items.map(item => (
                      <ServiceCard
                        key={item.title}
                        {...item}
                        onClick={() => navigate(item.route)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="section-grid">
                {visibleItems.map(item => (
                  <ServiceCard
                    key={item.title}
                    {...item}
                    onClick={() => navigate(item.route)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}