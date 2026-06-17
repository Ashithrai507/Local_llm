import { useEffect, useState, useRef, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function joinPath(base, name) {
  return base ? `${base}/${name}` : name;
}

function getExt(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function getFileIcon(filename) {
  const ext = getExt(filename);
  const map = {
    pdf: "📄", doc: "📝", docx: "📝", txt: "📃", md: "📃",
    jpg: "🖼️", jpeg: "🖼️", png: "🖼️", gif: "🖼️", webp: "🖼️", svg: "🖼️",
    mp4: "🎬", mov: "🎬", avi: "🎬", mkv: "🎬",
    mp3: "🎵", wav: "🎵", flac: "🎵",
    zip: "🗜️", tar: "🗜️", gz: "🗜️", rar: "🗜️",
    js: "📜", ts: "📜", jsx: "📜", tsx: "📜", py: "📜", json: "📜",
    html: "🌐", css: "🎨",
    xls: "📊", xlsx: "📊", csv: "📊",
    ppt: "📋", pptx: "📋",
  };
  return map[ext] || "📄";
}

function getExt2(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

const C = {
  bg: "#1c1c1e",
  sidebar: "#242426",
  toolbar: "#2c2c2e",
  surface: "#2c2c2e",
  surfaceHover: "#3a3a3c",
  surfaceSelected: "#0a84ff22",
  border: "#3a3a3c",
  borderLight: "#48484a",
  accent: "#0a84ff",
  accentHover: "#409cff",
  text: "#f5f5f7",
  muted: "#8e8e93",
  danger: "#ff453a",
  dangerBg: "#2d1a19",
  input: "#1c1c1e",
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: ${C.bg}; color: ${C.text}; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; font-size: 13px; user-select: none; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #48484a; border-radius: 3px; }
  input[type=text] { background: ${C.input}; border: 1px solid ${C.borderLight}; border-radius: 6px; color: ${C.text}; font-size: 13px; padding: 6px 10px; outline: none; width: 100%; }
  input[type=text]:focus { border-color: ${C.accent}; }
  input[type=file] { display: none; }
  button { cursor: pointer; font-family: inherit; font-size: 13px; border: none; border-radius: 6px; padding: 6px 12px; transition: background 0.1s; }
  .btn-primary { background: ${C.accent}; color: #fff; font-weight: 500; }
  .btn-primary:hover { background: ${C.accentHover}; }
  .btn-ghost { background: transparent; color: ${C.muted}; border: 1px solid ${C.borderLight}; }
  .btn-ghost:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .toolbar-btn { background: transparent; color: ${C.muted}; border-radius: 6px; padding: 5px 9px; display: flex; align-items: center; gap: 5px; font-size: 15px; }
  .toolbar-btn:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .toolbar-btn.active { color: ${C.accent}; }
  .toolbar-btn:disabled { opacity: 0.3; cursor: default; }
  .toolbar-btn:disabled:hover { background: transparent; }
  .sidebar-label { font-size: 10px; font-weight: 600; color: ${C.muted}; padding: 12px 12px 4px; letter-spacing: 0.06em; text-transform: uppercase; }
  .sidebar-item { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; cursor: pointer; color: ${C.muted}; font-size: 13px; }
  .sidebar-item:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .sidebar-item.active { background: ${C.accent}22; color: ${C.accent}; }
  .grid-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 6px; border-radius: 8px; cursor: pointer; text-align: center; width: 88px; }
  .grid-item:hover { background: ${C.surfaceHover}; }
  .grid-item.selected { background: ${C.surfaceSelected}; outline: 1.5px solid ${C.accent}; outline-offset: -1px; }
  .list-row { display: flex; align-items: center; gap: 10px; padding: 6px 16px; border-bottom: 1px solid ${C.border}; cursor: pointer; transition: background 0.1s; }
  .list-row:hover { background: ${C.surfaceHover}; }
  .list-row.selected { background: ${C.surfaceSelected}; }
  .ctx-menu { position: fixed; background: #323234; border: 1px solid ${C.borderLight}; border-radius: 10px; min-width: 180px; padding: 4px; z-index: 9999; box-shadow: 0 10px 30px #00000077; }
  .ctx-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 6px; cursor: pointer; color: ${C.text}; font-size: 13px; }
  .ctx-item:hover { background: ${C.accent}; color: #fff; }
  .ctx-sep { height: 1px; background: ${C.borderLight}; margin: 3px 0; }
  .ctx-item.danger { color: ${C.danger}; }
  .ctx-item.danger:hover { background: ${C.dangerBg}; color: ${C.danger}; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #3a3a3c; color: ${C.text}; padding: 9px 18px; border-radius: 20px; font-size: 13px; z-index: 9999; box-shadow: 0 4px 16px #00000055; pointer-events: none; }
  .modal-overlay { position: fixed; inset: 0; background: #00000088; display: flex; align-items: center; justify-content: center; z-index: 9998; }
  .modal { background: #2c2c2e; border: 1px solid ${C.borderLight}; border-radius: 12px; padding: 24px; min-width: 300px; }
  .drop-zone { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: ${C.accent}11; border: 2px dashed ${C.accent}; border-radius: 8px; z-index: 50; pointer-events: none; }
  .breadcrumb-btn { background: transparent; border: none; color: ${C.muted}; padding: 2px 5px; border-radius: 4px; cursor: pointer; font-size: 13px; white-space: nowrap; }
  .breadcrumb-btn:hover { background: ${C.surfaceHover}; color: ${C.text}; }
  .breadcrumb-btn.last { color: ${C.text}; font-weight: 500; cursor: default; }
  .breadcrumb-btn.last:hover { background: transparent; }
  .section-label { font-size: 10px; font-weight: 600; color: ${C.muted}; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 0 8px; }
`;

export default function App() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [history, setHistory] = useState([""]);
  const [histIdx, setHistIdx] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [modal, setModal] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const toastTimer = useRef();

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  }, []);

  async function loadFolder(path, push = true) {
    setLoading(true);
    setSelected(null);
    setSearch("");
    try {
      const url = path ? `${API_URL}/folder/${path}` : `${API_URL}/explorer`;
      const res = await fetch(url);
      if (!res.ok) throw new Error((await res.json()).detail || "Error");
      const data = await res.json();
      setFolders(data.folders);
      setFiles(data.files);
      setCurrentPath(path);
      if (push) {
        setHistory(prev => {
          const next = [...prev.slice(0, histIdx + 1), path];
          setHistIdx(next.length - 1);
          return next;
        });
      }
    } catch (e) {
      showToast("⚠ " + e.message);
    }
    setLoading(false);
  }

  function goHistory(delta) {
    const idx = histIdx + delta;
    if (idx < 0 || idx >= history.length) return;
    setHistIdx(idx);
    loadFolder(history[idx], false);
  }

  async function createFolder(name) {
    if (!name.trim()) return;
    try {
      const res = await fetch(`${API_URL}/folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), path: currentPath }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Error");
      showToast(`Folder "${name.trim()}" created`);
      loadFolder(currentPath, false);
    } catch (e) { showToast("⚠ " + e.message); }
  }

  async function deleteItem(name, isFolder) {
    try {
      const res = await fetch(`${API_URL}/delete/${joinPath(currentPath, name)}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).detail || "Error");
      showToast(`"${name}" deleted`);
      setSelected(null);
      loadFolder(currentPath, false);
    } catch (e) { showToast("⚠ " + e.message); }
  }

  async function uploadFiles(fileList) {
    let failed = 0;
    await Promise.all(Array.from(fileList).map(async (file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("path", currentPath);
      const res = await fetch(`${API_URL}/upload`, { method: "POST", body: fd });
      if (!res.ok) failed++;
    }));
    showToast(failed ? `⚠ ${failed} upload(s) failed` : `${fileList.length === 1 ? `"${fileList[0].name}"` : fileList.length + " files"} uploaded`);
    loadFolder(currentPath, false);
  }

  useEffect(() => { loadFolder(""); }, []);
  useEffect(() => {
    const close = () => setCtx(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const pathParts = currentPath ? currentPath.split("/") : [];
  const canBack = histIdx > 0;
  const canFwd = histIdx < history.length - 1;
  const ff = folders.filter(f => f.toLowerCase().includes(search.toLowerCase()));
  const fi = files.filter(f => f.toLowerCase().includes(search.toLowerCase()));
  const hasItems = ff.length > 0 || fi.length > 0;

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* ── Top toolbar ── */}
        <div style={{ background: C.toolbar, borderBottom: `1px solid ${C.border}`, padding: "7px 12px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <button className="toolbar-btn" disabled={!canBack} onClick={() => goHistory(-1)} title="Back">‹</button>
          <button className="toolbar-btn" disabled={!canFwd} onClick={() => goHistory(1)} title="Forward">›</button>

          {/* Path bar */}
          <div style={{ flex: 1, background: C.input, border: `1px solid ${C.borderLight}`, borderRadius: "7px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "1px", minWidth: 0, overflow: "hidden" }}>
            <button className="breadcrumb-btn" style={{ fontSize: "14px" }} onClick={() => loadFolder("")}>🏠</button>
            {pathParts.map((part, idx) => (
              <span key={idx} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                <span style={{ color: C.muted, margin: "0 1px", flexShrink: 0 }}>›</span>
                <button
                  className={`breadcrumb-btn${idx === pathParts.length - 1 ? " last" : ""}`}
                  onClick={() => idx < pathParts.length - 1 && loadFolder(pathParts.slice(0, idx + 1).join("/"))}
                  style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}
                >
                  {part}
                </button>
              </span>
            ))}
          </div>

          {/* Search */}
          <input type="text" placeholder="🔍  Search" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "160px", background: C.input }} />

          {/* View toggle */}
          <button className={`toolbar-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")} title="Icons">⊞</button>
          <button className={`toolbar-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")} title="List">≡</button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Sidebar ── */}
          <div style={{ width: "175px", background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
            <div className="sidebar-label">Locations</div>
            <div className={`sidebar-item${currentPath === "" ? " active" : ""}`} onClick={() => loadFolder("")}>
              <span>🏠</span> Home
            </div>

            <div className="sidebar-label" style={{ marginTop: "8px" }}>Actions</div>
            <div className="sidebar-item" onClick={() => { setModal("new-folder"); setInputVal(""); }}>
              <span style={{ fontSize: "15px" }}>📁</span> New Folder
            </div>
            <div className="sidebar-item" onClick={() => fileRef.current.click()}>
              <span style={{ fontSize: "15px" }}>⬆</span> Upload Files
            </div>

            {selected && (
              <>
                <div className="sidebar-label" style={{ marginTop: "8px" }}>Selected</div>
                <div style={{ padding: "4px 12px 8px", color: C.muted, fontSize: "11px", wordBreak: "break-all", lineHeight: 1.4 }}>{selected}</div>
                {selectedType === "file" && (
                  <div className="sidebar-item" onClick={() => window.open(`${API_URL}/download/${joinPath(currentPath, selected)}`, "_blank")}>
                    <span>⬇</span> Download
                  </div>
                )}
                {selectedType === "folder" && (
                  <div className="sidebar-item" onClick={() => loadFolder(joinPath(currentPath, selected))}>
                    <span>📂</span> Open
                  </div>
                )}
                <div className="sidebar-item" style={{ color: C.danger }} onClick={() => {
                  if (window.confirm(`Delete "${selected}"?`)) deleteItem(selected, selectedType === "folder");
                }}>
                  <span>🗑</span> Delete
                </div>
              </>
            )}

            <div style={{ flex: 1 }} />
            <div style={{ padding: "12px", fontSize: "11px", color: C.muted, borderTop: `1px solid ${C.border}` }}>
              {loading ? "Loading…" : `${folders.length} folder${folders.length !== 1 ? "s" : ""}, ${files.length} file${files.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {/* ── File area ── */}
          <div
            style={{ flex: 1, overflow: "auto", position: "relative", background: C.bg }}
            onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => { setSelected(null); setSelectedType(null); }}
          >
            {dragging && (
              <div className="drop-zone">
                <div style={{ textAlign: "center", color: C.accent }}>
                  <div style={{ fontSize: "36px" }}>⬆</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", marginTop: "8px" }}>Drop files to upload</div>
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" multiple onChange={e => { if (e.target.files.length) uploadFiles(e.target.files); e.target.value = ""; }} />

            {!hasItems && !loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px", color: C.muted }}>
                <div style={{ fontSize: "52px" }}>📂</div>
                <div style={{ fontSize: "15px", color: C.text, fontWeight: "500" }}>{search ? "No results" : "Empty folder"}</div>
                <div style={{ fontSize: "13px" }}>{search ? "Try a different search term" : "Drag files here or click Upload Files"}</div>
              </div>
            )}

            {/* ── Grid ── */}
            {viewMode === "grid" && hasItems && (
              <div style={{ padding: "16px" }}>
                {ff.length > 0 && (
                  <>
                    <div className="section-label">Folders</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", marginBottom: "20px" }}>
                      {ff.map(folder => (
                        <div
                          key={folder}
                          className={`grid-item${selected === folder ? " selected" : ""}`}
                          onClick={e => { e.stopPropagation(); setSelected(folder); setSelectedType("folder"); }}
                          onDoubleClick={() => loadFolder(joinPath(currentPath, folder))}
                          onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setSelected(folder); setSelectedType("folder"); setCtx({ x: e.clientX, y: e.clientY, name: folder, type: "folder" }); }}
                        >
                          <span style={{ fontSize: "38px", lineHeight: 1 }}>📁</span>
                          <span style={{ fontSize: "11px", lineHeight: 1.3, wordBreak: "break-word", color: selected === folder ? C.accent : C.text }}>{folder}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {fi.length > 0 && (
                  <>
                    <div className="section-label">Files</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                      {fi.map(file => (
                        <div
                          key={file}
                          className={`grid-item${selected === file ? " selected" : ""}`}
                          onClick={e => { e.stopPropagation(); setSelected(file); setSelectedType("file"); }}
                          onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setSelected(file); setSelectedType("file"); setCtx({ x: e.clientX, y: e.clientY, name: file, type: "file" }); }}
                        >
                          <span style={{ fontSize: "38px", lineHeight: 1 }}>{getFileIcon(file)}</span>
                          <span style={{ fontSize: "11px", lineHeight: 1.3, wordBreak: "break-word", color: selected === file ? C.accent : C.text }}>{file}</span>
                          <span style={{ fontSize: "10px", color: C.muted, textTransform: "uppercase" }}>{getExt2(file)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── List ── */}
            {viewMode === "list" && hasItems && (
              <div>
                <div style={{ display: "flex", padding: "6px 16px", borderBottom: `1px solid ${C.border}`, background: C.toolbar, position: "sticky", top: 0 }}>
                  <span style={{ flex: 1, fontSize: "11px", color: C.muted }}>Name</span>
                  <span style={{ width: "70px", fontSize: "11px", color: C.muted, textAlign: "right" }}>Kind</span>
                </div>
                {ff.map(folder => (
                  <div
                    key={folder}
                    className={`list-row${selected === folder ? " selected" : ""}`}
                    onClick={e => { e.stopPropagation(); setSelected(folder); setSelectedType("folder"); }}
                    onDoubleClick={() => loadFolder(joinPath(currentPath, folder))}
                    onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setSelected(folder); setSelectedType("folder"); setCtx({ x: e.clientX, y: e.clientY, name: folder, type: "folder" }); }}
                  >
                    <span style={{ fontSize: "16px" }}>📁</span>
                    <span style={{ flex: 1, color: selected === folder ? C.accent : C.text }}>{folder}</span>
                    <span style={{ width: "70px", textAlign: "right", color: C.muted, fontSize: "11px" }}>Folder</span>
                  </div>
                ))}
                {fi.map(file => (
                  <div
                    key={file}
                    className={`list-row${selected === file ? " selected" : ""}`}
                    onClick={e => { e.stopPropagation(); setSelected(file); setSelectedType("file"); }}
                    onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setSelected(file); setSelectedType("file"); setCtx({ x: e.clientX, y: e.clientY, name: file, type: "file" }); }}
                  >
                    <span style={{ fontSize: "16px" }}>{getFileIcon(file)}</span>
                    <span style={{ flex: 1, color: selected === file ? C.accent : C.text }}>{file}</span>
                    <span style={{ width: "70px", textAlign: "right", color: C.muted, fontSize: "11px", textTransform: "uppercase" }}>{getExt2(file) || "File"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Context menu ── */}
      {ctx && (
        <div
          className="ctx-menu"
          style={{ left: Math.min(ctx.x, window.innerWidth - 200), top: Math.min(ctx.y, window.innerHeight - 220) }}
          onClick={e => e.stopPropagation()}
        >
          {ctx.type === "folder" && (
            <div className="ctx-item" onClick={() => { loadFolder(joinPath(currentPath, ctx.name)); setCtx(null); }}>
              📂 Open
            </div>
          )}
          {ctx.type === "file" && (
            <div className="ctx-item" onClick={() => { window.open(`${API_URL}/download/${joinPath(currentPath, ctx.name)}`, "_blank"); setCtx(null); }}>
              ⬇ Download
            </div>
          )}
          <div className="ctx-sep" />
          <div className="ctx-item danger" onClick={() => { setCtx(null); if (window.confirm(`Delete "${ctx.name}"?`)) deleteItem(ctx.name, ctx.type === "folder"); }}>
            🗑 Delete
          </div>
        </div>
      )}

      {/* ── New Folder modal ── */}
      {modal === "new-folder" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "15px", fontWeight: "500", marginBottom: "16px" }}>New Folder</div>
            <input
              type="text"
              placeholder="Folder name"
              value={inputVal}
              autoFocus
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") { createFolder(inputVal); setModal(null); }
                if (e.key === "Escape") setModal(null);
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => { createFolder(inputVal); setModal(null); }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}