// =======================================
// EduManager - Auth (Login do Google + Fallback)
// =======================================

// Decodifica o token JWT enviado pelo Google
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
        console.error("Erro ao decodificar JWT:", e);
        return null;
    }
}

// Trata a resposta enviada pelo Google
function handleCredentialResponse(response) {
    const token = response.credential;
    if (token) {
        const user = decodeJWT(token);
        if (user) {
            fazerLoginNaSessao(user.name, user.email, user.picture);
        } else {
            alert("Erro ao ler dados do usuário.");
        }
    } else {
        alert("Falha no login com Google.");
    }
}

// Registra os dados no localStorage e redireciona
function fazerLoginNaSessao(nome, email, foto) {
    const userData = {
        nome: nome || "Usuário",
        email: email || "usuario@edumanager.com",
        foto: foto || "https://via.placeholder.com/40"
    };

    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "dashboard.html";
}

// Botão de acesso direto (Modo Convidado / Teste)
function entrarModoDireto() {
    fazerLoginNaSessao("Professor / Gestor", "gestor@edumanager.com", "https://via.placeholder.com/40");
}

// Inicialização do SDK do Google
window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts) {
        try {
            google.accounts.id.initialize({
                client_id: "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: false, // Desativa o prompt automáticos FedCM
                auto_select: false
            });

            google.accounts.id.renderButton(
                document.getElementById("googleLoginBtn"),
                {
                    theme: "outline",
                    size: "large",
                    type: "standard"
                }
            );
        } catch (e) {
            console.warn("Aviso ao inicializar Google Auth:", e);
        }
    }
};
