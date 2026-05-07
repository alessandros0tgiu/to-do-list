import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <div className="glass-panel text-center">
        <h1 className="h1-super">ZenTask</h1>
        <p className="p-muted">L'essenziale per la tua produttività.</p>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          <Link href="/add" className="btn-black">
            Nuovo Promemoria
          </Link>
          <Link href="/list" className="btn-ghost" style={{ textAlign: 'center' }}>
            Visualizza la tua lista
          </Link>
        </div>
      </div>
    </div>
  );
}