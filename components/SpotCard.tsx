export type Spot = {
  id: string;
  code: string;
  type: "STANDARD" | "EV";
  priceCad: number;
  status: "REPORTED" | "OCCUPIED" | "AVAILABLE";
  evKw?: number | null;
  estKmPerHour?: number | null;
};

export function SpotCard({ spot, onReserve }: { spot: Spot; onReserve: (spotId: string) => void }) {
  const tagClass = spot.type === "EV" ? "tag" : "tag warn";
  const tagText = spot.type === "EV" ? "EV CHARGER" : "STANDARD";

  return (
    <div className="card">
      <div className="pad">
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
          <span className={tagClass}>{tagText}</span>
          <span className="pill mono">{spot.status}</span>
        </div>

        <div style={{marginTop:12, display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12}}>
          <div>
            <div className="small">Spot</div>
            <div style={{fontSize:44, fontWeight:900, letterSpacing:"-1px"}}>{spot.code}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="small">Dynamic price</div>
            <div style={{fontSize:28, fontWeight:900}}>${spot.priceCad.toFixed(2)} <span className="small">CAD</span></div>
          </div>
        </div>

        {spot.type === "EV" && (
          <div style={{marginTop:10, display:"flex", gap:10, flexWrap:"wrap"}}>
            <span className="pill">Power: <b>{spot.evKw ?? 0} kW</b></span>
            <span className="pill">Est.: <b>{spot.estKmPerHour ?? 0} km / hour</b></span>
          </div>
        )}

        <div className="hr" />

        <button className="btn primary" style={{width:"100%"}} onClick={() => onReserve(spot.id)}>
          Reserve this spot →
        </button>

        <div className="small" style={{marginTop:10}}>
          Availability label is <b>Reported</b> now. Phase 2 upgrades to <b>Real-time</b> via RTSP cameras.
        </div>
      </div>
    </div>
  );
}
