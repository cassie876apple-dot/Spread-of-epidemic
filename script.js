const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const chartCanvas = document.getElementById('chartCanvas');
const chartCtx = chartCanvas.getContext('2d');

const runBtn = document.getElementById('run');

runBtn.addEventListener('click', () => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    // 读取滑块值
    const beta = parseFloat(document.getElementById('beta').value);
    const gamma = parseFloat(document.getElementById('gamma').value);
    const initialI = parseInt(document.getElementById('initialI').value);

    const N = 50; // 总人数
    let S = N - initialI;
    let I = initialI;
    let R = 0;

    const days = 50;
    let S_arr = [S];
    let I_arr = [I];
    let R_arr = [R];

    // 计算 SIR 模型
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

    // 绘制折线图
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    drawChart(chartCtx, S_arr, I_arr, R_arr);

    // 绘制动画点
    drawAnimation(S_arr, I_arr, R_arr);
});

// 绘制折线图
function drawChart(ctx, S_arr, I_arr, R_arr) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const max = Math.max(...S_arr, ...I_arr, ...R_arr);

    function plotLine(arr, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        arr.forEach((val, idx) => {
            const x = (idx / arr.length) * w;
            const y = h - (val / max) * h;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    plotLine(S_arr, 'blue'); // S
    plotLine(I_arr, 'red');  // I
    plotLine(R_arr, 'green'); // R
}

// 动画点（同步）
function drawAnimation(S_arr, I_arr, R_arr) {
    const total = 50;
    let points = [];
    for (let i = 0; i < total; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            status: i < I_arr[0] ? 'infected' : 'susceptible'
        });
    }

    let t = 0;
    const interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.forEach(p => {
            // 随机移动
            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;

            // 绘制颜色
            if (p.status === 'susceptible') ctx.fillStyle = 'blue';
            else if (p.status === 'infected') ctx.fillStyle = 'red';
            else ctx.fillStyle = 'green';

            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // 更新状态
        const currentI = Math.round(I_arr[t]);
        const currentR = Math.round(R_arr[t]);
        for (let i = 0; i < total; i++) {
            if (i < currentI) points[i].status = 'infected';
            else if (i < currentI + currentR) points[i].status = 'recovered';
            else points[i].status = 'susceptible';
        }

        t++;
        if (t >= S_arr.length) clearInterval(interval);
    }, 200);
}
