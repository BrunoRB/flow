<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wantTo('Save a image of a flowchart to my computer');

Flowchart::createFlowchart($I);

$I->click('#toggle-settings');

$I->waitForElementVisible("#export-image");

$I->click("#export-image");

$I->acceptPopup();