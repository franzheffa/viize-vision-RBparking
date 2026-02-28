import { useMemo, useState } from "react";

export function OwnerPanel({ owner }: { owner: string }) {
  const [rtsp, setRtsp] = useState({ ip: "", username: "", password: "", channel: "1" });

  const ownerLink = useMemo(() => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/rb-parking?owner=${encodeURIComponent(owner)}`;
  }, [owner]);

  async function runPaymentTest() {
    const r = await fetch(`/api/owner/payment-test?owner=${encodeURIComponent(owner)}`, { method: "POST" });
    const j = await r.json();
    alert(j?.ok ? `Payment test created: ${j.testId}` : `Error: ${j?.error || "unknown"}`);
  }

  async function saveRtsp() {
    const r = await fetch(`/api/owner/rtsp?owner=${encodeURIComponent(owner)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(rtsp)
    });
    const j = await r.json();
    alert(j?.ok ? "RTSP onboarding saved (Phase 2)." : `Error: ${j?.error || "unknown"}`);
  }

  return (
    <div className="card">
      <div className="pad">
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div className="small">Owner tools</div>
            <div className="h2" style={{marginTop:6}}>Owner panel</div>
          </div>
          <span className="pill mono">owner={owner}</span>
        </div>

        <div className="hr" />

        <div className="small">Owner dashboard link</div>
        <div className="mono" style={{padding:"10px 12px", border:"1px solid var(--line)", borderRadius:14, background:"rgba(0,0,0,.25)", overflowX:"auto"}}>
          {ownerLink}
        </div>

        <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:12}}>
          <button className="btn primary" onClick={runPaymentTest}>Run payment test →</button>
          <a className="btn" href="/reserve?lot=rb-parking" rel="noreferrer">Open reservation UI</a>
        </div>

        <div className="hr" />

        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div className="small">Phase 2</div>
            <div style={{fontSize:18, fontWeight:800}}>Camera RTSP onboarding</div>
          </div>
          <span className="pill">copy/paste fields</span>
        </div>

        <label>Camera IP</label>
        <input className="input" value={rtsp.ip} onChange={(e)=>setRtsp({...rtsp, ip:e.target.value})} placeholder="ex: 192.168.1.50" />

        <label>Username</label>
        <input className="input" value={rtsp.username} onChange={(e)=>setRtsp({...rtsp, username:e.target.value})} placeholder="ex: admin" />

        <label>Password</label>
        <input className="input" value={rtsp.password} onChange={(e)=>setRtsp({...rtsp, password:e.target.value})} placeholder="••••••••" />

        <label>Channel</label>
        <input className="input" value={rtsp.channel} onChange={(e)=>setRtsp({...rtsp, channel:e.target.value})} placeholder="1" />

        <div style={{marginTop:12}}>
          <button className="btn primary" onClick={saveRtsp}>Save RTSP onboarding →</button>
        </div>

        <div className="small" style={{marginTop:10}}>
          RTSP occupancy detection is activated in Phase 2. Until then, availability remains <b>Reported</b>.
        </div>
      </div>
    </div>
  );
}
