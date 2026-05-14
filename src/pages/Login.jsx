import { useState } from 'react';

function Login({ aluno, setAluno }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function fazerLogin(event) {
    event.preventDefault();
    setMensagem('');

    const resposta = await fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await resposta.json();

    if (resposta.status === 200) {
      setAluno(data.aluno);
      setMensagem(data.message);
    } else {
      setMensagem(data.error);
    }
  }

  async function fazerLogout() {
    await fetch('/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setAluno(null);
    setMensagem('Logout realizado');
  }

  return (
    <section className="page-section page-card narrow-section">
      <div className="section-heading">
        <h2>Login</h2>
      </div>

      {aluno && (
        <div className="box account-card">
          <p>
            Logado como <strong>{aluno.nome}</strong>
          </p>
          <strong className="role-pill">
            {aluno.is_admin ? 'Administrador' : 'Aluno'}
          </strong>
          <button className="button-secondary" onClick={fazerLogout}>
            Sair
          </button>
        </div>
      )}

      {!aluno && (
        <form className="panel-form" onSubmit={fazerLogin}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>

          <button>Entrar</button>
        </form>
      )}

      {mensagem && <p className="mensagem form-message">{mensagem}</p>}
    </section>
  );
}

export default Login;
