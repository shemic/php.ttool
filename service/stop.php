<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#关闭ttserver服务
$config['lang'] = '关闭';
$config['oper'] = 'stop';
if(!$config['name']) include('service.php');