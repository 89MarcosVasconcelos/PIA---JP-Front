import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MeusDados = () => {
    const [formData, setFormData] = useState({
        id_pessoa: '',
        id_usuario_pago: '',
        nome: '',
        cpf: '',
        telefone: '',
        celular: '',
        preco_hora: '',
        endereco: '',
        disponivel: '0'
    });
    const [nomeUsuario, setNomeUsuario] = useState('');

    const [errors, setErrors] = useState({});

    const maskCPF = (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    };

    const maskPhone = (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    };

    const maskMobile = (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    useEffect(() => {
        const fetchData = async () => {
        const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                window.location.replace('/');
            }
            const userId = localStorage.getItem('id');
            try {
                const checkResponse = await axios.get(`http://127.0.0.1:8000/api/v1/usuariopagocheckregister/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = checkResponse.data[0];
                setNomeUsuario(checkResponse.data[0]?.nome || "Usuário");

                setFormData({
                    id_pessoa: userId,
                    id_usuario_pago: data.id_usuario_pago,
                    nome: data.nome,
                    cpf: maskCPF(data.cpf || ''),
                    telefone: maskPhone(data.telefone || ''),
                    celular: maskMobile(data.celular || ''),
                    preco_hora: data.preco_hora,
                    endereco: data.endereco,
                    disponivel: data.disponivel ? '0' : '1'
                });
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:' + error, error);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        window.location.href = '/'; // ou a rota da sua página de login
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') {
            formattedValue = maskCPF(value);
        } else if (name === 'telefone') {
            formattedValue = maskPhone(value);
        } else if (name === 'celular') {
            formattedValue = maskMobile(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('access_token');

        try {
            await axios.patch(`http://127.0.0.1:8000/api/v1/usuariopago/${formData.id_usuario_pago}/`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert('Dados atualizados com sucesso!');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            //console.error('Erro ao atualizar os dados:' , error);
            alert('Erro ao atualizar os dados.');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* Logo / Nome do Sistema */}
                    <a className="navbar-brand" href="#">SIP</a>

                    {/* Botão de Menu Mobile */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Itens do Menu */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">  {/* Itens alinhados à esquerda */}
                            <li className="nav-item">
                                <a className="nav-link active" href="./agenda">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/meusdados">Meus Dados</a>
                            </li>
                        </ul>

                        <ul className="navbar-nav ms-auto">  {/* Itens alinhados à direita */}
                            <li className="nav-item">
                                <a className="nav-link text-white">Olá, {nomeUsuario}</a>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-danger nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        <div className="container mt-5">
            <h2 className="mb-4">Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id_pessoa" value={formData.id_pessoa} />
                <input type="hidden" name="id_usuario_pago" value={formData.id_usuario_pago} />
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
                            <label htmlFor="cpf" className="form-label">CPF</label>
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
                            <label htmlFor="telefone" className="form-label">Telefone</label>
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
                            <label htmlFor="celular" className="form-label">Celular</label>
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
                            <label htmlFor="preco_hora" className="form-label">Preço por Hora</label>
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
        </div>
    );
};

export default MeusDados;
