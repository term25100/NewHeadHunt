import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './header';
import { Vacancy_List } from './Pages/vacancy_list';
import { Vacation } from './Pages/vacancy';
import { Home } from './Pages/home';
import { Profile_List } from './Pages/profile';
import { Sign_In } from './Pages/sign_in';
import { Sign_Up } from './Pages/sign_up';
import { User_Room } from './Pages/user_room';
import { Profile_Card } from './Pages/profile_card';
import { User_vacations } from './Pages/user_vacations';
import { User_profiles } from './Pages/user_profiles';
import { Career } from './Pages/career_advice';

function AppContent() {
  const location = useLocation();
  

  const pathsWithoutHeader = ['/sign_in', '/sign_up', '/user_room']; 

  const shouldShowHeader = !pathsWithoutHeader.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route 
          path="/" 
          element={<Home />} 
        />

        <Route 
          path="/vacancy_list" 
          element={<Vacancy_List />} 
        />

        <Route 
          path="/vacation/:vacationId" 
          element={<Vacation />} 
        />

        <Route 
          path="/profiles"
          element={<Profile_List />} 
        />

        <Route 
          path="/sign_in"
          element={<Sign_In />} 
        />

        <Route 
          path="/sign_up"
          element={<Sign_Up />} 
        />

        <Route 
          path="/user_room" 
          element={<User_Room activeTab="vacancy"/>} 
        />

        <Route 
          path="/user_vacations/:userId" 
          element={<User_vacations />} 
        />

        <Route 
          path="/user_profiles/:userId" 
          element={<User_profiles />} 
        />

        <Route
          path='/profile/:profileId'
          element={<Profile_Card />}
        />

        <Route 
          path='/career_advices' 
          element={<Career />} 
        />
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