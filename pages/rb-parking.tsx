import React, { useEffect, useState } from 'react';

export default function RBParking() {
  const [spots, setSpots] = useState([]);
  const [stats, setStats] = useState({ occupancy: 0, revenue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/parking');
      const data = await res.json();
      setSpots(data.spots);
      setStats({ occupancy: data.occupancy, revenue: data.revenueCents / 100 });
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#070a12] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">RB PARKING × VIIZE</h1>
          <p className="text-gray-500 text-sm font-mono">Instance: Quartier Latin / Montreal</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase">Revenue Est.</div>
          <div className="text-2xl font-black text-indigo-400">{stats.revenue.toFixed(2)} CAD</div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {spots.map((spot: any) => (
          <div key={spot.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{spot.type}</span>
              <div className={`w-2 h-2 rounded-full ${spot.isAvailable ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-amber-400'}`}></div>
            </div>
            <div className="text-2xl font-black mb-1">{spot.code}</div>
            <div className="text-lg font-mono text-gray-300">{(spot.finalPriceCents / 100).toFixed(2)}$</div>
            <button className="w-full mt-4 py-2 bg-white/5 border border-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white text-black transition-colors">
              Réserver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
