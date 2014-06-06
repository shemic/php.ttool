<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#开启ttserver服务 只有开启功能，重启请使用restart
$config['lang'] = '开启';
$config['oper'] = 'start';
if(!$config['name']) include('service.php');