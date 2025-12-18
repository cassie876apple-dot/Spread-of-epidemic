const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const chartCanvas = document.getElementById('chartCanvas');
const chartCtx = chartCanvas.getContext('2d');

const runBtn = document.getElementById('run');
const timeline = document.getElementById('timeline');
const timelineContainer = document.getElementById('timelineContainer');

let S_arr = [], I_arr = [], R_arr = [];
let points = [];
let N = 50;
let days = 60;

runBtn.addEventListener('click', () => {
    timelineContainer.style.display = 'none';

    const beta = parseFloat(betaInput.value);
    const gamma = parseFloat(gammaInput.value);
    const initialI = parseInt(initialIInput.value);

    let S = N - initialI;
    let I = initialI;
    let R = 0;

    S_arr = [S];
    I_arr = [I];
    R_arr = [R];

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

    points = [];
    for (let i = 0; i < N; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            status: i < initialI ? 'infected' : 'susceptible'
        });
    }

    playAnimation();
});

function playAnimation() {
    let t = 0;

    const interval = setInterval(() => {
        drawFrame(t, true);
        t++;

        if (t >= days) {
            clearInterval(interval);
            setupTimeline();
        }
    }, 150);
}

function setupTimeline() {
    timeline.max = days - 1;
    timeline.value = days - 1;
    timelineContainer.style.display = 'block';

    timeline.oninput = () => {
        drawFrame(parseInt(timeline.value), false);
    };
}

function drawFrame(t, moveDots) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    updateStatuses(t);

    points.forEach(p => {
        if (moveDots) {
            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;
        }

        ctx.fillStyle =
            p.status === 'susceptible' ? 'blue' :
            p.status === 'infected' ? 'red' : 'green';

        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    drawLegend();
    drawChart(t);
}

function updateStatuses(t) {
    const I = Math.round(I_arr[t]);
    const R = Math.round(R_arr[t]);

    for (let i = 0; i < N; i++) {
        if (i < I) points[i].status = 'infected';
        else if (i < I + R) points[i].status = 'recovered';
        else points[i].status = 'susceptible';
    }
}

function drawLegend() {
    const legend = [
        ['blue', 'Susceptible'],
        ['red', 'Infected'],
        ['green', 'Recovered']
    ];

    legend.forEach((l, i) => {
        ctx.fillStyle = l[0];
        ctx.beginPath();
        ctx.arc(15, 20 + i * 20, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.fillText(l[1], 30, 25 + i * 20);
    });
}

function drawChart(t) {
    const w = chartCanvas.width;
    const h = chartCanvas.height;

    function plot(arr, color) {
        chartCtx.strokeStyle = color;
        chartCtx.beginPath();
        for (let i = 0; i <= t; i++) {
            const x = i / days * w;
            const y = h - arr[i] / N * h;
            i === 0 ? chartCtx.moveTo(x, y) : chartCtx.lineTo(x, y);
        }
        chartCtx.stroke();
    }

    plot(S_arr, 'blue');
    plot(I_arr, 'red');
    plot(R_arr, 'green');
}
