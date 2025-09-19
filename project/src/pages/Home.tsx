import '../css/Home.css';
import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import type { Digimon } from "../types/Digimon";
import { Link } from "react-router-dom";
import logo from '../assets/logo_story.png';
import digidexLogo from '../assets/digidex_lg_fixed.png';

function Home() {
  const [digimons, setDigimons] = useState<Digimon[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter by Level and Attribute:
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedAttribute, setSelectedAttribute] = useState("All")

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Level Colors
  const levelColors: Record<string, string> = {
    "Fresh": "#FFFDE7",        
    "In-Training": "#FFF9C4",  
    "Rookie": "#FFF176",       
    "Armor": "#FFEE58",        
    "Burst": "#FFEB3B",        
    "Hybrid": "#FDD835",       
    "Champion": "#FBC02D",     
    "Ultimate": "#F9A825",     
    "Mega": "#F57F17",         
    "Ultra": "#FF6F00",        
    "Unknown": "#95a6b5",      
    "All": "#92e5c6"           
  };

  const orderedLevels = Object.keys(levelColors).filter(l => l !== "All");

  // Attribute Colors
  const attributeColors: Record<string, string> = {
    "Vaccine": "#a8f0b0",
    "Virus": "#e3a2e7",
    "Data": "#6257d8",
    "Free": "#fef3c7",
    "Variable": "#9ce0ec",
    "Unknown": "#95a6b5",
    "All": "#92e5c6"
  };


  useEffect(() => {
    Papa.parse("/ingame_digimons.csv", { 
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (results: { data: Digimon[]; }) => {
        console.log("CSV carregado:", results.data);
        setDigimons(results.data as Digimon[]);
      },
      error: (err: unknown) => {
        console.error("Erro carregando CSV:", err);
      }
    });
  }, []);

  // const attributes = Array.from(new Set(digimons.map(d => d.attribute).filter(Boolean)))
  const attributes = Array.from(
  new Set(
    digimons.flatMap(d => (d.attribute ?? '').split('/').map(a => a.trim()))
  )
);

  // filters:
  const filtered = digimons.filter(d => {
    const matchesSearch = (d.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === "All" || d.level === selectedLevel;
    const matchesAttribute = selectedAttribute === "All" || (d.attribute ?? '').split('/').map(a => a.trim()).includes(selectedAttribute);

    return matchesSearch && matchesLevel && matchesAttribute;
  });

  // observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 12); 
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <img className="main-logo" src={logo} alt="Dindex Logo" />

      <div className="digi-logo-container">
        <img className="digi-logo" src={digidexLogo} alt="Digidex Logo" />
      </div>
            
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Digimon"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(12); 
          }}
        />
      </div>

      {/* FILTERS */}
      <div className="filters">
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={{ background: levelColors[selectedLevel] || "#92e5c6" }}
        >
          <option value="All">All Levels</option>
          {orderedLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <select value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.target.value)} style={{ background: attributeColors[selectedAttribute] || "#92e5c6" }}>
          <option value="All">All Attributes</option>
          {[...attributes]
            .sort((a, b) => {
              if (a === "Unknown") return 1;  // "Unknown" sempre por último
              if (b === "Unknown") return -1;
              return a.localeCompare(b);       // ordena o resto alfabeticamente
            })
            .map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))
          }
        </select>
      </div>

      {/* CONTADOR DE RESULTADOS */}
      <div className="result-count">
        {digimons.length === 0
          ? 'Loading...'
          : `${filtered.length} / ${digimons.length} digimons`}
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          filtered.slice(0, visibleCount).map((digimon) => (
            <Link to={`/digimon/${digimon.id}`} key={digimon.id} className="card">
              <div className="card-content">
                <img src={`/${digimon.image.replace(/^\/?/, '')}`} alt={digimon.name} />
                <p className="digi-name">{digimon.name}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="not-found">No Digimon found.</div>
        )}
        {/* loader invisível que dispara o observer */}
        <div ref={loaderRef} />
      </div>
    </div>
  );
}

export default Home;
