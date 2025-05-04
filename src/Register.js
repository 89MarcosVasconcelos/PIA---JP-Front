import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://52.1.79.163/api/v1/register/', { username, password });
      alert("Usuário criado com sucesso!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erro ao registrar');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center">Registre-se</h2>
        <form onSubmit={handleRegister}>
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
            Registrar
          </button>
        </form>

        <p className="text-center mt-2">
          Já tem conta? <Link to="/">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
