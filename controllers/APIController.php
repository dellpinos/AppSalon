<?php

namespace Controllers;

use Model\Servicio;
use Model\Turno;

class APIController {
    public static function index(){
        $servicios = Servicio::all();
        echo json_encode($servicios);

    }
    public static function guardar(){

        $turno = new Turno($_POST);

        $resultado = $turno->guardar();

        $respuesta = [
            'resultado' => $resultado
        ];

        echo json_encode($respuesta);
        
    }
}