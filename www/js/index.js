$(document).bind("mobileinit", function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.pageLoadErrorMessage = "Ha ocurrido un error al cargar la vista";
    $.mobile.loadingMessage = "Espere un momento...";
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.pushStateEnabled = true;
});