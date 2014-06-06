/**
 * add by suwibin
 */

var mine = window.mine ||
{
    speed : 100,
    init : function()
    {
        mine.ud('#mine-header-right-link', '.mine-header-right-link');
        mine.menu();
        mine.model();
        mine.png('div');
        $(".mine-main").fadeIn(200);
    },
    png : function(e)
    {
        if(window.XMLHttpRequest)
        {
            return false;
        }
        else
        {
            if(e) png.fix(e);
            return true;
        }
    },
    ud : function(e1, e2)
    {
        $(e1 + ', ' + e2).bind('mouseenter', function()
        {
            $(e2).removeClass('slideUp').addClass('slideDown');
            setTimeout(function()
            {
                if($(e2).hasClass('slideDown'))
                {
                    $(e2).slideDown(mine.speed);
                }
            }, 200);
        }).bind('mouseleave', function()
        {
            $(e2).removeClass('slideDown').addClass('slideUp');
            setTimeout(function()
            {
                if($(e2).hasClass('slideUp'))
                {
                    $(e2).slideUp(mine.speed);
                }
            }, 300);
        });
    },
    model : function()
    {
        var parent;
        $(".mine-right-model-unline").each(function()
        {
            parent = $(this).parent().parent();
            parent.css('width',parent.attr('width')+'px');
            if($(this).attr('class').indexOf('yes') != -1)
            {
                $(this).parent().next().slideUp();
            }
            $(this).bind('mouseenter',function()
            {
                $(this).addClass("mine-right-model-hover");
            }).bind('mouseleave',function()
            {
                $(this).removeClass("mine-right-model-hover");
            }).bind("click", function()
            {
                if($(this).attr('class').indexOf('yes') == -1)
                {
                    $(this).parent().next().slideUp(mine.speed);
                    $(this).addClass("mine-right-model-yes");
                }
                else
                {
                    $(this).parent().next().slideDown(mine.speed);
                    $(this).removeClass("mine-right-model-yes");
                }
            });
        })
    },
    menu : function()
    {
        var next = [];
        var unline = [];
        var current = [];
        $(".mine-left-arrow-up").each(function(){$(this).get(0).onclick = function(){mine.smallMenu()};})

        $(".mine-left-link li").each(function()
        {
            $(this).mouseover(function()
            {
                $(this).addClass("mine-left-link-hover");
            }).mouseout(function()
            {
                $(this).removeClass("mine-left-link-hover");
            })
        });
        
        $(".mine-left .mine-left-li").each(function(t)
        {
            current[t] = $(this).attr('class').indexOf('mine-left-current');
            next[t] =  $(this).next();
            unline[t] = $(this).children(".mine-left-unline");
            if(current[t] == -1)
            {
                $(".mine-left-menu").eq(t).addClass("mine-left-menu-"+(t+1));
            }
            else
            {
                $(".mine-left-menu").eq(t).addClass("mine-left-menu-"+(t+1)+"-hover");
                if(next[t].html() && next[t].attr('class') == 'mine-left-li-next' && next[t].attr('class').indexOf('mine-left-li-next-no') == -1)
                {
                    unline[t].addClass("mine-left-unline-current");
                    next[t].slideDown(mine.speed);
                    next[t].children(".mine-left-link").addClass("mine-left-link-current");
                    unline[t].addClass("mine-left-unline-yes");
                }
            }
            $(this).bind('mouseenter',function()
            {
                if(current[t] == -1)
                {
                    $(".mine-left-menu-"+(t+1)).addClass("mine-left-menu-"+(t+1)+"-hover");
                    $(this).children(".mine-left-div").find("a").addClass("mine-left-a-hover");
                }
                else
                {
                    $(this).css('border','1px solid #bababa');
                }
                if(next[t].html() && next[t].attr('class').indexOf('mine-left-li-next') != -1)
                {
                    unline[t].addClass("mine-left-unline-hover");

                    if(current[t] == -1)
                    {
                        unline[t].addClass("mine-left-unline-hover");
                    }
                    else
                    {
                        unline[t].addClass("mine-left-unline-current");
                    }
                    if(unline[t].attr('class').indexOf('click') == -1)
                    {
                        unline[t].bind("click", function()
                        {
                            if($(this).attr('class').indexOf('yes') == -1)
                            {
                                next[t].slideDown(mine.speed,function(){$(this).show()});
                                $(this).addClass("mine-left-unline-yes").addClass("mine-left-unline-hover");
                            }
                            else
                            {
                                next[t].slideUp(mine.speed,function(){$(this).hide()});
                                $(this).removeClass("mine-left-unline-yes");
                            }
                        }).addClass("mine-left-unline-click");
                    }
                }
                else
                {
                    unline[t].addClass("mine-left-unline-no");
                }
            }).bind('mouseleave',function()
            {
                if(current[t] == -1)
                {
                    $(".mine-left-menu-"+(t+1)).removeClass("mine-left-menu-"+(t+1)+"-hover");
                    $(this).children(".mine-left-div").find("a").removeClass("mine-left-a-hover");
                }
                else
                {
                    $(this).css('border','1px solid #6D6D6D');
                }
                if(next[t].html() && next[t].attr('class').indexOf('mine-left-li-next') != -1 && unline[t].attr('class').indexOf('yes') == -1)
                {
                    unline[t].removeClass("mine-left-unline-hover").removeClass("mine-left-unline-current");
                }
            });
        });
    },
    smallMenu : function()
    {
        $(".mine-left-current").css('border','1px solid #E3E3E3');
        $(".mine-left-li").addClass("mine-left-li-short").removeClass("mine-left-li");
        $(".mine-left-div").hide();
        $(".mine-left-li-next").each(function()
        {
            if($(this).get(0).style.display != 'none')
            {
                $(this).addClass("mine-left-li-display").removeClass("mine-left-li-no");
            }
            else
            {
                $(this).addClass("mine-left-li-no").removeClass("mine-left-li-display");
            }
            $(this).hide();
        })
        $(".mine-left-unline").hide();
        $(".mine-left-current").addClass("mine-left-current-short").removeClass("mine-left-current");
        $(".mine-left-arrow-up").addClass("mine-left-arrow-down").removeClass("mine-left-arrow-up").each(function(){$(this).get(0).onclick = function(){mine.bigMenu()};})

        var next = [];
        var child,title;
        $(".mine-left .mine-left-li-short").each(function(t)
        {
            next[t] =  $(this).next();

            $(this).bind('mouseenter',function()
            {
                $(".mine-left-div").hide();
                $(this).css('border','1px solid #E3E3E3');
                if(next[t].html() && next[t].attr('class').indexOf('mine-left-li-next') != -1)
                {
                    child = $(this).children(".mine-left-div");
                    child.find("a").removeClass("mine-left-a-hover");
                    if(child.html().indexOf('mine-left-link') == -1)
                    {
                        title = '';
                        if(next[t].html().indexOf("mine-left-link-current") != -1)
                        {
                            title = 'mine-left-div-title-current';
                        }
                        child.html('<div class="mine-left-div-title '+title+'"><div class="mine-left-div-title-a">' + child.html() + '</div></div>' + next[t].html()).addClass("mine-left-div-short");
                    }
                    child.show();
                    child.children(".mine-left-link").find("li").each(function()
                    {
                        $(this).bind('mouseenter',function()
                        {
                            $(this).addClass("mine-left-link-hover");
                        }).bind('mouseleave', function()
                        {
                            $(this).removeClass("mine-left-link-hover");
                        })
                    })
                    child.bind('mouseleave', function(){$(this).hide()});
                }

            }).bind('mouseleave',function()
            {
                $(this).css('border','1px solid #E3E3E3');
            });
        });
    },
    bigMenu : function()
    {
        $(".mine-left-div").each(function()
        {
            $(this).html($(this).find('.mine-left-div-title-a').html());
        }).removeClass("mine-left-div-short").unbind();

        $(".mine-left-li-next").each(function()
        {
            if($(this).attr('class').indexOf("mine-left-li-display") != -1)
            {
                $(this).show();
            }
        })

        $(".mine-left-li-short").addClass("mine-left-li").removeClass("mine-left-li-short").unbind();
        $(".mine-left-div").show();
        $(".mine-left-unline").show();
        $(".mine-left-current-short").addClass("mine-left-current").removeClass("mine-left-current-short");
        $(".mine-left-arrow-down").addClass("mine-left-arrow-up").removeClass("mine-left-arrow-down").each(function(){$(this).get(0).onclick = function(){mine.bigMenu()};})

        mine.menu();
    }
}
$(document).ready(mine.init);