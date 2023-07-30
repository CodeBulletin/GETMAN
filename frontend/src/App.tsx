import { Route, Routes } from 'react-router-dom'
import './App.scss'
import Home from './Home'
import Workspace from './Workspace'
// import MenuBar from './components/Navbar/Navbar'

function App() {
  return (
    <>
      {/* <MenuBar /> */}
      <Routes>
        <Route path="/" element = {
          <Home />
        } />
        <Route path="/workspaces" element = {
          <Workspace />
        }/>
      </Routes>
    </>
  )
}

export default App
