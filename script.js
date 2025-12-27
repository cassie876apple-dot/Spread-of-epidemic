const animationCanvas = document.getElementById("animationCanvas");
const ctx = animationCanvas.getContext("2d");

const chartCanvas = document.getElementById("chartCanvas");
const chartCtx = chartCanvas.getContext("2d");

const runBtn = document.getElementById("run");

const N = 30;
const DAYS = 60;

runBtn.onclick = () => {
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const beta = parseFloat(betaInput.value);
    const gamma = parseFloat(gammaInput.value);
    const initialI = parseInt(initialIInput.value);

    let S = N - initialI;
    let I = initialI;
    let R = 0;

    let S_arr = [S];
    let I_arr = [I];
    let R_arr = [R];

    for (let t = 1; t < DAYS; t++) {
        const newI = Math.min(beta * S * I / N, S);
        const newR = Math.min(gamma * I, I);

        S -= newI;
        I += newI - newR;
        R += newR;

        S_arr.push(S);
        I_arr.push(I);
        R_arr.push(R);
    }

    let people = [];
    for (let i = 0; i < N; i++) {
        people.push({
            x: Math.random() * animationCanvas.width,
            y: Math.random() * animationCanvas.height,
            state: i < initialI ? "I" : "S"
        });
    }

    let t = 0;
    const timer = setInterval(() => {
        ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);

        const curI = Math.round(I_arr[t]);
        const curR = Math.round(R_arr[t]);

        people.forEach((p, i) => {
            if (i < curI) p.state = "I";
            else if (i < curI + curR) p.state = "R";
            else p.state = "S";

            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;

            const emoji = p.state === "S" ? "🧍" : p.state === "I" ? "🤒" : "😊";
            ctx.font = "20px serif";
            ctx.fillText(emoji, p.x, p.y);
        });

        drawChart(S_arr, I_arr, R_arr, t);
        t++;

        if (t >= DAYS) clearInterval(timer);
    }, 150);
};

function drawChart(S, I, R, t) {
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    const h = chartCanvas.height;
    const w = chartCanvas.width;

    function line(arr, color) {
        chartCtx.strokeStyle = color;
        chartCtx.beginPath();
        arr.forEach((v, i) => {
            if (i > t) return;
            const x = i / DAYS * w;
            const y = h - (v / N) * h;
            i === 0 ? chartCtx.moveTo(x, y) : chartCtx.lineTo(x, y);
        });
        chartCtx.stroke();
    }

    line(S, "#4f7cff");
    line(I, "#ff5c5c");
    line(R, "#4caf50");
}
