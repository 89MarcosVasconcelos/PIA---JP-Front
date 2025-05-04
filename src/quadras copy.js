const fetchQuadras = async () => {
    const token = localStorage.getItem('access_token');
  
    try {
      const response = await axios.get('http://localhost:8000/api/quadras/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao buscar quadras', error);
    }
  };
  