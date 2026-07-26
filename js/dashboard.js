// =======================================
// EduManager - Dashboard Controller
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
            window.location.href = "/login.html";
            return false;
        }

        try {
            this.user = JSON.parse(userStr);
            this.dataKey = "eduData_" + (this.user.email || "default");

            const elNome = document.getElementById("userName");
            const elEmail = document.getElementById("userEmail");
            const elFoto = document.getElementById("userPhoto");

            if (elNome) elNome.textContent = this.user.nome || "Utilizador";
            if (elEmail) elEmail.textContent = this.user.email || "";
            if (elFoto && this.user.foto) elFoto.src = this.user.foto;

            return true;
        } catch (e) {
            localStorage.removeItem("eduManagerUser");
            window.location.href = "/login.html";
            return false;
        }
    },

    carregarDadosLocais() {
        if (!this.dataKey) return;
        const dadosSalvos = localStorage.getItem(this.dataKey);
        if (dadosSalvos) {
            try {
                const parsed = JSON.parse(dadosSalvos);
                this.eventos = parsed.eventos || [];
                this.turmas = parsed.turmas || [];
                this.participantes = parsed.participantes || [];
            } catch (err) {
                console.error("Erro ao ler dados locais:", err);
            }
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
                    <td colspan="5" class="text-center py-4 text-muted">Nenhum evento cadastrado. Clique em "Novo Evento" para começar.</td>
                </tr>
            `;
            return;
        }

        this.eventos.forEach((evento, index) => {
            let badgeClass = "bg-secondary";
            if (evento.status === "Aberto") badgeClass = "bg-success";
            if (evento.status === "Fechado") badgeClass = "bg-danger";
            if (evento.status === "Rascunho") badgeClass = "bg-warning text-dark";

            tbody.innerHTML += `
                <tr>
                    <td>
                        <span class="fw-bold d-block">${evento.nome}</span>
                        <small class="text-muted">${evento.descricao || 'Sem descrição'}</small>
                    </td>
                    <td>${evento.inicio}</td>
                    <td>${evento.fim}</td>
                    <td><span class="badge ${badgeClass}">${evento.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="dashboard.excluirEvento(${index})">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    },

    adicionarEvento(nome, descricao, inicio, fim, status) {
        const novoEvento = {
            id: Date.now(),
            nome,
            descricao,
            inicio,
            fim,
            status
        };

        this.eventos.push(novoEvento);
        this.salvarDadosLocais();
        this.atualizarCards();
        this.carregarEventos();
    },

    excluirEvento(index) {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
            this.eventos.splice(index, 1);
            this.salvarDadosLocais();
            this.atualizarCards();
            this.carregarEventos();
        }
    },

    baixarRelatorio() {
        if (this.eventos.length === 0) {
            alert("Não existem eventos cadastrados para exportar.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Nome do Evento;Descricao;Data Inicio;Data Fim;Status\n";

        this.eventos.forEach(ev => {
            csvContent += `"${ev.nome}";"${ev.descricao || ''}";"${ev.inicio}";"${ev.fim}";"${ev.status}"\n`;
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
    window.location.href = "/login.html";
}

window.onload = () => {
    dashboard.iniciar();
};
