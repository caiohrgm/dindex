import '../css/Home.css';

import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { Digimon } from "../types/Digimon";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';

function Home() {
  const [digimons, setDigimons] = useState<Digimon[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Papa.parse("/data/digimons.csv", {
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

  return (
    <div className="container">
      <img id="logo-image" src={logo} alt="Dindex Logo" />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar Digimon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          filtered.slice(0, 4).map((digimon) => (
            <Link to={`/digimon/${digimon.id}`} key={digimon.id} className="card">
              <img src={`https://corsproxy.io/?${digimon.image}`} alt={digimon.name} />
              <p>{digimon.name}</p>
            </Link>
          ))
        ) : (
          <div className="not-found">Nenhum Digimon encontrado.</div>
        )}
      </div>
    </div>
  );
}

export default Home;
