const formLogin = document.getElementById('formLogin');

formLogin.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    let baliseEmail = document.getElementById("email").value;
    let balisePassword = document.getElementById("password").value;
    const loginPost = JSON.stringify({
        email: baliseEmail,
        password: balisePassword,
    });
    try{
        const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST", // Correct HTTP method
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json", // Add the 'accept' header to match cURL
            },
            body: loginPost,
        });
        if (!response.ok) {
            let isEmailValid = regex.test(baliseEmail);
            if(!isEmailValid){
                const errorMessage = document.getElementsByClassName("inputEmail")[0];
                let existingError = errorMessage.querySelector(".errorMessage");
                if (!existingError) {
                    const textError = document.createElement("p");
                    textError.textContent = "Email non conforme";
                    textError.classList.add("errorMessage");
                    errorMessage.appendChild(textError);
                }
            };
            if(response.statusText === "Unauthorized"){
                const errorMessage = document.getElementsByClassName("inputPassword")[0];
                let existingError = errorMessage.querySelector(".errorMessage");
                if (!existingError) {
                    const textError = document.createElement("p");
                    textError.textContent = "L'Email ou le mot de passe n'est pas bon";
                    textError.classList.add("errorMessage");
                    errorMessage.appendChild(textError);
                }

            };

            return;
        }
        const responseData = await response.json();
        const responseDataLocal = JSON.stringify(responseData);
        window.localStorage.setItem("login", responseDataLocal);
        window.location.href = "index.html";
    }
    catch (error){
        console.error("Error during login:", error);
    };


});
