let correct=[]
let lives = 0
let start = 0
let end = 0
let time = 0
let userName
let intentos =0
let winners = []
let winner = false

// --------------------------- RANDOM ---------------------------
function randomNum(){
    let i=0
    while(i<4){
        let oneNumber = Math.floor(Math.random()*10)

        correct[i] = oneNumber
        let j=0
        while(j<i){
            if(correct[i]==correct[j]){
                oneNumber = Math.floor(Math.random()*10)
                correct[i] = oneNumber
                j=0
            }else{j++}
        }
        i++
    }
    //console.log(correct)
}

// --------------------------- DIFICULTAD ---------------------------
/* let againB = document.querySelectorAll(".again")
for(let buton of againB){
    buton.addEventListener('click', againFn);
} */
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

let dificultScreen = document.getElementById('dificult')
let userNameInp = document.getElementById('userName')

function againFn(){
    dificultScreen.style.display='flex'
    document.getElementById('win').style.display='none'
    document.getElementById('lost').style.display='none'

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
    userName = ""
    intentos = 0
    winner = false
}

function easyF(){
    randomNum()
    start = Date.now()
    lives = 15;
    userName = userNameInp.value
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
    userName = userNameInp.value

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
    userName = userNameInp.value

    dificultScreen.style.display='none'
    for(let i=0;i<5; i=i+1){
        let icon = document.createElement("i")
        icon.innerHTML = `<i class="fa-solid fa-heart"> </i> `
        let printcora = document.getElementById('printLives')
        printcora.appendChild(icon)
    }
}

function showTable(){
    dificultScreen.style.display='none'
    document.getElementById('tableContainer').style.display='flex'
}
function hideTable(){
    dificultScreen.style.display='flex'
    document.getElementById('tableContainer').style.display='none'
}

// --------------------------- GAME OVER ---------------------------
function youWin(){
    winner = true
    dificultScreen.style.display ='none'
    time = end - start
    sec = Math.floor(time/1000)
    min = Math.floor(time/60000)
    hour = 0
    while(min>60){
        hour++
        min-=60
    }
    let winContainer = document.getElementById('win')
    let paragh = document.createElement("p")
    paragh.id = 'winCartel'
    paragh.innerHTML = `Ganaste el Juego en ${hour}:${min}:${sec}`
    winContainer.prepend(paragh)
     
    winContainer.style.display='flex'
    
    let win = {
        name: userName,
        totalTime: time,
        intento: intentos
    }
    winners.push(win)
    let jsonwin = JSON.stringify(winners)
    localStorage.setItem('winners', jsonwin)
    insertHTML()
}
function youLose(){
    document.getElementById('lost').style.display='flex'
    let num = correct.join("")
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
        if(num[i] == correct[i]){
            right++
        }else{
            for(let j=0; j<4 ;j++){
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
        if(right==0 && wrong==0){
            let item = document.createElement("div")
            item.className = "item"
            item.innerHTML = `<div class="code">${num}</div>
                                <div class="codeInf">
                                    <p>Ninguno es Correcto </p>
                                </div>`
            let container = document.getElementById('information')
            container.appendChild(item)
        }else{
            let item = document.createElement("div")
            item.className = "item"
            item.innerHTML = `<div class="code">${num}</div>
                                <div class="codeInf">
                                    <p>Números Correctos y Bien Posicionados: ${right}</p>
                                    <p>Números Correctos Pero Mal Posicionados: ${wrong} </p>
                                </div>`
            let container = document.getElementById('information')
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
function onlyNumber(e){
    key = e.keyCode || e.which
    keyboard = String.fromCharCode(key)
    number = "0123456789"
    special = "8-37-38-46"
    keyboardSpecial = false
    for(var i in special){
        if(key==special[i]){
            keyboardSpecial=true;
        }
    }
    if(number.indexOf(keyboard) == -1 && !keyboardSpecial){
        return false;
    }
}
function maxLenght(e){
    if(e.value.lenght > e.maxLenght){
        e.value = e.value.slice(0,e.maxLenght)
    }
}
document.getElementById('check').addEventListener('click', validate)

function validate(){
    let validFlag = true
    let number = document.getElementById('inputName')
    let i=1
    while(i<4 && validFlag){
        let j=0
        while(j<i && validFlag){
            if(number.value[i]==number.value[j]){
                alert("Ingrese 4 números DISTINTOS")
                validFlag= false
            }else{j++}
        }
        if(number.value[i] == null){
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
function insertHTML(){
    let winnersOrd = winners.sort((c1,c2) => (c1.totalTime>c2.totalTime) ? 1 : (c1.totalTime<c2.totalTime) ? -1 :0)

    let id = 0
    let tBody = document.getElementById('tbody')
    
    while(tBody.firstChild){
        tBody.removeChild(tBody.firstChild)
    }

    winnersOrd.map(win => {
        time = win.totalTime
        sec = Math.floor(time/1000)
        min = Math.floor(time/60000)
        hour = 0
        id++
        while(min>60){
            hour++
            min-=60
        }
        let tr = document.createElement('tr')
        tr.innerHTML = `<th scope="row">${id}</th>
            <td>${win.name}</td>
            <td>${hour}:${min}:${sec}</td>
            <td>${win.intento}</td>
        `
        tBody.appendChild(tr)
    })
}

window.onload = function(){
    let storageData = JSON.parse(localStorage.getItem('winners'))
    if(storageData){
        winners = storageData
        insertHTML()
    }
}
