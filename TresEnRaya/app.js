function empezarJuego(){
    var tipoJuego = document.getElementsByName("tipoJuego");
    var modoJuego = document.getElementsByName("modoJuego");
    var modoSeleccionado;
    var tipoSeleccionado;
    for (var i = 0; i < tipoJuego.length; i++) {
        if (tipoJuego[i].checked) {
            tipoSeleccionado = tipoJuego[i].value;
        }
    }
    for (var i = 0; i < modoJuego.length; i++) {
        if (modoJuego[i].checked) {
            modoSeleccionado = modoJuego[i].value;
        }
    }
    window.location.href = 'tablero.html?tipoJuego=' + 
    encodeURIComponent(tipoSeleccionado) + '&modoJuego=' + encodeURIComponent(modoSeleccionado);
}



