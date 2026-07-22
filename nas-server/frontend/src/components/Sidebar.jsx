function Sidebar() {
  const css = `
    .sidebar { width: 200px; background: #0b1220; color: #9aa6bf; padding: 12px; }
  `;
  return (
    <>
      <style>{css}</style>
      <div className="sidebar">Sidebar</div>
    </>
  );
}

export default Sidebar;
