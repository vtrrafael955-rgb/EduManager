verificarAutenticacao() {
    const userStr = localStorage.getItem("eduManagerUser");
    
    if (!userStr) {
        window.location.href = "/login.html";
        return false;
    }

    try {
        this.user = JSON.parse(userStr);
        this.dataKey = "eduData_" + (this.user.email || "default");

        const elNome = document.getElementById("userName");
        const elEmail = document.getElementById("userEmail");
        const elFoto = document.getElementById("userPhoto");

        if (elNome) elNome.textContent = this.user.nome || "Utilizador";
        if (elEmail) elEmail.textContent = this.user.email || "";
        if (elFoto && this.user.foto) elFoto.src = this.user.foto;

        return true;
    } catch (e) {
        localStorage.removeItem("eduManagerUser");
        window.location.href = "/login.html";
        return false;
    }
}
