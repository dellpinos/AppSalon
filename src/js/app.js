let paso = 1; // le doy un valor inicial para que "mostrarSeccion" funcione la primera vez

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion(); // muestra y oculta las secciones
    tabs(); // Cambia la sección cuando cuando se presionan los tabs
}
function mostrarSeccion(){ // se ejecuta cada vez que hay un listener
    // Ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la seccion con el "paso"
    const pasoSelector = `#paso-${paso}`; // este es el nombre del id
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Eliminar clase "actual" al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){ // solo se ejecuta al iniciar la pagina
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso)

            mostrarSeccion();
        })
    });
}