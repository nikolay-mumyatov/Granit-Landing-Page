$(function () {
    var humburgerBtn = $('.humburger_btn'),
        close = $('.close-btn');

    humburgerBtn.on('click', function() {
        $('.menu').toggleClass('menu_active');
    });

    close.click(function (e) { 
        e.preventDefault();
        $('.menu').toggleClass('menu_active');
    });    
});