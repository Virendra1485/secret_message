import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import Header from './header';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Signin = () => {
  const localStorge = window.localStorage;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSignInClick = (event) => {
    event.preventDefault();
    validationSchema.validate(formData, { abortEarly: false })
      .then(() => {
        _postfunc(formData).then(
          (res) => {
          }
        )
      })
      .catch((errors) => {
        const newErrors = {};
        errors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        }
        )
        setFormErrors(newErrors)
      }

      )
  }
  const _postfunc = async () => {
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': true
      }
    }
    const res = await axios.post("/sign-in/", JSON.stringify(formData), config)
    if (res.status === 200) {
      localStorge.setItem('accessToken', res.data.access);
      localStorge.setItem('refreshToken', res.data.refresh);
      navigate('/')
    } else {
      navigate('/sign-in')
    }
  }
  const handleCreateAccount = () => {
    navigate("/sign-up")
  }
  return (
    <>
      <Header />
      <div className='container mt-5'>
        <h1>Sign In</h1>
        <div>
          <form>
            <div className='row'>
              <div className='col-md-3'>
                <div className="form-group mt-3">
                  <label htmlFor="email">Email:</label>
                </div>

              </div>
              <div className='col-md-3'>
                <div className="form-group mt-3">
                  <input type="email" onChange={handleChange} className="form-control" id="email" name="email" />
                </div>
              </div>
              {formErrors.email && <div className="error text-danger">{formErrors.email}</div>}
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className="form-group mt-3">
                  <label htmlFor="password">Password:</label>
                </div>

              </div>
              <div className='col-md-3'>
                <div className="form-group mt-3">
                  <input type="password" onChange={handleChange} className="form-control" id="password" name="password" />
                </div>
              </div>
              {formErrors.password && <div className="error text-danger">{formErrors.password}</div>}
            </div>
            <div className='row'>
              <div className='col-md-6 mt-3'>
                <button type="submit" className="btn btn-primary mt-3" onClick={handleSignInClick}>Sign In</button>
              </div>
            </div>
          </form>
        </div>
        <div className='row'>
          <div className='col-md-6 mt-3'>
            <button type="submit" className="btn btn-primary mt-3" onClick={handleCreateAccount}>Create new account</button>
          </div>
        </div>

      </div>

    </>
  );
}

export default Signin;
