<?php

namespace Controllers;

use Model\Servicio;

class APIController {
    public static function index(){
        $servicios = Servicio::all();
        echo json_encode($servicios);

    }
    public static function guardar(){
        $respuesta = [ // un array asociativo en PHP es el equivalente a un objeto en Js
            'datos' => $_POST,
        ];
        echo json_encode($respuesta);

    }
}