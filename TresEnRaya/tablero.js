let tiempoInicio;
let tiempoRestanteJugada = 30000;
let intervaloContador;
let intervaloRestante;
var urlParams = new URLSearchParams(window.location.search);
var tipoJuego = urlParams.get("tipoJuego");
var modoJuego = urlParams.get("modoJuego");
var tipo = document.getElementById("tipo");
var modo = document.getElementById("modo");
modo.innerText = "Modo: " + modoJuego + " fichas";

var nVictoriasJ= document.getElementById("nVictoriasJ");
var nEmpatesJ= document.getElementById("nEmpatesJ");
var nDerrotasJ = document.getElementById("nDerrotasJ");
var nVictoriasOtro = document.getElementById("nVictoriasOtro");
var nEmpatesOtro = document.getElementById("nEmpatesOtro");
var nDerrotasOtro = document.getElementById("nDerrotasOtro");
var mensajeGanador = document.getElementById("ganador"); // nuevo

var victoriasJugador = 0;
var empatesJugador = 0;
var derrotasJugador = 0;
var victoriasOtroJugador = 0;
var empatesOtroJugador = 0;
var derrotasOtroJugador = 0;

var otroJugador = document.getElementById("otroJugador");
if(tipoJuego == "1vsCPU"){
    otroJugador.innerText = "CPU (aleatorio)";
    tipo.innerText = "Tipo: 1 vs aleatorio";
}else if(tipoJuego == "1vsIA"){
    otroJugador.innerText = "IA";
    tipo.innerText = "Tipo: 1 vs IA";
}else{
    otroJugador.innerText = "Jugador 2";
    tipo.innerText = "Tipo: 2 jugadores";
}

let tablero = ["", "", "", "", "", "", "", "", ""];
let jugadorActual = "X";
let fichaJugadorActual = '<img src="./imagenes/boton-x.png">'; // nuevo
let terminar = false;
var mensajeGanador = document.getElementById("ganador"); // nuevo
mensajeGanador.innerHTML = ""; // nuevo
mensajeGanador.style.display = "none";

function jugar(event) {
    if(terminar){
        return;
    }
    if (!tiempoInicio) {
        tiempoInicio = Date.now();
        intervaloContador = setInterval(actualizarTiempoJuego, 1000);
    }
    
    
    const casilla = event.target; // con target capturamos unicamente el elemento de la tabla que hemos clickado
    const indice = casilla.dataset.indice; // capturamos el inice del elemento clickado

    // intento de eliminar ficha cuando es 1vs1
    var contadorX = 0;
    var contador0 = 0;
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "X") {
            contadorX++;
        }else if(tablero[i] === "0"){
            contador0++;
        }
    }
    // tenemos en cuenta los modos de juego para ver como actua el contador de tiempo de partida
    if(modoJuego == "9" || (modoJuego == "6" && (contadorX != 3 || contador0!=3))){
        tiempoRestanteJugada = 30000; // Reiniciamos el tiempo restante a 30 segundos
        clearInterval(intervaloRestante); // Detenemos cualquier intervalo existente
        intervaloRestante = setInterval(actualizarTiempoJugada, 1000); // Creamos un nuevo intervalo
    }
    

    if ((contadorX === 3 && contador0 === 3) && modoJuego === "6") {
        document.querySelectorAll('.casilla').forEach(function(casilla) { // recorremos todas las casillas
            casilla.addEventListener("contextmenu", function (e) { // y les añadimos el listener
                e.preventDefault() // evita que aparezca el menu
                const indiceClick = this.dataset.indice;
                if (tablero[indiceClick] === "X" && jugadorActual == "X") {
                    tablero[indiceClick] = "";
                    casilla.innerHTML = "";
                }else if (tablero[indiceClick] === "0" && jugadorActual == "0"){
                    tablero[indiceClick] = "";
                    casilla.innerHTML = "";
                }
            })
        })
        return; // para que no deje poner más fichas
    }
        
    if (tablero[indice] === "") {
        tablero[indice] = jugadorActual;
        casilla.innerHTML = fichaJugadorActual;
    }
    if (comprobarVictoria()) {
        detenerContador();
        if(jugadorActual == "X"){
            mostrarResultadoVictoria();
        }else{
            mostrarResultadoVictoriaJ2();
        }
    } else if (tableroCompleto()) {
        mostrarResultadoEmpate();
        detenerContador();
    } else {
        cambiarTurno();
        if (jugadorActual === "0") {
            if(tipoJuego == "1vsCPU"){
                jugarCPU();
            }else if(tipoJuego == "1vsIA"){
                jugarIA();
            }
        }
    }
}

function comprobarVictoria(){
    const lineasGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (const linea of lineasGanadoras) {
        const [a, b, c] = linea;
        if (tablero[a] !== "" && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return true;
        }
    }
    return false;
}

function tableroCompleto() {
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            return false;
        }
        
    }
    return true;
}

function cambiarTurno() {
    if(jugadorActual == "X"){
        jugadorActual = "0";
        fichaJugadorActual = '<img src="./imagenes/boton-0.png">';
    }else{
        jugadorActual = "X";
        fichaJugadorActual = '<img src="./imagenes/boton-x.png">';
    }
}

function jugarCPU(){
    if(terminar){
        return;
    }
    // eliminar ficha cuando fichas de la CPU sea = 3
    var fichasCPU = 0;
    var casillasCon0 = [];
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "0") {
            fichasCPU++;
            casillasCon0.push(i);
        }
    }
    if(modoJuego === "6" && fichasCPU == 3){
        const casillaRandom0 = casillasCon0[Math.floor(Math.random() * casillasCon0.length)];
        tablero[casillaRandom0] = "";
        document.querySelector(`.casilla[data-indice="${casillaRandom0}"]`).innerHTML = "";
    }

    let casillasDisponibles = [];
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            casillasDisponibles.push(i);
        }
    }
    if (casillasDisponibles.length > 0) {
        const indiceAleatorio = casillasDisponibles[Math.floor(Math.random() * casillasDisponibles.length)];
        tablero[indiceAleatorio] = jugadorActual;
        document.querySelector(`.casilla[data-indice="${indiceAleatorio}"]`).innerHTML = fichaJugadorActual;

        if (comprobarVictoria()) {
            detenerContador();
            mostrarResultadoVictoria2();
        } else if (tableroCompleto()) {
            detenerContador();
            mostrarResultadoEmpate();
        } else {
            cambiarTurno();
        }
    }
}

function jugarIA(){
    if(terminar){
        return;
    }
    const lineasGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
    var fichasIA = 0;
    var casillasCon0 = [];
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "0") {
            fichasIA++;
            casillasCon0.push(i);
        }
    }
    if(modoJuego === "6" && fichasIA == 3){ // se ejecuta solo en el modo 6 fichas
        var casillaSeleccionadaIA;
        for (let i = 0; i < casillasCon0.length; i++) {
            var casillaSeleccionada = true;
            for (const linea of lineasGanadoras) {
                const [a, b, c] = linea;
                if(tablero[a] == "" && tablero[b] == "" && tablero[c] == ""){
                }else{
                    if(casillasCon0[i] == a){
                        if(tablero[a] == "0" && tablero[b] == "0" && tablero[c] == ""){
                            casillaSeleccionada = false;
                            break;
                        }else if (tablero[a] == "0" && tablero[b] == "" && tablero[c] == "0"){
                            casillaSeleccionada = false;
                            break;
                        }else if(tablero[a] == "0" && tablero[b] == "X" && tablero[c] == "X"){
                            casillaSeleccionada = false;
                            break;
                        }
                    }else if (casillasCon0[i] == b){
                        if(tablero[a] == "0" && tablero[b] == "0" && tablero[c] == ""){
                            casillaSeleccionada = false;
                            break;
                        }else if (tablero[a] == "" && tablero[b] == "0" && tablero[c] == "0"){
                            casillaSeleccionada = false;
                            break;
                        }else if(tablero[a] == "X" && tablero[b] == "0" && tablero[c] == "X"){
                            casillaSeleccionada = false;
                            break;
                        }
                    }else if (casillasCon0[i] == c){
                        if(tablero[a] == "0" && tablero[b] == "" && tablero[c] == "0"){
                            casillaSeleccionada = false;
                            break;
                        }else if (tablero[a] == "" && tablero[b] == "0" && tablero[c] == "0"){
                            casillaSeleccionada = false;
                            break;
                        }else if(tablero[a] == "X" && tablero[b] == "X" && tablero[c] == "0"){
                            casillaSeleccionada = false;
                            break;
                        }
                    }
                }
            }
            if(casillaSeleccionada){
                casillaSeleccionadaIA = casillasCon0[i];      // no entiendo este if 
                break;
            }
        }
        if(casillaSeleccionadaIA  == undefined){
            const casillaSeleccionadaRandom = casillasCon0[Math.floor(Math.random() * casillasCon0.length)];
            tablero[casillaSeleccionadaRandom] = "";
            document.querySelector(`.casilla[data-indice="${casillaSeleccionadaRandom}"]`).innerHTML = "";
        }else{
            tablero[casillaSeleccionadaIA] = "";
            document.querySelector(`.casilla[data-indice="${casillaSeleccionadaIA}"]`).innerHTML = "";
        }
        
    }

    let casillasDisponibles = [];
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            casillasDisponibles.push(i);
        }
    }
    if (casillasDisponibles.length === 8) {
        const indiceAleatorio = casillasDisponibles[Math.floor(Math.random() * casillasDisponibles.length)];
        tablero[indiceAleatorio] = jugadorActual;
        document.querySelector(`.casilla[data-indice="${indiceAleatorio}"]`).innerHTML = fichaJugadorActual;
    }else if(casillasDisponibles.length != 8 && casillasDisponibles.length > 0){
        var movimiento;
        for (const linea of lineasGanadoras) {
            const [a, b, c] = linea;
            if(tablero[a] == "" && tablero[b] == "" && tablero[c] == ""){

            }else{
                if (tablero[a] == "" && tablero[b] === tablero[c] && (tablero[b] == "X" || tablero[c] == "X")) {
                    movimiento = a;
                }else if (tablero[b] == "" && tablero[a] === tablero[c] && (tablero[a] == "X" || tablero[c] == "X")) {
                    movimiento = b;
                }else if (tablero[c] == "" && tablero[a] === tablero[b] && (tablero[a] == "X" || tablero[b] == "X")) {
                    movimiento = c;
                }else if (tablero[a] == "" && tablero[b] === tablero[c] && (tablero[b] == "0" || tablero[c] == "0")) {
                    movimiento = a;
                    break;
                }else if (tablero[b] == "" && tablero[a] === tablero[c] && (tablero[a] == "0" || tablero[c] == "0")) {
                    movimiento = b;
                    break;
                }else if (tablero[c] == "" && tablero[a] === tablero[b] && (tablero[a] == "0" || tablero[b] == "0")) {
                    movimiento = c;
                    break;
                }
            }
        }
        if(movimiento == undefined){
            let ultimasCasillasDisponibles = [];
            for (let i = 0; i < tablero.length; i++) {
                if (tablero[i] === "") {
                    ultimasCasillasDisponibles.push(i);
                }
            }
            const casillaAleatoria = ultimasCasillasDisponibles[Math.floor(Math.random() * ultimasCasillasDisponibles.length)];
            tablero[casillaAleatoria] = jugadorActual;
            document.querySelector(`.casilla[data-indice="${casillaAleatoria}"]`).innerHTML = fichaJugadorActual;
        }else{
            tablero[movimiento] = jugadorActual;
            document.querySelector(`.casilla[data-indice="${movimiento}"]`).innerHTML = fichaJugadorActual;
        } 
    }
    if (comprobarVictoria()) {
        detenerContador();
        mostrarResultadoVictoria2();
    } else if (tableroCompleto()) {
        detenerContador();
        mostrarResultadoEmpate();
    } else {
        cambiarTurno();
    }
}

function revancha(){
    historico.hidden = true;
    tablero = ["", "", "", "", "", "", "", "", ""];
    jugadorActual = "X";
    fichaJugadorActual = '<img src="./imagenes/boton-x.png">';
    terminar = false;
    tiempoInicio = null;
    document.getElementById("contador").textContent = "";
    document.getElementById("contadorJugada").textContent = "";
    intervaloContador = null;
    intervaloRestante = null;
    const casillas = document.querySelectorAll('.casilla');
    casillas.forEach(casilla => casilla.textContent = "");
    mensajeGanador.style.display = "none";
    mensajeGanador.innerHTML = "";
}

function mostrarResultadoVictoria(){
    historico.hidden = false;
    terminar = true;
    victoriasJugador++;
    derrotasOtroJugador++;
    nVictoriasJ.innerText = victoriasJugador;
    nDerrotasOtro.innerText = derrotasOtroJugador;
    mensajeGanador.style.display = "block";
    mensajeGanador.innerHTML = "Has Ganado!"; // nuevo
    mensajeGanador.style.backgroundColor = "rgba(0, 128, 0, 0.5)";

}

function mostrarResultadoVictoriaJ2(){
    historico.hidden = false;
    terminar = true;
    derrotasJugador++;
    victoriasOtroJugador++;
    nDerrotasJ.innerText = derrotasJugador;
    nVictoriasOtro.innerText = victoriasOtroJugador;
    mensajeGanador.style.display = "block";
    mensajeGanador.innerHTML = "Has Perdido!"; // nuevo
    mensajeGanador.style.backgroundColor = "rgba(128, 0, 0, 0.7)";
}

function mostrarResultadoVictoria2(){
    historico.hidden = false;
    terminar = true;
    victoriasOtroJugador++;
    derrotasJugador++;
    nDerrotasJ.innerText = derrotasJugador;
    nVictoriasOtro.innerText = victoriasOtroJugador;
    mensajeGanador.style.display = "block";
    mensajeGanador.innerHTML = "Has Perdido!"; // nuevo
    mensajeGanador.style.backgroundColor = "rgba(128, 0, 0, 0.7)";
}

function mostrarResultadoEmpate(){
    historico.hidden = false;
    terminar = true;
    empatesJugador++;
    empatesOtroJugador++;
    nEmpatesJ.innerText = empatesJugador;
    nEmpatesOtro.innerText = empatesOtroJugador;
    mensajeGanador.style.display = "block";
    mensajeGanador.innerHTML = "Has Empatado!"; // nuevo
    mensajeGanador.style.backgroundColor = "rgba(255, 165, 0, 0.7)";
}

function actualizarTiempoJuego() {
    const contadorElemento = document.getElementById("contador");
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    contadorElemento.textContent = `${tiempoTranscurrido} s`;
}

function actualizarTiempoJugada() {
    const contadorJugada = document.getElementById("contadorJugada");
    tiempoRestanteJugada -= 1000;
    const tiempoRestante = Math.floor(tiempoRestanteJugada / 1000);
    if (tiempoRestante === 0) {
        clearInterval(intervaloRestante);
        if (jugadorActual === "X") {
            detenerContador();
            mostrarResultadoVictoria2();
        }else if(jugadorActual === "0"){
            detenerContador();
            mostrarResultadoVictoria();
        }
    }
    contadorJugada.textContent = `${tiempoRestante} s`;
}

function detenerContador() {
    clearInterval(intervaloContador);
    clearInterval(intervaloRestante);
}

function empezarOtraVez(){
    window.location.href = '3EnRaya.html';
}