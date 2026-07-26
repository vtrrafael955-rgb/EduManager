// =======================================
// EduManager - Dashboard
// =======================================

const dashboard = {

    eventos: [],
    turmas: [],
    categorias: [],
    opcoes: [],

    iniciar() {

        this.atualizarCards();
        this.carregarEventos();

    },

    atualizarCards() {

        document.getElementById("eventos").textContent = this.eventos.length;
        document.getElementById("participantes").textContent = 0;
        document.getElementById("turmas").textContent = this.turmas.length;
        document.getElementById("opcoes").textContent = this.opcoes.length;

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

        this.eventos.forEach((evento, index) => {

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

window.onload = () => {

    dashboard.iniciar();

};
