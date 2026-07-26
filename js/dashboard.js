// =======================================
// EduManager - Dashboard & Autenticação
// =======================================

const dashboard = {

    eventos: [],
    turmas: [],
    categorias: [],
    opcoes: [],

    iniciar() {
        // 1. Checa se o usuário tá logado e coloca foto/nome no topo
        this.verificarAutenticacao();
        
        // 2. Atualiza a tela
        this.atualizarCards();
        this.carregarEventos();
    },

    verificarAutenticacao() {
        // Busca os dados do usuário salvos pelo auth.js
        const userStr = localStorage.getItem("eduManagerUser");

        // Se NÃO estiver logado, redireciona de volta para o login (Proteção de Rota)
        if (!userStr) {
            window.location.href = "login.html";
            return;
        }

        // Se estiver logado, preenche os dados do Google na tela
        const user = JSON.parse(userStr);
        
        const elNome = document.getElementById("userName");
        const elEmail = document.getElementById("userEmail");
        const elFoto = document.getElementById("userPhoto");

        if (elNome) elNome.textContent = user.nome;
        if (elEmail) elEmail.textContent = user.email;
        if (elFoto) elFoto.src = user.foto;
    },

    atualizarCards() {
        const elEventos = document.getElementById("eventos");
        const elParticipantes = document.getElementById("participantes");
        const elTurmas = document.getElementById("turmas");
        const elOpcoes = document.getElementById("opcoes");

        if (elEventos) elEventos.textContent = this.eventos.length;
        if (elParticipantes) elParticipantes.textContent = 0;
        if (elTurmas) elTurmas.textContent = this.turmas.length;
        if (elOpcoes) elOpcoes.textContent = this.opcoes.length;
    },

    carregarEventos() {
        const tbody = document.getElementById("listaEventos");

        if (!tbody) return;

        tbody.innerHTML = "";

        if (this.eventos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        Nenhum evento cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        this.eventos.forEach((evento) => {
            tbody.innerHTML += `
                <tr>
                    <td>${evento.nome}</td>
                    <td>${evento.inicio}</td>
                    <td>${evento.fim}</td>
                    <td>
                        <span class="badge bg-success">
                            ${evento.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary">
                            Editar
                        </button>
                    </td>
                </tr>
            `;
        });
    }

};

// Função global acionada pelo botão "Sair"
function logout() {
    localStorage.removeItem("eduManagerUser");
    window.location.href = "login.html";
}

window.onload = () => {
    dashboard.iniciar();
};
