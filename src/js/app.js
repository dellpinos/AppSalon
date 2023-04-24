let paso = 1; // le doy un valor inicial para que "mostrarSeccion" funcione la primera vez
const pasoInicial = 1;
const pasoFinal = 3;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion(); // muestra y oculta las secciones
    tabs(); // Cambia la sección cuando cuando se presionan los tabs
    botonesPaginador(); // muestra y oculta botones paginador
    paginaSiguiente();
    paginaAnterior();
    
    consultarAPI(); // Consulta la API en el Backend de PHP
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
            botonesPaginador();
        });
    });
}
function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
        
    });
}
async function consultarAPI(){
    try{
        const url = 'http://127.0.0.1:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch(error){
        console.log(error);
    }
}
function mostrarServicios(servicios){

    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio; // destruct, extrae el valor y crea la variable en una sola linea

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id; // el elemento, el metodo atributo, el nombre del atributo = asigno valor al atributo

       servicioDiv.appendChild(nombreServicio);
       servicioDiv.appendChild(precioServicio);

       document.querySelector('#servicios').appendChild(servicioDiv);

    });
}

// scripting es mas lento para el desarrollador pero tiene mejor performance y es mas seguro
// scripting se refiere a crear html con código Js, conlleva muchas lineas de codigo a comparacion como lo haria con php/html

