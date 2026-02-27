import { useEffect,useState } from "react"

export default function RB(){
  const [data,setData]=useState<any>(null)

  useEffect(()=>{
    fetch("/api/parking?slug=rb-parking")
      .then(r=>r.json())
      .then(setData)
  },[])

  if(!data) return <div style={{padding:40}}>Loading...</div>

  return(
    <div style={{background:"#070a12",minHeight:"100vh",color:"#fff",padding:40,fontFamily:"system-ui"}}>
      <h1>RB Parking</h1>
      <p>Reserve your spot in seconds.</p>
      <p>Platform fee: {data.platformFeePercent}%</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20,marginTop:30}}>
        {data.spots.map((s:any)=>(
          <div key={s.id} style={{background:"rgba(255,255,255,.05)",padding:20,borderRadius:12}}>
            <h2>{s.code}</h2>
            <p>${(s.finalPriceCents/100).toFixed(2)} CAD</p>
            <button
              style={{padding:10,background:"#fff",color:"#000",borderRadius:8}}
              onClick={()=>reserve(s.id)}
            >
              Reserve →
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  async function reserve(spotId:string){
    const r=await fetch("/api/reserve",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({spotId})})
    const j=await r.json()
    alert("Reservation created: "+j.reference)
  }
}
