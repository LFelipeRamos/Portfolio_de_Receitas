import { useEffect, useState } from 'react';

function ReceitaForm({
  aluno,
  receitaEditando,
  setReceitaEditando,
  recarregar,
}) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkExterno, setLinkExterno] = useState('');
  const [categoriaIds, setCategoriaIds] = useState([]);
  const [alunoIds, setAlunoIds] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  function alternarSelecao(lista, valor) {
    if (lista.includes(valor)) {
      return lista.filter((item) => item !== valor);
    }

    return [...lista, valor];
  }

  async function carregarDados() {
    const respostaCategorias = await fetch('/categorias');
    const dataCategorias = await respostaCategorias.json();

    if (respostaCategorias.status === 200) {
      setCategorias(dataCategorias);
    }

    const respostaAlunos = await fetch('/alunos', {
      credentials: 'include',
    });
    const dataAlunos = await respostaAlunos.json();

    if (respostaAlunos.status === 200) {
      setAlunos(dataAlunos);
    }
  }

  async function salvarReceita(event) {
    event.preventDefault();
    setMensagem('');

    let url = '/receitas';
    let metodo = 'POST';

    if (receitaEditando) {
      url = `/receitas/${receitaEditando.id}`;
      metodo = 'PUT';
    }

    const resposta = await fetch(url, {
      method: metodo,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        descricao,
        link_externo: linkExterno,
        categorias: categoriaIds,
        alunos: alunoIds,
      }),
    });

    const data = await resposta.json();

    if (resposta.status === 201 || resposta.status === 200) {
      setNome('');
      setDescricao('');
      setLinkExterno('');
      setCategoriaIds([]);
      setAlunoIds([]);
      setReceitaEditando(null);
      setMensagem(receitaEditando ? 'Receita atualizada' : 'Receita criada');
      recarregar();
    } else {
      setMensagem(data.error);
    }
  }

  useEffect(() => {
    if (aluno) {
      carregarDados();
    }
  }, [aluno]);

  useEffect(() => {
    if (receitaEditando) {
      setNome(receitaEditando.nome);
      setDescricao(receitaEditando.descricao);
      setLinkExterno(receitaEditando.link_externo);
      setCategoriaIds(
        (receitaEditando.Categoria || receitaEditando.Categorias || []).map(
          (categoria) => categoria.id,
        ),
      );
      setAlunoIds((receitaEditando.Alunos || []).map((aluno) => aluno.id));
    }
  }, [receitaEditando]);

  if (!aluno) {
    return (
      <section className="page-section page-card narrow-section">
        <h2>Nova receita</h2>
        <p>Faça login para cadastrar receitas.</p>
      </section>
    );
  }

  return (
    <section className="page-section page-card narrow-section">
      <div className="section-heading">
        <h2>{receitaEditando ? 'Editar receita' : 'Nova receita'}</h2>
      </div>

      <form className="panel-form" onSubmit={salvarReceita}>
        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>

        <label>
          Descrição
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        <label>
          Link externo
          <input
            value={linkExterno}
            onChange={(e) => setLinkExterno(e.target.value)}
          />
        </label>

        <fieldset className="choice-group">
          <legend>Categorias</legend>
          <div className="choice-list">
            {categorias.map((categoria) => (
              <label className="choice-item" key={categoria.id}>
                <input
                  type="checkbox"
                  checked={categoriaIds.includes(categoria.id)}
                  onChange={() =>
                    setCategoriaIds(alternarSelecao(categoriaIds, categoria.id))
                  }
                />
                <span />
                {categoria.nome}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="choice-group">
          <legend>Alunos responsáveis</legend>
          <div className="choice-list">
            {alunos.map((aluno) => (
              <label className="choice-item" key={aluno.id}>
                <input
                  type="checkbox"
                  checked={alunoIds.includes(aluno.id)}
                  onChange={() =>
                    setAlunoIds(alternarSelecao(alunoIds, aluno.id))
                  }
                />
                <span />
                {aluno.nome}
              </label>
            ))}
          </div>
        </fieldset>

        <button>
          {receitaEditando ? 'Atualizar receita' : 'Salvar receita'}
        </button>
      </form>

      {mensagem && <p className="mensagem form-message">{mensagem}</p>}
    </section>
  );
}

export default ReceitaForm;
