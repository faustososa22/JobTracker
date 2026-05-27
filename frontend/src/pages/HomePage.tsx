import { useNavigate } from "react-router-dom"

export function HomePage() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar strip */}
            <div style={{ borderBottom: '1px solid var(--border)', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '15px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    <span className="auth-logo" style={{ width: '28px', height: '28px', fontSize: '13px', borderRadius: '7px' }}>J</span>
                    Job Tracker
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-sm" onClick={() => navigate('/login')} style={{ fontSize: '13px', color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}>
                        Sign in
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')} style={{ fontSize: '13px' }}>
                        Get started
                    </button>
                </div>
            </div>

            {/* Hero */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'var(--accent-light)', color: 'var(--accent)',
                    borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 500,
                    marginBottom: '28px', border: '1px solid rgba(99,102,241,0.2)'
                }}>
                    AI-powered · Free to use
                </div>

                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '20px', maxWidth: '640px' }}>
                    Track your job hunt,<br />
                    <span style={{ color: 'var(--accent)' }}>land faster.</span>
                </h1>

                <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.6, marginBottom: '36px' }}>
                    Organise every application, log every stage, and get AI-powered feedback on your CV and progress.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/register')} style={{ padding: '10px 24px', fontSize: '14px' }}>
                        Get started — it's free
                    </button>
                    <button className="btn" onClick={() => navigate('/login')} style={{ padding: '10px 24px', fontSize: '14px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
                        Sign in
                    </button>
                </div>
            </div>

            {/* Features */}
            <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', padding: '60px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
                    {[
                        { label: 'Track', desc: 'Every application in one place — status, notes, and timeline.' },
                        { label: 'CV Match', desc: 'Paste a job offer and get an AI match score for your CV.' },
                        { label: 'Insights', desc: 'AI feedback on what to expect and how to improve.' },
                    ].map(f => (
                        <div key={f.label}>
                            <div style={{ width: '32px', height: '3px', background: 'var(--accent)', borderRadius: '2px', marginBottom: '14px' }} />
                            <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px', color: 'var(--text)' }}>{f.label}</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
