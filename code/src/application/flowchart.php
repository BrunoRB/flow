<?php

namespace src\application;

class Flowchart extends \core\BaseView {

    private $mustacheEngine;

    public function __construct() {
        $this->redirectIfNotLogged();

        $this->setTitle('Flow - fluxogramas');
        $this->setDefaultMethod('load');

        $this->mustacheEngine = new \Mustache_Engine();

        $this->controller = new \src\controller\FlowchartController();

        $this->appendExtraCssFiles();
        $this->appendExtraJavascriptFiles();
    }

    public function load() {
        $loadedFlowchart = $this->controller->getFlowchart($this->objectId);

        $template = $this->getTemplate('flowchart.mustache');

        $compiledConfMenu = $this->mustacheEngine->render(
            $this->getTemplate('flowchart_config_menu.mustache'), array('loadedFlowchart' => $loadedFlowchart)
        );

        $compiledPagination = $this->getPaginationContent();

        $compiledHelp = $this->mustacheEngine->render(
            $this->getTemplate('flowchart-help.mustache'),
            $this->controller->getShapesDefinitionDataParsedForExhibition()
        );

        $data = array(
            'menuShapes' => $this->controller->getMenuShapes(),
            'loadedFlowchart' => $loadedFlowchart,
            'nameFilter' => isset($_GET['name']) ? $_GET['name'] : '',
            'paginationContent' => $compiledPagination,
            'configMenu' => $compiledConfMenu,
            'helpContent' => $compiledHelp
        );

        echo $this->mustacheEngine->render($template, $data);
    }

    public function getPaginationContent() {
        $this->controller->baseLimit = 3;

        $data = array(
            'myFlowcharts' => $this->controller->getOwnFlowchartsForPagination(),
            'paginationBarContent' => $this->controller->getPaginationBarContent('flowchart'),
            'filteredBy' => str_replace('%', '', $this->controller->getNameFilter())
        );

        $pagination = $this->mustacheEngine->render($this->getTemplate('flowchart_pagination.mustache'), $data);

        if ($this->isAjaxGetRequest()) {
            echo json_encode($pagination);
        }
        else {
            return $pagination;
        }
    }

    public function create() {
        $retval = $this->controller->create();

        $flowchartId = (is_int($retval)) ? $retval : false;

        echo json_encode($flowchartId);
    }

    /**
     * Update a given flowchart, callable only via AJAX
     */
    public function update() {
        if (!$this->isAjaxPostRequest() || !isset($this->objectId)) {
            return false;
        }

        $retval = $this->controller->update($this->objectId);

        if ($retval != $this->objectId) { // succeeded update returns the updated object ID
            echo json_encode(false);
        }
        else {
            echo json_encode($retval);
        }
    }

    public function delete() {
        $result = $this->controller->delete($this->objectId);

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
        else {
            $this->load();
            echo $this->buildSuccessMessage('//TODO');
        }
    }

    /**
     * Get flowchart object, only for AJAX requests
     *
     * @return entity\Flowchart|boolean
     */
    public function getFlowchart() {
        if (!$this->isAjaxGetRequest() || !isset($this->objectId)) {
            return false;
        }

        $flowchart = $this->controller->getFlowchart($this->objectId);

        if ($flowchart === false) {
            return false;
        }

        echo json_encode($flowchart);
    }

    /**
     * Get config menu HTML for a given flowchart, method only callable for AJAX requests
     *
     * @return string Mustache pre-compiled HTML
     */
    public function getConfigMenu() {
        if (!$this->isAjaxGetRequest() || !isset($this->objectId)) {
            return false;
        }

        $flowchart = $this->controller->getFlowchart($this->objectId);

        echo json_encode(
            $this->mustacheEngine->render(
                $this->getTemplate('flowchart_config_menu.mustache'),
                array('loadedFlowchart' => $flowchart)
            )
        );
    }

    public function saveShape() {
        $result = $this->controller->saveShape();

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
        else if (!$this->isAjaxRequest()) {
            $this->load();
            echo $this->buildSuccessMessage('//TODO');
        }
    }

    public function getShapesData() {
        if (!$this->isAjaxGetRequest() || !isset($this->objectId)) {
            return false;
        }

        $retval = $this->controller->getShapesData($this->objectId);

        if (!empty($retval)) {
            echo json_encode($retval);
        }
        else {
            echo json_encode(false);
        }
    }

    public function deleteShape() {
        $result = $this->controller->deleteShape($this->objectId);

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
        else {
            $this->load();
            echo $this->buildSuccessMessage('//TODO');
        }
    }

    public function deleteConnection() {
        $result = $this->controller->deleteConnection();

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
        else if (!$this->isAjaxRequest()) {
            $this->load();
            echo $this->buildSuccessMessage("//TODO");
        }
    }

    public function setConnection() {
        $retval = $this->controller->setConnection();

        if ($this->isAjaxPostRequest()) {
            echo json_encode($retval);
        }
        else if (!$this->isAjaxRequest()) {
            $this->load();
            echo $this->buildSuccessMessage('//TODO');
        }
    }

    public function recreateShape() {
        $result = $this->controller->recreateShape();

        if ($this->isAjaxPostRequest()) {
            echo json_encode($result);
        }
    }

    public function logout() {
        $this->controller->logout();
    }

    private function redirectIfNotLogged() {
        $login = new \src\extension\Login();
        if (!$login->isLogged()) {
            \core\Utilities::redirect('/home');
        }
    }

    private function appendExtraJavascriptFiles() {
        if (!$this->serverIsOnProduction()) {
			$this->appendProductionJavascriptFiles();
        }
        else {
            $this->appendOwnJavascriptToFooter('flowchart-concatenated');
        }

		$this->appendOwnJavascriptToFooter('init-flowchart');
    }

	private function appendProductionJavascriptFiles() {
		$this->appendExternalJavascriptToFooter('pace');
		$this->appendExternalJavascriptToFooter('jquery.jsPlumb-1.5.5');

        $this->appendOwnJavascriptToFooter('flowchart/defaults');
		$this->appendOwnJavascriptToFooter('flowchart/cache');
		$this->appendOwnJavascriptToFooter('flowchart/templates');
        $this->appendOwnJavascriptToFooter('flowchart/state');
        $this->appendOwnJavascriptToFooter('flowchart/ui-elements');
        $this->appendOwnJavascriptToFooter('flowchart/execution-handler');
        $this->appendOwnJavascriptToFooter('flowchart/flowchart-handler');
        $this->appendOwnJavascriptToFooter('flowchart/shape');
        $this->appendOwnJavascriptToFooter('flowchart/shape-handler');
        $this->appendOwnJavascriptToFooter('flowchart/util');
        $this->appendOwnJavascriptToFooter('flowchart/flowchart-listeners');
        $this->appendOwnJavascriptToFooter('flowchart/shape-listeners');
        $this->appendOwnJavascriptToFooter('flowchart/nodes');
        $this->appendOwnJavascriptToFooter('flowchart/element-selection');
        $this->appendOwnJavascriptToFooter('flowchart/execute');
	}

    private function appendExtraCssFiles() {
        if (!$this->serverIsOnProduction()) {
            $this->appendExternalCssToHeader('pace');
            $this->appendOwnCssToHeader('shapes');
            $this->appendOwnCssToHeader('flowchart');
            $this->appendOwnCssToHeader('flowchart-help');
        }
        else {
            $this->appendOwnCssToHeader('flowchart-concatenated');
        }
    }
}