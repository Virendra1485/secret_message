import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Header from './header';

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:"|;'\\<>?,./~])/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Signup = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    validationSchema.validate(formData, { abortEarly: false })
      .then(() => {
        _postfunc(formData).then(
        )
      })
      .catch(

        (errors) => {
          const newErrors = {};
          errors.inner.forEach((error) => {
            newErrors[error.path] = error.message;
          }
          )
          setFormErrors(newErrors)
        }
      )
  }
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const _postfunc = async () => {

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': true
      }
    }
    const res = await axios.post("/sign-up/", JSON.stringify(formData), config)
      if (res.status === 201) {
      navigate('/sign-in')
    }
  }
  return (
    <>
      <Header />
      <div className='container mt-5'>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className='col-md-3'>
              <div className="form-group mt-3">
                <label htmlFor="firstName">First Name:</label>
              </div>

            </div>
            <div className='col-md-3'>
              <div className="form-group mt-3">
                <input type="text" className="form-control" id="firstName" name="first_name" onChange={handleChange} />
              </div>
            </div>
            {formErrors.first_name && <div className="error text-danger">{formErrors.first_name}</div>}
          </div>
          <div className='row'>
            <div className='col-md-3'>
              <div className="form-group mt-3">
                <label htmlFor="lastName">Last Name:</label>
              </div>

            </div>
            <div className='col-md-3'>
              <div className="form-group mt-3">
                <input type="text" onChange={handleChange} className="form-control" id="lastName" name="last_name" />
              </div>
            </div>
            {formErrors.last_name && <div className="error text-danger">{formErrors.last_name}</div>}
          </div>
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
              <button type="submit" className="btn btn-primary mt-3" onClick={() => handleSubmit()}>Sign Up</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
