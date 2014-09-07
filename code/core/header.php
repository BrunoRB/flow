<?php
namespace core;

class Header {
    private static $title;
    private static $extraCSS = array();
    private static $extraHeaderJS = array();

    public static function appendCss($style) {
        self::$extraCSS[] = $style;
    }

    public static function getAppendedCss() {
        return self::$extraCSS;
    }

    public static function appendJavascriptToHeader($script) {
        self::$extraHeaderJS[] = $script;
    }

    public static function getAppendedHeaderJavascript() {
        return self::$extraHeaderJS;
    }

    public static function setTitle($title) {
        self::$title = $title;
    }

    public static function getTitle() {
        return self::$title;
    }

    public static function loadHeader() {
        $mustacheEngine = new \Mustache_Engine();
        $extension = (Config::$SERVER_TYPE === Vars::SERVER_PRODUCTION) ? '.min' : '';
        $header = file_get_contents(Vars::CORE_TEMPLATE_ROOT . 'header.mustache');

        echo $mustacheEngine->render(
            $header,
            array(
                'title' => Header::getTitle(),
                'extension' => (!empty($extension)) ? 'min.' : '',
                'extraCSS' => self::$extraCSS,
                'extraJS' => self::$extraHeaderJS,
                'serverIsOnProduction' => (Config::$SERVER_TYPE === Vars::SERVER_PRODUCTION)
            )
        );
    }
}