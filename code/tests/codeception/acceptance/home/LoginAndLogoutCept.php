<?php

$I = new WebGuy\FlowSteps($scenario);

$I->loginHasTestUser();

$I->wait(500);

$I->seeInCurrentUrl('/flowchart');


$I->click('#leave');

$I->acceptPopup();

$I->wait(500);

$I->seeInCurrentUrl('/home');