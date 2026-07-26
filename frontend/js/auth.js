// =======================================
// EduManager - Auth (Final)
// =======================================

// Recebe a resposta do Google assim que o usuário clicar e aprovar
window.handleCredentialResponse = function(response) {
    if (!response.credential) {
        alert("Erro ao obter credenciais do Google.");
        return;
    }

    // Lê os dados que vêm encriptados do Google
    const data = parseJwt(response.credential);

    const userData = {
        nome: data.name || "Usuário do Google",
        email: data.email || "",
        foto: data.picture || "https://via.placeholder.com/40"
    };

    // Guarda a sessão e força o navegador para a raiz do Dashboard no Vercel
    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "/dashboard.html";
};

// Desencriptador de JWT padrão
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        return {};
    }
}

// O botão azul chama esta função para você nunca ficar preso de fora do sistema
window.entrarModoDireto = function() {
    const userData = {
        nome: "Professor (Modo Teste)",
        email: "teste@edumanager.com",
        foto: "https://via.placeholder.com/40"
    };
    
    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "/dashboard.html";
};
