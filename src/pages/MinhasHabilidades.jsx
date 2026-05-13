import { useEffect, useState } from 'react';

function MinhasHabilidades({ aluno }) {
  const [habilidades, setHabilidades] = useState([]);
  const [alunoHabilidades, setAlunoHabilidades] = useState([]);
  const [habilidadeId, setHabilidadeId] = useState('');
  const [nivel, setNivel] = useState(0);
  const [mensagem, setMensagem] = useState('');

  async function carregar() {
    const respostaHabilidades = await fetch('/habilidades');
    const dataHabilidades = await respostaHabilidades.json();

    if (respostaHabilidades.status === 200) {
      setHabilidades(dataHabilidades);
    }

    const respostaAlunoHabilidades = await fetch('/aluno-habilidades', {
      credentials: 'include',
    });
    const dataAlunoHabilidades = await respostaAlunoHabilidades.json();

    if (respostaAlunoHabilidades.status === 200) {
      setAlunoHabilidades(dataAlunoHabilidades);
    }
  }

  async function salvar(event) {
    event.preventDefault();

    const resposta = await fetch('/aluno-habilidades', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aluno_id: aluno.id,
        habilidade_id: Number(habilidadeId),
        nivel: Number(nivel),
      }),
    });

    const data = await resposta.json();

    if (resposta.status === 201) {
      setMensagem('Habilidade adicionada');
      carregar();
    } else {
      setMensagem(data.error);
    }
  }

  async function atualizar(item, novoNivel) {
    const resposta = await fetch(
      `/aluno-habilidades/${item.aluno_id}/${item.habilidade_id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nivel: Number(novoNivel) }),
      },
    );

    const data = await resposta.json();

    if (resposta.status === 200) {
      carregar();
    } else {
      setMensagem(data.error);
    }
  }

  async function apagar(item) {
    const resposta = await fetch(
      `/aluno-habilidades/${item.aluno_id}/${item.habilidade_id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );

    const data = await resposta.json();

    if (resposta.status === 200) {
      setMensagem('Habilidade removida');
      carregar();
    } else {
      setMensagem(data.error);
    }
  }

  function nomeHabilidade(id) {
    const habilidade = habilidades.find((item) => item.id === id);

    if (habilidade) {
      return habilidade.nome;
    }

    return id;
  }

  useEffect(() => {
    if (aluno) {
      carregar();
    }
  }, [aluno]);

  if (!aluno) {
    return (
      <section>
        <h2>Minhas habilidades</h2>
        <p>Faça login para editar suas habilidades.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Minhas habilidades</h2>

      <form onSubmit={salvar}>
        <label>
          Habilidade
          <select
            value={habilidadeId}
            onChange={(e) => setHabilidadeId(e.target.value)}
          >
            <option value="">Selecione</option>
            {habilidades.map((habilidade) => (
              <option key={habilidade.id} value={habilidade.id}>
                {habilidade.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nível
          <input
            type="number"
            min="0"
            max="10"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          />
        </label>

        <button>Adicionar</button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="lista">
        {alunoHabilidades.map((item) => (
          <div className="box" key={`${item.aluno_id}-${item.habilidade_id}`}>
            <strong>{nomeHabilidade(item.habilidade_id)}</strong>
            <input
              type="number"
              min="0"
              max="10"
              defaultValue={item.nivel}
              onBlur={(e) => atualizar(item, e.target.value)}
            />
            <button onClick={() => apagar(item)}>Excluir</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MinhasHabilidades;
