<?php

namespace core;

class Footer {
    private static $extraFooterJS = array();
    private static $extraContent = array();

    public static function appendJavascriptToFooter($script) {
        self::$extraFooterJS[] = $script;
    }

    public static function appendContentToFooter($content) {
        self::$extraContent[] = $content;
    }

    public static function getAppendedFooterJavascript() {
        return self::$extraFooterJS;
    }

    public static function loadFooter() {
        $mustacheEngine = new \Mustache_Engine();
        $footer = file_get_contents(Vars::CORE_TEMPLATE_ROOT . 'footer.mustache');

        echo $mustacheEngine->render(
            $footer,
            array(
                'extraJS' => self::$extraFooterJS,
                'extraContent' => self::$extraContent,
                'serverIsOnProduction' => (Config::$SERVER_TYPE === Vars::SERVER_PRODUCTION)
            )
        );
    }
}