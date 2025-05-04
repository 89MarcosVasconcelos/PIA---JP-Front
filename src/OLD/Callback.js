import React, { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const Callback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const code_verifier = localStorage.getItem('code_verifier');

    const fetchToken = async () => {
      try {
        const response = await axios.post('http://localhost:8000/o/token/',
          new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://localhost:3000/callback',
            client_id: 'AK1j33k2wqYse1TPi2QftCvLKPrGzrrGPFG60bVp',
            code_verifier: code_verifier,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        localStorage.setItem('access_token', response.data.access_token);
        alert("Login realizado com sucesso!");
      } catch (err) {
        console.error("Erro ao obter token:", err.response?.data || err.message);
      }
    };

    if (code && code_verifier) {
      fetchToken();
    } else {
      console.warn("Código ou code_verifier ausente.");
    }
  }, [searchParams]);

  return <div>Processando login...</div>;
};

export default Callback;
