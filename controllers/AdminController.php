<?php

namespace Controllers;

use MVC\Router;
use Model\AdminTurno;


class AdminController {

    public static function index(Router $router) {
        // session_start();


        // Consultar DB
        $query = "SELECT turnos.id, turnos.hora, CONCAT(usuarios.nombre, \" \" ,usuarios.apellido) AS cliente, ";
        $query .= " usuarios.email, usuarios.telefono, servicios.nombre AS servicio, servicios.precio ";
        $query .= " FROM turnos ";
        $query .= " LEFT OUTER JOIN usuarios ";
        $query .= " ON turnos.usuarioId=usuarios.id ";
        $query .= " LEFT OUTER JOIN turnosServicios ";
        $query .= " ON turnosServicios.turnoId=turnos.id ";
        $query .= " LEFT OUTER JOIN servicios ";
        $query .= " ON turnosServicios.servicioId=servicios.id ";
//        $query .= " WHERE fecha = '{$fecha}' ;";


        $turnos = AdminTurno::SQL($query);


        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'turnos' => $turnos
        ]);
    }

}

