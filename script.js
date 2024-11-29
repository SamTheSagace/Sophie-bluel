
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
let tokenAdmin = ''
// to stop function that are page specific
// function pageStopper(targetPage, scriptName) {
//     const currentPage = document.body.id;
//     if (currentPage !== targetPage) {
//         console.log(`Script ${scriptName} not running. Expected page: ${targetPage}, but on: ${currentPage}`);
//         return true; 
//     }
//     console.log(scriptName + " should work")
//     return false;
// }

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
                // console.log(parsedData.token)
                tokenAdmin = parsedData.token
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
    let categoriesList = ''
    categoriesList = await getCategories()
    // console.log(categoriesList)
    let allFigures =`
            <button id="tousButton" class="button"><h3>Tous</h3></button>
                
            `
    for(let i = 0; i< categoriesList.length; i++ ){
        let button = `
                <button id="${categoriesList[i].name}" class="button"><h3>${categoriesList[i].name}</h3>
            `;
    allFigures += button;
    
    }
    // console.log(allFigures)
    let filters = document.getElementById("filter");
    filters.innerHTML = allFigures
}

//create a gallery at the start
async function createGallery(){
    let buttons = document.querySelectorAll(".button")
    let buttonTrierTous = document.getElementById("tousButton")

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

async function runFunctionOrder(){
    await buttonFilterBuild();
    await createGallery();
    await buttonTrierPage();
}
runFunctionOrder();

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
    await modalGalleryBuild()
    await modalFunctionAdd();
    await modalFunctionDelete();
    if(adminStatue){
        modifyButton.addEventListener("click", function(){
            modalWrap.classList.remove("hidden")
        });
        ajoutButton.addEventListener("click", function(){
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
            <div class="trashWrap" class>
                <i class="fa-solid fa-trash-can delete" id="${dataWork[i].id}" style="color: #ffffff;"></i>
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
        <option value="${dataCategory[i].id}">${dataCategory[i].name}
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



async function modalFunctionAdd(){
    if(adminStatue){ 
        const addForm = document.getElementById("formModalAjout")
        addForm.addEventListener("submit", async (event) => {
            // On empêche le comportement par défaut
            event.preventDefault();
            let formName = document.getElementById("title").value
            let formCategory = document.getElementById("categories").value
            let formImg = document.getElementById("picture").files[0]
            const validTypes = ["image/jpeg", "image/png"];

            if (!validTypes.includes(formImg.type)) {
                console.log("Invalid file type. Please upload a JPG or PNG image.");
                return;
            }

            if (formImg.size > 4 * 1024 * 1024) { // 4 MB in bytes
                console.log("File size exceeds 4 MB. Please upload a smaller image.");
                return;
            }
            if (!formName) {
                console.log("Title is required.");
                return;
            }
        
            if (!formCategory || isNaN(parseInt(formCategory))) {
                console.log("Valid category is required.");
                return;
            }
           
            try{
                const formData = new FormData();
                formData.append("image", formImg); // Attach the image file
                formData.append("title", formName); // Add title
                formData.append("category", formCategory);
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST", // Correct HTTP method
                    headers: {
                        "Authorization": `Bearer ${tokenAdmin}`,
                        "Accept": "application/json", 
                    },
                    body: formData,
                });
                if (response.ok) {
                    console.log("Image submitted successfully.");
                    createGallery();
                    modalGalleryBuild();
                } else {
                    console.log("Error :", response.status, response.statusText);
                    console.log(tokenAdmin)
                }
            }
            catch (error) {
                console.error("Error processing image:", error);
            }
           
        });
    }
}



async function modalFunctionDelete(){
    if(adminStatue){ 
        const deleteButtons = document.querySelectorAll(".delete")   
        deleteButtons.forEach(function(deleteButton) {
            deleteButton.addEventListener("click", async function(event) {
                console.log("Deleted button with id: " + event.target.id);
                let targetDelete = event.target.id
                try{

                    const response = await fetch(`http://localhost:5678/api/works/${targetDelete}`, {
                        method: "delete", // Correct HTTP method
                        headers: {
                            "Authorization": `Bearer ${tokenAdmin}`,
                            "Accept": "application/json", 
                        },
                    });
                    if (response.ok) {
                        console.log("Image deleted successfully.");
                        await createGallery(); // Ensure this refreshes the DOM
                        await modalGalleryBuild(); // Ensure this refreshes the modal DOM
                        await modalFunctionDelete();
                    } else {
                        console.log("Error :", response.status, response.statusText);
                        console.log(tokenAdmin)
                    }
                }
                catch (error) {
                    console.error("Error processing image:", error);
                }
            });
        });
    }
}