import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <div className="glass-panel" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center' 
      }}>
        
        <header style={{ marginBottom: '48px' }}>
          <h1 className="h1-super">To-Do-List</h1>
          <p className="p-muted">
            L'essenziale per la tua produttività. <br />
            Organizza i tuoi impegni con chiarezza e stile.
          </p>
        </header>
        
        {/* Container dei tasti: allineamento e larghezza identica per entrambi */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', // Centra i figli orizzontalmente
          gap: '16px', 
          width: '100%', 
          maxWidth: '320px' 
        }}>
          <Link href="/add" className="btn-black" style={{ width: '100%' }}>
            Nuovo Promemoria
          </Link>
          
          <Link href="/list" className="btn-ghost" style={{ 
            width: '100%',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            Visualizza la tua lista
          </Link>
        </div>

      </div>
    </div>
  );
}