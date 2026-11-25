import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { formatDate, statusFor, today } from '../utils/dates';

const slots = ['Morning (fasting)', 'After breakfast', 'After lunch', 'After dinner'];

export function AddReadingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ reading_date: today(), time_slot: '', glucose_value: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) api.get(`/readings/${id}`).then(r => {
      const x = r.data.reading;
      setForm({ reading_date: String(x.reading_date).slice(0,10), time_slot: x.time_slot, glucose_value: String(x.glucose_value) });
    }).catch(e => setErrors({ form: e.response?.data?.message || 'Unable to load reading.' }));
  }, [id]);

  const validate = () => {
    const e = {};
    if (form.glucose_value === '') e.glucose_value = 'Please enter a glucose value.';
    else if (!/^\d+$/.test(form.glucose_value)) e.glucose_value = 'Please enter a whole number.';
    else if (+form.glucose_value < 40 || +form.glucose_value > 600) e.glucose_value = 'Value must be between 40 and 600 mg/dl.';
    if (!form.reading_date) e.reading_date = 'Please select a date.';
    else if (form.reading_date > today()) e.reading_date = 'Date cannot be in the future.';
    if (!slots.includes(form.time_slot)) e.time_slot = 'Please select a time slot.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = async event => {
    event.preventDefault(); setMessage('');
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, glucose_value: Number(form.glucose_value) };
      if (id) await api.put(`/readings/${id}`, payload);
      else await api.post('/readings', payload);
      setMessage(id ? 'Reading updated successfully.' : 'Reading added successfully.');
      if (!id) setForm({ reading_date: today(), time_slot: '', glucose_value: '' });
    } catch (e) {
      setErrors(e.response?.data?.errors || { form: e.response?.data?.message || 'Unable to save reading.' });
    } finally { setLoading(false); }
  };
  const error = key => errors[key] ? <div className="field-error">{errors[key]}</div> : null;
  return (
    <div className="narrow-page">
      <div className="page-heading"><div><span className="eyebrow">Glucose tracker</span><h1>{id ? 'Edit Reading' : 'Add Reading'}</h1></div></div>
      <form className="card-panel form-panel" onSubmit={submit}>
        {message && <div className="alert alert-success">{message}</div>}
        {errors.form && <div className="alert alert-danger">{errors.form}</div>}
        <label className="form-label">Date</label><input className="form-control" type="date" max={today()} value={form.reading_date} onChange={e => setForm({...form, reading_date:e.target.value})}/>{error('reading_date')}
        <label className="form-label mt-3">Time slot</label><select className="form-select" value={form.time_slot} onChange={e => setForm({...form,time_slot:e.target.value})}><option value="">Select a time slot</option>{slots.map(s => <option key={s}>{s}</option>)}</select>{error('time_slot')}
        <label className="form-label mt-3">Glucose value</label><div className="input-unit"><input className="form-control" inputMode="numeric" value={form.glucose_value} onChange={e => setForm({...form,glucose_value:e.target.value})}/><span>mg/dl</span></div>{error('glucose_value')}
        <div className="form-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setForm({reading_date:today(),time_slot:'',glucose_value:''})}>Reset</button><button className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : id ? 'Update Reading' : 'Save Reading'}</button></div>
        <button type="button" className="btn btn-link mt-2" onClick={() => navigate('/dashboard')}>Return to dashboard</button>
      </form>
    </div>
  );
}

export function ReadingHistoryPage() {
  const [readings,setReadings]=useState([]); const [search,setSearch]=useState(''); const [date,setDate]=useState('');
  const [sort,setSort]=useState('newest'); const [loading,setLoading]=useState(true);
  const load=()=>api.get('/readings').then(r=>setReadings(r.data.readings)).finally(()=>setLoading(false));
  useEffect(()=>{load()},[]);
  const remove=async id=>{ if(!window.confirm('Delete this reading?')) return; await api.delete(`/readings/${id}`); load(); };
  let shown=[...readings].filter(r=>(r.time_slot+r.glucose_value).toLowerCase().includes(search.toLowerCase()) && (!date || String(r.reading_date).slice(0,10)===date));
  shown.sort((a,b)=>sort==='newest' ? String(b.reading_date).localeCompare(String(a.reading_date)) : String(a.reading_date).localeCompare(String(b.reading_date)));
  return <div><div className="page-heading"><div><span className="eyebrow">Your records</span><h1>Reading History</h1></div></div>
    <div className="filter-bar"><input className="form-control" placeholder="Search readings..." value={search} onChange={e=>setSearch(e.target.value)} /><input className="form-control" type="date" value={date} onChange={e=>setDate(e.target.value)} /><select className="form-select" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div>
    <section className="card-panel mt-3">{loading?<div className="loading">Loading...</div>:shown.length?<div className="table-responsive"><table className="table table-hover align-middle"><thead><tr><th>Date</th><th>Time slot</th><th>Value</th><th>Status</th><th>Actions</th></tr></thead><tbody>{shown.map(r=>{const s=statusFor(r.glucose_value);return<tr key={r.id}><td>{formatDate(r.reading_date)}</td><td>{r.time_slot}</td><td>{r.glucose_value} mg/dl</td><td><span className={`status-pill ${s.className}`}>{s.label}</span></td><td><Link className="btn btn-sm btn-outline-primary me-2" to={`/readings/${r.id}/edit`}>Edit</Link><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(r.id)}>Delete</button></td></tr>;})}</tbody></table></div>:<div className="empty-state">No readings match your filters.</div>}</section></div>;
}
