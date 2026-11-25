import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  return <div className="narrow-page"><div className="page-heading"><div><span className="eyebrow">Account</span><h1>My Profile</h1></div></div>
    <section className="card-panel form-panel"><div className="profile-avatar">{user?.full_name?.charAt(0)||'P'}</div><label className="form-label">Full name</label><input className="form-control" value={user?.full_name||''} readOnly/><label className="form-label mt-3">Email</label><input className="form-control" value={user?.email||''} readOnly/><label className="form-label mt-3">Role</label><input className="form-control" value="Patient" readOnly/></section></div>;
}
