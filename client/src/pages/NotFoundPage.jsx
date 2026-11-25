import { Link } from 'react-router-dom';
export default function NotFoundPage(){return <div className="auth-page"><div className="auth-card text-center"><h1>404</h1><p className="text-muted">We couldn't find that page.</p><Link className="btn btn-primary" to="/">Return home</Link></div></div>}
