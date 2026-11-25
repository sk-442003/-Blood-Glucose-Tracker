import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav"><Link className="brand" to="/"><span className="brand-mark">S</span><span>Sweety</span></Link>
        <div><Link className="btn btn-outline-primary me-2" to="/login">Login</Link><Link className="btn btn-primary" to="/register">Register</Link></div>
      </nav>
      <section className="hero">
        <div><span className="eyebrow">Smart glucose tracking</span><h1>Understand your glucose, improve every day.</h1>
          <p>Record readings, spot patterns, and share clear reports with your assigned doctor.</p>
          <Link className="btn btn-primary btn-lg" to="/register">Get started</Link>
        </div>
        <div className="hero-visual"><div className="glucose-ring"><strong>105</strong><span>mg/dl</span></div></div>
      </section>
    </div>
  );
}
