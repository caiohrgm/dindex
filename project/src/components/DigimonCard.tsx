// import type { Digimon } from "../types/Digimon";

// export function DigimonCard({ digimon }: { digimon: Digimon }) {
//   return (
//     <div className="card">
//       <img src={digimon.image} alt={digimon.name} />
//       <h2>{digimon.name}</h2>
//       <p><strong>Nível:</strong> {digimon.level}</p>
//       <p><strong>Atributo:</strong> {digimon.attribute}</p>
//       <p><strong>Família:</strong> {digimon.family}</p>

//       <p><strong>Ataques:</strong></p>
//       <ul>
//         {digimon.attacks?.map((attack, index) => (
//           <li key={index}>
//             <strong>{attack.name}</strong>: {attack.description}
//           </li>
//         )) ?? <li>Nenhum ataque disponível</li>}
//       </ul>
//     </div>
//   );
// }
