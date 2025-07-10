import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DigimonDetail from './pages/DigimonDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/digimon/:id" element={<DigimonDetail />} />
    </Routes>
  )
}

export default App
