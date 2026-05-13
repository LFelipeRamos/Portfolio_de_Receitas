import { useEffect, useState } from 'react';

function Receitas({ aluno, recarregar, editarReceita }) {
  const [receitas, setReceitas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [comentarios, setComentarios] = useState({});
  const [receitaComentando, setReceitaComentando] = useState(null);
  const [nomeComentario, setNomeComentario] = useState('');
  const [textoComentario, setTextoComentario] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function carregarReceitas() {
    let url = '/receitas';

    if (categoriaId) {
      url = `/receitas/categoria/${categoriaId}`;
    }

    const resposta = await fetch(url, {
      credentials: 'include',
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      setReceitas(data);
      setMensagem('');
    } else {
      setReceitas([]);
      setMensagem(data.error);
    }
  }

  async function carregarCategorias() {
    const resposta = await fetch('/categorias');
    const data = await resposta.json();

    if (resposta.status === 200) {
      setCategorias(data);
    }
  }

  async function apagarReceita(id) {
    if (!confirm('Deseja excluir esta receita?')) {
      return;
    }

    const resposta = await fetch(`/receitas/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      carregarReceitas();
    } else {
      setMensagem(data.error);
    }
  }

  async function carregarComentarios(receitaId) {
    const resposta = await fetch(`/comentarios/receita/${receitaId}`);
    const data = await resposta.json();

    if (resposta.status === 200) {
      const novosComentarios = {
        ...comentarios,
      };

      novosComentarios[receitaId] = data;
      setComentarios(novosComentarios);
    }
  }

  async function carregarTodosComentarios() {
    const novosComentarios = {};

    for (const receita of receitas) {
      const resposta = await fetch(`/comentarios/receita/${receita.id}`);
      const data = await resposta.json();

      if (resposta.status === 200) {
        novosComentarios[receita.id] = data;
      }
    }

    setComentarios(novosComentarios);
  }

  async function salvarComentario(event, receitaId) {
    event.preventDefault();

    const resposta = await fetch('/comentarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receita_id: receitaId,
        nome: nomeComentario,
        texto: textoComentario,
      }),
    });

    const data = await resposta.json();

    if (resposta.status === 201) {
      setNomeComentario('');
      setTextoComentario('');
      setReceitaComentando(null);
      carregarComentarios(receitaId);
    } else {
      setMensagem(data.error);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarReceitas();
  }, [categoriaId, recarregar]);

  useEffect(() => {
    carregarTodosComentarios();
  }, [receitas]);

  return (
    <section>
      <h2>Receitas</h2>

      <label>
        Filtrar por categoria
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </label>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="lista">
        {receitas.map((receita) => (
          <div className="box" key={receita.id}>
            <h3>{receita.nome}</h3>
            <p>{receita.descricao}</p>
            <a href={receita.link_externo} target="_blank">
              Link externo
            </a>

            <p>
              Categorias:{' '}
              {(receita.Categoria || receita.Categorias || [])
                .map((categoria) => categoria.nome)
                .join(', ') || 'sem categoria'}
            </p>

            <p>
              Responsáveis:{' '}
              {(receita.Alunos || []).map((aluno) => aluno.nome).join(', ') ||
                'sem aluno'}
            </p>

            {aluno && (
              <>
                <button onClick={() => editarReceita(receita)}>Editar</button>
                <button onClick={() => apagarReceita(receita.id)}>
                  Excluir
                </button>
              </>
            )}

            <div className="comentarios">
              <h4>Comentários</h4>

              {(comentarios[receita.id] || []).map((comentario) => (
                <p key={comentario._id}>
                  <strong>{comentario.nome}:</strong> {comentario.texto}
                </p>
              ))}

              {receitaComentando !== receita.id && (
                <button onClick={() => setReceitaComentando(receita.id)}>
                  Comentar
                </button>
              )}

              {receitaComentando === receita.id && (
                <form onSubmit={(e) => salvarComentario(e, receita.id)}>
                  <input
                    placeholder="Seu nome"
                    value={nomeComentario}
                    onChange={(e) => setNomeComentario(e.target.value)}
                  />
                  <textarea
                    placeholder="Comentário"
                    value={textoComentario}
                    onChange={(e) => setTextoComentario(e.target.value)}
                  />
                  <button>Salvar comentário</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Receitas;
