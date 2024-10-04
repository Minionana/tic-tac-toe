let boxes = document.querySelectorAll("td")
let blocker = document.getElementsByClassName("blocker")[0]
let oTurn = true
let oStart = true
let draw = false
let win = false

let oScore = 0
let xScore = 0

let moves = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let positions = [-1, -1, -1]

const oIcon = "fa-regular fa-o oIcon"
const xIcon = "fa-solid fa-xmark xIcon"
const oInitIcon = "fa-regular fa-beat fa-o oIcon"
const xInitIcon = "fa-solid fa-beat fa-xmark xIcon"
const resetIcon = "fa-solid fa-minus none"

const oText = document.getElementById("oScore")
const xText = document.getElementById("xScore")

const placeAudio = document.getElementById("place")
const winAudio = document.getElementById("win")
const drawAudio = document.getElementById("draw")

start()

function start(){
    oTurn = oStart
    for (let i = 0; i < boxes.length; i++){
        let box = boxes[i]
        box.addEventListener("click", ()=> {
            {
                placeAudio.muted = false
                placeAudio.play()
                let icon = box.firstChild
                if (icon.className != "fa-solid fa-minus none"){
                    return
                }
            
                if (oTurn){
                    icon.className = oInitIcon
                    setTimeout(()=> {
                        icon.className = oIcon
                    }, 1000)
                    moves[i] = 1
                }
                else{
                    icon.className = xInitIcon
                    setTimeout(()=> {
                        icon.className = xIcon
                    }, 1000)
                    moves[i] = 5
                }
            
                checkWin(3)
                checkWin(15)
                
                oTurn = !oTurn
            }
        })

        box.firstChild.addEventListener("animationend", ()=> {
            box.firstChild.className = resetIcon
            box.firstChild.style.animation = null
            box.style.animation = null
            blocker.style.pointerEvents = "none"
        })
    }
}

function checkWin(sum){
    if (draw || win) {return}
    let r1 = moves[0] + moves[1] + moves[2]
    let r2 = moves[3] + moves[4] + moves[5]
    let r3 = moves[6] + moves[7] + moves[8]
    let c1 = moves[0] + moves[3] + moves[6]
    let c2 = moves[1] + moves[4] + moves[7]
    let c3 = moves[2] + moves[5] + moves[8]
    let d1 = moves[0] + moves[4] + moves[8]
    let d2 = moves[2] + moves[4] + moves[6]

    let winPositions = [-1, -1, -1]

    let color = sum == 3 ? "seagreen" : "brown"
    switch (sum){
        case r1:
            winPositions = [0, 1, 2]
            break
        case r2:
            winPositions = [3, 4, 5]
            break
        case r3:
            winPositions = [6, 7, 8]
            break
        case c1:
            winPositions = [0, 3, 6]
            break
        case c2:
            winPositions = [1, 4, 7]
            break
        case c3:
            winPositions = [2, 5, 8]
            break
        case d1:
            winPositions = [0, 4, 8]
            break
        case d2:
            winPositions = [2, 4, 6]
            break
    }

    if (winPositions[0] != -1){
        blocker.style.pointerEvents = "all"
        positions = winPositions
        win = true
        display(winPositions, color)
        return
    }
    
    if (moves.every((move)=> {return move != 0}) && sum == 15){
        drawAudio.muted = false
        drawAudio.play()
        draw = true
        boxes.forEach(box => {
            box.style.animation = "drawFadeIn 1s linear 1 normal both"
            setTimeout(() => {
                box.style.animation = "drawFadeOut 1s linear 1 normal both"
            }, 2000);
        })
        setTimeout(()=> {
            clear()
            oStart = !oStart
        }, 2000);
    }
}

function display(positions, color){
    winAudio.muted = false
    winAudio.play()
    if (color == "seagreen"){
        oScore += 1
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            boxes[pos].style.animation = "oFadeIn 1s linear 1 normal both"
            boxes[pos].style.animationDelay = (i * 0.2).toString() + "s"
        }
    }
    else{
        xScore += 1
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            boxes[pos].style.animation = "xFadeIn 1s linear 1 normal both"
            boxes[pos].style.animationDelay = (i * 0.2).toString() + "s"
        }
    }

    oText.innerText = oScore.toString()
    xText.innerText = xScore.toString()

    setTimeout(()=> {
        clear()
        oStart = !oStart
    }, 2000);
}

function clear(){
    for (let i = 0; i < moves.length; i++) {
        box = boxes[i]
        if (positions.includes(i) && !draw){
            box.style.animation = moves[i] == 1 ? "oFadeOut 1s linear 1 normal both" : "xFadeOut 1s linear 1 normal both"
        }
        box.firstChild.style.animation = "iconFadeOut 1s linear 1 forwards"
    }
    moves = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    draw = false
    win = false
}