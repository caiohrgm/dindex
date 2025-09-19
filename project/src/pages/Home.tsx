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

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Papa.parse("/ingame_digimons.csv", { // recomendado: arquivo em public/data/
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

  // filtro seguro (evita erro quando d.name é undefined)
  const filtered = digimons.filter(d =>
    (d.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

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
