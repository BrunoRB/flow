<?php

namespace core;

use core\Config;
use core\Vars;

/**
 * Default view methods, all classes visible to users extends from this
 */
abstract class BaseView {

    protected $controller;

    private $defaultMethod;

    /**
     * ID passed in the URL
     * @var integer
     */
    protected $objectId;

    /**
     *  Set the objectId, passed by the url
     *
     * @param integer $objectId
     */
    public function setObjectId($objectId) {
        $this->objectId = $objectId;
    }

    /**
     * Get the id passed in the url
     *
     * @return integer
     */
    protected function getObjectId() {
        return $this->objectId;
    }

    /**
     * Set the default method to call on that page
     *
     * @param string $defaultMethod
     */
    protected function setDefaultMethod($defaultMethod) {
        $this->defaultMethod = $defaultMethod;
    }

    /**
     * Get the default method to call on that page
     *
     * @param string $defaultMethod
     */
    public function getDefaultMethod() {
        return $this->defaultMethod;
    }

    /**
     * Set the page title
     *
     * @param string $title
     */
    protected function setTitle($title) {
        Header::setTitle($title);
    }

    protected function appendExternalCssToHeader($file) {
        $extension = ($this->serverIsInProduction()) ? '.min.css' : '.css' ;
        Header::appendCss('/resources/css/' . $file . $extension);
    }

    protected function appendOwnCssToHeader($file) {
        $extension = ($this->serverIsInProduction()) ? '.min.css' : '.css' ;
        Header::appendCss('/resources/css-dev/' . $file . $extension);
    }

    protected function appendExternalJavascriptToHeader($file) {
        $extension = ($this->serverIsInProduction()) ? '.min.js' : '.js' ;
        Header::appendJavascriptToHeader('/resources/js/' . $file . $extension);
    }

    protected function appendExternalJavascriptToFooter($file) {
        $extension = ($this->serverIsInProduction()) ? '.min.js' : '.js' ;
        Footer::appendJavascriptToFooter('/resources/js/' . $file . $extension);
    }

    protected function appendOwnJavascriptToFooter($file) {
        $extension = ($this->serverIsInProduction()) ? '.min.js' : '.js' ;
        Footer::appendJavascriptToFooter('/resources/js-dev/' . $file . $extension);
    }

    protected function appendOwnJavascriptToHeader($file) {
        $extension = ($this->serverIsInProduction()) ? '.min.js' : '.js' ;
        Header::appendJavascriptToHeader('/resources/js-dev/' . $file . $extension);
    }

    protected function buildSuccessMessage($message) {
        return '<script>alertify.success("' . $message . '")</script>';
    }

    protected function buildErrorMessage($message) {
        return '<script>alertify.error("' . $message . '")</script>';
    }

    protected function serverIsOnProduction() {
        return (Config::$SERVER_TYPE === Vars::SERVER_PRODUCTION);
    }

    /**
     * Get content from a template file
     *
     * @param string $file File name
     * @return string Content
     */
    protected function getTemplate($file) {
         $extension = ($this->serverIsInProduction()) ? '.min' : '' ;
        return file_get_contents(Vars::TEMPLATE_ROOT . $file . $extension);
    }

    protected function isAjaxGetRequest() {
        return (isset($_GET['request_type']) && $_GET['request_type'] === \core\Vars::REQUEST_AJAX) ? true : false;
    }

    protected function isAjaxPostRequest() {
        return (isset($_POST['request_type']) && $_POST['request_type'] === \core\Vars::REQUEST_AJAX) ? true : false;
    }

    protected function isAjaxRequest() {
        return $this->isAjaxGetRequest() || $this->isAjaxPostRequest();
    }

    protected function isPostRequest() {
        return $_SERVER['REQUEST_METHOD'] === 'POST';
    }

    protected function isGetRequest() {
        return $_SERVER['REQUEST_METHOD'] === 'GET';
    }

    private function serverIsInProduction() {
        return Config::$SERVER_TYPE === Vars::SERVER_PRODUCTION;
    }
}