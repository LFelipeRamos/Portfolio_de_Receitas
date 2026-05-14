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
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Portfólio de Receitas</h1>
          <p>Receitas, habilidades e contribuições organizadas por alunos.</p>
        </div>

        <div className="user-status">
          <strong>{aluno ? aluno.nome : 'Visitante'}</strong>
          <span>
            {aluno?.is_admin ? 'Administrador' : aluno ? 'Aluno' : 'Sem login'}
          </span>
        </div>
      </header>

      <nav className="app-nav" aria-label="Navegação principal">
        <button
          className={pagina === 'receitas' ? 'active' : ''}
          onClick={() => mudarPagina('receitas')}
        >
          Receitas
        </button>
        <button
          className={pagina === 'novaReceita' ? 'active' : ''}
          onClick={novaReceita}
        >
          Nova receita
        </button>
        <button
          className={pagina === 'habilidades' ? 'active' : ''}
          onClick={() => mudarPagina('habilidades')}
        >
          Minhas habilidades
        </button>
        <button
          className={pagina === 'relatorio' ? 'active' : ''}
          onClick={() => mudarPagina('relatorio')}
        >
          Relatório
        </button>
        <button
          className={pagina === 'admin' ? 'active' : ''}
          onClick={() => mudarPagina('admin')}
        >
          Admin
        </button>
        <button
          className={pagina === 'login' ? 'active' : ''}
          onClick={() => mudarPagina('login')}
        >
          Login
        </button>
      </nav>

      <main className="app-main">
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
