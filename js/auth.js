// =======================================
// EduManager - Auth (Login com Google)
// =======================================


// Decodifica o token JWT recebido do Google
function decodeJWT(token) {

    const base64Url = token.split('.')[1];

    const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');


    const jsonPayload = decodeURIComponent(
        atob(base64)
        .split('')
        .map(function(c) {

            return '%' +
            ('00' + c.charCodeAt(0).toString(16))
            .slice(-2);

        })
        .join('')
    );


    return JSON.parse(jsonPayload);

}




function handleCredentialResponse(response) {


    const token = response.credential;


    if (token) {


        // Pega dados do usuário no token Google
        const user = decodeJWT(token);



        const userData = {

            nome: user.name,

            email: user.email,

            foto: user.picture

        };



        // Salva sessão
        localStorage.setItem(
            "eduManagerUser",
            JSON.stringify(userData)
        );



        // Vai para dashboard
        window.location.href = "dashboard.html";



    } else {


        alert(
            "Falha no login com Google. Tente novamente."
        );


    }

}





window.onload = function () {


    google.accounts.id.initialize({

        client_id:
        "782376662205-tuh98d4gn2bmnlgfauqnt49bbpf8oe57.apps.googleusercontent.com",

        callback:
        handleCredentialResponse

    });



    google.accounts.id.renderButton(

        document.getElementById("googleLoginBtn"),

        {
            theme: "outline",
            size: "large"
        }

    );


    google.accounts.id.prompt();


};
