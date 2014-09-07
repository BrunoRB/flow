<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Delete some conctions bettewen shapes');

Flowchart::createFlowchart($I);

$I->click('#toggle-console');

$I->wait(1);

Flowchart::createShapes($I, array('begin', 'process'));

$connections = array(
    array('source' => 'begin', 'target' => 'process')
);

Flowchart::connectShapes($I, $connections);

$I->wait(1);

$connectionSelector = '._jsPlumb_connector';

$I->click($connectionSelector);

$I->pressKeyUp($connectionSelector, 46);

$I->cantSeeElement($connectionSelector);
