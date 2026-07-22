function Navbar() {
  const css = `
    .nav { height: 56px; background: transparent; display:flex; align-items:center; padding:0 18px; color:#e6eef8; }
  `;
  return (
    <>
      <style>{css}</style>
      <div className="nav">Personal Server</div>
    </>
  );
}

export default Navbar;
