// =======================================
// EduManager - Auth (Redirecionamento Absoluto)
// =======================================

const CLIENT_ID = "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com";
let tokenClient;

// Redireciona com barra inicial para garantir que vai para a raiz do site no Vercel
function fazerLoginNaSessao(nome, email, foto) {
    const userData = {
        nome: nome || "Utilizador",
        email: email || "usuario@edumanager.com",
        foto: foto || "https://via.placeholder.com/40"
    };

    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    // USAR /dashboard.html (A barra garante que vai para a raiz do Vercel)
    window.location.href = "/dashboard.html";
}

// Tornar a função global para o botão HTML encontrar sempre
window.entrarModoDireto = function() {
    fazerLoginNaSessao("Professor / Gestor", "gestor@edumanager.com", "https://via.placeholder.com/40");
};

// Tornar o login do Google global
window.iniciarLoginGoogle = function() {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        // Se o SDK do Google falhar ou demorar, entra em modo de segurança
        window.entrarModoDireto();
    }
};

async function buscarPerfilGoogle(accessToken) {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = await response.json();
        
        if (user && user.email) {
            fazerLoginNaSessao(user.name, user.email, user.picture);
        } else {
            window.entrarModoDireto();
        }
    } catch (error) {
        console.error("Erro no Google:", error);
        window.entrarModoDireto();
    }
}

window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                callback: (response) => {
                    if (response.access_token) {
                        buscarPerfilGoogle(response.access_token);
                    }
                }
            });
        } catch(e) {
            console.warn("Erro ao iniciar cliente Google Auth");
        }
    }
};
