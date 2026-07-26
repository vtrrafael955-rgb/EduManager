// =======================================
// EduManager - Auth (Apenas Google Login)
// =======================================

const CLIENT_ID = "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com";

// Função para processar a resposta do token JWT enviado pelo Google
function handleCredentialResponse(response) {
    if (!response.credential) {
        console.error("Erro ao obter credenciais do Google.");
        return;
    }

    // Decodifica o token JWT para extrair os dados do utilizador
    const data = parseJwt(response.credential);

    const userData = {
        nome: data.name,
        email: data.email,
        foto: data.picture
    };

    // Salva a sessão no localStorage
    localStorage.setItem("eduManagerUser", JSON.stringify(userData));

    // Redireciona para o Dashboard (utilizando a raiz do domínio)
    window.location.href = "/dashboard.html";
}

// Função utilitária para decodificar o token JWT do Google no frontend
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        return {};
    }
}

// Renderiza o botão oficial do Google na página assim que o SDK estiver pronto
window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse
        });

        // Renderiza o botão dentro da div #buttonDiv
        const btnContainer = document.getElementById("buttonDiv");
        if (btnContainer) {
            google.accounts.id.renderButton(
                btnContainer,
                { theme: "outline", size: "large", width: "100%" }
            );
        }
    } else {
        console.error("SDK do Google Identity não foi carregado no HTML.");
    }
};
