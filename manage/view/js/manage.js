/**
 * add by suwibin
 */

var manage = window.manage ||
{
    go : function(view)
    {
        var date = new Date();
        $("#content").html('loading...');
        $.get($_c_d['root'] + '?' + view + '&time=' + date.getTime(),function(t)
        {
            $("#content").html(t);
        });
    },
    create : function()
    {
        $.confirm('确定创建这个项目吗？',function(){manage.createAction()});
    },
    createAction : function()
    {
        var name = $("#name").val();
        if(!name)
        {
            $.alert('项目名称不能为空');
            return;
        }
        $.post($_c_d['root'] + '?view=manage&type=newaction',{name:name},function(t)
        {
            $.alert(t, function(){$.box('close');manage.go('view=manage')});
        });
    },
    edit : function()
    {
        $("#show").hide();
        $("#edit").show();
        $("#show_show").hide();
        $("#edit_show").show();
    },
    show : function()
    {
        $("#edit").hide();
        $("#show").show();
        $("#edit_show").hide();
        $("#show_show").show();
    },
    editpost : function(name)
    {
        var content = $("#"+name).val();
        $.post($_c_d['root'] + '?view=manage&type=edit',{name:name,content:content},function(t)
        {
            $.alert(t,function(){$.box('close');manage.go('view=manage&type=set&name='+name)});
        });
    },
    oper : function(oper)
    {
        $.confirm('确定进行此项操作吗？',function(){manage.operAction(oper)});
    },
    operAction : function(oper)
    {
        var name = $("#name").val();
        manage.go('service='+oper+'&project='+name);
    }
};