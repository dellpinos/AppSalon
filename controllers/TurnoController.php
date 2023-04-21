<?php

namespace Controllers;

use MVC\Router;

class TurnoController {
    public static function index(Router $router){

        $router->render('turno/index', [
            
        ]);
    }
}