// =======================================
// EduManager - Auth (Login com Google)
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
        console.error("Erro ao decodificar token JWT:", e);
        return null;
    }
}

function handleCredentialResponse(response) {
    const token = response.credential;

    if (token) {
        const user = decodeJWT(token);

        if (user) {
            const userData = {
                nome: user.name || "Utilizador",
                email: user.email || "",
                foto: user.picture || "https://via.placeholder.com/40"
            };

            // Guarda a sessão no navegador
            localStorage.setItem("eduManagerUser", JSON.stringify(userData));

            // Redireciona diretamente para o dashboard
            window.location.href = "dashboard.html";
        } else {
            alert("Erro ao ler os dados do utilizador. Tente novamente.");
        }
    } else {
        alert("Falha no login com o Google. Tente novamente.");
    }
}

window.onload = function () {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf80e57.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("googleLoginBtn"),
            {
                theme: "outline",
                size: "large"
            }
        );

        google.accounts.id.prompt();
    }
};
