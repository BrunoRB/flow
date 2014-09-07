<?php

namespace core\install;

class Install extends \core\BaseView {
    private $mustache;

    public function __construct() {
        $this->setTitle('Flow - Install');
        $this->setDefaultMethod('show');

        $this->controller = new InstallController();

        $this->mustache = new \Mustache_Engine();
    }

    public function show() {
        $template = file_get_contents(\core\Vars::INSTALL_ROOT . 'install.mustache');

        echo $this->mustache->render($template);
    }

    public function install() {
        if ($this->isPostRequest()) {
            $this->controller->install();
        }
        else {
            return false;
        }
    }
}