import { useEffect, useState } from 'react';
import api from '../services/api';
import ReportsPage from './ReportsPage';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dates';

export default function DoctorDashboard() {
  const { user }=useAuth();
  const [patients,setPatients]=useState([]); const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState(''); const [readings,setReadings]=useState([]);
  useEffect(()=>{api.get('/doctor/patients').then(r=>{setPatients(r.data.patients);if(r.data.patients.length)setSelected(r.data.patients[0]);});},[]);
  useEffect(()=>{if(selected)api.get(`/doctor/patients/${selected.id}/readings`).then(r=>setReadings(r.data.readings));},[selected]);
  const filtered=patients.filter(p=>p.full_name.toLowerCase().includes(search.toLowerCase()));
  return <div><div className="page-heading"><div><span className="eyebrow">Doctor dashboard</span><h1>Welcome, {user?.full_name}</h1></div></div>
    <div className="doctor-grid"><aside className="card-panel patient-list"><h2>Assigned patients</h2><input className="form-control mb-3" placeholder="Search patient" value={search} onChange={e=>setSearch(e.target.value)} />
      {filtered.map(p=><button key={p.id} className={`patient-item ${selected?.id===p.id?'active':''}`} onClick={()=>setSelected(p)}><span className="profile-mini">{p.full_name.charAt(0)}</span><span><strong>{p.full_name}</strong><small>{p.email}</small></span></button>)}
      {!filtered.length&&<div className="empty-state">No assigned patients found.</div>}
    </aside><main>{selected?<><section className="card-panel"><div className="panel-heading"><div><h2>{selected.full_name}</h2><span className="text-muted">{selected.email}</span></div></div><h3 className="subheading">Latest readings</h3>{readings.length?<div className="reading-chips">{readings.slice(0,8).map(r=><div key={r.id}><span>{r.time_slot}</span><strong>{r.glucose_value} mg/dl</strong><small>{formatDate(r.reading_date)}</small></div>)}</div>:<div className="empty-state">No readings available.</div>}</section><ReportsPage patientId={selected.id} doctor /></>:<div className="card-panel empty-state">Select an assigned patient.</div>}</main></div></div>;
}
