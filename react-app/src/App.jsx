import InternDirectory from './components/InternDirectory'
import './App.css'

function App() {
  return (
    <div className="container">
      <div className="header">
        <h1>Intern Portal</h1>
      </div>
      
      {/* Using the InternDirectory component that handles API calls */}
      <InternDirectory />
    </div>
  )
}

export default App