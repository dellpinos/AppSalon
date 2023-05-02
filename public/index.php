<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\APIController;
use Controllers\TurnoController;
use Controllers\LoginController;
use Controllers\AdminController;
use MVC\Router;

$router = new Router();

// Inicia sesion

$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

// Recuperar password
$router->get('/olvide', [LoginController::class, 'olvide']);
$router->post('/olvide', [LoginController::class, 'olvide']);
$router->get('/recuperar', [LoginController::class, 'recuperar']);
$router->post('/recuperar', [LoginController::class, 'recuperar']);

// Crear cuenta
$router->get('/crear-cuenta', [LoginController::class, 'crear']);
$router->post('/crear-cuenta', [LoginController::class, 'crear']);

//Confirmar cueenta
$router->get('/confirmar-cuenta', [LoginController::class, 'confirmar']);
$router->get('/mensaje', [LoginController::class, 'mensaje']);

// Area Pivada - cliente
$router->get('/turno', [TurnoController::class, 'index']);
// Area Privada - admin
$router->get('/admin', [AdminController::class, 'index']);

// API de Turnos
$router->get('/api/servicios', [APIController::class, 'index']);
$router->post('/api/turnos', [APIController::class, 'guardar']);
$router->post('/api/eliminar', [APIController::class, 'eliminar']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();