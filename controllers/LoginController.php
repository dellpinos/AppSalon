<?php

namespace Controllers;

use Classes\Email;
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
                // Verificar que el usuario este registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows) {
                    // Ya esta registrado
                    $alertas = Usuario::getAlertas(); // doble punto porque es un metodo estatico, no requiero una instancia
                } else {
                    // No esta registrado

                    // Hashear password
                    $usuario->hashPassword();
                    // Generar un Token unico
                    $usuario->crearToken();
                    // Enviar el email
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);

                    $email->enviarConfirmacion();

                    // Crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado){
                        header('Location: /mensaje');
                    }
                }
            }
        }
        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }
    public static function mensaje(Router $router){
        $router->render('auth/mensaje');
    }
    public static function confirmar(Router $router){
        $alertas = [];

        $token = s($_GET['token']);

        debuguear($token);


        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}
