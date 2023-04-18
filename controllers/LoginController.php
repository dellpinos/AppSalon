<?php

namespace Controllers;
use MVC\Router;
use Model\Usuario;

class LoginController {

    public static function login(Router $router){
        $router->render('auth/login');
        echo 'Desde Login';
    }
    public static function logout(){
        echo 'Desde Logout';
    }
    public static function olvide(Router $router){
        $router->render('auth/olvide-password', [

        ]);
    }
    public static function recuperar(){
        echo 'Desde recuperar';
    }
    public static function crear(Router $router){

        $usuario = new Usuario;

        // Alertas vacias
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            // Comprobar que alertas este vacio
            if(empty($alertas)){
                echo "Pasaste la validacion";
            }

        }


        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }
}
