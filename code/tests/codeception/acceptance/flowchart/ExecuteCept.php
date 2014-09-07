<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Execute a flowchart');

Flowchart::createFlowchart($I);

$I->click('#toggle-console');

$shapes = array('begin', 'process', 'display', 'end');
Flowchart::createShapes($I, $shapes);


$connections = array(
    array('source' => 'begin', 'target' => 'process'),
    array('source' => 'process', 'target' => 'display'),
    array('source' => 'display', 'target' => 'end')
);

 Flowchart::connectShapes($I, $connections);

Flowchart::editShapeValue($I, 'process', true, 'nomeVariavel <- "Hello Wolrd"');
Flowchart::editShapeValue($I, 'display', true, 'nomeVariavel');

$I->wait(1);

$I->click('#toggle-console');

$I->wait(1);

$I->click("#execute");

$I->wait(1);

$I->see('Hello Wolrd', '#console-display-content');