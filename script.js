const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");

const chartCanvas = document.getElementById("chartCanvas");
const chartCtx = chartCanvas.getContext("2d");

const runBtn = document.getElementById("run");

runBtn.addEventListener("click", () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const beta = parseFloat(document.getElementById("beta").value);
    const gamma = parseFloat(document.getElementById("gamma").value);
    const initialI = parseInt(document.getElementById("initialI").value);

    const N = 40;
    let S = N - initialI;
    let I = initialI;
    let R = 0;

    const days = 40;
    const S_arr = [S];
    const I_arr = [I];
    const R_arr = [R];

    for (let t = 1; t < days; t++) {
        const newI = Math.min(beta * S * I / N, S);
        const newR = Math.min(gamma * I, I);

        S -= newI;
        I += newI - newR;
        R += newR;

        S_arr.push(S);
        I_arr.push(I);
        R_arr.push(R);
    }

    // 初始化点（emoji）
    let people = [];
    for (let i = 0; i < N; i++) {
        people.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            state: i < initialI ? "😷" : "🙂"
        });
    }

    let t = 0;
    const timer = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        people.forEach(p => {
            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;

            ctx.font = "16px serif";
            ctx.fillText(p.state, p.x, p.y);
        });

        const curI = Math.round(I_arr[t]);
        const curR = Math.round(R_arr[t]);

        for (let i = 0; i < N; i++) {
            if (i < curI) people[i].state = "😷";
            else if (i < curI + curR) people[i].state = "😃";
            else people[i].state = "🙂";
        }

        drawChart(t, S_arr, I_arr, R_arr);

        t++;
        if (t >= days) clearInterval(timer);
    }, 200);
});

function drawChart(t, S, I, R) {
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    const max = Math.max(...S, ...I, ...R);

    drawLine(S, "blue", t, max);
    drawLine(I, "red", t, max);
    drawLine(R, "green", t, max);
}

function drawLine(arr, color, t, max) {
    chartCtx.strokeStyle = color;
    chartCtx.beginPath();
    arr.forEach((v, i) => {
        if (i > t) return;
        const x = (i / arr.length) * chartCanvas.width;
        const y = chartCanvas.height - (v / max) * chartCanvas.height;
        if (i === 0) chartCtx.moveTo(x, y);
        else chartCtx.lineTo(x, y);
    });
    chartCtx.stroke();
}
