const nav = document.getElementById("nav");

const menuToggle = document.getElementById("menu-toggle");

const navLinks = document.getElementById("nav-links");



window.addEventListener("scroll",()=>{


if(window.scrollY > 50){

nav.classList.add("active");

}

else{

nav.classList.remove("active");

}


});




menuToggle.addEventListener("click",()=>{


navLinks.classList.toggle("active");


});