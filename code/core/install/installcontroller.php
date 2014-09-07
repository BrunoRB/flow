<?php

namespace core\install;

use core\install\Examples;
use src\enum\Table;

class InstallController {

    public function install() {
        $this->cleanDatabase();

        //TODO install DATABASE

        $this->createTestUser();

        $this->installExamples();

        \RedBean_Facade::close();
    }

    private function installExamples() {
        $idUser = $this->saveUser();

        $this->createFlowcarts($idUser);
    }

    private function cleanDatabase() {
        \RedBean_Facade::exec('DELETE FROM ' . Table::SHAPE_CONNECTION);
        \RedBean_Facade::exec('DELETE FROM ' . Table::SHAPE);
        \RedBean_Facade::exec('DELETE FROM ' . Table::FLOWCHART);
        \RedBean_Facade::exec('DELETE FROM ' . Table::USER);
    }

    private function createTestUser() {
        if (\core\Config::$SERVER_TYPE === \core\Vars::SERVER_DEVELOPMENT) {
            $testUserBean = \RedBean_Facade::dispense(Table::USER);
            $testUserBean->name = 'teste';
            $testUserBean->email = 'teste@teste.com';
            $testUserBean->password = hash(\src\extension\Login::HASH_ALG, 'admin');
            \RedBean_Facade::store($testUserBean);
        }
    }

    private function saveUser() {
        $userData = Examples::getExampleUser();
        $userBean = \RedBean_Facade::dispense(Table::USER);
        $userBean->name = $userData['name'];
        $userBean->email = $userData['email'];
        $userBean->password = $userData['password'];

        $retval = \RedBean_Facade::store($userBean);
        if (is_int($retval) && $retval !== 0) {
            return $retval;
        }
        else {
            throw new Exception("Fail on save a new user");
        }
    }

    private function createFlowcarts($idUser) {
        echo '<h1>Creating Flowcharts, shapes and connections</h1>';

        $data = Examples::getFlowcharts();
        foreach ($data as $key => $flowchartData) {
            $flowchartBean = \RedBean_Facade::dispense(Table::FLOWCHART);
            $flowchartBean->name = $flowchartData['name'];
            $flowchartBean->fkFlowUser = $idUser;
            $flowchartBean->isPublic = true;
            $this->createFlowchartShapes(\RedBean_Facade::store($flowchartBean), $key);
        }

        echo '<h2>Done</h2>';
    }

    private function createFlowchartShapes($idFlowchart, $key) {

        $data = Examples::getFlowcharts()[$key];
        foreach ($data['shapes'] as &$shapeData) {
            $shapeBean = \RedBean_Facade::dispense(Table::SHAPE);
            $shapeBean->fkFlowchart = $idFlowchart;
            $shapeBean->positionLeft = $shapeData['left'];
            $shapeBean->positionTop = $shapeData['top'];
            $shapeBean->fkShapeDefinition = $shapeData['shapeDefinition'];
            $shapeBean->value = $shapeData['value'];
            $shapeData['id']  = \RedBean_Facade::store($shapeBean);
        }

        $this->createShapesConnections($data);
    }

    private function createShapesConnections($data) {
        foreach ($data['shapes'] as $key => $shapeData) {
            if (isset($shapeData['connectedTo'])) {
                $connectionBean = \RedBean_Facade::dispense(Table::SHAPE_CONNECTION);
                $connectionBean->fkSourceShape = $shapeData['id'];
                $idTarget = $data['shapes'][$shapeData['connectedTo']]['id'];
                $connectionBean->fkTargetShape = $idTarget;
                \RedBean_Facade::store($connectionBean);
            }
        }
    }
}