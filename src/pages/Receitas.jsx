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

  function podeAlterarReceita(receita) {
    if (!aluno) {
      return false;
    }

    if (aluno.is_admin) {
      return true;
    }

    return (receita.Alunos || []).some(
      (responsavel) => responsavel.id === aluno.id,
    );
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
    <section className="page-section page-card">
      <div className="section-heading">
        <h2>Receitas</h2>

        <label className="filter-control">
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
      </div>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="recipe-grid">
        {receitas.map((receita) => (
          <article className="recipe-card" key={receita.id}>
            <div className="recipe-card__header">
              <h3>{receita.nome}</h3>

              {receita.link_externo && (
                <a
                  className="external-link"
                  href={receita.link_externo}
                  target="_blank"
                >
                  Abrir fonte
                </a>
              )}
            </div>

            <p className="recipe-description">{receita.descricao}</p>

            <div className="meta-list">
              <div>
                <span>Categorias</span>
                <strong>
                  {(receita.Categoria || receita.Categorias || [])
                    .map((categoria) => categoria.nome)
                    .join(', ') || 'Sem categoria'}
                </strong>
              </div>

              <div>
                <span>Responsáveis</span>
                <strong>
                  {(receita.Alunos || [])
                    .map((aluno) => aluno.nome)
                    .join(', ') || 'Sem aluno'}
                </strong>
              </div>
            </div>

            {podeAlterarReceita(receita) && (
              <div className="actions-row">
                <button
                  className="button-secondary"
                  onClick={() => editarReceita(receita)}
                >
                  Editar
                </button>
                <button
                  className="button-danger"
                  onClick={() => apagarReceita(receita.id)}
                >
                  Excluir
                </button>
              </div>
            )}

            <div className="comentarios">
              <div className="comments-heading">
                <h4>Comentários</h4>
                <span>{(comentarios[receita.id] || []).length}</span>
              </div>

              <div className="comments-list">
                {(comentarios[receita.id] || []).map((comentario) => (
                  <p key={comentario._id}>
                    <strong>{comentario.nome}</strong>
                    <span>{comentario.texto}</span>
                  </p>
                ))}
              </div>

              {receitaComentando === receita.id ? (
                <form
                  className="comment-form"
                  onSubmit={(e) => salvarComentario(e, receita.id)}
                >
                  <label>
                    Nome
                    <input
                      placeholder="Seu nome"
                      value={nomeComentario}
                      onChange={(e) => setNomeComentario(e.target.value)}
                    />
                  </label>
                  <label>
                    Comentário
                    <textarea
                      placeholder="Escreva seu comentário"
                      value={textoComentario}
                      onChange={(e) => setTextoComentario(e.target.value)}
                    />
                  </label>
                  <div className="actions-row">
                    <button>Publicar comentário</button>
                    <button
                      className="button-quiet"
                      type="button"
                      onClick={() => setReceitaComentando(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="comment-trigger"
                  onClick={() => setReceitaComentando(receita.id)}
                >
                  Adicionar comentário
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Receitas;
