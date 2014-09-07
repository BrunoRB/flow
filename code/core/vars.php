<?php

namespace core;

define('SERVER_ROOT', '/home/brunorb/workspace/Flow/code/'); // Change for ambient var latter (getenv())

define('APPLICATION_ROOT', SERVER_ROOT . '/src/application/');

define('VENDOR_ROOT', SERVER_ROOT . '/vendor/');

define('CONTROLLER_ROOT', SERVER_ROOT . '/src/controller/');

define('TEMPLATE_ROOT', SERVER_ROOT . '/src/template/');

define('CORE_TEMPLATE_ROOT', SERVER_ROOT . '/core/template/');

define('ENTITY_ROOT', SERVER_ROOT . '/src/entity/');

define('CORE_ROOT', SERVER_ROOT . '/core/');

define('INSTALL_ROOT', SERVER_ROOT . '/core/install/');

define('RESOURCES_ROOT', SERVER_ROOT . '/resources/');

define('ERROR_ROOT', SERVER_ROOT . '/error/');

define('LIBRARY_ROOT', SERVER_ROOT . '/core/library/');

define('BUILD_ROOT', SERVER_ROOT . '/build/');

/**
 * Define system constants
 */
class Vars {

    /**
     * Root folder of the system
     */
    const SERVER_ROOT = SERVER_ROOT; // Change for ambient var lattter;

    /**
     * Root folder for the vendor folder (third party libraries)
     */
    const VENDOR_ROOT = VENDOR_ROOT;

    /**
     * Root folder for the "user" classes (what they can access directly) of the application
     */
    const APPLICATION_ROOT = APPLICATION_ROOT;

    /**
     * Root folder for controllers
     */
    const CONTROLLER_ROOT = CONTROLLER_ROOT;

    /**
     * Root folder for templates
     */
    const TEMPLATE_ROOT = TEMPLATE_ROOT;

    /**
     * Root folder for core templates
     */
    const CORE_TEMPLATE_ROOT = CORE_TEMPLATE_ROOT;

    /**
     * Root folder for entitys
     */
    const ENTITY_ROOT = ENTITY_ROOT;

    /**
     * Root folder for the core of the application
     */
    const CORE_ROOT = CORE_ROOT;

    /**
     * Root folder for the install files
     */
    const INSTALL_ROOT = INSTALL_ROOT;

    /**
     * Root folder for css/js/img's
     */
    const RESOURCES_ROOT = RESOURCES_ROOT;

    /**
     * Root folder error pages
     */
    const ERROR_ROOT = ERROR_ROOT;

    /**
     * Root folder for external/third-part librarys
     */
    const LIBRARY_ROOT = LIBRARY_ROOT;

    /**
     * Root folder for build (.phar's)
     */
    const BUILD_ROOT = BUILD_ROOT;

    /**
     * The database currentily used by the application
     */
    const DATABASE = 'postgresql';

    const SERVER_PRODUCTION = 'production';

    const SERVER_DEVELOPMENT = 'development';

    const REQUEST_AJAX = 'ajax';

    const REQUEST_PHP = 'php';
}
