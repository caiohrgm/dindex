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
    Papa.parse("/data/digimons.csv", {
      header: true,
      download: true,
      complete: (results: { data: any[] }) => {
        const data = results.data.map((row) => {
          return {
            ...row,
            family: row.family ? row.family.replace(/[\\[\]"]/g, '').split(',').map((f: string) => f.trim()) : [],
            prior_forms: row.prior_forms ? row.prior_forms.replace(/[\\[\]"]/g, '').split(',').map((f: string) => f.trim()) : [],
            next_forms: row.next_forms ? row.next_forms.replace(/[\\[\]"]/g, '').split(',').map((f: string) => f.trim()) : [],
            lateral_next_forms: row.lateral_next_forms ? row.lateral_next_forms.replace(/[\\[\]"]/g, '').split(',').map((f: string) => f.trim()) : [],
            digifuse_forms: row.digifuse_forms ? row.digifuse_forms.replace(/[\\[\]"]/g, '').split(',').map((f: string) => f.trim()) : [],
            attacks: row.attacks ? JSON.parse(row.attacks) : [],
          };
        }) as Digimon[];

        if (id && !isNaN(Number(id))) {
          const numericId = Number(id);
          const idAsString = numericId.toString();
          const selected = data.find(d => d.id === idAsString); 
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
          <p>Nível: {digimon.level}</p>
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
          🔍 Clique na imagem para ampliar
        </p>

        <div className="section">
          <p className="label">Atributo:</p>
          <div className="badges">
           {digimon.attribute ? (
            digimon.attribute.split(',').map((attr, i) => {
              const displayAttr = attr.trim().toLowerCase() === 'unidentified' ? 'Não identificado' : attr.trim();
              return <span key={i}>{displayAttr}</span>;
            })
          ) : (
            <p>Informação desconhecida</p>
          )}
          </div>
        </div>

        <div className="section">
          <p className="label">Famílias:</p>
          <div className="badges">
            {digimon.family && digimon.family.length > 0 ? (
              digimon.family.map((fam, i) => <span key={i}>{fam}</span>)
            ) : (
              <p>Informação desconhecida</p>
            )}
          </div>
        </div>

        <div className="section">
          <p className="label">Ataques:</p>
          {digimon.attacks && digimon.attacks.length > 0 ? (
            digimon.attacks.map((atk, i) => (
              <div className="attack" key={i}>
                <strong>{atk.name}</strong>: {atk.description}
              </div>
            ))
          ) : (
            <p>Informação desconhecida</p>
          )}
        </div>

        <div className="section">
          <p className="label">Digivoluções Anteriores:</p>
          <div className="evolution-list">
            {digimon.prior_forms && digimon.prior_forms.length > 0 ? (
              digimon.prior_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <p>Informação desconhecida</p>
            )}
          </div>

          <p className="label">Digivoluções Finais:</p>
          <div className="evolution-list">
            {digimon.next_forms && digimon.next_forms.length > 0 ? (
              digimon.next_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <p>Informação desconhecida</p>
            )}
          </div>

          <p className="label">Digivoluções Laterais:</p>
          <div className="evolution-list">
            {digimon.lateral_next_forms && digimon.lateral_next_forms.length > 0 ? (
              digimon.lateral_next_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <p>Informação desconhecida</p>
            )}
          </div>
        </div>

        <div className="section">
          <p className="label">Digifusões:</p>
          <div className="evolution-list">
            {digimon.digifuse_forms && digimon.digifuse_forms.length > 0 ? (
              digimon.digifuse_forms.map((form, i) => <span key={i}>{form}</span>)
            ) : (
              <p>Informação desconhecida</p>
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
