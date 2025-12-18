const animationCanvas = document.getElementById("animationCanvas");
const ctx = animationCanvas.getContext("2d");

const chartCanvas = document.getElementById("chartCanvas");
const chartCtx = chartCanvas.getContext("2d");

const betaSlider = document.getElementById("beta");
const gammaSlider = document.getElementById("gamma");
const initialISlider = document.getElementById("initialI");
const timeSlider = document.getElementById("timeSlider");
const runBtn = document.getElementById("run");

const N = 50;
const days = 60;

let S = [], I = [], R = [];
let points = [];

/* ===== 生成 SIR 数据 ===== */
function generateSIR() {
    const beta = parseFloat(betaSlider.value);
    const gamma = parseFloat(gammaSlider.value);
    const initialI = parseInt(initialISlider.value);

    S = [N - initialI];
    I = [initialI];
    R = [0];

    for (let t = 1; t < days; t++) {
        const newInfected = Math.min(beta * S[t-1] * I[t-1] / N, S[t-1]);
        const newRecovered = Math.min(gamma * I[t-1], I[t-1]);

        S.push(S[t-1] - newInfected);
        I.push(I[t-1] + newInfected - newRecovered);
        R.push(R[t-1] + newRecovered);
    }

    timeSlider.max = days - 1;
}

/* ===== 初始化点 ===== */
function initPoints(initialI) {
    points = [];
    for (let i = 0; i < N; i++) {
        points.push({
            x: Math.random() * animationCanvas.width,
            y: Math.random() * animationCanvas.height,
            status: i < initialI ? "I" : "S"
        });
    }
}

/* ===== 画图例 ===== */
function drawLegend() {
    const legend = [
        { color: "blue", text: "Susceptible (S)" },
        { color: "red", text: "Infected (I)" },
        { color: "green", text: "Recovered (R)" }
    ];

    legend.forEach((item, i) => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(15, 20 + i * 25, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "13px Arial";
        ctx.fillText(item.text, 30, 25 + i * 25);
    });
}

/* ===== 画点动画 ===== */
function drawDots(t) {
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);

    const currentI = Math.round(I[t]);
    const currentR = Math.round(R[t]);

    points.forEach((p, i) => {
        if (i < currentI) p.status = "I";
        else if (i < currentI + currentR) p.status = "R";
        else p.status = "S";

        if (p.status === "S") ctx.fillStyle = "blue";
        if (p.status === "I") ctx.fillStyle = "red";
        if (p.status === "R") ctx.fillStyle = "green";

        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    drawLegend();
}

/* ===== 画折线图（和时间同步） ===== */
function drawChart(t) {
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    function plot(data, color) {
        chartCtx.strokeStyle = color;
        chartCtx.beginPath();
        data.forEach((v, i) => {
            if (i > t) return;
            const x = (i / days) * chartCanvas.width;
            const y = chartCanvas.height - (v / N) * chartCanvas.height;
            if (i === 0) chartCtx.moveTo(x, y);
            else chartCtx.lineTo(x, y);
        });
        chartCtx.stroke();
    }

    plot(S, "blue");
    plot(I, "red");
    plot(R, "green");
}

/* ===== 时间轴变化 ===== */
timeSlider.addEventListener("input", () => {
    const t = parseInt(timeSlider.value);
    drawDots(t);
    drawChart(t);
});

/* ===== 重置按钮 ===== */
runBtn.addEventListener("click", () => {
    generateSIR();
    initPoints(parseInt(initialISlider.value));
    timeSlider.value = 0;
    drawDots(0);
    drawChart(0);
});
