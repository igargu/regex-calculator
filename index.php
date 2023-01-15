<?php

use Swoole\WebSocket\{Server, Frame};

$server = new Server("localhost", 3000, SWOOLE_PROCESS, SWOOLE_SOCK_TCP | SWOOLE_SSL);

/*$fds = new Swoole\Table(1024);
$fds->column('fd', Swoole\Table::TYPE_INT, 4);
$fds->column('name', Swoole\Table::TYPE_STRING, 16);
$fds->create();*/

$server->on("Start", function (Server $server) {
    echo "WebSocket Server is started at " . $server->host . ":" . $server->port . "\n";
});

$server->on('Open', function (Server $server, Swoole\Http\Request $request) /*use ($fds)*/ {
    echo "Connection open" . "\n";
});

$server->on('Message', function (Server $server, Frame $frame) /*use ($fds)*/ {
    echo "Received message: {$frame->data}" . PHP_EOL . "\n";
});

$server->on('Close', function (Server $server, int $fd) /*use ($fds)*/ {
    echo "Connection close" . "\n";
});

$server->on('Disconnect', function (Server $server, int $fd) /*use ($fds)*/ {
    echo "Disconnect" . "\n";
});

$server->start();
