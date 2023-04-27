let paso = 1; // le doy un valor inicial para que "mostrarSeccion" funcione la primera vez
const pasoInicial = 1;
const pasoFinal = 3;

const turno = { // por default los objetos en js funcionan como "let" pueden ser modificados durante la ejecución
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // muestra y oculta las secciones
    tabs(); // Cambia la sección cuando cuando se presionan los tabs
    botonesPaginador(); // muestra y oculta botones paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el Backend de PHP

    nombreCliente(); // Almacena el nombre del cliente en el objeto Turno
    seleccionarFecha(); // Almacena la fecha del turno en el objeto
    seleccionarHora(); // Almacena la hora del turno en el objeto

    mostrarResumen(); // Muestra el resumen del turno
}
function mostrarSeccion() { // se ejecuta cada vez que hay un listener
    // Ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la seccion con el "paso"
    const pasoSelector = `#paso-${paso}`; // este es el nombre del id
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Eliminar clase "actual" al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() { // solo se ejecuta al iniciar la pagina
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso)

            mostrarSeccion();
            botonesPaginador();

        });
    });
}
function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen(); // Validar
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}
function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function () {
        if (paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function () {
        if (paso >= pasoFinal) return;
        paso++;
        botonesPaginador();

    });
}
async function consultarAPI() {
    try {
        const url = 'http://127.0.0.1:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}
function mostrarServicios(servicios) {

    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio; // destruct, extrae el valor y crea la variable en una sola linea

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id; // el elemento, el metodo atributo, el nombre del atributo = asigno valor al atributo
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = turno; // destructuring, extraigo el array "servicios" contenido dentro del objeto "turno" y creo la variable/objeto servicios

    // Identificar el elemento que recibe el click
    const divServicio = document.querySelector(`[data-id-servicio= "${id}"]`);
    // Comprobar si un servicio ya fue agregado o quitarlo
    if (servicios.some(agregado => agregado.id === id)) {
        // Eliminarlo
        turno.servicios = servicios.filter(agregado => agregado.id !== id); // array method que crea un nuevo array con los elementos que cumplan cierta condicion
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        turno.servicios = [...servicios, servicio]; // spread operator hago una copia de "servicios" y le agrego "servicio", de esta forma si presiono en varios botones se van a ir sumando al objeto
        divServicio.classList.add('seleccionado');
    }


}

function nombreCliente() {
    const nombre = document.querySelector('#nombre').value;
    turno.nombre = nombre;
}
function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {
        console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay();

        if ([0, 6].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Solo de Lunes a Viernes', 'error', '.formulario');
        } else {
            turno.fecha = e.target.value;
        }
    });
}
function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function (e) {

        const hora = e.target.value.split(':')[0];
        if (hora < 9 || hora > 19) {
            e.target.value = '';
            mostrarAlerta('Horario no valido', 'error', '.formulario');
        } else {
            turno.hora = e.target.value;
        }
    });
}
function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de resumen
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if (Object.values(turno).includes('') || turno.servicios.length < 1) {
        mostrarAlerta('Todos los campos son obligatorios (servicio/s, fecha y hora)', 'error', '.contenido-resumen', false);

        return;
    }
    const { nombre, fecha, hora, servicios } = turno;

    // Headin para Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando e imprimiendo en pantalla los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    // Scripting <div> Resumen
    // Headin para Resumen
    const headingTurno = document.createElement('H3');
    headingTurno.textContent = 'Resumen del Turno';
    resumen.appendChild(headingTurno);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear fecha del turno
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    const opciones = { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);

    console.log(fechaFormateada);

    const fechaTurno = document.createElement('P');
    fechaTurno.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaTurno = document.createElement('P');
    horaTurno.innerHTML = `<span>Hora:</span> ${hora} hs`;

    // Boton para crear un turno

    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Turno';
    botonReservar.onclick = reservarTurno; // el funcion que se ejecuta en respuesta al evento no lleva parametros (). Si no debo escribir un callback con function() {}

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaTurno);
    resumen.appendChild(horaTurno);

    resumen.appendChild(botonReservar);

}

function mostrarAlerta(mensaje, tipo, elemento, tiempo = true) {

    // Previene que se genere más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }
    // Scripting para generar la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (tiempo) {
        // Eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
}

async function reservarTurno() {

    const datos = new FormData();
    datos.append('nombre', 'Martin');

    // Peticion hacia la API
    const url = 'http://127.0.0.1:3000/api/turnos';
    const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
    });

    const resultado = await respuesta.json();

    console.log(resultado);

    console.log(respuesta);
}


// console.log([...datos]);
