import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const _postfunc = async () => {
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': true,
        'Authorization': 'Bearer ' + localStorage.accessToken,
      }
    }

    const res = await axios.post("/sign-out/",JSON.stringify(
      {
        refresh: localStorage.refreshToken
      }
    ), config)
    if (res.status === 200) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/sign-in')
    }
  }
  const handleSignOut = () => {
    _postfunc().then(
      (res) => {
      }
    )
      .catch((error) => {
      });
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark" style={{ height: '80px' }}>
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>Home</Link>
                {

                }
                {localStorage.accessToken ? (
                  <Link to="/secret-message" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', marginLeft: '1rem' }}>Secret Message</Link>
                ) : (
                  <div></div>
                )
                }
              </li>
            </ul>
            {localStorage.accessToken ? (
              <>
                <Link to="/reset-password" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', marginRight: '1rem' }}>Reset Password</Link>
                <Link to="/" onClick={handleSignOut} style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', marginLeft: '1rem' }}>Sign-out</Link>
              </>
            ) : (
              <Link to="/sign-in" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>Sign-in</Link>
            )
            }
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
