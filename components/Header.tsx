import React from 'react';

export const Header = () => (
  <header className="flex items-center justify-between py-4 border-b border-white/10">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center font-bold">RB</div>
      <div>
        <div className="text-xs font-black tracking-tighter">RB PARKING</div>
        <div className="text-[10px] text-gray-500">Powered by VIIZE</div>
      </div>
    </div>
  </header>
);
