<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#管理接口
$array = array
        (
            'start' => '开启',
            'stop' => '关闭',
            'bak' => '备份',
            'bakdel' => '备份删除',
            'bakroll' => '备份恢复',
            'del' => '数据清理',
            'ulog' => '日志清理',
        );

$server['name'] = $array[$config['request']['oper']];
$server['oper'] = $config['request']['oper'];