import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './header';
import { Vacancy } from './Pages/vacancy';
import { Home } from './Pages/home';
import { Profile } from './Pages/profile';
import { Sign_In } from './Pages/sign_in';
import { Sign_Up } from './Pages/sign_up';
function AppContent() {
  const location = useLocation();
  

  const pathsWithoutHeader = ['/sign_in', '/sign_up']; 

  const shouldShowHeader = !pathsWithoutHeader.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vacancy" element={<Vacancy />} />
        <Route path="/profiles" element={<Profile />} />
        <Route path="/sign_in" element={<Sign_In />} />
        <Route path="/sign_up" element={<Sign_Up />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;