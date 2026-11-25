import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { today, formatDate } from '../utils/dates';

export default function ReportsPage({ patientId = null, doctor = false }) {
  const [type,setType]=useState('daily'); const [date,setDate]=useState(today());
  const [report,setReport]=useState(null); const [error,setError]=useState('');
  const load=async()=>{ setError('');
    try {
      const base=doctor?`/doctor/patients/${patientId}/reports/${type}`:`/reports/${type}`;
      const {data}=await api.get(base,{params:{date}});
      setReport(data);
    } catch(e){setError(e.response?.data?.message||'Unable to load report.');}
  };
  useEffect(()=>{load()},[type,date,patientId]);
  const chart=(report?.readings||[]).map(r=>({date:formatDate(r.reading_date),value:r.glucose_value}));
  const s=report?.statistics||{};
  return <div><div className="page-heading"><div><span className="eyebrow">{doctor?'Patient report':'Health report'}</span><h1>Glucose Reports</h1></div></div>
    {error&&<div className="alert alert-danger">{error}</div>}
    <div className="report-controls"><div className="segmented">{[['daily','Daily'],['month-to-date','Month to date'],['previous-month','Previous month']].map(([v,l])=><button key={v} className={type===v?'active':''} onClick={()=>setType(v)}>{l}</button>)}</div><input className="form-control" type="date" max={today()} value={date} onChange={e=>setDate(e.target.value)}/></div>
    {report&&<>
      <div className="range-caption">Report range: {formatDate(report.range.start)} - {formatDate(report.range.end)}</div>
      <div className="stat-grid"><div className="stat-card"><span>Average</span><strong>{s.average??'--'} <small>mg/dl</small></strong></div><div className="stat-card"><span>Highest</span><strong>{s.highest??'--'} <small>mg/dl</small></strong></div><div className="stat-card"><span>Lowest</span><strong>{s.lowest??'--'} <small>mg/dl</small></strong></div><div className="stat-card"><span>Total readings</span><strong>{s.total}</strong></div></div>
      <section className="card-panel mt-4"><div className="panel-heading"><h2>Readings chart</h2></div>{chart.length?<div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart}><XAxis dataKey="date"/><YAxis domain={[40,600]}/><Tooltip/><Line type="monotone" dataKey="value" stroke="#1c9a9a" strokeWidth={3}/></LineChart></ResponsiveContainer></div>:<div className="empty-state">No readings exist for this report range.</div>}</section>
      {report.readings.length>0&&<section className="card-panel mt-4"><table className="table align-middle mb-0"><thead><tr><th>Date</th><th>Time slot</th><th>Value</th></tr></thead><tbody>{report.readings.map(r=><tr key={r.id}><td>{formatDate(r.reading_date)}</td><td>{r.time_slot}</td><td>{r.glucose_value} mg/dl</td></tr>)}</tbody></table></section>}
    </>}
  </div>;
}
