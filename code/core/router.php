<?php

namespace core;

use core\Vars;

/**
 * Responsible for routing requests to the apropriate class/method
 */
class Router {
    private $object;

    /**
     * What the user is trying to access ?
     *
     * @return string Requested url ("HTTP GET")
     */
    private static function getRequestedUrl() {
        return $_SERVER['REQUEST_URI'];
    }

    /**
     * Set te include file and instantiate the class
     *
     * @param string $page
     * @return boolean true|false for success|failure
     */
    private function instantiate($page) {
        if (!self::srcFileExists($page)) {
            return false;
        }

        $class = self::getObjectNamespace() . ucfirst($page);

        if (!class_exists($class)) {
            return false;
        }

        $this->object = new $class;

        return true;
    }

    /**
     * Wrapper for file_exists
     *
     * @param string $page Name of the requested page
     * @return boolean
     */
    private static function srcFileExists($page) {
        if (!self::isInstall()) {
            return file_exists(Vars::APPLICATION_ROOT . $page . '.php');
        }
        else {
            return file_exists(Vars::INSTALL_ROOT . $page . '.php');
        }
    }

    /**
     *  Call the method passed on the url, if valid and exists, or else call the default method
     */
    private function callMethod($methodName = null) {
        if (!isset($methodName) || empty($methodName) || !method_exists($this->object, $methodName)) {
            $methodName = $this->object->getDefaultMethod();
        }

        $retval = call_user_func(array($this->object, $methodName));

        return ($retval === false) ? false : true;
    }

    /**
     * Get the class and method names from a url
     *
     * @return array ('class' string & 'method' string|null & 'submethod' string|null & 'id' integer|null)
     */
    private static function getUrlClassAndParameters() {
        $urlparsed = parse_url(self::getRequestedUrl());
        parse_str($urlparsed['path'], $url);
        $url = explode('/', array_keys($url)[0]);

        $class = $method = $id = $submethod = null;

        // First string "/class/", get class name
        if (count($url) <= 1 || empty($url[1])) {
            $class = 'home';
        }
        else {
            $class = $url[1];
        }

        // Second string, "/class/method/", get method name
        if (count($url) > 2 && !empty($url[2])) {
            $method = $url[2];
        }

        // String or integer, "/class/method/submethod/" OR "/class/method/9999/", get submethod name or object id
        if (count($url) > 3 && !empty($url[3])) {
            if (is_numeric($url[3])) {
                $id = intval($url[3]);
            }
            else {
                $submethod = $url[3];
            }
        }

        // String, "/class/method/9999/submethod/" get submethod afeter object id
        if (count($url) > 4 && !empty($url[4])) {
            $submethod = $url[4];
        }

        return array('class' => $class, 'method' => $method, 'submethod' => $submethod, 'id' => $id);
    }

    /**
     * Main function of the class
     */
    public function route() {
        if (self::isInstall() && self::alredyInstalled()) {
            return false;
        }

        $urlParams = self::getUrlClassAndParameters();

        if (!$this->instantiate($urlParams['class'])) {

            return false;
        }

        $this->object->setObjectId($urlParams['id']);

        return $this->callMethod($urlParams['method']);
    }

    private static function getObjectNamespace() {
        return (self::isInstall()) ? 'core\install\\' : 'src\application\\';
    }

    private static function isInstall() {
        return preg_match('/\/install/', $_SERVER['REQUEST_URI']);
    }

    private static function alredyInstalled() {
        return self::srcFileExists('installed');
    }
}



