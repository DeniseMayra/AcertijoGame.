//import "dotenv/config";    //tira el error Los módulos relativos especificados deben comenzar con “./”, “../” o “/”.
//import "../node_modules/dotenv/config.js"   //Uncaught ReferenceError: require is not defined en config.js
import {saveWin, getWinners} from './firebase.js';
import { login, logout} from './firebase.js';

// --------------------------- AUTENTICACION VARIABLES ---------------------------

const loginB = document.getElementById('loginB');
const logoutB = document.getElementById('logoutB');

const userP = document.getElementById('userPhoto');
const userN = document.getElementById('userName');

let currentUser=null

// --------------------------- VARIABLES ---------------------------
let correct=[]
let lives = 0
let start = 0
let end = 0
let time = 0
let intentos =0
let winner = false

// --------------------------- RANDOM ---------------------------
function randomNum(){   
    let i=0
    while(i<4){
        let oneNumber = Math.floor(Math.random()*10)

        correct[i] = oneNumber
        let j=0
        while(j<i){     //verifica que no se repita 
            if(correct[i]==correct[j]){
                oneNumber = Math.floor(Math.random()*10)
                correct[i] = oneNumber
                j=0
            }else{j++}
        }
        i++
    }
}

// --------------------------- DEFINIR BOTONES ---------------------------
document.getElementById('againW').addEventListener('click', againFn);
document.getElementById('againL').addEventListener('click', againFn);

let tableB = document.querySelectorAll(".tableB")
for(let buton of tableB){
    buton.addEventListener('click', showTable);
}

document.getElementById("easyB").addEventListener('click', easyF);
document.getElementById("dificultB").addEventListener('click', difF);
document.getElementById("expertB").addEventListener('click', expertF);

document.getElementById("Back").addEventListener('click', hideTable);

const dificultScreen = document.getElementById('dificult')

const winScreen = document.getElementById('win')
const lostScreen = document.getElementById('lost')

const tableCont = document.getElementById('tableContainer')

// --------------------------- REINICIO ---------------------------

function againFn(){
    dificultScreen.style.display='flex'
    winScreen.style.display='none'
    lostScreen.style.display='none'

    // limpio todo lo que use
    let items = document.getElementsByClassName('item')
    while(items.length>0){
        items[0].parentNode.removeChild(items[0])
    }
    let livesPrinted = document.getElementsByClassName('fa-heart')
    while(livesPrinted.length>0){
        livesPrinted[0].parentNode.removeChild(livesPrinted[0])
    }

    if(winner){
        let winCar = document.getElementById('winCartel')
        winCar.remove();
    }else{
        let correctNum = document.getElementById('correctNum')
        correctNum.removeChild(correctNum.lastElementChild)
    }
    
    start = 0
    end = 0
    time = 0
    intentos = 0
    winner = false
}

// --------------------------- DIFICULTAD ---------------------------

function easyF(){
    randomNum()
    start = Date.now()
    lives = 15;
    // imprimo los corazones 
    dificultScreen.style.display='none'
    for(let i=0;i<15; i=i+1){
        let icon = document.createElement("i")
        icon.innerHTML = `<i class="fa-solid fa-heart"> </i> `
        let printcora = document.getElementById('printLives')
        printcora.appendChild(icon)
    }
}
function difF(){
    randomNum()
    start = Date.now()
    lives = 10;

    dificultScreen.style.display='none'
    for(let i=0;i<10; i=i+1){
        let icon = document.createElement("i")
        icon.innerHTML = `<i class="fa-solid fa-heart"> </i> `
        let printcora = document.getElementById('printLives')
        printcora.appendChild(icon)
    }
}
function expertF(){
    randomNum()
    start = Date.now()
    lives = 5;

    dificultScreen.style.display='none'
    for(let i=0;i<5; i=i+1){
        let icon = document.createElement("i")
        icon.innerHTML = `<i class="fa-solid fa-heart"> </i> `
        let printcora = document.getElementById('printLives')
        printcora.appendChild(icon)
    }
}

async function showTable(){
    const winners = await getWinners()
    insertHTML(winners)

    dificultScreen.style.display='none'
    tableCont.style.display='flex'
}
function hideTable(){
    dificultScreen.style.display='flex'
    tableCont.style.display='none'
}

// --------------------------- GAME OVER ---------------------------
function youWin(){
    winner = true       //flag para que en again limpie
    dificultScreen.style.display ='none'

    //imprimo el tiempo que tardo
    let time = end - start
    let sec = Math.floor(time/1000)
    let min = 0
    let hour = 0
    while(sec>60){
        min++
        sec-=60
    }
    while(min>60){
        hour++
        min-=60
    }
    let paragh = document.createElement("p")
    paragh.id = 'winCartel'
    paragh.innerHTML = `Ganaste el Juego en ${hour}:${min}:${sec}`
    winScreen.prepend(paragh)
     
    winScreen.style.display='flex'   //muestro cartel
    
    // guardo nueva fila en base de datos
    if(currentUser != undefined){
        let win = {
            email: currentUser.email,
            name: currentUser.displayName,
            totalTime: time,
            intento: intentos
        }
        saveWin(win) 
    }
   /*  winners.push(win)
    let jsonwin = JSON.stringify(winners)
    localStorage.setItem('winners', jsonwin)
    insertHTML() */
}
function youLose(){
    lostScreen.style.display='flex'
    // imprimo el numero correcto 
    let num = correct.join("")  //join para concatenar el array con "" entre medio
    let correctNumber = document.getElementById('correctNum')
    let paragh = document.createElement("span")
    paragh.innerHTML= `${num}`
    correctNumber.appendChild(paragh)
}

// --------------------------- ANALISIS DEL JUEGO ---------------------------
function analyze(num){
    intentos++
    let right = 0
    let wrong =0
    
    for(let i=0;i<4; i++){
        if(num[i] == correct[i]){       //analizo bien posicionados 
            right++
        }else{
            for(let j=0; j<4 ;j++){     //analizo mal posicionados
                if(num[i] == correct[j]){
                    wrong++
                }
            }
        }
    }
    if(right==4){
        end = Date.now()
        youWin()
    }else{
        const container = document.getElementById('information')
        if(right==0 && wrong==0){
            let item = document.createElement("div")
            item.className = "item"
            item.innerHTML = `<div class="code">${num}</div>
                                <div class="codeInf">
                                    <p>Ninguno es Correcto </p>
                                </div>`
            container.appendChild(item)

        }else{
            let item = document.createElement("div")
            item.className = "item"
            item.innerHTML = `<div class="code">${num}</div>
                                <div class="codeInf">
                                    <p>Números Correctos y Bien Posicionados: ${right}</p>
                                    <p>Números Correctos Pero Mal Posicionados: ${wrong} </p>
                                </div>`
            container.appendChild(item)
        }
        lives--
        let coraContainer = document.getElementById('printLives')
        coraContainer.removeChild(coraContainer.lastElementChild)
        if(lives==0){
            youLose()
        }
    }

}

// --------------------------- VALIDA INPUT ---------------------------

let inputNum = document.getElementById('inputName')
inputNum.addEventListener('input', function(){
    if(this.value.length > 4){
        this.value = this.value.slice(0,3)
    }
})

document.getElementById('check').addEventListener('click', validate)

function validate(){
    let validFlag = true
    let number = document.getElementById('inputName')
    let i=1
    while(i<4 && validFlag){
        let j=0
        while(j<i && validFlag){
            if(number.value[i]==number.value[j]){       //valida si se repite el numero 
                alert("Ingrese 4 números DISTINTOS")
                validFlag= false
            }else{j++}
        }
        if(number.value[i] == null){                    //valida si se ingresa menos de 4 numeros 
            alert("Ingrese 4 números DISTINTOS")
            validFlag= false
        }
        i++
    }
    if(validFlag){
        analyze(number.value)
    }
    number.value = "";
}

// --------------------------- LOCAL STORAGE ---------------------------
function insertHTML(winners){
    // ordena el array de totalTime menor a mayor
    let winnersOrd = winners.sort((c1,c2) => (c1.totalTime>c2.totalTime) ? 1 : (c1.totalTime<c2.totalTime) ? -1 :0)

    let id = 0
    let tBody = document.getElementById('tbody')
    
    //limpia lo que haya
    while(tBody.firstChild){
        tBody.removeChild(tBody.firstChild)
    }

    winnersOrd.map(win => {
        let sec = Math.floor(win.totalTime/1000)
        let min = 0
        let hour = 0
        while(sec>60){
            min++
            sec-=60
        }
        while(min>60){
            hour++
            min-=60
        }
        id++
        let tr = document.createElement('tr')
        tr.innerHTML = `<th scope="row">${id}</th>
            <td>${win.name}</td>
            <td>${hour}:${min}:${sec}</td>
            <td>${win.intento}</td>
        `
        tBody.appendChild(tr)
    }) 
}
//cuando se refresca la pagina vuelve a analizar el local storage
/* window.onload = function(){
    let storageData = JSON.parse(localStorage.getItem('winners'))
    if(storageData){
        winners = storageData
        insertHTML()
    }
} */

// --------------------------- AUTENTICACION ---------------------------


loginB.addEventListener('click', async() => {
    try{
        currentUser = await login()
        insertUser()
        loginB.style.display = 'none'
        logoutB.style.display = 'block'
    }catch(error){
        console.log(error)
    }
})
 
logoutB.addEventListener('click', async() => {
    logout()
    currentUser = null
    loginB.style.display = 'block'
    logoutB.style.display = 'none'
    userP.removeChild(userP.lastElementChild)
    userN.removeChild(userN.lastElementChild)
})

function insertUser(){
    let img = document.createElement('img')
    img.src = `${currentUser.photoURL}`
    userP.appendChild(img)

    let nam = document.createElement('p')
    nam.innerHTML = `${currentUser.displayName}`
    userN.appendChild(nam)
}
