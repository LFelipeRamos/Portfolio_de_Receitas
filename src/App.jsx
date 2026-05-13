import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Receitas from './pages/Receitas';
import ReceitaForm from './pages/ReceitaForm';
import Admin from './pages/Admin';
import MinhasHabilidades from './pages/MinhasHabilidades';
import Relatorio from './pages/Relatorio';
import './App.css';

function App() {
  const [pagina, setPagina] = useState('receitas');
  const [aluno, setAluno] = useState(null);
  const [recarregar, setRecarregar] = useState(0);
  const [receitaEditando, setReceitaEditando] = useState(null);

  function mudarPagina(novaPagina) {
    setPagina(novaPagina);
  }

  function atualizarListas() {
    setRecarregar(recarregar + 1);
  }

  function editarReceita(receita) {
    setReceitaEditando(receita);
    setPagina('novaReceita');
  }

  function novaReceita() {
    setReceitaEditando(null);
    setPagina('novaReceita');
  }

  useEffect(() => {
    async function buscarAluno() {
      const resposta = await fetch('/me', {
        credentials: 'include',
      });

      const data = await resposta.json();

      if (resposta.status === 200) {
        setAluno(data.aluno);
      }
    }

    buscarAluno();
  }, []);

  return (
    <div>
      <header>
        <h1>Portfólio de Receitas</h1>
        <p>Receitas cadastradas pelos alunos</p>
      </header>

      <nav>
        <button onClick={() => mudarPagina('receitas')}>Receitas</button>
        <button onClick={() => mudarPagina('relatorio')}>Relatório</button>
        <button onClick={() => mudarPagina('login')}>Login</button>
        <button onClick={novaReceita}>Nova receita</button>
        <button onClick={() => mudarPagina('habilidades')}>
          Minhas habilidades
        </button>
        <button onClick={() => mudarPagina('admin')}>Admin</button>
      </nav>

      <main>
        {pagina === 'receitas' && (
          <Receitas
            aluno={aluno}
            recarregar={recarregar}
            editarReceita={editarReceita}
          />
        )}

        {pagina === 'relatorio' && <Relatorio />}

        {pagina === 'login' && <Login aluno={aluno} setAluno={setAluno} />}

        {pagina === 'novaReceita' && (
          <ReceitaForm
            aluno={aluno}
            receitaEditando={receitaEditando}
            setReceitaEditando={setReceitaEditando}
            recarregar={atualizarListas}
          />
        )}

        {pagina === 'habilidades' && <MinhasHabilidades aluno={aluno} />}

        {pagina === 'admin' && (
          <Admin aluno={aluno} recarregar={atualizarListas} />
        )}
      </main>
    </div>
  );
}

export default App;
