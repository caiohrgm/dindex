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
  // const [modalOpen, setModalOpen] = useState(false);

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

        {/* <div className="digimon-card">
          <div className="card-header">
            <h1 className='card-title'> DIGIMON </h1>
            <span className="digi-id">#{digimon.id}</span>
          </div>

          <div className="card-image">
            <img
              src={`/${digimon.image.replace(/^\/?/, '')}`}
              alt={digimon.name}
              draggable={false}
            />
          </div>

          <div className='dig-properties'> 
            <h1 className="digi-name">{digimon.name}</h1>
            <div className='digi-sub-info'>
              <span className={`level-badge ${digimon.level?.toLowerCase()}`}>
                {digimon.level}
              </span>
              <div className="card-attributes">
                {digimon.attribute ? digimon.attribute.split(",").map((attr, i) => (
                  <span key={i} className={`attribute-badge ${attr.toLowerCase()}`}>
                    {attr}
                  </span>
                )) : (
                  <span className="attribute-badge unknown">Unknown</span>
                )}
              </div>
            </div>
          </div>

          
          <p className="card-description">
            {digimon.description || "Still being analyzed..."}
          </p>

          
          <div className="info-section">
            <p className="digi-info-label">Family</p>
            <div className="badges">
              {digimon.family?.length ? digimon.family.map((fam, i) => (
                <span key={i} className={`family-badge ${fam.toLowerCase()}`}>
                  {fam}
                </span>
              )) : <span className="family-unknown-badge">Unknown</span>}
            </div>
          </div>

          
          <div className="info-section">
            <p className="digi-info-label">Attacks</p>
            <div className="attack-list">
              {digimon.attacks?.length ? digimon.attacks.map((atk, i) => (
                <span key={i} className="attack-badge">{atk}</span>
              )) : <span className="unknown-badge">Unknown</span>}
            </div>
          </div>
        </div> */}
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