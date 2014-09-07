<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Create new shapes in a flowchart');

Flowchart::createFlowchart($I);

$shapes = array('process', 'decision');

Flowchart::createShapes($I, $shapes);

foreach ($shapes as $shape) {
    Flowchart::editShapeValue($I, $shape, true, rand());
}

$connections =  array(
    array('source' => 'process', 'target' => 'decision')
);
Flowchart::connectShapes($I, $connections);

Flowchart::deleteShapes($I, $shapes);

$I->click('div.flowchart.active');

$I->focus('div.flowchart.active');

$I->pressKeyUp('div.flowchart', 'z', 'ctrl');

$I->pressKeyUp('div.flowchart', 'z', 'ctrl');

$I->pressKey('div.flowchart', 'z', 'ctrl');

$I->pressKeyDown('div.flowchart', 'z', 'ctrl');

$I->wait(4);
