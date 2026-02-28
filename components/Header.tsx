import Link from "next/link";

export function Header() {
  return (
    <div className="nav">
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <div className="pill" aria-label="brand">
          <span className="mono" style={{fontWeight:700}}>RB</span>
        </div>
        <div>
          <div style={{fontWeight:800, letterSpacing:".2px"}}>RB PARKING</div>
          <div className="small">Reservations · Payments · EV ready</div>
        </div>
      </div>

      <div style={{display:"flex", alignItems:"center", gap:10}}>
        <div className="badge" title="Availability truthfulness">
          <span className="dot" />
          <span><b>Reported</b> availability · Phase 2: RTSP camera → real-time</span>
        </div>

        <Link className="btn primary" href="/reserve?lot=rb-parking">
          Test reservation →
        </Link>
      </div>
    </div>
  );
}
