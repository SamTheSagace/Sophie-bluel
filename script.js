
let dataWork = ''

async function getWork(){
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json(); // Parse the JSON response if needed 
}

async function createGallery() {
    try {        
        dataWork = await getWork()
        let allFigures =''
        for (let i = 0; i< dataWork.length; i++ ){
        let imgFigure = dataWork[i].imageUrl
        let titreFigure = dataWork[i].title
        let figure = `                
            <figure>
                <img src="${imgFigure}">
                <figcaption>${titreFigure}</figcaption>
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

createGallery();


let buttonTrierTous = document.getElementById("tousButton")
let buttonTrierAppartements = document.getElementById("appartementButton")
let buttonTrierObjets = document.getElementById("objetsButton")
let buttonTrierHotel = document.getElementById("hotelButton")
let buttons = document.querySelectorAll(".button")


buttonTrierTous.addEventListener("click", async function() {
    buttons.forEach(button => {
        button.classList.remove("buttonHover");
    });
    buttonTrierTous.classList.add("buttonHover")
    await createGallery();    
}); 

buttonTrierObjets.addEventListener("click", async function() {
    buttons.forEach(button => {
        button.classList.remove("buttonHover");
    });
    buttonTrierObjets.classList.add("buttonHover")
    dataWork = await getWork()
    const objetsFiltrer = dataWork.filter(function (work) {
        console.log(work.category.name); // Log category name
        return work.category.name === "Objets";
    });
    let allFigures =''
    for (let i = 0; i< objetsFiltrer.length; i++ ){
    let imgFigure = objetsFiltrer[i].imageUrl
    let titreFigure = objetsFiltrer[i].title
    let figure = `                
        <figure>
            <img src="${imgFigure}">
            <figcaption>${titreFigure}</figcaption>
        </figure>
    `;
    allFigures += figure;
    }
    let gallery = document.getElementById("portfolio").querySelector(".gallery")
    gallery.innerHTML = ''
    gallery.innerHTML = allFigures
}); 


buttonTrierAppartements.addEventListener("click", async function() {
    buttons.forEach(button => {
        button.classList.remove("buttonHover");
    });
    buttonTrierAppartements.classList.add("buttonHover")
    await createGallery();
}); 

buttonTrierHotel.addEventListener("click", async function() {
    buttons.forEach(button => {
        button.classList.remove("buttonHover");
    });
    buttonTrierHotel.classList.add("buttonHover")
    await createGallery();
}); 