function Music() {
  const css = `
    .music-shell { min-height: 100vh; background: #0f172a; color: #e6eef8; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; padding: 28px; }
    .music-title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
  `;

  return (
    <div className="music-shell">
      <style>{css}</style>
      <div className="music-title">Music</div>
      <div style={{ color: '#9aa6bf' }}>Coming Soon</div>
    </div>
  );

}

export default Music;
