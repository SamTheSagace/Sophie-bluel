
let dataWork = ''
// fetching the data for the works
async function getWork(){
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json(); // Parse the JSON response if needed 
}

// async function createfilters(){
//     dataWork = await getWork()  
//     console.log(dataWork.category.name);   
// }

// let for the different button filter
let buttonTrierTous = document.getElementById("tousButton")
let buttonTrierAppartements = document.getElementById("appartementButton")
let buttonTrierObjets = document.getElementById("objetsButton")
let buttonTrierHotel = document.getElementById("hotelButton")
let buttons = document.querySelectorAll(".button")

// create the galllery at the start
async function createGallery(){
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
    else{
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
    else{
    }
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