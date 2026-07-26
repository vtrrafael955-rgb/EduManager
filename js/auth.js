// =======================================
// EduManager - Auth (Pop-up OAuth Directo)
// =======================================

const CLIENT_ID = "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com";
let tokenClient;

// Função para buscar dados do perfil do usuário na API do Google
async function buscarPerfilGoogle(accessToken) {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = await response.json();
        
        if (user && user.email) {
            fazerLoginNaSessao(user.name, user.email, user.picture);
        } else {
            alert("Não foi possível obter os dados do perfil.");
        }
    } catch (error) {
        console.error("Erro ao buscar perfil do Google:", error);
        alert("Erro ao conectar com o Google.");
    }
}

// Salva a sessão no LocalStorage e vai para o Dashboard
function fazerLoginNaSessao(nome, email, foto) {
    const userData = {
        nome: nome || "Usuário",
        email: email || "usuario@edumanager.com",
        foto: foto || "https://via.placeholder.com/40"
    };

    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "dashboard.html";
}

// Botão de login direto (Sem o Google)
function entrarModoDireto() {
    fazerLoginNaSessao("Professor / Gestor", "gestor@edumanager.com", "https://via.placeholder.com/40");
}

// Disparado ao clicar no botão do Google
function iniciarLoginGoogle() {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        alert("O serviço de login do Google ainda está carregando. Tente novamente em alguns segundos.");
    }
}

// Inicializa o cliente OAuth por Pop-up
window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: (response) => {
                if (response.access_token) {
                    buscarPerfilGoogle(response.access_token);
                }
            }
        });
    }
};
