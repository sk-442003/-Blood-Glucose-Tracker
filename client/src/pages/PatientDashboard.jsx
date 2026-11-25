import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, statusFor, today } from '../utils/dates';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/readings').then(r => setReadings(r.data.readings)).finally(() => setLoading(false)); }, []);
  const todayRows = readings.filter(r => String(r.reading_date).slice(0, 10) === today());
  const values = readings.map(r => r.glucose_value);
  const stats = {
    latest: values[0] ?? null,
    average: values.length ? (values.reduce((a,b) => a+b,0)/values.length).toFixed(1) : null,
    highest: values.length ? Math.max(...values) : null,
    lowest: values.length ? Math.min(...values) : null
  };
  const chart = [...readings].reverse().slice(-14).map(r => ({ date: formatDate(r.reading_date), value: r.glucose_value }));
  return (
    <div>
      <div className="page-heading"><div><span className="eyebrow">Patient dashboard</span><h1>Welcome, {user?.full_name}</h1><p>{new Date().toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p></div>
        <Link className="btn btn-primary" to="/readings/new">+ Add Reading</Link></div>
      {loading ? <div className="loading">Loading...</div> : <>
        <div className="stat-grid">
          <div className="stat-card"><span>Latest reading</span><strong>{stats.latest ?? '--'} <small>mg/dl</small></strong></div>
          <div className="stat-card"><span>Average</span><strong>{stats.average ?? '--'} <small>mg/dl</small></strong></div>
          <div className="stat-card"><span>Highest</span><strong>{stats.highest ?? '--'} <small>mg/dl</small></strong></div>
          <div className="stat-card"><span>Lowest</span><strong>{stats.lowest ?? '--'} <small>mg/dl</small></strong></div>
        </div>
        <div className="dashboard-grid">
          <section className="card-panel"><div className="panel-heading"><h2>Glucose trend</h2></div>
            {chart.length ? <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><XAxis dataKey="date"/><YAxis domain={[40, 600]}/><Tooltip/><Line type="monotone" dataKey="value" stroke="#1c9a9a" strokeWidth={3}/></LineChart></ResponsiveContainer></div> : <div className="empty-state">No readings yet.</div>}
          </section>
          <section className="card-panel"><div className="panel-heading"><h2>Today's readings</h2><span>{todayRows.length}/4</span></div>
            {todayRows.length ? todayRows.map(r => <div className="reading-row" key={r.id}><div><strong>{r.time_slot}</strong><small>{formatDate(r.reading_date)}</small></div><strong>{r.glucose_value} mg/dl</strong></div>) : <div className="empty-state">No readings for today.</div>}
          </section>
        </div>
        <section className="card-panel mt-4"><div className="panel-heading"><h2>Recent readings</h2><Link to="/readings">View all</Link></div>
          {readings.length ? <div className="table-responsive"><table className="table table-hover align-middle"><thead><tr><th>Date</th><th>Time slot</th><th>Value</th><th>Status</th></tr></thead><tbody>{readings.slice(0,6).map(r => { const s=statusFor(r.glucose_value); return <tr key={r.id}><td>{formatDate(r.reading_date)}</td><td>{r.time_slot}</td><td>{r.glucose_value} mg/dl</td><td><span className={`status-pill ${s.className}`}>{s.label}</span></td></tr>;})}</tbody></table></div> : <div className="empty-state">No readings yet.</div>}
        </section>
      </>}
    </div>
  );
}
