import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkflowPage from './pages/WorkflowPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/workflow/:id" element={<WorkflowPage />} />
    </Routes>
  )
}