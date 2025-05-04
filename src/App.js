// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './Login';
// import Callback from './Callback';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/callback" element={<Callback />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import QuadraCrud from './QuadrasCrud';
import FormularioUsuario from './FormularioUsuario';
import AgendaUsuarioPago from './AgendaUsuarioPago';
import MeusDados from './MeusDados';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quadra" element={<QuadraCrud />} />
        <Route path="/agenda" element={<AgendaUsuarioPago />} />
        <Route path="/meusdados" element={<MeusDados />} />
        <Route path="/formulariousuario" element={<FormularioUsuario />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
