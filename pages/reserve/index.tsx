import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { SpotCard } from '../../components/SpotCard';

export default function ReservePage() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On appelle l'API locale qui communique avec Prisma
    fetch('/api/rb-parking/spots')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSpots(data.spots);
        } else {
          setError(data.error || "Aucune place trouvée.");
        }
      })
      .catch(() => setError("Erreur de connexion au serveur."))
      .finally(() => setLoading(false));
  }, []);

  const onReserve = (spotId: string) => {
    // REDIRECTION VERS LE TUNNEL DE PAIEMENT PRINCIPAL
    // On transmet l'ID du spot pour que l'autre plateforme sache quoi facturer
    const targetUrl = `https://viize-vision-parking.vercel.app/reserve?spotId=${spotId}&source=rb-parking`;
    window.location.href = targetUrl;
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="mt-12">
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter italic">RÉSERVER UNE PLACE</h1>
          <p className="text-gray-400 mb-8 font-mono uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Quartier Latin — Disponibilité en temps réel
          </p>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="p-6 border border-red-500/30 rounded-2xl bg-red-500/5 text-red-400 font-mono text-sm">
              [SYSTEM ERROR]: {error}
            </div>
          )}
          
          {!loading && !error && (
            <div 
              className="grid" 
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                gap: 20
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
