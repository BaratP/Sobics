$(document).ready(function () {
    let kep;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            kep='<div></div>';
            $(kep).appendTo('#jatekter').css({
                position: 'absolute',
                top: (i*50),
                left: (j*50),
                width: 40,
                height: 40,
                background: 'green'
            });
        }
    }
    $(kep).click(function () {
        if ($(this).css('background')==='green') $(this).css({background: 'blue'})
    })
});