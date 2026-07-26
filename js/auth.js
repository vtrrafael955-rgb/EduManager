// =======================================
// EduManager - Google Auth Handler
// =======================================

window.handleCredentialResponse = function(response) {
    if (!response || !response.credential) {
        alert("Erro ao receber as credenciais do Google.");
        return;
    }

    const tokenPayload = parseJwt(response.credential);

    const userData = {
        nome: tokenPayload.name || "Utilizador",
        email: tokenPayload.email || "",
        foto: tokenPayload.picture || "https://via.placeholder.com/40"
    };

    // Guarda os dados na sessão e redireciona para o Dashboard oficial
    localStorage.setItem("eduManagerUser", JSON.stringify(userData));
    window.location.href = "/dashboard.html";
};

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Falha ao decodificar token JWT:", e);
        return {};
    }
};
