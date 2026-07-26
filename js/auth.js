// =======================================
// EduManager - Auth (Login com Google & Modo Direto)
// =======================================

// Função para decodificar o token JWT do Google
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar token JWT:", e);
        return null;
    }
}

// Callback chamado quando o login do Google é efetuado com sucesso
function handleCredentialResponse(response) {
    const token = response.credential;
    if (token) {
        const user = decodeJWT(token);
        if (user) {
            fazerLoginNaSessao(user.name, user.email, user.picture);
        } else {
            alert("Erro ao ler os dados do utilizador. Tente novamente.");
        }
    } else {
        alert("Falha no login com o Google. Tente novamente.");
    }
}

// Grava as informações do utilizador no localStorage e redireciona para o Dashboard
function fazerLoginNaSessao(nome, email, foto) {
    const userData = {
        nome: nome || "Utilizador",
        email: email || "usuario@edumanager.com",
        foto: foto || "https://via.placeholder.com/40"
    };

    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "dashboard.html";
}

// Entrada alternativa sem passar pelo Google (caso queira testar rapidamente)
function entrarModoDireto() {
    fazerLoginNaSessao("Professor / Gestor", "gestor@edumanager.com", "https://via.placeholder.com/40");
}

// Inicialização do Google Identity Services
window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts) {
        try {
            google.accounts.id.initialize({
                client_id: "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: false // Desativa o bloqueio do FedCM no Chrome
            });

            google.accounts.id.renderButton(
                document.getElementById("googleLoginBtn"),
                {
                    theme: "outline",
                    size: "large"
                }
            );
        } catch (e) {
            console.warn("Aviso na inicialização do Google Auth:", e);
        }
    } else {
        console.error("SDK do Google não foi carregado corretamente.");
    }
};
