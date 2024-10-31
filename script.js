let filas, columnas, minas, tablero, revelado;
var primerTurno = true;
var enCurso = false;

const numeros = ["uno", "dos", "tres", "cuatro", "cinco", "seis"];

function mostrarEstado(){  //funcion para debug
  console.log("En Curso:", enCurso);
  console.log("Primer Turno", primerTurno)
  
}

//var btnMostrar = document.querySelector("#btn-mostr");
//btnMostrar.addEventListener('click', mostrarEstado);


function seleccionarDificultad() {
  const dificultad = document.getElementById("dificultad").value;
  const filasInput = document.getElementById("filas");
  const columnasInput = document.getElementById("columnas");
  const minasInput = document.getElementById("minas");
  const inputsPersonalizados = document.getElementById("inputs-personalizados");

  if (dificultad === "personalizado") {
    inputsPersonalizados.style.display = "block";
    filasInput.value = "";
    columnasInput.value = "";
    minasInput.value = "";
  } else {
    inputsPersonalizados.style.display = "none";

    switch (dificultad) {
      case "facil":
        filasInput.value = 8;
        columnasInput.value = 8;
        minasInput.value = 10;
        break;
      case "medio":
        filasInput.value = 12;
        columnasInput.value = 12;
        minasInput.value = 24;
        break;
      case "dificil":
        filasInput.value = 16;
        columnasInput.value = 16;
        minasInput.value = 40;
        break;
      case "muy_dificil":
        filasInput.value = 20;
        columnasInput.value = 20;
        minasInput.value = 60;
        break;
      case "hardcore":
        filasInput.value = 24;
        columnasInput.value = 24;
        minasInput.value = 99;
        break;
      case "leyenda":
        filasInput.value = 30;
        columnasInput.value = 30;
        minasInput.value = 150;
        break;
    }
  }
}


function iniciarJuego() {
  filas = parseInt(document.getElementById("filas").value);
  columnas = parseInt(document.getElementById("columnas").value);
  minas = parseInt(document.getElementById("minas").value);

  if (filas < 5 || columnas < 5 || minas < 1 || minas >= filas * columnas) {
    alert("Por favor, ingrese valores válidos.");
    return;
  }

  // Inicializar tablero y celdas reveladas
  tablero = Array.from({ length: filas }, () => Array(columnas).fill(0));
  revelado = Array.from({ length: filas }, () => Array(columnas).fill(false));

  //restablecer el primer turno
  primerTurno = true;

  // Generar el tablero HTML
  generarTableroHTML();
}

function generarTableroHTML() {
  const tableroDiv = document.getElementById("tablero");
  tableroDiv.innerHTML = "";
  tableroDiv.style.gridTemplateRows = `repeat(${filas + 2}, 32px)`;
  tableroDiv.style.gridTemplateColumns = `repeat(${columnas + 2}, 32px)`;

  tableroDiv.style.display = "grid";

  for (let i = 0; i < filas; i++) {

    //Esquina izquierda
    if(i == 0){
      let bordeTL = document.createElement("div");
      bordeTL.className = "top-left";
      tableroDiv.appendChild(bordeTL);

      //Bordes superiores
      for(let k = 0; k < columnas; k++){
        let bordeT = document.createElement("div");
        bordeT.className = "top";
        tableroDiv.appendChild(bordeT);
      }

      //Esquina derecha arriba
      const bordeTR = document.createElement("div");
      bordeTR.className = "top-right";
      tableroDiv.appendChild(bordeTR);
    }

    for (let j = 0; j < columnas; j++) {

      //Bordes izq
      if(j == 0){
        let bordeI = document.createElement("div");
        bordeI.className = "left";
        tableroDiv.appendChild(bordeI);
      }

      const celda = document.createElement("div");
      celda.className = "celda";
      celda.dataset.fila = i;
      celda.dataset.columna = j;
      celda.onclick = () => revelarCelda(i, j);
      celda.oncontextmenu = (e) => {
        e.preventDefault();
        marcarCelda(i, j);
      };
      tableroDiv.appendChild(celda);

      if(j == columnas - 1){
        let bordeD = document.createElement("div");
        bordeD.className = "right";
        tableroDiv.appendChild(bordeD);
      }
      
    }

    //Esquina izquierda abajo
    if(i == filas - 1){
      let bordeBL = document.createElement("div");
      bordeBL.className = "bottom-left";
      tableroDiv.appendChild(bordeBL);

      //Bordes inferiores
      for(let l = 0; l < columnas; l++){
        let bordeB = document.createElement("div");
        bordeB.className = "bottom";
        tableroDiv.appendChild(bordeB);
      }

      //Esquina derecha abajo
      const bordeBR = document.createElement("div");
      bordeBR.className = "bottom-right";
      tableroDiv.appendChild(bordeBR);
    }

  }
}

function colocarMinas(filaI, colI) {
  let minasColocadas = 0;
  while (minasColocadas < minas) {
    const fila = Math.floor(Math.random() * filas);
    const columna = Math.floor(Math.random() * columnas);
    if (tablero[fila][columna] === 0 && fila != filaI && columna != colI) {
      tablero[fila][columna] = "M";
      minasColocadas++;
      actualizarNumeros(fila, columna);
    }
  }
}

function actualizarNumeros(fila, columna) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nuevaFila = fila + i;
      const nuevaColumna = columna + j;
      if (esValido(nuevaFila, nuevaColumna) && tablero[nuevaFila][nuevaColumna] !== "M") {
        tablero[nuevaFila][nuevaColumna]++;
      }
    }
  }
}

function revelarCelda(fila, columna) {
  if (!esValido(fila, columna) || revelado[fila][columna]) return;

  if(primerTurno == true){
    colocarMinas(fila, columna);
    primerTurno = false;
    enCurso = true;
  }

  const celdaDiv = document.querySelector(`.celda[data-fila='${fila}'][data-columna='${columna}']`);
  revelado[fila][columna] = true;
  celdaDiv.classList.add("revelada");

  if (tablero[fila][columna] === "M") {
    celdaDiv.classList.add("mina");
    revelarMinas("derrota");
    alert("Perdiste! Has caído en una mina.");
    enCurso = false;
    return;
  }

  const minasCerca = tablero[fila][columna];
  if (minasCerca > 0) {
    celdaDiv.classList.add(`${numeros[minasCerca - 1]}`);
  } else {
    // Revelar celdas vacías adyacentes
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        revelarCelda(fila + i, columna + j);
      }
    }
  }

  verificarVictoria();
}


function revelarMinas(estado){
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {

      const celdaDiv = document.querySelector(`.celda[data-fila='${i}'][data-columna='${j}']`);

      if (celdaDiv.className == "celda bandera") {

        if (tablero[i][j] !== "M") {
      
          celdaDiv.classList.add("error");
        }

      } else {

        if (tablero[i][j] === "M" && estado === "derrota") {
          celdaDiv.classList.add("mina");
        }

        if (tablero[i][j] === "M" && estado === "victoria") {
          celdaDiv.classList.add("celda");
          celdaDiv.classList.add("bandera");
        }
      }
    }
  }
}

function marcarCelda(fila, columna) {
  const celdaDiv = document.querySelector(`.celda[data-fila='${fila}'][data-columna='${columna}']`);
  if (!revelado[fila][columna]) {
    celdaDiv.classList.toggle("bandera");
  }
}

function verificarVictoria() {
  let celdasReveladas = 0;
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (revelado[i][j] && tablero[i][j] !== "M") {
        celdasReveladas++;
      }
    }
  }
  if (celdasReveladas === filas * columnas - minas) {
    revelarMinas("victoria");
    alert("¡Felicidades, has ganado!");
    enCurso = false;
  }
}

function esValido(fila, columna) {
  return fila >= 0 && fila < filas && columna >= 0 && columna < columnas;
}
