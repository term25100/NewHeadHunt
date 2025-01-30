import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from 'react-router-dom';
import { Header } from './header';
import { Vacancy } from './Pages/vacancy';
import { Home } from './Pages/home';
function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vacancy" element={<Vacancy />} />
      </Routes>
    </Router>
  );
}

export default App;
