
const togglerButton = document.querySelector(".toggler-button");
const navItems = document.querySelector(".nav-items");
const navList = document.querySelectorAll(".nav-list");

const modal = document.querySelector(".modalBox");
const openModal = document.querySelector(".newEntry-button");
const closeModal = document.querySelector(".close-button");
const cancelModal = document.querySelector(".cancel-button");

//Common Javascript to navbar

togglerButton.addEventListener("click",function(){
    navItems.classList.toggle("nav-items-display");
    togglerButton.classList.toggle("toggle-icon");
});


//Modal functioning

openModal.addEventListener("click",function(){
modal.style.display ="block";
});

closeModal.addEventListener("click",function(){
    modal.style.display ="none";
});

cancelModal.addEventListener("click",function(){
modal.style.display = "none";
});


window.addEventListener("click",function(event){
if(event.target === modal){
    modal.style.display = "none";
}
});
