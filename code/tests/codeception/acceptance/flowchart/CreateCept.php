<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Create a new flowchart');

Flowchart::createFlowchart($I);



