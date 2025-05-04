import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8000/api/v1/quadras/'; 

const QuadraCrud = () => {
  const [quadras, setQuadras] = useState([]);
  const [form, setForm] = useState({ nome: '', endereco: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchQuadras();
  }, []);

  const fetchQuadras = async () => {
    const response = await api.get(API_URL);
    setQuadras(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`${API_URL}${editId}/`, form);
      } else {
        await api.post(API_URL, form);
      }
      setForm({ nome: '', endereco: '' });
      setEditId(null);
      fetchQuadras();
    } catch (error) {
      console.error('Erro ao salvar quadra:', error);
    }
  };

  const handleEdit = (quadra) => {
    setForm({ nome: quadra.nome, endereco: quadra.endereco });
    setEditId(quadra.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      await api.delete(`${API_URL}${id}/`);
      fetchQuadras();
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Quadras</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome da quadra"
          value={form.nome}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="endereco"
          placeholder="Localização"
          value={form.endereco}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="endereco"
          placeholder="Localização"
          value={form.endereco}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {editId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <ul className="space-y-3">
        {quadras.map((quadra) => (
          <li key={quadra.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <strong>{quadra.nome}</strong> — {quadra.endereco}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(quadra)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(quadra.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuadraCrud;
