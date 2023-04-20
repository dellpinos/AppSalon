<?php

namespace Controllers;

use Classes\Email;
use MVC\Router;
use Model\Usuario;

class LoginController {

    public static function login(Router $router){
        $alertas=[];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();
        }

        if(empty($alertas)){
            // Comprobar que exista el usuario
            $usuario = Usuario::where('email', $auth->email);

            if($usuario){
                // Verificar el password
                $usuario->comprobarPasswordAndVerificado($auth->password);
            } else {
                Usuario::setAlerta('error', 'El usuario no existe');
            }
        }
        $alertas = Usuario::getAlertas();


        $router->render('auth/login', [
            'alertas' => $alertas
        ]);
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


        $usuario = Usuario::where('token', $token);

        if(empty($usuario)){
            // Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no valido'); // lo agrega en el array
        } else {
            // Modificar usuario a confirmado
            $usuario->confirmado = '1'; // Modifico el atributo en memoria
            $usuario->token = ''; // borro el token en memoria
            $usuario->guardar();
            Usuario::setAlerta('exito', 'Dirección de correo confirmada correctamente');
        }


        $alertas = Usuario::getAlertas(); // leer el array

        // Renderizar la vista
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}
