import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { OwnerPanel } from "@/components/OwnerPanel";

function kmPerHourFromKw(kw: number, efficiencyKwhPer100km: number) {
  // km/h = (kWh per hour) / (kWh per km)
  const kwhPerKm = efficiencyKwhPer100km / 100;
  return Math.round((kw / Math.max(0.1, kwhPerKm)) * 10) / 10;
}

export default function RBParkingPage() {
  const [kw, setKw] = useState<number>(50);
  const [eff, setEff] = useState<number>(18); // kWh/100km typical EV

  const estKmPerHour = useMemo(() => kmPerHourFromKw(kw, eff), [kw, eff]);

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const owner = params?.get("owner") || "";

  return (
    <>
      <Head>
        <title>RB Parking — Powered by VIIZE (Buttertech)</title>
        <meta name="description" content="Reserve parking near Quartier Latin in seconds. EV charging coming soon." />
      </Head>

      <div className="container">
        <Header />

        <div className="split" style={{marginTop:10}}>
          <div className="card">
            <div className="pad">
              <span className="badge">
                <span className="dot" />
                <span><b>Open 24/7</b> · Downtown Montréal</span>
              </span>

              <h1 className="h1">RB Parking<br/>Reserve your spot in seconds.</h1>
              <p className="p">
                Secure parking near Quartier Latin. Reserve, pay, and get a confirmed spot —
                with <b>EV charging coming soon</b>.
              </p>

              <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:16}}>
                <Link className="btn primary" href="/reserve?lot=rb-parking">Test reservation →</Link>
                <a className="btn" href="#spots">View 20 spots</a>
                <a className="btn" href="#location">View map</a>
              </div>

              <div className="small" style={{marginTop:14}}>
                Address: <b>1439 Rue Saint-Timothée, Montréal, QC H2L 3N7</b><br/>
                Platform fee: <b>5%</b> (Buttertech) · Processing fees: <b>Interac / Stripe</b>
              </div>

              <div className="kpis">
                <div className="kpi">
                  <div className="small">Spots</div>
                  <div className="big">20</div>
                  <div className="small">available to list now</div>
                </div>
                <div className="kpi">
                  <div className="small">EV chargers</div>
                  <div className="big">Soon</div>
                  <div className="small">installation in progress</div>
                </div>
              </div>

              <div className="hr" />

              <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:14}}>
                <div className="card" style={{background:"rgba(255,255,255,.03)"}}>
                  <div className="pad">
                    <div className="small">EV charging preview</div>
                    <div style={{fontSize:18, fontWeight:900, marginTop:6}}>Power & range estimate</div>
                    <div className="small" style={{marginTop:8}}>
                      We will display charger <b>kW</b> and an estimated <b>km/hour</b> based on vehicle efficiency.
                    </div>

                    <label>Charger power (kW)</label>
                    <input
                      className="input"
                      type="range"
                      min={7}
                      max={250}
                      value={kw}
                      onChange={(e) => setKw(Number(e.target.value))}
                    />
                    <div style={{display:"flex", justifyContent:"space-between"}} className="small">
                      <span>7 kW</span><span className="mono"><b>{kw} kW</b></span><span>250 kW</span>
                    </div>

                    <label>Vehicle efficiency (kWh / 100 km)</label>
                    <input
                      className="input"
                      type="range"
                      min={12}
                      max={28}
                      value={eff}
                      onChange={(e) => setEff(Number(e.target.value))}
                    />
                    <div style={{display:"flex", justifyContent:"space-between"}} className="small">
                      <span>12</span><span className="mono"><b>{eff} kWh/100km</b></span><span>28</span>
                    </div>

                    <div className="hr" />
                    <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                      <span className="pill">Power: <b className="mono">{kw} kW</b></span>
                      <span className="pill">Estimated: <b className="mono">{estKmPerHour} km / hour</b></span>
                    </div>

                    <div className="small" style={{marginTop:10}}>
                      Note: estimate varies by temperature, vehicle, battery level and charger curve.
                    </div>
                  </div>
                </div>

                <div className="card" style={{background:"rgba(255,255,255,.03)"}}>
                  <div className="pad">
                    <div className="small">Truthful availability</div>
                    <div style={{fontSize:18, fontWeight:900, marginTop:6}}>“Reported” now, real-time in Phase 2</div>
                    <div className="small" style={{marginTop:8}}>
                      We do <b>not</b> claim “real-time” occupancy without sensors. We label it <b>Reported availability</b> today,
                      then upgrade to <b>Real-time</b> using existing RTSP cameras (Phase 2).
                    </div>

                    <div className="hr" />

                    <table className="table">
                      <tbody>
                        <tr><td><span className="tag warn">Phase 1</span></td><td className="right">Reported availability + payment</td></tr>
                        <tr><td><span className="tag">Phase 2</span></td><td className="right">RTSP camera → occupancy detection</td></tr>
                        <tr><td><span className="tag">Phase 3</span></td><td className="right">EV chargers live + kW / km/h per charger</td></tr>
                      </tbody>
                    </table>

                    <div style={{marginTop:12}}>
                      <Link className="btn primary" href="/reserve?lot=rb-parking">Run a test reservation →</Link>
                    </div>

                    <div className="small" style={{marginTop:10}}>
                      If you are the owner, open <span className="mono">?owner=rb</span> for the owner panel.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {owner ? <OwnerPanel owner={owner} /> : (
            <div className="card">
              <div className="pad">
                <div className="small">POC status</div>
                <div style={{fontSize:28, fontWeight:900, marginTop:6}}>Launch checklist</div>
                <div className="small" style={{marginTop:6}}>Keep this honest until RTSP occupancy goes live.</div>

                <div className="hr" />

                <div className="grid" style={{gap:10}}>
                  <div className="pill">✅ Add RB Parking page (this page)</div>
                  <div className="pill">✅ List 20 real spots</div>
                  <div className="pill">✅ Send owner a personalized link</div>
                  <div className="pill">⬜ 1 test booking + payment flow</div>
                  <div className="pill">⬜ Phase 2: RTSP camera → occupancy detection</div>
                </div>

                <div style={{marginTop:14}}>
                  <Link className="btn primary" href="/reserve?lot=rb-parking">Run a test reservation →</Link>
                </div>

                <div className="small" style={{marginTop:10}}>
                  Availability label is <b>Reported availability</b> now, then upgrade to <b>Real-time (camera RTSP)</b>.
                </div>
              </div>
            </div>
          )}
        </div>

        <div id="location" style={{marginTop:18}} className="card">
          <div className="pad">
            <div className="h2">Location</div>
            <div className="p">Near Cabaret Mado / Quartier Latin. Open 24/7.</div>
          </div>
          <div style={{borderTop:"1px solid var(--line)"}}>
            <iframe
              title="RB Parking map"
              src="https://www.google.com/maps/embed?pb=!4v1772088050639!6m8!1m7!1soXrpldCusooivklODmdlNg!2m2!1d45.51735097499155!2d-73.55822337370365!3f29.422028!4f0!5f0.7820865974627469"
              width="100%"
              height="420"
              style={{border:0}}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="pad">
            <div className="small">
              Note: Google embed is for location preview only. Reservations happen on VIIZE.
            </div>
          </div>
        </div>

        <div id="spots" style={{marginTop:18}} className="card">
          <div className="pad">
            <div className="h2">Available spots (20)</div>
            <div className="p">
              Current status is <b>Reported</b> availability. Real-time occupancy becomes available in Phase 2 via RTSP cameras.
            </div>
            <div style={{marginTop:14}}>
              <Link className="btn primary" href="/reserve?lot=rb-parking">Open reservation list →</Link>
            </div>
          </div>
        </div>

        <div style={{marginTop:18}} className="small">
          Powered by <b>VIIZE</b> (Buttertech). Payments: Interac / Stripe. Platform fee: 5%.
        </div>
      </div>
    </>
  );
}
