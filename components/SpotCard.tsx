import React from 'react';

export const SpotCard = ({ spot, onReserve }: { spot: any, onReserve: (id: string) => void }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-mono text-gray-500">STANDARD</span>
      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">REPORTED</span>
    </div>
    <div className="text-2xl font-black mt-2">{spot.code}</div>
    <div className="text-xl font-bold mt-1 text-blue-400">${(spot.finalPriceCents / 100).toFixed(2)} CAD</div>
    <button 
      onClick={() => onReserve(spot.id)}
      className="w-full mt-4 py-3 bg-white text-black rounded-xl font-black text-sm hover:bg-gray-200 transition-colors"
    >
      RESERVE THIS SPOT →
    </button>
  </div>
);
