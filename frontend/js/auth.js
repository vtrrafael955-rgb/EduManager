// =======================================
// EduManager - Auth (Sem falhas de carregamento)
// =======================================

// A função precisa ser global (window) para o HTML do Google conseguir ativá-la
window.handleCredentialResponse = function(response) {
    if (!response.credential) {
        alert("Erro ao obter credenciais do Google.");
        return;
    }

    // Decodifica o token para pegar nome, email e foto
    const data = parseJwt(response.credential);

    const userData = {
        nome: data.name || "Utilizador",
        email: data.email || "",
        foto: data.picture || "https://via.placeholder.com/40"
    };

    // Guarda no navegador e atira para o Dashboard
    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "dashboard.html";
};

// Descriptografa o código JWT que o Google envia
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
