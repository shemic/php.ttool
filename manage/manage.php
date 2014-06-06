<?php
/**
 * tt管理工具
 * 作者：于斌
 */
#管理接口
if($config['request']['type'] == 'new')
{
    
}
elseif($config['request']['type'] == 'newaction')
{
    if($config['request']['name'])
    {
        $file = TT_CONFIG_PATH . $config['request']['name'].'.php';
        if(is_file($file))
        {
            echo '项目已存在';die;
        }
        file_put_contents($file, '<?php #'. date('Y-m-d H:i:s') . 'ttserver管理工具创建'."\n" );
        echo '创建成功';die;
    }
    else
    {
        echo '项目名称不能为空';die;
    }
}
elseif($config['request']['type'] == 'set')
{
    $file = TT_CONFIG_PATH . $config['request']['name'].'.php';
    $manage['name'] = $config['request']['name'];
    $manage['data'] = file_get_contents($file);
}
elseif($config['request']['type'] == 'edit')
{
    $file = TT_CONFIG_PATH . $config['request']['name'].'.php';
    $data = str_replace('\\','', $config['request']['content']);
    if(is_file($file))
    {
        $state = file_put_contents($file, $data);
    }
    else
    {
        $state = false;
    }
    echo '编辑成功';die;
}
elseif($config['request']['type'] == 'data')
{
    
}
else
{
    $path = TT_CONFIG_PATH;

    if(is_dir($path))
    {
        $manage['path'] = scandir($path);
    }
}