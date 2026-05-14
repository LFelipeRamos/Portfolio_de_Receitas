import { useEffect, useState } from 'react';

function Relatorio() {
  const [relatorio, setRelatorio] = useState([]);
  const [mensagem, setMensagem] = useState('');

  async function carregar() {
    const resposta = await fetch('/habilidades/relatorio');
    const data = await resposta.json();

    if (resposta.status === 200) {
      setRelatorio(data);
    } else {
      setMensagem(data.error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <section className="page-section page-card">
      <div className="section-heading">
        <h2>Relatório de habilidades</h2>
      </div>
      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Habilidade</th>
              <th>Alunos</th>
              <th>Percentual</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.total_alunos}</td>
                <td>
                  <strong>{Number(item.percentual).toFixed(1)}%</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Relatorio;
