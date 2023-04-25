let paso=1;const pasoInicial=1,pasoFinal=3,turno={nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaSiguiente(),paginaAnterior(),consultarAPI(),nombreCliente(),seleccionarFecha()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");const o="#paso-"+paso;document.querySelector(o).classList.add("mostrar");const t=document.querySelector(".actual");t&&t.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",(function(e){paso=parseInt(e.target.dataset.paso),mostrarSeccion(),botonesPaginador()}))})}function botonesPaginador(){const e=document.querySelector("#anterior"),o=document.querySelector("#siguiente");1===paso?(e.classList.add("ocultar"),o.classList.remove("ocultar")):3===paso?(e.classList.remove("ocultar"),o.classList.add("ocultar")):(e.classList.remove("ocultar"),o.classList.remove("ocultar")),mostrarSeccion()}function paginaAnterior(){document.querySelector("#anterior").addEventListener("click",(function(){paso<=1||(paso--,botonesPaginador())}))}function paginaSiguiente(){document.querySelector("#siguiente").addEventListener("click",(function(){paso>=3||(paso++,botonesPaginador())}))}async function consultarAPI(){try{const e="http://127.0.0.1:3000/api/servicios",o=await fetch(e);mostrarServicios(await o.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach(e=>{const{id:o,nombre:t,precio:n}=e,c=document.createElement("P");c.classList.add("nombre-servicio"),c.textContent=t;const a=document.createElement("P");a.classList.add("precio-servicio"),a.textContent="$"+n;const r=document.createElement("DIV");r.classList.add("servicio"),r.dataset.idServicio=o,r.onclick=function(){seleccionarServicio(e)},r.appendChild(c),r.appendChild(a),document.querySelector("#servicios").appendChild(r)})}function seleccionarServicio(e){const{id:o}=e,{servicios:t}=turno,n=document.querySelector(`[data-id-servicio= "${o}"]`);t.some(e=>e.id===o)?(turno.servicios=t.filter(e=>e.id!==o),n.classList.remove("seleccionado")):(turno.servicios=[...t,e],n.classList.add("seleccionado")),console.log(turno)}function nombreCliente(){const e=document.querySelector("#nombre").value;turno.nombre=e}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){console.log(e.target.value);const o=new Date(e.target.value).getUTCDay();[0,6].includes(o)?(e.target.value="",mostrarAlerta("Solo de Lunes a Viernes","error")):turno.fecha=e.target.value,console.log(o)}))}function mostrarAlerta(e,o){if(document.querySelector(".alerta"))return;const t=document.createElement("DIV");t.textContent=e,t.classList.add("alerta"),t.classList.add(o);document.querySelector(".formulario").appendChild(t),setTimeout(()=>{t.remove()},2e3)}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));