
// console.log(window.localStorage)
// fetching the data for the works
async function getWork(){
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json(); // Parse the JSON response if needed
}
async function getCategories(){
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json(); // Parse the JSON response if needed
}


let adminStatue = false
let loginData = localStorage.getItem("login")

// to stop function that are page specific
function pageStopper(targetPage, scriptName) {
    const currentPage = document.body.id;
    if (currentPage !== targetPage) {
        // console.log(`Script ${scriptName} not running. Expected page: ${targetPage}, but on: ${currentPage}`);
        return true; 
    }
    // console.log(scriptName + " should work")
    return false;
}

// checking for admin statue at the start

function tokenCheck(){
    // console.log(loginData)
    if (loginData) {
        try {
            // Parse the stored JSON
            const parsedData = JSON.parse(loginData);
            // Check if the token exists
            if (parsedData.token) {
                // console.log("Token found:", parsedData.token);
                adminStatue = true
                return parsedData.token; // Return the token for use elsewhere
            } else {
                console.log("Token not found in stored data.");
            }
        } catch (error) {
            console.error("Error parsing login data:", error);
        }
    } else {
        console.log("No login data found in localStorage.");
    }
};
tokenCheck();

function adminVersion(){
    if (pageStopper("homePage", "adminVersion")) {
        return; // Stop execution if not on the target page
    };
    if(adminStatue){
        document.getElementById("adminHeader").classList.remove("hidden")
        document.getElementById("portfolioModify").classList.remove("hidden")
        document.getElementById("filter").classList.add("hidden")
        console.log("you are admin")
        let login = document.getElementById("login")
        login.innerHTML = "logout"
        login.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("login")
            window.location.href = "index.html";
        });
    };
};
adminVersion();



let dataWork = ''
let dataCategory = ''



async function buttonFilterBuild(){
    if (pageStopper("homePage", "createGallery")) {
        return; // Stop execution if not on the target page
    }
    let categoriesList = ''
    categoriesList = await getCategories()
    let allFigures =`
            <button id="tousButton" class="button"><h3>Tous</h3></button>
                
            `
    for(let i = 0; i< categoriesList.length; i++ ){
        let button = `
                <button id="${categoriesList[i].name}" class="button"><h3>${categoriesList[i].name}</h3>
            `;
    allFigures += button;
    }
    console.log(allFigures)
    let filters = document.getElementById("filter");
    filters.innerHTML = allFigures


}




//create a gallery at the start

async function createGallery(){
    let buttons = document.querySelectorAll(".button")
    let buttonTrierTous = document.getElementById("tousButton")

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
            gallery.innerHTML = ''
            gallery.innerHTML = allFigures
            return gallery
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
};

async function runFunctionOrder(){
    await buttonFilterBuild();
    await createGallery();
    await buttonTrierPage();
}
runFunctionOrder();

// when each button is pressed, it recreate the gallery with a filtered version of it


async function createFilterGallery(nomButton, nomFiltre){
    let buttons = document.querySelectorAll(".button")
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
};

async function buttonTrierPage(){
    if (pageStopper("homePage", "button.addEventListener")) {
        return; // Stop execution if not on the target page
    }
    //filter buttons
    let buttons = document.querySelectorAll(".button")
    let buttonTrierTous = document.getElementById("tousButton")
    let buttonTrierAppartements = document.getElementById("Appartements")
    let buttonTrierObjets = document.getElementById("Objets")
    let buttonTrierHotel = document.getElementById("Hotels & restaurants")

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
};


//modal elements
const modifyButton = document.getElementById("portfolioModify")
const modalWrap = document.getElementById("modalWrap")
const fullModal = document.getElementById("fullModal")
const modalGallery = document.getElementById("modalGallery")
const modalAjout = document.getElementById("modalAjout")
const quitModal = document.querySelector(".Quit")
const ajoutButton = document.getElementById("ajoutButton")
const ajouterButton = document.getElementById("ajouterButton")


//open and close modal
async function modalHide(){
    if (pageStopper("homePage", "modal")) {
        return; // Stop execution if not on the target page
    };
    if(adminStatue){
        modifyButton.addEventListener("click", function(){
            modalGalleryBuild()
            modalWrap.classList.remove("hidden")
        });
        ajoutButton.addEventListener("click", function(){
            modalCategoryBuild()
            modalGallery.classList.add("hidden")
            modalAjout.classList.remove("hidden")
        });
    
        function quit(){
            modalWrap.classList.add("hidden")
            modalGallery.classList.remove("hidden")
            modalAjout.classList.add("hidden")
        };
        quitModal.addEventListener("click", function () {
            if(!modalWrap.classList.contains("hidden")){
                quit()
            }
        });
        document.addEventListener("click", (event) => {
            if (!fullModal.contains(event.target) && modalWrap.contains(event.target)) {
                quit()
            }
        });
    }  
};
modalHide();


// create the mini gallery on the first modal
async function modalGalleryBuild(){
    dataWork = await getWork()
    let galleryModal = document.getElementById("containerModalImg")
    let allFigures = ''

    for (let i = 0; i< dataWork.length; i++ ){
    let figure = `
        <figure class="modalImgWrap">
            <div class="trashWrap">
                <i class="fa-solid fa-trash-can delete" style="color: #ffffff;"></i>
            </div> 
            <img src="${dataWork[i].imageUrl}" class="modalImg">
        </figure>
    `;
    allFigures += figure;
    };
    galleryModal.innerHTML = ''
    galleryModal.innerHTML += allFigures;
};

// call the categories for the form 
async function modalCategoryBuild(){
    dataCategory = await getCategories()
    let categories = document.getElementById("categories")
    let allFigures = ''
    
    for (let i = 0; i< dataCategory.length; i++ ){
    let figure = `
        <option value="${dataCategory[i].name}">${dataCategory[i].name}
        </option>       
    `;
    allFigures += figure;
    };
    categories.innerHTML = ''
    categories.innerHTML += allFigures;
};

//handle the inputs to ad
function previewFile() {
    const uploadWrap = document.getElementById("uploadButtonWrap")
    const formImg = document.getElementById("picture").files[0]
    const previewModal = document.getElementById("previewModal")
    const reader = new FileReader();  // Event listener for when the file is read
    reader.addEventListener("load", () => {
          // convert image file to base64 string
          previewModal.src = reader.result;
        },
        false,
    );
    if (formImg) {
        reader.readAsDataURL(formImg);
    }
    previewModal.classList.remove("hidden")    
    uploadWrap.classList.add("hidden")
}

async function modalFunction(){
    if (pageStopper("homePage", "modal")) {
        return; // Stop execution if not on the target page
    };
    
    if(adminStatue){ 
        const inputImg = document.getElementById("picture")
        const formImg = document.getElementById("picture").files[0]
        const previewModal = document.getElementById("previewModal")
        const addForm = document.getElementById("formModalAjout")
        const addPost = JSON.stringify({
            id: 0,
            title: "string",
            imageUrl: "string",
            categoryId: "string",
            userId: 0
        });
        addForm.addEventListener("submit", async (event) => {
            // On empêche le comportement par défaut
            event.preventDefault();
            let formName = document.getElementById("title").value
            let formCategory = document.getElementById("categories").value
            let formImg = document.getElementById("picture").files[0]
            console.log(formName);
            console.log(formCategory);
            console.log(formImg);
        })
    }
}
modalFunction();

// Login page
async function formLogins (){
    if (pageStopper("loginPage", "formLogin")) {
        return; // Stop execution if not on the target page
    };
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
};
formLogins();


