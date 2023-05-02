<div class="barra">
    <p>Hola: <?php echo $nombre ?? ''; ?></p>
    <a href="/logout" class="boton">Cerrar Sesión</a>
</div>

<?php

debuguear($_SESSION);


if(isset($_SESSION['admin'])) {
    echo "Si es Admin";
} else {
    echo "No es admin";
}