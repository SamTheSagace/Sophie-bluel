

// fetching the data for the works
async function getWork(){
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json(); // Parse the JSON response if needed
}

// let for the different button filter

let buttonTrierTous = document.getElementById("tousButton")
let buttonTrierAppartements = document.getElementById("appartementButton")
let buttonTrierObjets = document.getElementById("objetsButton")
let buttonTrierHotel = document.getElementById("hotelButton")
let buttons = document.querySelectorAll(".button")

function pageStopper(targetPage, scriptName) {
    // Early exit if the current page doesn't match the target
    const currentPage = document.body.id;
    if (currentPage !== targetPage) {
        console.log(`Script ${scriptName} not running. Expected page: ${targetPage}, but on: ${currentPage}`);
        return true; // Signal to stop further execution
    }
    console.log("the code should work")
    return false; // Signal to continue
}

//create a let for the gallery data
let dataWork = ''

// create the galllery at the start
async function createGallery(){
    if (pageStopper("homePage", "createGallery")) {
        return; // Stop execution if not on the target page
    }
    if(buttonTrierTous.classList.contains("buttonHover") === false){
        buttons.forEach(button => {
            button.classList.remove("buttonHover");
        });
        buttonTrierTous.classList.add("buttonHover")
        try {
            dataWork = await getWork()
            const objetsFiltrer = dataWork.filter(function (work) {
                return work.category.name === "Objets";
            });
            let allFigures =''
            for (let i = 0; i< dataWork.length; i++ ){
            let figure = `
                <figure>
                    <img src="${dataWork[i].imageUrl}">
                    <figcaption>${dataWork[i].title}</figcaption>
                </figure>
            `;
            allFigures += figure;
            }
            let gallery = document.getElementById("portfolio").querySelector(".gallery")
            gallery.innerHTML = allFigures
            return gallery
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}
createGallery();

// when each button is pressed, it recreate the gallery with a filtered version of it

async function createFilterGallery(nomButton, nomFiltre){
    if(nomButton.classList.contains("buttonHover") === false){
        buttons.forEach(button => {
            button.classList.remove("buttonHover");
        });
        nomButton.classList.add("buttonHover")
        const Filtrer = dataWork.filter(function (work) {
        return work.category.name === nomFiltre;
        });
        let allFigures =''
        for (let i = 0; i< Filtrer.length; i++ ){
            let figure = `
                <figure>
                    <img src="${Filtrer[i].imageUrl}">
                        <figcaption>${Filtrer[i].title}</figcaption>
                </figure>
            `;
            allFigures += figure;
        }
        let gallery = document.getElementById("portfolio").querySelector(".gallery")
        gallery.innerHTML = ''
        gallery.innerHTML = allFigures
    }
}

async function buttonTrierPage(){
    if (pageStopper("homePage", "button.addEventListener")) {
        return; // Stop execution if not on the target page
    }
    buttonTrierTous.addEventListener("click", async function() {
        await createGallery();
    });

    buttonTrierObjets.addEventListener("click", async function() {
        await createFilterGallery(buttonTrierObjets, "Objets")
    });

    buttonTrierAppartements.addEventListener("click", async function() {
        await createFilterGallery(buttonTrierAppartements, "Appartements")
    });

    buttonTrierHotel.addEventListener("click", async function() {
        await createFilterGallery(buttonTrierHotel, "Hotels & restaurants")
    });
}
buttonTrierPage();



async function formLogins (){
    if (pageStopper("loginPage", "formLogin")) {
        return; // Stop execution if not on the target page
    };
    const formLogin = document.getElementById('formLogin');
    const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");

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
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST", // Correct HTTP method
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // Add the 'accept' header to match cURL
                },
                body: loginPost,
            });

            if (!response.ok) {
                console.error("Login failed:", response.statusText);
                let isEmailValid = regex.test(baliseEmail);
                if (!isEmailValid) {
                    console.log("le mail n'est pas bon");
                };
                return;
            }
            const responseData = await response.json();
            console.log("Login successful:", responseData);
            const responseDataLocal = JSON.stringify(responseData);
            window.localStorage.setItem("login", responseDataLocal);
            console.log(localStorage.login)
        }
        catch (error){
            console.error("Error during login:", error);
        };

        
    });
}
formLogins()


