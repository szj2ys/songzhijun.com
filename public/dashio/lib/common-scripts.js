$((function(){$("#nav-accordion").dcAccordion({eventType:"click",autoClose:!0,saveState:!0,disableLink:!0,speed:"slow",showCount:!1,autoExpand:!0,classExpand:"dcjq-current-parent"})}));var Script=(jQuery("#sidebar .sub-menu > a").click((function(){var e=$(this).offset();diff=250-e.top,diff>0?$("#sidebar").scrollTo("-="+Math.abs(diff),500):$("#sidebar").scrollTo("+="+Math.abs(diff),500)})),$((function(){function e(){var e=$(window).width();e<=768&&($("#container").addClass("sidebar-close"),$("#sidebar > ul").hide()),e>768&&($("#container").removeClass("sidebar-close"),$("#sidebar > ul").show())}$(window).on("load",e),$(window).on("resize",e)})),$(".fa-bars").click((function(){!0===$("#sidebar > ul").is(":visible")?($("#main-content").css({"margin-left":"0px"}),$("#sidebar").css({"margin-left":"-210px"}),$("#sidebar > ul").hide(),$("#container").addClass("sidebar-closed")):($("#main-content").css({"margin-left":"210px"}),$("#sidebar > ul").show(),$("#sidebar").css({"margin-left":"0"}),$("#container").removeClass("sidebar-closed"))})),$("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4",cursorwidth:"3",cursorborderradius:"10px",background:"#404040",spacebarenabled:!1,cursorborder:""}),jQuery(".panel .tools .fa-chevron-down").click((function(){var e=jQuery(this).parents(".panel").children(".panel-body");jQuery(this).hasClass("fa-chevron-down")?(jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up"),e.slideUp(200)):(jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down"),e.slideDown(200))})),jQuery(".panel .tools .fa-times").click((function(){jQuery(this).parents(".panel").parent().remove()})),$(".tooltips").tooltip(),$(".popovers").popover(),void($(".custom-bar-chart")&&$(".bar").each((function(){var e=$(this).find(".value").html();$(this).find(".value").html(""),$(this).find(".value").animate({height:e},2e3)}))));jQuery(document).ready((function(e){e(".go-top").on("click",(function(a){a.preventDefault(),e("html, body").animate({scrollTop:0},500)}))}));