// export default Home;
import '../css/Home.css';
import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import type { Digimon } from "../types/Digimon";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';

function Home() {
  const [digimons, setDigimons] = useState<Digimon[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12); // começa mostrando 12 em vez de 6

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Papa.parse("../data/digimons_filtered.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (results: { data: Digimon[]; }) => {
        setDigimons(results.data as Digimon[]);
      },
    });
  }, []);

  const filtered = digimons.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 12); // carrega mais 12
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
      <img id="logo-image" src={logo} alt="Dindex Logo" />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar Digimon..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(12); // reseta quando busca
          }}
        />
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          filtered.slice(0, visibleCount).map((digimon) => (
            <Link to={`/digimon/${digimon.id}`} key={digimon.id} className="card">
              <img src={`https://corsproxy.io/?${digimon.image}`} alt={digimon.name} />
              <p>{digimon.name}</p>
            </Link>
          ))
        ) : (
          <div className="not-found">Nenhum Digimon encontrado.</div>
        )}
        {/* loader invisível que dispara o observer */}
        <div ref={loaderRef} />
      </div>
    </div>
  );
}

export default Home;
