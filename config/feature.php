<?php
#tt项目配置

$config['global'] = array
                    (
                        'name' => 'feature',
                        'state' => 1,
                        'server' => '/usr/local/tt/bin/',
                    );

$config['db'] = array
                    (
                        0 => 'tags_data',
                    );

$config['tags_data'] = array
                    (
                        'type' => 'tct',
                        'host' => '192.168.1.203',
                        'port' => '2022',
                        'thnum' => 32,
                        'ulim' => '128m',
                        'ext' => '#idx=cdate:dec#bnum=1000000#rcnum=1000000#dfunit=8',
                    );