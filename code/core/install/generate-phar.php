<?php

require_once '../vars.php';

$corePharFileName = 'flow.phar';

if (file_exists(core\Vars::BUILD_ROOT . $corePharFileName)) {
    unlink(core\Vars::BUILD_ROOT . $corePharFileName);
}

$phar = new Phar(
    core\Vars::BUILD_ROOT . $corePharFileName,
    FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::KEY_AS_FILENAME,
    $corePharFileName
);

$phar->buildFromDirectory(core\Vars::CORE_ROOT);
$phar->buildFromDirectory(core\Vars::ERROR_ROOT);
$phar->buildFromDirectory(core\Vars::SERVER_ROOT . 'src/');
$phar->buildFromDirectory(core\Vars::VENDOR_ROOT);
$phar['index.php'] = file_get_contents(core\Vars::SERVER_ROOT . 'index.php');

$phar->setStub($phar->createDefaultStub('index.php'));