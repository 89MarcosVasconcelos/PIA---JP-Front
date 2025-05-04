import React, { useEffect, useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [quadras, setQuadras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuadras = async () => {
      try {
        const response = await api.get('agendausuariopago/');
        setQuadras(response.data);
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
        if (error.response?.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate('/');
        }
      }
    };

    fetchQuadras();
  }, [navigate]);

  return (
    <div>
      <h2>🏠 Home</h2>
      <nav>
        <button onClick={() => navigate('/')}>Sair</button>
        <button onClick={() => navigate('/quadra')}>Quadra</button>
      </nav>

      <h3>Quadras disponíveis:</h3>
      <ul>
        {quadras.map((q) => (
          <li key={q.id}>
            <strong>{q.nome}</strong> - {q.tipo}
            <br />
            {q.endereco}
            <br />
            {q.preco_hora}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
