<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#重启
$config['lang'] = '重启';
$config['no'] = 'yes';
$config['oper'] = 'restart';
include(str_replace('daemon', '', dirname(__FILE__)) . '/service/service.php');