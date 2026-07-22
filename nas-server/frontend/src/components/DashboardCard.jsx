import { useNavigate } from "react-router-dom";

function DashboardCard({ title, description, icon, route }) {
  const navigate = useNavigate();

  const css = `
    .card { background: #1e293b; border-radius: 12px; padding: 18px; color: #e6eef8; transition: transform 120ms ease, box-shadow 120ms ease; cursor: pointer; display: flex; flex-direction: column; gap: 8px; }
    .card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 10px 30px #00000055; }
    .card-icon { font-size: 28px; }
    .card-title { font-weight: 700; }
    .card-desc { color: #9aa6bf; font-size: 13px; }
  `;

  return (
    <div className="card" onClick={() => navigate(route)}>
      <style>{css}</style>
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
      <div className="card-desc">{description}</div>
    </div>
  );
}

export default DashboardCard;
