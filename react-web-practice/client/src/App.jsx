import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Componets/Navbar/Navbar';
import Home from "./Pages/Home/Home";
import Login from './Pages/Login/Login';
import Profile from './Pages/Profile/Profile';
import Register from './Pages/Register/Register';
import { UserProvider } from './Componets/UserContext/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App;