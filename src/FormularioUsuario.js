import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const FormularioUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        id_pessoa: '',
        cpf: '',
        celular: '',
        telefone: '',
        endereco: '',
        precoHora: '',
        disponivel: '0'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem('id');
        setFormData(prev => ({ ...prev, id_pessoa: userId }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Máscara de CPF
        if (name === 'cpf') {
            let formattedValue = value.replace(/\D/g, ''); // Remove tudo que não é número
            if (formattedValue.length <= 11) {
                formattedValue = formattedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            }
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }

        // Máscara de telefone
        else if (name === 'telefone') {
            let formattedValue = value.replace(/\D/g, ''); // Remove tudo que não é número
            if (formattedValue.length <= 10) {
                formattedValue = formattedValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
            }
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        // Máscara de telefone
        else if (name === 'celular') {
            let formattedValue = value.replace(/\D/g, ''); // Remove tudo que não é número
            if (formattedValue.length <= 11) {
                formattedValue = formattedValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            }
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        // Máscara de celular
        else if (name === 'precoHora') {
            let rawValue = value.replace(/\D/g, ''); // Remove tudo que não é número

            if (rawValue === '') {
                setFormData(prev => ({ ...prev, [name]: '' }));
                return;
            }

            // Garante pelo menos 3 dígitos
            rawValue = rawValue.padStart(3, '0');

            const cents = rawValue.slice(-2);
            const integer = rawValue.slice(0, -2);

            const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            const formattedValue = `${formattedInteger},${cents}`;

            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        

        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }


        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const requiredFields = ['nome', 'id_pessoa', 'cpf', 'celular', 'disponivel'];
        const newErrors = {};
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} é um campo obrigatório, preencha por favor.`;
            }
        });
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Token de autenticação não encontrado.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/usuariopago/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                
                alert('Cadastro realizado com sucesso!');
                setFormData({
                    nome: '',
                    id_pessoa: localStorage.getItem('id'),
                    cpf: '',
                    celular: '',
                    telefone: '',
                    endereco: '',
                    precoHora: '',
                    disponivel: '0',
                });
                // Redireciona após 2 segundos
                setTimeout(() => {
                    navigate('/agenda');
                }, 2000);
            } else {
                const errorData = await response.json();
                console.log(errorData);
                alert('Erro ao cadastrar: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
            console.log(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id_pessoa" value={formData.id_pessoa} />

                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input
                            type="text"
                            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            maxLength="150"
                            required
                        />
                        {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                    </div>



                    <div className="col-md-6">
                        <label htmlFor="cpf">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            className="form-control"
                            maxLength={14}
                            value={formData.cpf}
                            onChange={handleChange}
                            placeholder="Digite o CPF"
                            required
                        />
                        {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="telefone">Telefone:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="telefone"
                            name="telefone"
                            maxLength={14}
                            value={formData.telefone}
                            onChange={handleChange}
                            placeholder="Digite o telefone"
                        />
                        {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="celular">Celular:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="celular"
                            name="celular"
                            maxLength={15}
                            value={formData.celular}
                            onChange={handleChange}
                            placeholder="Digite o celular"
                            required
                        />
                        {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="precoHora">Preço por Hora:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="preco_hora"
                            name="preco_hora"
                            value={formData.preco_hora}
                            onChange={handleChange}
                            placeholder="Digite o preço por hora"
                            required
                        />
                        {errors.preco_hora && <div className="invalid-feedback">{errors.preco_hora}</div>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="endereco" className="form-label">Endereço</label>
                        <input
                            type="text"
                            className="form-control"
                            id="endereco"
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="disponivel" className="form-label">Disponibilidade</label>
                        <select
                            className={`form-select ${errors.disponivel ? 'is-invalid' : ''}`}
                            id="disponivel"
                            name="disponivel"
                            value={formData.disponivel}
                            onChange={handleChange}
                        >
                            <option value="0">Sim</option>
                            <option value="1">Não</option>
                        </select>
                        {errors.disponivel && <div className="invalid-feedback">{errors.disponivel}</div>}
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Salvar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormularioUsuario;
