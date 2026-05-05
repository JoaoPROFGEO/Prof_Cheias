import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CloudRain, Trees, Map, Droplets, AlertTriangle, Info, Home as HomeIcon } from 'lucide-react';

type LandUse = 'floresta' | 'agricultura' | 'urbano';

export default function App() {
  const [precipitation, setPrecipitation] = useState<number>(10);
  const [landUse, setLandUse] = useState<LandUse>('floresta');
  const [slope, setSlope] = useState<number>(20);
  const [waterLevel, setWaterLevel] = useState<number>(20);

  // Calcula o nível da água baseado nas variáveis
  useEffect(() => {
    let infiltracao = 0;
    if (landUse === 'floresta') infiltracao = 0.85;
    else if (landUse === 'agricultura') infiltracao = 0.50;
    else if (landUse === 'urbano') infiltracao = 0.10;

    const escorrencia = 1 - infiltracao;
    const decliveFactor = 1 + (slope / 100) * 0.8;
    const baseLevel = 20;
    const addedLevel = precipitation * escorrencia * decliveFactor * 2.8;
    
    setWaterLevel(baseLevel + addedLevel);
  }, [precipitation, landUse, slope]);

  // Interpretação do risco matching the Artistic Flair color palette
  const getRiskStatus = () => {
    if (waterLevel < 60) return { nível: 'Estiagem (Baixo)', risco: 'Nulo', riskHex: 'var(--color-water)', textClass: 'text-water' };
    if (waterLevel < 120) return { nível: 'Leito Normal', risco: 'Baixo', riskHex: 'var(--color-accent)', textClass: 'text-accent' };
    if (waterLevel < 220) return { nível: 'Extrapolação', risco: 'Elevado', riskHex: '#ca8a04', textClass: 'text-yellow-600' };
    return { nível: 'Inundação no Leito Maior', risco: 'Crítico', riskHex: 'var(--color-danger)', textClass: 'text-danger' };
  };

  const status = getRiskStatus();

  return (
    <div className="min-h-screen bg-bg-paper text-ink font-sans flex flex-col lg:grid lg:grid-cols-[320px_1fr] lg:grid-rows-[80px_1fr_auto]">
      
      {/* Header */}
      <header className="lg:col-span-2 border-b-2 border-ink bg-white flex items-center justify-between px-6 lg:px-10 py-5 lg:py-0 z-20 relative">
        <h1 className="font-serif italic font-black text-2xl lg:text-[32px] m-0 flex items-center gap-3 text-ink">
          <Droplets className="w-6 h-6 lg:w-8 lg:h-8 hidden sm:block" />
          Dinâmica de Cheias
        </h1>
        <div className="text-[10px] sm:text-[12px] font-extrabold uppercase tracking-[2px] border-[1.5px] border-ink px-3 py-1 rounded-full whitespace-nowrap text-ink">
          Geografia 10º Ano
        </div>
      </header>

      {/* Sidebar Controls */}
      <aside className="border-b-2 lg:border-b-0 lg:border-r-2 border-ink bg-white p-6 lg:p-[30px] flex flex-col z-10 relative">
        <div className="space-y-8">
          {/* Precipitação */}
          <div className="control-group">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-sans font-semibold text-[14px] uppercase tracking-[0.5px]">Precipitação</span>
              <span className="font-serif text-[18px] font-black">{precipitation}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={precipitation}
              onChange={(e) => setPrecipitation(Number(e.target.value))}
            />
          </div>

          {/* Uso do Solo */}
          <div className="control-group">
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-sans font-semibold text-[14px] uppercase tracking-[0.5px]">Cobertura de Solo</span>
            </div>
            <div className="space-y-2">
              {(['floresta', 'agricultura', 'urbano'] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setLandUse(tipo)}
                  className={`w-full text-left px-4 py-2 border-2 transition-all duration-200 flex items-center justify-between ${
                    landUse === tipo 
                      ? 'border-ink bg-ink text-white'
                      : 'border-gray-200 hover:border-ink bg-white text-ink'
                  }`}
                >
                  <span className="capitalize font-semibold text-[13px] tracking-wide">{tipo === 'urbano' ? 'Área Urbana' : tipo}</span>
                  {landUse === tipo && <div className="w-2 h-2 rounded-full bg-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Declive */}
          <div className="control-group">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-sans font-semibold text-[14px] uppercase tracking-[0.5px]">Declive</span>
              <span className="font-serif text-[18px] font-black">{slope}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={slope}
              onChange={(e) => setSlope(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Análise Resumo (Risk Panel alternative location matching theme) */}
        <div className="mt-auto pt-10 text-[13px] leading-relaxed border-t border-gray-200 mt-12 pb-4">
          <strong className="uppercase text-[11px] font-extrabold tracking-widest block mb-1">Estado do Leito:</strong>
          <span className="font-serif text-3xl font-black block leading-none pb-2 pt-1" style={{ color: status.riskHex }}>
            {status.risco}
          </span>
          Nível da água estimado: <span className="font-bold">{status.nível}</span>.
        </div>
      </aside>

      {/* Main Stage Viz */}
      <main className="relative bg-bg-paper p-6 lg:p-[40px] flex flex-col justify-center gap-8 overflow-hidden z-10">
        
        {/* Background typographic element */}
        <div className="absolute top-4 right-6 lg:top-8 lg:right-10 font-sans text-5xl lg:text-[80px] font-black uppercase opacity-[0.03] pointer-events-none leading-none tracking-tighter">
          BACIA
        </div>

        {/* SVG Wrapper */}
        <div className="border-2 border-ink bg-white shadow-[10px_10px_0px_rgba(0,0,0,0.05)] w-full aspect-video relative overflow-hidden z-20">
          <div className="absolute top-2 left-0 w-full text-center font-sans text-[10px] font-extrabold uppercase tracking-[2px] opacity-40 z-30">
            Secção Transversal do Rio
          </div>
          
          {/* Chuva */}
          {precipitation > 0 && (
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.35]">
              {Array.from({ length: Math.min(100, Math.floor(precipitation * 1.5)) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-ink w-[1.5px] rounded-full"
                  initial={{ opacity: 0, y: -20, x: Math.random() * 1000, height: 10 + Math.random() * 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: 500, x: `calc(${Math.random() * 1000}px - 50px)` }}
                  transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: Math.random(), ease: "linear" }}
                />
              ))}
            </div>
          )}

          <svg viewBox="0 0 1000 500" className="w-full h-full block absolute inset-0 z-20" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="florestaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D5A27" />
                <stop offset="100%" stopColor="#1B3617" />
              </linearGradient>
              <linearGradient id="agroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8A9A5B" />
                <stop offset="100%" stopColor="#637042" />
              </linearGradient>
              <linearGradient id="urbanoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#737373" />
                <stop offset="100%" stopColor="#404040" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3A7CA5" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#1D4E6D" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Fundo */}
            <path d="M0,200 Q150,150 250,250 T500,200 T750,280 T1000,150 L1000,500 L0,500 Z" fill="#D0CDBE" opacity="0.3" />

            {/* Perfil */}
            <motion.path 
              d="M0,100 L200,250 L380,280 L450,450 L550,450 L620,280 L800,250 L1000,100 L1000,500 L0,500 Z" 
              fill={`url(#${landUse === 'floresta' ? 'florestaGrad' : landUse === 'agricultura' ? 'agroGrad' : 'urbanoGrad'})`}
              animate={{ d: `M0,${150 - (slope / 2)} L200,250 L380,280 L450,450 L550,450 L620,280 L800,250 L1000,${150 - (slope / 2)} L1000,500 L0,500 Z` }}
              transition={{ duration: 0.5 }}
            />

            {/* Outline on top of the terrain to match the artistic stroke style */}
            <motion.path 
              d="M0,100 L200,250 L380,280 L450,450 L550,450 L620,280 L800,250 L1000,100 L1000,500 L0,500 Z" 
              fill="none" stroke="var(--color-ink)" strokeWidth="2" opacity="0.2"
              animate={{ d: `M0,${150 - (slope / 2)} L200,250 L380,280 L450,450 L550,450 L620,280 L800,250 L1000,${150 - (slope / 2)} L1000,500 L0,500 Z` }}
              transition={{ duration: 0.5 }}
            />

            {/* Ocupação do Solo Dinâmica */}
            <g className="ocupacao-solo">
              {landUse === 'urbano' && (
                  <g className="urbano" transform="translate(0, -10)">
                    {/* Casas na margem esquerda */}
                    {/* Prédio 1 */}
                    <rect x="230" y="180" width="35" height="80" fill="#404040" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <rect x="240" y="190" width="5" height="12" fill="#E8DCD8" />
                    <rect x="250" y="190" width="5" height="12" fill="#E8DCD8" />
                    <rect x="240" y="210" width="5" height="12" fill="#E8DCD8" />
                    <rect x="250" y="210" width="5" height="12" fill="#E8DCD8" />
                    <rect x="240" y="230" width="5" height="12" fill="#E8DCD8" />
                    <rect x="250" y="230" width="5" height="12" fill="#E8DCD8" />

                    {/* Casa 1 */}
                    <rect x="280" y="235" width="30" height="25" fill="#C84C32" rx="0" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <polygon points="275,235 295,215 315,235" fill="#E8DCD8" stroke="var(--color-ink)" strokeWidth="1.5" />
                    {/* Casa 2 */}
                    <rect x="320" y="245" width="40" height="25" fill="#E8DCD8" rx="0" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <polygon points="310,245 340,225 370,245" fill="#C84C32" stroke="var(--color-ink)" strokeWidth="1.5" />
                    {/* Casa extra */}
                    <rect x="200" y="225" width="20" height="20" fill="#E8DCD8" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <polygon points="195,225 210,210 225,225" fill="#C84C32" stroke="var(--color-ink)" strokeWidth="1.5" />
                    
                    {/* Casas na margem direita */}
                    {/* Casa 3 */}
                    <rect x="640" y="245" width="35" height="30" fill="#C84C32" rx="0" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <polygon points="630,245 657,220 685,245" fill="#E8DCD8" stroke="var(--color-ink)" strokeWidth="1.5" />
                    {/* Prédio 2 */}
                    <rect x="690" y="200" width="45" height="75" fill="#404040" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <rect x="700" y="215" width="8" height="10" fill="var(--color-accent)" />
                    <rect x="715" y="215" width="8" height="10" fill="var(--color-bg-paper)" />
                    <rect x="700" y="235" width="8" height="10" fill="var(--color-bg-paper)" />
                    <rect x="715" y="235" width="8" height="10" fill="var(--color-accent)" />
                    {/* Casa 4 */}
                    <rect x="750" y="230" width="30" height="25" fill="#E8DCD8" rx="0" stroke="var(--color-ink)" strokeWidth="1.5" />
                    <polygon points="745,230 765,210 785,230" fill="#C84C32" stroke="var(--color-ink)" strokeWidth="1.5" />
                  </g>
              )}

              {landUse === 'floresta' && (
                  <g className="arvores">
                      {/* Árvores densas */}
                      {[
                        {cx: 40, cy: 150}, {cx: 80, cy: 190}, {cx: 120, cy: 220}, {cx: 170, cy: 240},
                        {cx: 230, cy: 250}, {cx: 280, cy: 260}, {cx: 320, cy: 270}, {cx: 360, cy: 280},
                        {cx: 100, cy: 160}, {cx: 140, cy: 200}, {cx: 190, cy: 230}, {cx: 250, cy: 255},
                        {cx: 640, cy: 280}, {cx: 690, cy: 270}, {cx: 740, cy: 260}, {cx: 790, cy: 245},
                        {cx: 840, cy: 230}, {cx: 890, cy: 200}, {cx: 940, cy: 160}, {cx: 980, cy: 130},
                        {cx: 700, cy: 250}, {cx: 760, cy: 240}, {cx: 810, cy: 220}, {cx: 880, cy: 180}
                      ].map((pos, i) => (
                         <g key={`tree-${i}`} transform={`translate(${pos.cx}, ${pos.cy})`}>
                             <rect x="-2" y="0" width="4" height="15" fill="var(--color-ink)" />
                             <polygon points="-12,0 0,-20 12,0" fill="var(--color-bg-paper)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
                         </g>
                      ))}
                      {/* Small lone house */}
                      <g transform="translate(280, 255)">
                         <rect x="0" y="0" width="20" height="15" fill="#E8DCD8" rx="0" stroke="var(--color-ink)" strokeWidth="1.5" />
                         <polygon points="-5,0 10,-10 25,0" fill="#C84C32" stroke="var(--color-ink)" strokeWidth="1.5" />
                      </g>
                  </g>
              )}

              {landUse === 'agricultura' && (
                  <g className="agricultura">
                      {/* Lotes agrícolas esquemáticos */}
                      {[
                        {x: 220, y: 260, w: 100, skew: -20},
                        {x: 650, y: 260, w: 110, skew: 20}
                      ].map((field, i) => (
                          <g key={`field-${i}`} transform={`translate(${field.x}, ${field.y})`}>
                             <rect x="0" y="0" width={field.w} height="15" fill="#8A9A5B" opacity="0.6" stroke="var(--color-ink)" strokeWidth="1" transform={`skewX(${field.skew})`} />
                             {Array.from({length: Math.floor(field.w / 20)}).map((_, j) => (
                                 <line key={j} x1={j * 20 + 10} y1="0" x2={j * 20 + 10 + (field.skew > 0 ? 5 : -5)} y2="15" stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                             ))}
                          </g>
                      ))}
                      {/* Quinta / Farmhouse */}
                      <g transform="translate(330, 245)">
                         <rect x="0" y="0" width="30" height="20" fill="#E8DCD8" rx="0" stroke="var(--color-ink)" strokeWidth="1.5" />
                         <polygon points="-5,0 15,-15 35,0" fill="#C84C32" stroke="var(--color-ink)" strokeWidth="1.5" />
                         <rect x="35" y="5" width="15" height="15" fill="#8A9A5B" stroke="var(--color-ink)" strokeWidth="1.5" />
                      </g>
                      {/* Silo */}
                      <g transform="translate(770, 230)">
                        <rect x="0" y="0" width="15" height="30" fill="#D0CDBE" stroke="var(--color-ink)" strokeWidth="1.5" />
                        <path d="M0,0 Q7.5,-10 15,0 Z" fill="#D0CDBE" stroke="var(--color-ink)" strokeWidth="1.5" />
                      </g>
                      {/* Algumas árvores dispersas */}
                      {[ {cx: 190, cy: 230}, {cx: 810, cy: 220} ].map((pos, i) => (
                         <g key={`farm-tree-${i}`} transform={`translate(${pos.cx}, ${pos.cy})`}>
                             <rect x="-2" y="0" width="4" height="15" fill="var(--color-ink)" />
                             <circle cx="0" cy="-5" r="8" fill="var(--color-bg-paper)" stroke="var(--color-ink)" strokeWidth="1.5" />
                         </g>
                      ))}
                  </g>
              )}
            </g>

            {/* Água */}
            <motion.rect
              x="0"
              y={450 - waterLevel}
              width="1000"
              height={waterLevel + 50}
              fill="url(#waterGrad)"
              initial={{ y: 430, height: 20 }}
              animate={{ y: 450 - waterLevel, height: waterLevel + 50 }}
              transition={{ type: "spring", stiffness: 30, damping: 15 }}
            />
            {/* Top border of water */}
            <motion.line
              x1="0" x2="1000"
              stroke="#1D4E6D" strokeWidth="3"
              initial={{ y1: 430, y2: 430 }}
              animate={{ y1: 450 - waterLevel, y2: 450 - waterLevel }}
              transition={{ type: "spring", stiffness: 30, damping: 15 }}
            />

            {/* Linhas */}
            <line x1="380" y1="350" x2="620" y2="350" stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
            <line x1="200" y1="280" x2="800" y2="280" stroke="#C84C32" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5" />
            
            {waterLevel >= 220 && (
              <text x="800" y="270" textAnchor="end" fontSize="11" fill="var(--color-danger)" fontWeight="800" className="opacity-80">
                EXTRAPOLAÇÃO DAS MARGENS
              </text>
            )}
          </svg>
        </div>

        {/* Metrics Grid inside Main Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="border-l-2 border-ink pl-4">
            <div className="text-[10px] font-extrabold uppercase opacity-50 tracking-widest text-ink">Tempo de Concentração</div>
            <div className="text-[20px] font-semibold text-ink font-serif drop-shadow-sm">
              {Math.max(10, Math.round(200 - (slope * 1.5) - ((landUse==='urbano'?0.9:landUse==='agricultura'?0.5:0.15) * 80)))} min
            </div>
          </div>
          <div className="border-l-2 border-ink pl-4">
            <div className="text-[10px] font-extrabold uppercase opacity-50 tracking-widest text-ink">Escoamento Superficial</div>
            <div className="text-[20px] font-semibold text-ink font-serif drop-shadow-sm">
              {Math.round((landUse==='urbano'?0.9:landUse==='agricultura'?0.5:0.15)*100)}%
            </div>
          </div>
          <div className="border-l-2 border-ink pl-4">
            <div className="text-[10px] font-extrabold uppercase opacity-50 tracking-widest text-ink">Taxa de Infiltração</div>
            <div className="text-[20px] font-semibold text-ink font-serif drop-shadow-sm">
              {Math.round((landUse==='floresta'?0.85:landUse==='agricultura'?0.5:0.1)*100)}%
            </div>
          </div>
        </div>

      </main>

      {/* Footer Info matched entirely to structural design requirements */}
      <footer className="lg:col-span-2 bg-ink text-white grid grid-cols-1 lg:grid-cols-[320px_1fr] border-t border-white/10 z-20">
        <div className="p-6 lg:p-8 font-sans text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 border-b lg:border-b-0 lg:border-r border-white/10 flex items-center lg:h-full">
          Explicação Geográfica
        </div>
        <div className="p-6 lg:p-8 font-serif italic text-[15px] lg:text-[17px] flex items-center leading-relaxed text-gray-200">
          <div>
            "Com precipitação a {precipitation}%, uso de solo {landUse} e declive acentuado ({slope}%), 
            {landUse === 'floresta' 
              ? ' a infiltração elevada pelo manto florestal retarda a escorrência superficial, contendo o pico de caudal moderadamente.' 
              : landUse === 'urbano' 
                ? ' a selagem dos solos anula a infiltração, provocando escoamento imediato e subida súbita do nível médio das águas do leito.'
                : ' a redução da proteção natural acelera a carga hídrica, extrapolando rapidamente o leito normal para a planície de inundação.'
            } 
            {waterLevel >= 220 
              ? ' O risco em áreas antropizadas na planície é neste momento Crítico devido à histórica construção em espaço de margem.' 
              : ''}
            "
          </div>
        </div>
      </footer>
      
    </div>
  );
}
