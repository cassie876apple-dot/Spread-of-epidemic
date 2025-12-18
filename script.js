const animCanvas = document.getElementById('animationCanvas');
const actx = animCanvas.getContext('2d');

const chartCanvas = document.getElementById('chartCanvas');
const cctx = chartCanvas.getContext('2d');

const runBtn = document.getElementById('run');
const timeline = document.getElementById('timeline');
const timelineContainer = document.getElementById('timelineContainer');

const N = 50;
const days = 60;

let S_arr = [], I_arr = [], R_arr = [];
let points = [];
let animationInterval = null;

// ===== 工具函数 =====
function drawLegend() {
    const legend = [
        { color: 'blue', text: 'Susceptible' },
        { color: 'red', text: 'Infected' },
        { color: 'green', text: 'Recovered' }
    ];
    legend.forEach((l, i) => {
        actx.fillStyle = l.color;
        actx.beginPath();
        actx.arc(15, 20 + i * 20, 6, 0, Math.PI * 2);
        actx.fill();
        actx.fillStyle = 'black';
        actx.fillText(l.text, 30, 25 + i * 20);
    });
}

function drawPoints() {
    actx.clearRect(0, 0, animCanvas.width, animCanvas.height);
    drawLegend();
    points.forEach(p => {
        actx.fillStyle =
            p.status === 'S' ? 'blue' :
            p.status === 'I' ? 'red' : 'green';
        actx.beginPath();
        actx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        actx.fill();
    });
}

function drawChart(t) {
    cctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    const max = N;

    function line(arr, color) {
        cctx.strokeStyle = color;
        cctx.beginPath();
        arr.forEach((v, i) => {
            if (i > t) return;
            const x = i / days * chartCanvas.width;
            const y = chartCanvas.height - (v / max) * chartCanvas.height;
            if (i === 0) cctx.moveTo(x, y);
            else cctx.lineTo(x, y);
        });
        cctx.stroke();
    }

    line(S_arr, 'blue');
    line(I_arr, 'red');
    line(R_arr, 'green');
}

// ===== SIR 计算 =====
function computeSIR(beta, gamma, initialI) {
    let S = N - initialI, I = initialI, R = 0;
    S_arr = [S]; I_arr = [I]; R_arr = [R];

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
}

// ===== 主逻辑 =====
runBtn.onclick = () => {
    clearInterval(animationInterval);
    timelineContainer.style.display = 'none';

    const beta = +betaInput.value;
    const gamma = +gammaInput.value;
    const initialI = +initialIInput.value;

    computeSIR(beta, gamma, initialI);

    // 初始化点
    points = [];
    for (let i = 0; i < N; i++) {
        points.push({
            x: Math.random() * animCanvas.width,
            y: Math.random() * animCanvas.height,
            status: i < initialI ? 'I' : 'S'
        });
    }

    let t = 0;
    animationInterval = setInterval(() => {
        // 更新状态
        points.forEach((p, i) => {
            if (i < Math.round(I_arr[t])) p.status = 'I';
            else if (i < Math.round(I_arr[t] + R_arr[t])) p.status = 'R';
            else p.status = 'S';

            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;
        });

        drawPoints();
        drawChart(t);

        t++;
        if (t >= days) {
            clearInterval(animationInterval);
            timeline.max = days - 1;
            timeline.value = days - 1;
            timelineContainer.style.display = 'block';
        }
    }, 200);
};

// ===== 时间轴回看 =====
timeline.oninput = () => {
    const t = +timeline.value;
    points.forEach((p, i) => {
        if (i < Math.round(I_arr[t])) p.status = 'I';
        else if (i < Math.round(I_arr[t] + R_arr[t])) p.status = 'R';
        else p.status = 'S';
    });
    drawPoints();
    drawChart(t);
};
