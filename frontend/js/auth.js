// =======================================
// EduManager - Auth (Login com Google)
// =======================================

function handleCredentialResponse(response) {
    const token = response.credential;

    if (token) {
        // Se o login deu certo, vai para o dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Falha no login com Google. Tente novamente.");
    }
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf8oe57.apps.googleusercontent.com", // <-- coloque aqui o Client ID que o Google te deu
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt();
};
