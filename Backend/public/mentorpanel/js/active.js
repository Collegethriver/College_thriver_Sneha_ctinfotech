(function ($) {
    "use strict";

    // :: Variables
    var flapt_window = $(window);
    var pageWrapper = $(".flapt-page-wrapper");
    var sideMenuArea = $(".flapt-sidemenu-wrapper");
    var fullScreen = $("body")[0];



    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#flaptSideNav').slimscroll({
            height: '100%',
            size: '2px',
            position: 'right',
            color: '#8c8c8c',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            touchScrollStep : 75,
            wheelStep: 10,
        });
    }


    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#messageBox, #notificationsBox').slimscroll({
            height: '345px',
            size: '4px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }
    // :: Chatbox Active Code
    if ($.fn.slimscroll) {
        $('#HotChat-list, #HotChat-list2, #HotChat-list3, #chatBody').slimscroll({
            height: '500px',
            size: '4px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Chatbox Active Code
    if ($.fn.slimscroll) {
        $('#chatBody').slimscroll({
            height: '580px',
            size: '4px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#product, #shiping').slimscroll({
            height: '280px',
            size: '4px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('.widgetbox').slimscroll({
            height: '400px',
            size: '2px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#dashboardTimeline').slimscroll({
            height: '380px',
            size: '2px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 2
        });
    }

    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#dashboardTable').slimscroll({
            height: '400px',
            size: '2px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#chatBox').slimscroll({
            height: '330px',
            size: '2px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }
    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#shareId, #activeUser').slimscroll({
            height: '400px',
            size: '2px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Slimscroll Active Code
    if ($.fn.slimscroll) {
        $('#chooseLayout, #quickSettingPanel').slimscroll({
            height: '100%',
            size: '2px',
            position: 'right',
            color: '#ebebeb',
            alwaysVisible: false,
            distance: '0px',
            railVisible: false,
            wheelStep: 15
        });
    }

    // :: Menu Active Code
    $("#menuCollasped").on("click", function () {
        pageWrapper.toggleClass("menu-collasped-active");
    });

    $("#mobileMenuOpen").on("click", function () {
        pageWrapper.toggleClass("mobile-menu-active");
    });

    $("#rightSideTrigger").on("click", function () {
        $(".right-side-content").toggleClass("active");
    });

    sideMenuArea.on("mouseenter", function () {
        pageWrapper.addClass("sidemenu-hover-active");
        pageWrapper.removeClass("sidemenu-hover-deactive");
    });

    sideMenuArea.on("mouseleave", function () {
        pageWrapper.removeClass("sidemenu-hover-active");
        pageWrapper.addClass("sidemenu-hover-deactive");
    });

    // :: Setting Panel Active Code
    $("#settingTrigger").on("click", function () {
        $(".choose-layout-area").toggleClass("active");
    });

    $("#settingCloseIcon").on("click", function () {
        $(".choose-layout-area").removeClass("active");
    })

    $("#quicksettingTrigger").on("click", function () {
        $(".quick-settings-panel").toggleClass("active");
    });

    $("#quicksettingCloseIcon").on("click", function () {
        $(".quick-settings-panel").removeClass("active");
    })


    // :: Popover Active Code
    if ($.fn.popover) {
        $('[data-toggle="popover"]').popover();
    }

    // :: Nice Select Active Code
    if ($.fn.niceSelect) {
        $('select').niceSelect();
    }

    // :: Active tooltip Code
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // :: Popover Code
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    // :: PreventDefault a Click
    $('a[href="#"]').on("click", function ($) {
        $.preventDefault();
    });

    // :: Preloader Active Code
    flapt_window.on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    $(".toggle-password").click(function() {
        $(this).toggleClass("fa-eye-slash fa-eye");
        var input = $(this).parent().find("input");
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
    
    setTimeout(function() {
        $('.alert-success').fadeOut(); // This will fade out the element with the ID 'alert-success'
    }, 3000);
    setTimeout(function() {
        $('.alert-danger').fadeOut(); // This will fade out the element with the ID 'alert-success'
    }, 3000);
    
    

})(jQuery);




// $(document).ready(function(){
//     // var xhr = new XMLHttpRequest();
//     if (window.localStorage.getItem('user_token') == null) {
//         // alert('cccccccccccccccc');
//         location.replace("http://192.168.1.38:4000/mentor-login")
//     }
//     //  else {
//     //     alert('dddddddddddddddd');
//     //     xhr.open('GET', 'http://192.168.1.38:4000/mentorprofile'); // Open the XMLHttpRequest before setting headers
//     //     xhr.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('user_token'));
//     //     console.log(">>>>>>>>",xhr.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('user_token')));
//     //     console.log(xhr);

//     // }
// });
