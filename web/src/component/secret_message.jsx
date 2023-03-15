import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';

const SecretMessage = () => {
  const [apiData, setApiData] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        '/secret-message/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': true,
            Authorization: 'Bearer ' + localStorage.accessToken
          },
        })
      if (response) {
        console.log("response", response);
        setApiData(response.data)
      }
    }
    catch (e) {
      console.log('error', e)
    }
   
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <>
      <Header />
      <div>
        <div>{apiData.name}</div>
        <div>{apiData.message}</div>
      </div>
    </>
  );
}

export default SecretMessage;
