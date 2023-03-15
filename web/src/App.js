import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './component/signin.jsx';
import Resetpassword from './component/reset_password.jsx';
import Signup from './component/signup.jsx';
import Home from './component/home.jsx';
import SecretMessage from './component/secret_message.jsx';
import { setupAxiosInterceptors } from './core/axios';


function App() {
  setupAxiosInterceptors();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/secret-message" element={<SecretMessage />} />
        <Route path="/reset-password" element={<Resetpassword />} />
      </Routes>
    </Router>
  );
}

export default App;
