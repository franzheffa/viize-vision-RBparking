import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SpotCard, Spot } from "@/components/SpotCard";

export default function ReserveIndex() {
  const router = useRouter();
  const lot = useMemo(() => (typeof router.query.lot === "string" ? router.query.lot : "rb-parking"), [router.query.lot]);

  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const r = await fetch(`/api/rb-parking/spots?lot=${encodeURIComponent(lot)}`);
        const j = await r.json();
        if (!alive) return;
        if (!r.ok) throw new Error(j?.error || "Failed to load spots");
        setSpots(j.spots || []);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [lot]);

  function onReserve(spotId: string) {
    router.push(`/reserve/${encodeURIComponent(spotId)}?lot=${encodeURIComponent(lot)}`);
  }

  return (
    <>
      <Head><title>Reserve — RB Parking</title></Head>
      <div className="container">
        <div className="nav">
          <div>
            <div style={{fontWeight:900}}>RB Parking</div>
            <div className="small">Reserve a spot · {spots.length || 0} listed</div>
          </div>
          <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
            <Link className="btn" href="/rb-parking">Back to landing</Link>
            <Link className="btn primary" href="/rb-parking?owner=rb">Owner tools →</Link>
          </div>
        </div>

        <div className="card">
          <div className="pad">
            <div className="h2" style={{marginBottom:6}}>Reserve a spot</div>
            <div className="p">Availability is <b>Reported</b> today. Phase 2 upgrades to camera RTSP real-time occupancy.</div>
          </div>
        </div>

        {loading && (
          <div style={{marginTop:18}} className="card"><div className="pad">Loading…</div></div>
        )}

        {error && (
          <div style={{marginTop:18}} className="card"><div className="pad"><b>Error:</b> {error}</div></div>
        )}

        {!loading && !error && (
          <div style={{marginTop:18}} className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:18}}>
            {spots.map((s) => (
              <SpotCard key={s.id} spot={s} onReserve={onReserve} />
            ))}
          </div>
        )}

        <div style={{marginTop:18}} className="small">
          Platform fee: 5% (Buttertech). Processing fees are charged by Interac/Stripe.
        </div>
      </div>
    </>
  );
}
