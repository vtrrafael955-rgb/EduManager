// =======================================
// EduManager - Dashboard (Local Storage)
// =======================================

const dashboard = {
    user: null,
    dataKey: "",

    eventos: [],
    turmas: [],
    participantes: [],

    iniciar() {
        if (!this.verificarAutenticacao()) return;
        this.carregarDadosLocais();
        this.atualizarCards();
        this.carregarEventos();
    },

    verificarAutenticacao() {
        const userStr = localStorage.getItem("eduManagerUser");
        
        if (!userStr) {
            // Se não estiver logado, redireciona para login
            window.location.href = "login.html";
            return false;
        }

        try {
            this.user = JSON.parse(userStr);
            this.dataKey = "eduData_" + (this.user.email || "default");

            // Atualiza os dados no ecran
            const elNome = document.getElementById("userName");
            const elEmail = document.getElementById("userEmail");
            const elFoto = document.getElementById("userPhoto");

            if (elNome) elNome.textContent = this.user.nome || "Utilizador";
            if (elEmail) elEmail.textContent = this.user.email || "";
            if (elFoto && this.user.foto) elFoto.src = this.user.foto;

            return true;
        } catch (e) {
            localStorage.removeItem("eduManagerUser");
            window.location.href = "login.html";
            return false;
        }
    },

    carregarDadosLocais() {
        if (!this.dataKey) return;
        const dadosSalvos = localStorage.getItem(this.dataKey);
        if (dadosSalvos) {
            const parsed = JSON.parse(dadosSalvos);
            this.eventos = parsed.eventos || [];
            this.turmas = parsed.turmas || [];
            this.participantes = parsed.participantes || [];
        }
    },

    salvarDadosLocais() {
        if (!this.dataKey) return;
        const payload = {
            eventos: this.eventos,
            turmas: this.turmas,
            participantes: this.participantes
        };
        localStorage.setItem(this.dataKey, JSON.stringify(payload));
    },

    atualizarCards() {
        const elEventos = document.getElementById("eventos");
        const elParticipantes = document.getElementById("participantes");
        const elTurmas = document.getElementById("turmas");

        if (elEventos) elEventos.textContent = this.eventos.length;
        if (elParticipantes) elParticipantes.textContent = this.participantes.length;
        if (elTurmas) elTurmas.textContent = this.turmas.length;
    },

    carregarEventos() {
        const tbody = document.getElementById("listaEventos");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (this.eventos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">Nenhum evento cadastrado.</td>
                </tr>
            `;
            return;
        }

        this.eventos.forEach((evento, index) => {
            tbody.innerHTML += `
                <tr>
                    <td class="fw-bold">${evento.nome}</td>
                    <td>${evento.inicio}</td>
                    <td>${evento.fim}</td>
                    <td><span class="badge bg-success">${evento.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="dashboard.excluirEvento(${index})">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    },

    adicionarEvento(nome, inicio, fim, status) {
        this.eventos.push({ nome, inicio, fim, status });
        this.salvarDadosLocais();
        this.atualizarCards();
        this.carregarEventos();
    },

    excluirEvento(index) {
        this.eventos.splice(index, 1);
        this.salvarDadosLocais();
        this.atualizarCards();
        this.carregarEventos();
    },

    baixarRelatorio() {
        if (this.eventos.length === 0) {
            alert("Não possui eventos cadastrados para baixar.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Nome do Evento;Data Inicio;Data Fim;Status\n";

        this.eventos.forEach(ev => {
            csvContent += `"${ev.nome}";"${ev.inicio}";"${ev.fim}";"${ev.status}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Relatorio_Eventos_${(this.user.nome || "Utilizador").replace(/ /g, "_")}.csv`);
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }
};

function logout() {
    localStorage.removeItem("eduManagerUser");
    window.location.href = "login.html";
}

window.onload = () => {
    dashboard.iniciar();
};
