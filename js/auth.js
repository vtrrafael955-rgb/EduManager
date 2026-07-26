// =======================================
// EduManager - Auth (Sem One Tap / Sem FedCM)
// =======================================

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
        return null;
    }
}

function handleCredentialResponse(response) {
    const token = response.credential;
    if (token) {
        const user = decodeJWT(token);
        if (user) {
            fazerLoginNaSessao(user.name, user.email, user.picture);
        }
    }
}

function fazerLoginNaSessao(nome, email, foto) {
    const userData = {
        nome: nome || "Usuário",
        email: email || "usuario@edumanager.com",
        foto: foto || "https://via.placeholder.com/40"
    };

    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "dashboard.html";
}

function entrarModoDireto() {
    fazerLoginNaSessao("Professor / Gestor", "gestor@edumanager.com", "https://via.placeholder.com/40");
}

window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts) {
        try {
            // Inicializa SEM FedCM e SEM auto_select
            google.accounts.id.initialize({
                client_id: "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: false,
                auto_select: false
            });

            // Renderiza apenas o botão físico
            google.accounts.id.renderButton(
                document.getElementById("googleLoginBtn"),
                {
                    theme: "outline",
                    size: "large",
                    type: "standard"
                }
            );

            // REMOVIDO: google.accounts.id.prompt(); 
            // Apagar essa linha elimina a mensagem de "exponential cool down" e NetworkError!
        } catch (e) {
            console.log("Erro Auth:", e);
        }
    }
};
