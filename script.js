// 游戏变量
let currentIdiom = null;
let score = 0;
let timeLeft = 60;
let timer = null;
let hintsUsed = 0;
let gameActive = false;

// DOM 元素
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const hintTextElement = document.getElementById('hint-text');
const idiomPlaceholderElement = document.getElementById('idiom-placeholder');
const userInputElement = document.getElementById('user-input');
const submitButton = document.getElementById('submit-btn');
const startButton = document.getElementById('start-btn');
const hintButton = document.getElementById('hint-btn');
const skipButton = document.getElementById('skip-btn');
const resultModal = document.getElementById('result-modal');
const finalScoreElement = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again-btn');

// 初始化游戏
function initGame() {
    // 重置游戏状态
    score = 0;
    timeLeft = 60;
    hintsUsed = 0;
    gameActive = true;
    
    // 更新UI
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    
    // 启用按钮
    userInputElement.disabled = false;
    submitButton.disabled = false;
    hintButton.disabled = false;
    skipButton.disabled = false;
    startButton.disabled = true;
    
    // 清空输入框
    userInputElement.value = '';
    userInputElement.focus();
    
    // 选择一个成语
    selectRandomIdiom();
    
    // 开始计时器
    startTimer();
}

// 选择随机成语
function selectRandomIdiom() {
    // 随机选择一个成语
    const randomIndex = Math.floor(Math.random() * idiomDatabase.length);
    currentIdiom = idiomDatabase[randomIndex];
    
    // 显示成语的第一个提示
    hintTextElement.textContent = currentIdiom.hint1;
    
    // 显示成语占位符（用星号表示）
    const placeholderText = '★★★★';
    idiomPlaceholderElement.textContent = placeholderText;
}

// 开始计时器
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 验证用户输入
function validateInput() {
    const userInput = userInputElement.value.trim();
    
    if (userInput === currentIdiom.idiom) {
        // 答案正确
        const pointsEarned = 10 - (hintsUsed * 3);
        score += pointsEarned > 0 ? pointsEarned : 1;
        scoreElement.textContent = score;
        
        // 显示正确答案
        idiomPlaceholderElement.textContent = currentIdiom.idiom;
        idiomPlaceholderElement.style.color = '#2ecc71';
        
        // 短暂延迟后选择新成语
        setTimeout(() => {
            idiomPlaceholderElement.style.color = '#2c3e50';
            hintsUsed = 0;
            selectRandomIdiom();
            userInputElement.value = '';
            userInputElement.focus();
        }, 1000);
    } else {
        // 答案错误
        userInputElement.classList.add('shake');
        setTimeout(() => {
            userInputElement.classList.remove('shake');
        }, 500);
    }
}

// 提供额外提示
function provideHint() {
    if (hintsUsed === 0) {
        // 显示第二个提示
        hintTextElement.textContent = `${currentIdiom.hint1}，${currentIdiom.hint2}`;
        hintsUsed++;
    } else if (hintsUsed === 1) {
        // 显示成语含义
        hintTextElement.textContent = `含义：${currentIdiom.meaning}`;
        hintsUsed++;
    } else if (hintsUsed === 2) {
        // 显示成语第一个字
        const firstChar = currentIdiom.idiom.charAt(0);
        const placeholder = '★★★';
        idiomPlaceholderElement.textContent = firstChar + placeholder;
        hintsUsed++;
    } else {
        // 显示成语例句
        hintTextElement.textContent = `例句：${currentIdiom.example}`;
        hintsUsed++;
    }
}

// 跳过当前成语
function skipIdiom() {
    score = Math.max(0, score - 2); // 扣2分
    scoreElement.textContent = score;
    
    // 显示被跳过的成语
    idiomPlaceholderElement.textContent = currentIdiom.idiom;
    idiomPlaceholderElement.style.color = '#e74c3c';
    
    // 短暂延迟后选择新成语
    setTimeout(() => {
        idiomPlaceholderElement.style.color = '#2c3e50';
        hintsUsed = 0;
        selectRandomIdiom();
        userInputElement.value = '';
    }, 1000);
}

// 结束游戏
function endGame() {
    clearInterval(timer);
    gameActive = false;
    
    // 禁用游戏控件
    userInputElement.disabled = true;
    submitButton.disabled = true;
    hintButton.disabled = true;
    skipButton.disabled = true;
    startButton.disabled = false;
    
    // 显示结果模态框
    finalScoreElement.textContent = score;
    resultModal.style.display = 'flex';
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 开始游戏按钮
    startButton.addEventListener('click', () => {
        initGame();
        resultModal.style.display = 'none';
    });
    
    // 提交按钮
    submitButton.addEventListener('click', () => {
        if (gameActive) {
            validateInput();
        }
    });
    
    // 输入框回车键
    userInputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && gameActive) {
            validateInput();
        }
    });
    
    // 提示按钮
    hintButton.addEventListener('click', () => {
        if (gameActive) {
            provideHint();
        }
    });
    
    // 跳过按钮
    skipButton.addEventListener('click', () => {
        if (gameActive) {
            skipIdiom();
        }
    });
    
    // 再玩一次按钮
    playAgainButton.addEventListener('click', () => {
        resultModal.style.display = 'none';
        initGame();
    });
})