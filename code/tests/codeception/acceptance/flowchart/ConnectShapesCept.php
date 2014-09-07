<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Make shape connections');

$flowchartId = Flowchart::createFlowchart($I)['id'];

Flowchart::loadFlowchart($I, $flowchartId);

$shapes = array('begin', 'manual_input', 'display', 'end');
Flowchart::createShapes($I, $shapes);

$connections = array(
    array('source' => 'begin', 'target' => 'manual_input'),
    array('source' => 'manual_input', 'target' => 'display'),
    array('source' => 'display', 'target' => 'end')
);

Flowchart::connectShapes($I, $connections);

