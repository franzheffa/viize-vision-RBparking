import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { SpotCard } from '../../components/SpotCard';

export default function ReservePage() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/rb-parking/spots')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSpots(data.spots);
        else setError("Failed to load spots");
      })
      .catch(() => setError("Connection error"))
      .finally(() => setLoading(false));
  }, []);

  const onReserve = (spotId: string) => {
    alert(`Redirection vers le paiement pour la place ${spotId}...`);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="mt-12">
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Réserver une place</h1>
          <p className="text-gray-400 mb-8 font-mono uppercase tracking-widest text-xs">
            Quartier Latin — 1439 Rue Saint-Timothée
          </p>

          {loading && <div className="animate-pulse text-blue-400 font-mono">CHARGEMENT...</div>}
          
          {!loading && !error && (
            <div 
              className="grid" 
              style={{
                marginTop: 18, 
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
                gap: 18
              }}
            >
              {spots.map((s: any) => (
                <SpotCard key={s.id} spot={s} onReserve={onReserve} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
