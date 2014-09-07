<?php

namespace src\application;

use core\Utilities;

class Home extends \core\BaseView {
    private $mustache;

    public function __construct() {
        $this->redirectIfAlredyLogged();

        $this->setTitle('Flow - Home');
        $this->setDefaultMethod('show');

        $this->controller = new \src\controller\HomeController();

        $this->mustache = new \Mustache_Engine();

        $this->appendOwnCssToHeader('home');
        $this->appendOwnJavascriptToFooter('flowchart/defaults');
        $this->appendOwnJavascriptToFooter('flowchart/util');
        $this->appendOwnJavascriptToFooter('home');
    }

    public function show() {
        echo $this->mustache->render($this->getTemplate('header.mustache'));

        $this->appendExtraHomeScripts();
        $this->appendExtraCssOnHome();
        echo $this->mustache->render($this->getTemplate('home.mustache'));
    }

    public function register() {
        echo $this->mustache->render($this->getTemplate('header.mustache'));

        echo $this->mustache->render($this->getTemplate('register.mustache'));
    }

    public function registerNewUser() {
        $result = $this->controller->registerNewUser();

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
        else if (!$this->isAjaxRequest()) {
            if ($result) {
                Utilities::redirect('/flowchart');
            }
            else {
                $this->register();
                echo $this->buildErrorMessage('Falha no registro do usuário');
            }
        }
    }

    public function login() {
        $result = $this->controller->login();

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
        else if (!$this->isAjaxRequest()) {
            if ($result) {
                Utilities::redirect('/flowchart');
            }
            else {
                $this->show();
                echo $this->buildErrorMessage('Senha e/ou usuário inválido(s)');
            }
        }
    }

    private function redirectIfAlredyLogged() {
        $login = new \src\extension\Login();
        if ($login->isLogged()) {
            Utilities::redirect('flowchart');
        }
    }

    private function appendExtraHomeScripts() {
        $this->appendExternalJavascriptToFooter('pace');
        $this->appendExternalJavascriptToFooter('jquery.jsPlumb-1.5.5');
        $this->appendOwnJavascriptToFooter('examples');
        $this->appendOwnJavascriptToFooter('flowchart/defaults');
    }

    private function appendExtraCssOnHome() {
        $this->appendOwnCssToHeader('shapes');
    }
}