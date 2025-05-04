import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5';
import $ from 'jquery';
import 'datatables.net';

const AgendaUsuarioPago = () => {
    const [agenda, setAgenda] = useState([]);
    const [idUsuarioPago, setIdUsuarioPago] = useState(null);
    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('id');
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                window.location.replace('/');
            }

            try {
                const checkResponse = await axios.get(`http://52.54.221.143:8000/api/v1/usuariopagocheckregister/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const id_pago = checkResponse.data[0]?.id_usuario_pago;
                setNomeUsuario(checkResponse.data[0]?.nome || "Usuário");

                
                setIdUsuarioPago(id_pago);
                
                const agendaResponse = await axios.get(`http://52.54.221.143:8000/api/v1/agendausuariopago/${id_pago}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                setAgenda(agendaResponse.data);


                // Inicializar DataTable após carregar os dados
                setTimeout(() => {
                    $('#agendaTable').DataTable();
                }, 100);
            } catch (error) {
                console.error('Erro ao buscar dados da agenda:', error);
            }
        };

        fetchData();
    }, []);

    function formatarData(dataISO) {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    }



    const handleConfirmacao = async (id, data_hora_inicio, data_hora_fim) => {
        if (!id || !data_hora_inicio || !data_hora_fim) {
            alert("Erro: Campos obrigatórios faltando.");
            return;
        }

        const accessToken = localStorage.getItem('access_token');

        try {
            await axios.patch(`http://52.54.221.143:8000/api/v1/agendausuariopago/${id}/`, {
                aceitar: '0',
                data_hora_inicio,
                data_hora_fim
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            alert("Confirmação realizada com sucesso.");
            window.location.reload();
            setAgenda(prevAgenda =>
                prevAgenda.map(item => item.id === id ? { ...item, aceitar: true } : item)
            );
        } catch (error) {
            alert("Erro ao confirmar " );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        
        window.location.href = '/'; // ou a rota da sua página de login
    };


    const handleNaoConfirmacao = async (id) => {
        const accessToken = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://52.54.221.143:8000/api/v1/agendausuariopago/${id}/`,  {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert('Solicitação cancelada com sucesso.');
            window.location.reload();
        } catch (error) {
            alert('Erro ao cancelar: ' );
        }
    };

    return (
        <div>
            {/* Menu */}
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

            {/* Tabela */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Agenda</h2>
                <div className="table-responsive">
                    <table id="agendaTable" className="table table-striped">
                        <thead>
                            <tr>
                                <th>Solicitação</th>
                                <th>Data Início</th>
                                <th>Data Fim</th>
                                <th>Confirmação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agenda.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.compromisso}</td>
                                    <td>{formatarData(item.data_hora_inicio)}</td>
                                    <td>{formatarData(item.data_hora_fim)}</td>
                                    <td>
                                        {item.aceitar ? (
                                            <button className="btn btn-success btn-sm" >Confirmado</button>
                                        ) : (
                                            <>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleConfirmacao(item.id_agenda, item.data_hora_inicio, item.data_hora_fim)}>
                                                    Confirmar 
                                                    </button>&nbsp;&nbsp;

                                                    <button className="btn btn-danger btn-sm" onClick={() => handleNaoConfirmacao(item.id_agenda)}>
                                                    Excluir
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgendaUsuarioPago;
