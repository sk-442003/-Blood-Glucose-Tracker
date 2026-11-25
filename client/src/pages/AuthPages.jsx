import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = async event => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate(data.user.role === 'doctor' ? '/doctor' : '/dashboard');
    } catch (e) { setError(e.response?.data?.message || 'Unable to log in.'); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link className="brand auth-brand" to="/"><span className="brand-mark">S</span><span>Sweety</span></Link>
        <h1>Welcome back</h1><p className="text-muted">Sign in to continue tracking your glucose.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <label className="form-label">Email</label>
          <input className="form-control mb-3" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <label className="form-label">Password</label>
          <input className="form-control mb-4" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-3 text-center">New patient? <Link to="/register">Create account</Link></p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = async event => {
    event.preventDefault(); setLoading(true); setError(''); setErrors({});
    const nextErrors = {};
    if (form.full_name.trim() === '') nextErrors.full_name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirm_password) nextErrors.confirm_password = 'Passwords must match.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setLoading(false); return; }
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user); navigate('/dashboard');
    } catch (e) { setError(e.response?.data?.message || 'Unable to register.'); setErrors(e.response?.data?.errors || {}); }
    finally { setLoading(false); }
  };
  const fieldError = key => errors[key] ? <div className="field-error">{errors[key]}</div> : null;
  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <Link className="brand auth-brand" to="/"><span className="brand-mark">S</span><span>Sweety</span></Link>
        <h1>Create your account</h1><p className="text-muted">Start managing your blood glucose readings.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <label className="form-label">Full name</label><input className="form-control" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />{fieldError('full_name')}
          <label className="form-label mt-3">Email</label><input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />{fieldError('email')}
          <label className="form-label mt-3">Password</label><input className="form-control" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />{fieldError('password')}
          <label className="form-label mt-3">Confirm password</label><input className="form-control" type="password" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} />{fieldError('confirm_password')}
          <button className="btn btn-primary w-100 mt-4" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="mt-3 text-center">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
