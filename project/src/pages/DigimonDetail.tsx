/* eslint-disable @typescript-eslint/no-explicit-any */
import '../css/DigimonDetail.css';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import type { Digimon } from '../types/Digimon';
import digiHome from '../assets/back_home.png'
import DigimonCard from "./DigimonCard";


function DigimonDetail() {
  const { id } = useParams();
  const [digimon, setDigimon] = useState<Digimon | null>(null);
  
  useEffect(() => {
    Papa.parse("/ingame_digimons.csv", {
      header: true,
      download: true,
      complete: (results: { data: any[] }) => {
        const data = results.data.map((row) => {
          return {
            ...row,
            family: row.family ? row.family.replace(/[\\[\]"]/g, '').split(',').map((f: string) => f.trim()) : [],

            prior_forms: row.prior_forms ? row.prior_forms.replace(/[\\[\]"]/g, '').split('|').map((f: string) => f.trim()) : [],

            next_forms: row.next_forms ? row.next_forms.replace(/[\\[\]"]/g, '').split('|').map((f: string) => f.trim()) : [],

            lateral_next_forms: row.lateral_next_forms ? row.lateral_next_forms.replace(/[\\[\]"]/g, '').split('|').map((f: string) => f.trim()) : [],

            digifuse_forms: row.digifuse_forms ? row.digifuse_forms.replace(/[\\[\]"]/g, '').split('|').map((f: string) => f.trim()) : [],
            
            attacks: row.attacks ? row.attacks.split('|').map((atk: string) => atk.trim()) : [],
          };
        }) as Digimon[];

        if (id && !isNaN(Number(id))) {
          const numericId = Number(id);
          const idAsString = numericId.toString();
          const selected = data.find(d => d.id === idAsString); 
          // const selected = data.find(d => d.id == id); 
          setDigimon(selected ?? null);
        } else {
          setDigimon(null); 
        }
      }
    });
  }, [id]);

  if (!digimon) return <p>Digimons Not found!</p>;

  return (
    <>
      <div className="digimon-detail">

        <div className="back-button">
          <Link to="/">
            <img 
              src={digiHome}
              alt="Back"
              className="back-icon"
            />
          </Link>
        </div>

        {digimon && <DigimonCard digimon={digimon} />}

      </div>
    </>
  );
}

export default DigimonDetail;

 {/* <div className="info-section">
              <p className="digi-info-label">Prior Digivolutions:</p>
              <div className="evolution-list evolution-prior">
                {digimon.prior_forms && digimon.prior_forms.length > 0 ? (
                  digimon.prior_forms.map((form, i) => <span key={i}>{form}</span>)
                ) : (
                  <span className="unknown-badge">Unknown</span>
                )}
              </div>              
            </div>

            <div className="info-section">
              <p className="digi-info-label">Digivolutions</p>
              <div className="evolution-list evolution-next">
                {digimon.next_forms && digimon.next_forms.length > 0 ? (
                  digimon.next_forms.map((form, i) => <span key={i}>{form}</span>)
                ) : (
                  <span className="unknown-badge">Unknown</span>
                )}
              </div>
            </div>

            <div className="info-section">
              <p className="digi-info-label">Lateral Digivolutions:</p>
              <div className="evolution-list evolution-lateral">
                {digimon.lateral_next_forms && digimon.lateral_next_forms.length > 0 ? (
                  digimon.lateral_next_forms.map((form, i) => <span key={i}>{form}</span>)
                ) : (
                  <span className="unknown-badge">Unknown</span>
                )}
              </div>
            </div>

            <div className="info-section">
              <p className="digi-info-label">Digifusions:</p>
              <div className="evolution-list evolution-digifuse">
                {digimon.digifuse_forms && digimon.digifuse_forms.length > 0 ? (
                  digimon.digifuse_forms.map((form, i) => <span key={i}>{form}</span>)
                ) : (
                  <span className="unknown-badge">Unknown</span>
                )}
              </div>
            </div> */}