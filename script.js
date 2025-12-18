// ===== 基础获取 =====
const animCanvas = document.getElementById("animationCanvas");
const animCtx = animCanvas.getContext("2d");

const chartCanvas = document.getElementById("chartCanvas");
const chartCtx = chartCanvas.getContext("2d");

const runBtn = document.getElementById("run");

// ===== 主逻辑 =====
runBtn.addEventListener("click", () => {
    // 读取参数
    const beta = parseFloat(document.getElementById("beta").value);
    const gamma = parseFloat(document.getElementById("gamma").value);
    const initialI = parseInt(document.getElementById("initialI").value);

    const N = 50;
    const days = 60;

    let S = N - initialI;
    let I = initialI;
    let R = 0;

    const S_arr = [S];
    const I_arr = [I];
    const R_arr = [R];

    // ===== SIR 计算 =====
    for (let t = 1; t < days; t++) {
        const newInfected = Math.min(beta * S * I / N, S);
        const newRecovered = Math.min(gamma * I, I);

        S -= newInfected;
        I += newInfected - newRecovered;
        R += newRecovered;

        S_arr.push(S);
        I_arr.push(I);
        R_arr.push(R);
    }

    // ===== 初始化点 =====
    let dots = [];
    for (let i = 0; i < N; i++) {
        dots.push({
            x: Math.random() * animCanvas.width,
            y: Math.random() * animCanvas.height,
            state: i < initialI ? "I" : "S"
        });
    }

    // ===== 绘制图例 =====
    function drawLegend() {
        const legend = [
            { color: "blue", text: "Susceptible (S)" },
            { color: "red", text: "Infected (I)" },
            { color: "green", text: "Recovered (R)" }
        ];

        legend.forEach((item, i) => {
            animCtx.fillStyle = item.color;
            animCtx.beginPath();
            animCtx.arc(15, 20 + i * 22, 6, 0, Math.PI * 2);
            animCtx.fill();

            animCtx.fillStyle = "black";
            animCtx.font = "13px Arial";
            animCtx.fillText(item.text, 28, 25 + i * 22);
        });
    }

    // ===== 折线图 =====
    function drawChart(t) {
        chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        const max = N;

        function plot(arr, color) {
            chartCtx.strokeStyle = color;
            chartCtx.beginPath();
            arr.forEach((v, i) => {
                if (i > t) return;
                const x = (i / days) * chartCanvas.width;
                const y = chartCanvas.height - (v / max) * chartCanvas.height;
                if (i === 0) chartCtx.moveTo(x, y);
                else chartCtx.lineTo(x, y);
            });
            chartCtx.stroke();
        }

        plot(S_arr, "blue");
        plot(I_arr, "red");
        plot(R_arr, "green");

        // 时间轴
        chartCtx.strokeStyle = "black";
        chartCtx.beginPath();
        const tx = (t / days) * chartCanvas.width;
        chartCtx.moveTo(tx, 0);
        chartCtx.lineTo(tx, chartCanvas.height);
        chartCtx.stroke();
    }

    // ===== 时间进度条 =====
    function drawTimeline(t) {
        const y = animCanvas.height - 10;
        animCtx.strokeStyle = "#ccc";
        animCtx.beginPath();
        animCtx.moveTo(10, y);
        animCtx.lineTo(animCanvas.width - 10, y);
        animCtx.stroke();

        const pos = 10 + (t / days) * (animCanvas.width - 20);
        animCtx.fillStyle = "black";
        animCtx.beginPath();
        animCtx.arc(pos, y, 4, 0, Math.PI * 2);
        animCtx.fill();
    }

    // ===== 动画循环 =====
    let t = 0;
    const interval = setInterval(() => {
        animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);

        drawLegend();
        drawTimeline(t);

        // 更新状态
        const currentI = Math.round(I_arr[t]);
        const currentR = Math.round(R_arr[t]);

        dots.forEach((d, i) => {
            if (i < currentI) d.state = "I";
            else if (i < currentI + currentR) d.state = "R";
            else d.state = "S";

            d.x += (Math.random() - 0.5) * 2;
            d.y += (Math.random() - 0.5) * 2;

            if (d.state === "S") animCtx.fillStyle = "blue";
            if (d.state === "I") animCtx.fillStyle = "red";
            if (d.state === "R") animCtx.fillStyle = "green";

            animCtx.beginPath();
            animCtx.arc(d.x, d.y, 4, 0, Math.PI * 2);
            animCtx.fill();
        });

        drawChart(t);

        t++;
        if (t >= days) clearInterval(interval);
    }, 200);
});
