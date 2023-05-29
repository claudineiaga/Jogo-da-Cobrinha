const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtendo a pontuação máxima do armazenamento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;

const updateFoodPosition = () => {
    // Passando um valor aleatório de 1 a 30 como posição para pegar o ponto
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Zerando o cronômetro e recarregando a página no fim do jogo
    clearInterval(setIntervalId);
    alert("Você Perdeu! Pressione OK para recomeçar...");
    location.reload();
}

const changeDirection = e => {
    // Alterando o valor da velocidade com base no pressionamento de tecla
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Chamando changeDirection em cada clique de tecla e passando o valor do conjunto de dados da chave como um objeto
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Verificando se a cobra atingiu o momento de pegar o ponto
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Aumentando a cobra de tamanho ao comer o ponto
        score++; // incrementando pontuação +1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontuação: ${score}`;
        highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;
    }
    // Atualizando a posição da cabeça da cobra com base na velocidade atual
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Deslocando para frente os valores dos elementos no corpo da cobra em 1
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Configurando o primeiro elemento do corpo da cobra para a posição atual da cobra

    // Verificando se a cabeça da cobra está fora da parede, em caso afirmativo, definindo gameOver como verdadeiro
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adicionando um div para cada parte do corpo da cobra
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verificando se a cabeça da cobra atingiu o corpo, em caso afirmativo, defina gameOver como verdadeiro
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);