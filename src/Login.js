import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/o/token/', new URLSearchParams({
        grant_type: 'password',
        username,
        password,
        client_id: 'pFyMBEN5EtMJqpmXJ5OzeDsAm5sRO0ITeWNJJtjg',
        client_secret: 't82J0uzLByoXqT2bTL4MEck0O38mWF5uzJJl1yD0vPvofZzIYdnugp2zN46MA4mXFX1iZQRk376V7dUFZX59aZTYqfN9sYEjhCp9gXTM4en6N812jLQLP0teN7yJGicC',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      const accessToken = response.data.access_token;
      setToken(accessToken);
      localStorage.setItem('access_token', accessToken);

      // Armazenar id
      const userId = response.data.id;
      localStorage.setItem('id', userId);

      // Armazenar username
      const username_auth = response.data.username;
      localStorage.setItem('username', username_auth);

      try {
        const checkResponse = await axios.get(`http://52.54.221.143:8000/api/v1/usuariopagocheckregister/${userId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (checkResponse.data == '') {
          console.log(checkResponse.data);
          navigate('/formulariousuario');
        } else {
          console.log('n vazio');
          navigate('/agenda');
        }
      } catch (error) {
        alert('Usuário não encontrado');
        console.error('Erro ao consultar registro', error);
      }

     // navigate('/home');
      
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer login. Verifique usuário e senha.' + error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>

        <p className="text-center mt-2">
          Não tem conta? <Link to="/register">Registre-se</Link>
        </p>
      </div>
    </div>
  );
};


export default Login;
