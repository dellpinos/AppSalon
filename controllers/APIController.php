<?php

namespace Controllers;

use Model\Servicio;

class APIController {
    public static function index(){
        $servicios = Servicio::all();

        debuguear($servicios);

        echo 'Desde api/index';
    }
}