/* eslint-disable @typescript-eslint/no-explicit-any */
import '../css/DigimonDetail.css';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import type { Digimon } from '../types/Digimon';

function DigimonDetail() {
  const { id } = useParams();
  const [digimon, setDigimon] = useState<Digimon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    Papa.parse("/data/digimons_filtered.csv", {
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

  if (!digimon) return <p>Carregando...</p>;

  return (
    <>
      <div className="card">
        <div id="back-home-button" className="back-button">
          <Link to="/" className="btn-back">← Voltar</Link>
        </div>
        <div className="header">
          <h1>{digimon.name}</h1>
          <p>
            Level:{' '}
            <span className={`level-badge ${digimon.level?.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '').replace(/[^a-z-]/g, '')}`}>
              {digimon.level}
            </span>
          </p>
        </div>

        <img
          className="digimon-image"
          src={`https://corsproxy.io/?${digimon.image}`}
          alt={digimon.name}
          onClick={openModal}
          style={{ cursor: 'pointer' }}
          draggable={false}
        />

        <p className="image-hint">
          Click on the image to enlarge it.
        </p>

        <div className="section">
          <p className="label">Attribute:</p>
          <div className="badges">
           {digimon.attribute ? (
              digimon.attribute.split(',').flatMap((attr, i) => {
                return attr.split('/').map((subAttr, j) => {
                  const trimmed = subAttr.trim();
                  const className = `attribute-badge ${trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`;
                  return (
                    <span key={`${i}-${j}`} className={className}>
                      {trimmed}
                    </span>
                  );
                });
              })
            ) : (
              <span className="unknown-badge">Unknown</span>

            )}
          </div>
        </div>

        <div className="section">
          <p className="label">Family:</p>
          <div className="badges">
            {digimon.family && digimon.family.length > 0 ? (
              digimon.family.map((fam, i) => {
                const className = `family-badge ${fam.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`;
                return <span className={className} key={i}>{fam}</span>;
              })
            ) : (
              <span className="unknown-badge">Unknown</span>

            )}
          </div>
        </div>

        <div className="section">
          <p className="label">Ataques:</p>
          <div className="attack-list">
            {digimon.attacks && digimon.attacks.length > 0 ? (
              digimon.attacks.map((atk, i) => (
                <span key={i} className="attack-badge">{atk}</span>
              ))
            ) : (
              <span className="unknown-badge">Unknown</span>
            )}
          </div>
        </div>


        <div className="section">
          <p className="label">Prior Digivolutions:</p>
          <div className="evolution-list evolution-prior">
            {digimon.prior_forms && digimon.prior_forms.length > 0 ? (
              digimon.prior_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <span className="unknown-badge">Unknown</span>
            )}
          </div>

          <p className="label">Next Digivolutions:</p>
          <div className="evolution-list evolution-next">
            {digimon.next_forms && digimon.next_forms.length > 0 ? (
              digimon.next_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <span className="unknown-badge">Unknown</span>
            )}
          </div>

          <p className="label">Lateral Digivolutions:</p>
          <div className="evolution-list evolution-lateral">
            {digimon.lateral_next_forms && digimon.lateral_next_forms.length > 0 ? (
              digimon.lateral_next_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <span className="unknown-badge">Unknown</span>
            )}
          </div>
        </div>

        <div className="section">
          <p className="label">Digifusions:</p>
          <div className="evolution-list evolution-digifuse">
            {digimon.digifuse_forms && digimon.digifuse_forms.length > 0 ? (
              digimon.digifuse_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <span className="unknown-badge">Unknown</span>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div id="imageModal" className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img
            id="modalImg"
            className="modal-content"
            src={`https://corsproxy.io/?${digimon.image}`}
            alt={digimon.name}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </>
  );
}

export default DigimonDetail;
