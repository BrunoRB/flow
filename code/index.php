<?php
/**
 * Front controller
 */

spl_autoload_extensions(".php");
spl_autoload_register();

require_once \core\Vars::LIBRARY_ROOT . 'bootstrap.php'; // necessary

if ($_SERVER['REQUEST_URI'] === '/') {
    \core\Utilities::redirect('/home');
}

ob_start();

$router = new core\Router();
$routededWithSuccess = $router->route(); // route

$content = ob_get_clean(); // store the content

if ($routededWithSuccess && !core\Utilities::isAjaxRequest()) {
    core\Header::loadHeader();

    echo $content;

    core\Footer::loadFooter();
}
else if($routededWithSuccess && core\Utilities::isAjaxRequest()) {
    echo $content;
}
else {
    require_once \core\Vars::ERROR_ROOT . '404.php';
}
