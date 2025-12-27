const dotCanvas = document.getElementById("dotCanvas");
const dotCtx = dotCanvas.getContext("2d");

const lineCanvas = document.getElementById("lineCanvas");
const lineCtx = lineCanvas.getContext("2d");

const startBtn = document.getElementById("startBtn");

startBtn.onclick = startSimulation;

function startSimulation() {
    const beta = parseFloat(document.getElementById("beta").value);
    const gamma = parseFloat(document.getElementById("gamma").value);
    const initialI = parseInt(document.getElementById("initialI").value);

    const N = 30;
    let S = N - initialI;
    let I = initialI;
    let R = 0;

    let S_arr = [S];
    let I_arr = [I];
    let R_arr = [R];

    // 创建点
    let dots = [];
    for (let i = 0; i < N; i++) {
        dots.push({
            x: Math.random() * dotCanvas.width,
            y: Math.random() * dotCanvas.height,
            state: i < initialI ? "I" : "S"
        });
    }

    let day = 0;

    const interval = setInterval(() => {
        day++;

        // SIR 计算
        const newInfected = Math.min(beta * S * I / N, S);
        const newRecovered = Math.min(gamma * I, I);

        S -= newInfected;
        I += newInfected - newRecovered;
        R += newRecovered;

        S_arr.push(S);
        I_arr.push(I);
        R_arr.push(R);

        // 更新点状态
        dots.forEach((d, index) => {
            if (index < I) d.state = "I";
            else if (index < I + R) d.state = "R";
            else d.state = "S";
        });

        drawDots(dots);
        drawLines(S_arr, I_arr, R_arr);

        if (day > 60) clearInterval(interval);
    }, 200);
}

function drawDots(dots) {
    dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);

    dots.forEach(d => {
        d.x += (Math.random() - 0.5) * 2;
        d.y += (Math.random() - 0.5) * 2;

        if (d.state === "S") dotCtx.fillStyle = "blue";
        if (d.state === "I") dotCtx.fillStyle = "red";
        if (d.state === "R") dotCtx.fillStyle = "green";

        dotCtx.beginPath();
        dotCtx.arc(d.x, d.y, 5, 0, Math.PI * 2);
        dotCtx.fill();
    });

    // 图例
    drawLegend();
}

function drawLegend() {
    const legend = [
        { color: "blue", text: "Susceptible" },
        { color: "red", text: "Infected" },
        { color: "green", text: "Recovered" }
    ];

    legend.forEach((l, i) => {
        dotCtx.fillStyle = l.color;
        dotCtx.beginPath();
        dotCtx.arc(15, 20 + i * 20, 5, 0, Math.PI * 2);
        dotCtx.fill();

        dotCtx.fillStyle = "black";
        dotCtx.fillText(l.text, 30, 25 + i * 20);
    });
}

function drawLines(S, I, R) {
    lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

    const max = 30;

    function draw(arr, color) {
        lineCtx.strokeStyle = color;
        lineCtx.beginPath();
        arr.forEach((v, i) => {
            const x = i * 8;
            const y = lineCanvas.height - (v / max) * lineCanvas.height;
            if (i === 0) lineCtx.moveTo(x, y);
            else lineCtx.lineTo(x, y);
        });
        lineCtx.stroke();
    }

    draw(S, "blue");
    draw(I, "red");
    draw(R, "green");
}
