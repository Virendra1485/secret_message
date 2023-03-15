import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Header from './header';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
//   email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  new_password: Yup.string().required('Please provide new password')
});

const Resetpassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
//     email: "",
    password: "",
    confirm_password: "",
    new_password: ""
  });


  const [formErrors, setformErrors] = useState({
//     email: '',
    password: '',
    confirm_password: "",
    new_password: ""
  });

  const handlePasswordReset = (event) => {
  if (event) {
  event.preventDefault();
  }

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
          setformErrors(newErrors)
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
        'Access-Control-Request-Headers': true,
        'Authorization': 'Bearer ' + localStorage.accessToken,
      }
    }
    const res = await axios.post("/reset-my-password/", JSON.stringify(formData), config)
    if (res.status === 200) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/sign-in')
    }
  }
  return (
    <>
      <Header />
      <div className='container mt-5'>
        <h1>Reset Password</h1>
        <form onSubmit={handlePasswordReset}>
{/*           <div className='row'> */}
{/*             <div className='col-md-3'> */}
{/*               <div className="form-group mt-3"> */}
{/*                 <label htmlFor="email">Email:</label> */}
{/*               </div> */}

{/*             </div> */}
{/*             <div className='col-md-3'> */}
{/*               <div className="form-group mt-3"> */}
{/*                 <input type="email" className="form-control" id="email" name="email" onChange={handleChange} /> */}
{/*               </div> */}
{/*             </div> */}
{/*             {formErrors.email && <div className="error text-danger">{formErrors.email}</div>} */}
{/*           </div> */}
          <div className='row'>
            <div className='col-md-3'>
              <div className="form-group mt-3">
                <label htmlFor="password">Password:</label>
              </div>
            </div>
            <div className='col-md-3'>
              <div className="form-group mt-3">
                <input type="password" className="form-control" id="password" name="password" onChange={handleChange} />
              </div>
            </div>
            {formErrors.password && <div className="error text-danger">{formErrors.password}</div>}
          </div>
          <div className='row mt-3'>
            <div className='col-md-3'>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
              </div>
            </div>
            <div className='col-md-3'>
              <div className="form-group mtFirst Name-3">
                <input type="password" className="form-control" id="confirmPassword" name="confirm_password" onChange={handleChange} />
              </div>
            </div>
            {formErrors.confirm_password && <div className="error text-danger">{formErrors.confirm_password}</div>}
          </div>
          <div className='row mt-3'>
            <div className='col-md-3'>
              <div className="form-group">
                <label htmlFor="newPasswo••••••••rd">New Password:</label>
              </div>

            </div>
            <div className='col-md-3'>
              <div className="form-group">
                <input type="password" className="form-control" id="newPassword" name="new_password" onChange={handleChange} />
              </div>
            </div>
            {formErrors.new_password && <div className="error text-danger">{formErrors.new_password}</div>}
          </div>
          <div className='row'>
            <div className='col-md-6 mt-3'>
              <button type="submit" className="btn btn-primary mt-3" onClick={() => handlePasswordReset()}>Reset Passwords</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );

}

export default Resetpassword;
