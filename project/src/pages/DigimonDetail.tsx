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
      complete: (results: { data: Digimon[]; }) => {
        const data = results.data as Digimon[];
        const selected = data[parseInt(id ?? "0")];
        setDigimon(selected);
      }
    });
  }, [id]);


  if (!digimon) return <p>Carregando...</p>;

  return (
    <>
      <div id="back-home-button" className="back-button">
        <Link to="/" className="btn-back">← Voltar à Home</Link>
      </div>

      <div className="card">
        <div className="header">
          <h1>{digimon.name}</h1>
          <p>Nível: {digimon.level}</p>
        </div>

        <img
          className="digimon-image"
          src={digimon.image}
          alt={digimon.name}
          onClick={openModal}
          style={{ cursor: "pointer" }}
        />
        {modalOpen && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            <img
              className="modal-content"
              src={digimon.image}
              alt={digimon.name}
              onClick={(e) => e.stopPropagation()} // pra clicar na imagem não fechar
            />
          </div>
        )}

        <div className="section">
          <p className="label">Atributo:</p>
          <div className="badges">
            {digimon.attribute ? (
              digimon.attribute.split(',').map((attr, i) => (
                <span key={i}>{attr.trim()}</span>
              ))
            ) : (
              <p>Informação desconhecida</p>
            )}
          </div>
        </div>

        {/* Adicione aqui os outros campos como família, ataques, evoluções, etc. */}
      </div>

      {/* Modal da imagem se quiser */}
    </>
  );
}

export default DigimonDetail;

