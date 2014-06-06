<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#开启ttserver服务 只有开启功能，重启请使用restart
if(!$config)
{
    echo '错误的入口';die;
}

if(!$config['no'])
{
    echo "请输入要" . $config['lang'] . "的ttserver服务,不输入则" . $config['lang'] . "所有服务\n在输入服务名称之后按回车键\n";
    $stdin = fopen('php://stdin','r'); 
    $project = trim(fgets($stdin,100));
}

include(str_replace('service', '', dirname(__FILE__)) . '/core.php');
tt_echo("正在" . $config['lang'] . "ttserver服务...");

if($project)
{
    tt_load($project.'.php', $config['oper']);
}
else
{
    $data = tt_config();
    foreach($data as $k => $v)
    {
        tt_load($v, $config['oper']);
    }
}

echo tt_echo('程序执行完毕');