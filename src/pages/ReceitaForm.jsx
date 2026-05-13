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

  function pegarValoresSelecionados(event) {
    return Array.from(event.target.selectedOptions).map((option) =>
      Number(option.value),
    );
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
      <section>
        <h2>Nova receita</h2>
        <p>Faça login para cadastrar receitas.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>{receitaEditando ? 'Editar receita' : 'Nova receita'}</h2>

      <form onSubmit={salvarReceita}>
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

        <label>
          Categorias
          <select
            multiple
            value={categoriaIds.map(String)}
            onChange={(e) => setCategoriaIds(pegarValoresSelecionados(e))}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Alunos responsáveis
          <select
            multiple
            value={alunoIds.map(String)}
            onChange={(e) => setAlunoIds(pegarValoresSelecionados(e))}
          >
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>
        </label>

        <button>Salvar</button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}
    </section>
  );
}

export default ReceitaForm;
