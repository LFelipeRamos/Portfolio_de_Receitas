import { useEffect, useState } from 'react';

function Admin({ aluno, recarregar }) {
  const [alunos, setAlunos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const [nomeAluno, setNomeAluno] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [senhaAluno, setSenhaAluno] = useState('');
  const [alunoAdmin, setAlunoAdmin] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [editarNomeAluno, setEditarNomeAluno] = useState('');
  const [editarEmailAluno, setEditarEmailAluno] = useState('');
  const [editarAlunoAdmin, setEditarAlunoAdmin] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [nomeHabilidade, setNomeHabilidade] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [editarNomeCategoria, setEditarNomeCategoria] = useState('');
  const [habilidadeEditando, setHabilidadeEditando] = useState(null);
  const [editarNomeHabilidade, setEditarNomeHabilidade] = useState('');

  async function carregar() {
    const respostaAlunos = await fetch('/alunos', {
      credentials: 'include',
    });
    const dataAlunos = await respostaAlunos.json();

    if (respostaAlunos.status === 200) {
      setAlunos(dataAlunos);
    }

    const respostaCategorias = await fetch('/categorias');
    const dataCategorias = await respostaCategorias.json();

    if (respostaCategorias.status === 200) {
      setCategorias(dataCategorias);
    }

    const respostaHabilidades = await fetch('/habilidades');
    const dataHabilidades = await respostaHabilidades.json();

    if (respostaHabilidades.status === 200) {
      setHabilidades(dataHabilidades);
    }
  }

  async function criarAluno(event) {
    event.preventDefault();

    const resposta = await fetch('/alunos', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nomeAluno,
        email: emailAluno,
        senha: senhaAluno,
        is_admin: alunoAdmin,
      }),
    });

    const data = await resposta.json();

    if (resposta.status === 201) {
      setNomeAluno('');
      setEmailAluno('');
      setSenhaAluno('');
      setAlunoAdmin(false);
      setMensagem('Aluno criado');
      carregar();
    } else {
      setMensagem(data.error);
    }
  }

  async function criarCategoria(event) {
    event.preventDefault();

    const resposta = await fetch('/categorias', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: nomeCategoria }),
    });

    const data = await resposta.json();

    if (resposta.status === 201) {
      setNomeCategoria('');
      setMensagem('Categoria criada');
      carregar();
      recarregar();
    } else {
      setMensagem(data.error);
    }
  }

  async function criarHabilidade(event) {
    event.preventDefault();

    const resposta = await fetch('/habilidades', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: nomeHabilidade }),
    });

    const data = await resposta.json();

    if (resposta.status === 201) {
      setNomeHabilidade('');
      setMensagem('Habilidade criada');
      carregar();
    } else {
      setMensagem(data.error);
    }
  }

  async function apagar(url) {
    const resposta = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      setMensagem('Registro excluído');
      carregar();
      recarregar();
    } else {
      setMensagem(data.error);
    }
  }

  function abrirEditarAluno(item) {
    setAlunoEditando(item.id);
    setEditarNomeAluno(item.nome);
    setEditarEmailAluno(item.email);
    setEditarAlunoAdmin(item.is_admin);
  }

  async function atualizarAluno(event) {
    event.preventDefault();

    if (!editarNomeAluno || !editarEmailAluno) {
      return;
    }

    const resposta = await fetch(`/alunos/${alunoEditando}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: editarNomeAluno,
        email: editarEmailAluno,
        is_admin: editarAlunoAdmin,
      }),
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      setAlunoEditando(null);
      setEditarNomeAluno('');
      setEditarEmailAluno('');
      setEditarAlunoAdmin(false);
      setMensagem('Aluno atualizado');
      carregar();
    } else {
      setMensagem(data.error);
    }
  }

  function abrirEditarCategoria(item) {
    setCategoriaEditando(item.id);
    setEditarNomeCategoria(item.nome);
  }

  function abrirEditarHabilidade(item) {
    setHabilidadeEditando(item.id);
    setEditarNomeHabilidade(item.nome);
  }

  async function atualizarCategoria(event) {
    event.preventDefault();

    if (!editarNomeCategoria) {
      return;
    }

    const resposta = await fetch(`/categorias/${categoriaEditando}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: editarNomeCategoria }),
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      setCategoriaEditando(null);
      setEditarNomeCategoria('');
      setMensagem('Categoria atualizada');
      carregar();
      recarregar();
    } else {
      setMensagem(data.error);
    }
  }

  async function atualizarHabilidade(event) {
    event.preventDefault();

    if (!editarNomeHabilidade) {
      return;
    }

    const resposta = await fetch(`/habilidades/${habilidadeEditando}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: editarNomeHabilidade }),
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      setHabilidadeEditando(null);
      setEditarNomeHabilidade('');
      setMensagem('Registro atualizado');
      carregar();
      recarregar();
    } else {
      setMensagem(data.error);
    }
  }

  useEffect(() => {
    if (aluno?.is_admin) {
      carregar();
    }
  }, [aluno]);

  if (!aluno?.is_admin) {
    return (
      <section>
        <h2>Admin</h2>
        <p>Faça login como administrador.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Admin</h2>
      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="colunas">
        <div className="box">
          <h3>Alunos</h3>
          <form onSubmit={criarAluno}>
            <input
              placeholder="Nome"
              value={nomeAluno}
              onChange={(e) => setNomeAluno(e.target.value)}
            />
            <input
              placeholder="Email"
              value={emailAluno}
              onChange={(e) => setEmailAluno(e.target.value)}
            />
            <input
              placeholder="Senha"
              value={senhaAluno}
              onChange={(e) => setSenhaAluno(e.target.value)}
            />
            <label className="checkbox">
              <input
                type="checkbox"
                checked={alunoAdmin}
                onChange={(e) => setAlunoAdmin(e.target.checked)}
              />
              Administrador
            </label>
            <button>Criar aluno</button>
          </form>

          {alunos.map((item) => (
            <div key={item.id}>
              <p>
                {item.nome} {item.is_admin ? '(admin)' : ''}
                <button onClick={() => abrirEditarAluno(item)}>Editar</button>
                <button onClick={() => apagar(`/alunos/${item.id}`)}>
                  Excluir
                </button>
              </p>

              {alunoEditando === item.id && (
                <form onSubmit={atualizarAluno}>
                  <input
                    placeholder="Nome"
                    value={editarNomeAluno}
                    onChange={(e) => setEditarNomeAluno(e.target.value)}
                  />
                  <input
                    placeholder="Email"
                    value={editarEmailAluno}
                    onChange={(e) => setEditarEmailAluno(e.target.value)}
                  />
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={editarAlunoAdmin}
                      onChange={(e) => setEditarAlunoAdmin(e.target.checked)}
                    />
                    Administrador
                  </label>
                  <button>Salvar</button>
                </form>
              )}
            </div>
          ))}
        </div>

        <div className="box">
          <h3>Categorias</h3>
          <form onSubmit={criarCategoria}>
            <input
              placeholder="Nome"
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(e.target.value)}
            />
            <button>Criar categoria</button>
          </form>

          {categorias.map((item) => (
            <div key={item.id}>
              <p>
                {item.nome}
                <button onClick={() => abrirEditarCategoria(item)}>
                  Editar
                </button>
                <button onClick={() => apagar(`/categorias/${item.id}`)}>
                  Excluir
                </button>
              </p>

              {categoriaEditando === item.id && (
                <form onSubmit={atualizarCategoria}>
                  <input
                    placeholder="Nome"
                    value={editarNomeCategoria}
                    onChange={(e) => setEditarNomeCategoria(e.target.value)}
                  />
                  <button>Salvar</button>
                </form>
              )}
            </div>
          ))}
        </div>

        <div className="box">
          <h3>Habilidades</h3>
          <form onSubmit={criarHabilidade}>
            <input
              placeholder="Nome"
              value={nomeHabilidade}
              onChange={(e) => setNomeHabilidade(e.target.value)}
            />
            <button>Criar habilidade</button>
          </form>

          {habilidades.map((item) => (
            <div key={item.id}>
              <p>
                {item.nome}
                <button onClick={() => abrirEditarHabilidade(item)}>
                  Editar
                </button>
                <button onClick={() => apagar(`/habilidades/${item.id}`)}>
                  Excluir
                </button>
              </p>

              {habilidadeEditando === item.id && (
                <form onSubmit={atualizarHabilidade}>
                  <input
                    placeholder="Nome"
                    value={editarNomeHabilidade}
                    onChange={(e) => setEditarNomeHabilidade(e.target.value)}
                  />
                  <button>Salvar</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Admin;
