import React, { useEffect, useState } from "react";
import type { Digimon } from "../types/Digimon";
import Papa from "papaparse";
import "../css/DigimonCard.css";

type Props = {
  digimon: Digimon;
};

const DigimonCard: React.FC<Props> = ({ digimon }) => {
    const [digivolutions, setDigivolutions] = useState<Digimon[]>([]);

    useEffect(() => {
        Papa.parse("/ingame_digimons.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: Digimon[]; }) => {
            const allDigimons = results.data as Digimon[];
            const nextForms = digimon.next_forms ?? [];
            const evols: Digimon[] = allDigimons.filter((d) =>
            nextForms.includes(d.name)
            );

            setDigivolutions(evols);
        },
        error: (err: unknown) => console.error("Erro ao carregar CSV:", err),
        });
    }, [digimon]);

    return (
        <>
            <div className="tcg-card">
            <div className="tcg-header">
                <h1 className='card-title'> DIGIMON </h1>
                <div className="digimon-card-id">
                    {digimon.id ? `#${digimon.id.toString().padStart(3, "0")}` : "??"}
                </div>
            </div>

            <div className="tcg-image">
                <img
                src={`/${digimon.image.replace(/^\/?/, "")}`}
                alt={digimon.name}
                draggable={false}
                />
            </div>

            <div className="tcg-info">
                <div className="digicard-name-details">
                    <div className="name">{digimon.name}</div>
                    <p className="description">
                    {digimon.description || "Still being analyzed..."}
                </p>
                </div>

                <div className="details">
                    <div className="digicard-level">
                        {digimon.level && <span>{digimon.level}</span>}
                    </div>
                    {digimon.attribute &&
                    digimon.attribute.split(" / ").map((attr, index) => (
                        <span key={index}>| {attr.trim()}</span>
                    ))
                    }
                </div>

                <div className="attacks-detail">
                    <p className="digi-attack-label">Attacks</p>
                    <div className="digi-attack-list">
                    {digimon.attacks?.length ? 
                        digimon.attacks.slice(0, 2).map((atk, i) => (
                        <span key={i} className="attack-badge">{atk}</span>
                        )) 
                        : <span className="unknown-badge">Unknown</span>}
                    </div>
                </div>
            </div>
        </div>

        {/* Seção Digivolutions */}
        {digivolutions.length > 0 && (
            <div className="digivolutions-section">
                <h2>Digivolutions</h2>
                <div className="digivolutions-list">
                    {digivolutions.map((evo) => (
                        <a key={evo.id} href={`/digimon/${evo.id}`}>
                            <img
                                src={`/digimons_images/${evo.image}`}
                                alt={evo.name}
                                className="digivolution-image"
                            />
                            <p>{evo.name}</p>
                        </a>
                    ))}
                </div>
            </div>
        )}
        </>
    );
};

export default DigimonCard;
