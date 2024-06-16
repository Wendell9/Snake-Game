const canvas = document.querySelector("canvas");
//Contexto
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")
//tamanho da cobrinha
const size = 30;

const initialPosition={x: 300, y: 300}

const audio = new Audio('../assets/audio.mp3')

let snake = [
    { x: 300, y: 300 }
]


let direction, loopId

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10
}

const randomNumber = (min, max) => {
    let numeroAleatorio = Math.round(Math.random() * (max - min)) + min;
    return numeroAleatorio
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red},${green},${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

//Define a cor do objeto

const drawSnake = () => {
    ctx.fillStyle = "red";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "orange";
        }
        ctx.fillRect(position.x, position.y, size, size)
    })

}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    snake.shift()

    if (direction == "right") {
        //remove o primeiro elemento do array
        //use chaves para indicar o elemento do array
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        //remove o primeiro elemento do array
        //use chaves para indicar o elemento do array
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "up") {
        //remove o primeiro elemento do array
        //use chaves para indicar o elemento do array
        snake.push({ x: head.x, y: head.y - size })
    }
    if (direction == "down") {
        //remove o primeiro elemento do array
        //use chaves para indicar o elemento do array
        snake.push({ x: head.x, y: head.y + size })
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "white"

    for (let index = 30; index < canvas.width; index += 30) {
        //Abaxo indica que a coordenada abaixo de begin path é a primeira onde se inicia as linhas
        ctx.beginPath()
        //Aqui são colocadas as coordenadas iniciais e finais da linha
        ctx.lineTo(index, 0)
        ctx.lineTo(index, 600)
        ctx.stroke()

        //Abaxo indica que a coordenada abaixo de begin path é a primeira onde se inicia as linhas
        ctx.beginPath()
        //Aqui são colocadas as coordenadas iniciais e finais da linha
        ctx.lineTo(0, index)
        ctx.lineTo(600, index)
        ctx.stroke()
    }
}

const chackEat = () => {
    head = snake[snake.length - 1]
    if (head.x == food.x && head.y == food.y) {
        audio.play()
        snake.push(head)


        let x = randomPosition();
        let y = randomPosition();
        incrementScore();

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }
        food.x = x;
        food.Y = y;
        food.color = randomColor();
        drawFood();
    }
}

const checkColision = () => {
    const head = snake[snake.length - 1]
    const wallCollision = head.x < 0 || head.x > canvas.width - size || head.y < 0 || head.y > canvas.width - size
    for (let index = 0; index < snake.length - 2; index++) {
        if (snake[index].x == head.x && snake[index].y == head.y) {
            gameOver()
        }
    }

    if (wallCollision) {
        //alert
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = "flex"
    finalScore.textContent = score.textContent
    canvas.style.filter = "blur(2px)";

}

const gameloop = () => {
    //Limpa os loops para não gerar bugs
    clearInterval(loopId)
    //Aqui você define a questão da limpeza do canvas, para dar a sensação de movimento
    ctx.clearRect(0, 0, 600, 600);
    drawGrid()
    drawFood();

    moveSnake();
    drawSnake();
    chackEat();

    checkColision()

    //Aqui define o tempo de atualização da cobrinha
    loopId = setTimeout(() => {
        gameloop()
    }, 100);
}

gameloop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    snake = [
        initialPosition
    ]
    canvas.style.filter="none"
})