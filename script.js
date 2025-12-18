const daySlider = document.getElementById('daySlider');
const dayLabel = document.getElementById('dayLabel');

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const chartCanvas = document.getElementById('chartCanvas');
const chartCtx = chartCanvas.getContext('2d');

const runBtn = document.getElementById('run');

runBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const beta = parseFloat(document.getElementById('beta').value);
    const gamma = parseFloat(document.getElementById('gamma').value);
    const initialI = parseInt(document.getElementById('initialI').value);

    const N = 50;
    let S = N - initialI;
    let I = initialI;
    let R = 0;

    const days = 50;
    let S_arr = [S];
    let I_arr = [I];
    let R_arr = [R];

    // SIR 计算
    for (let t = 1; t < days; t++) {
        const newInfected = Math.min(beta * S * I / N, S);
        const newRecovered = Math.min(gamma * I, I);

        S -= newInfected;
        I += newInfected - newRecovered;
        R += newRecovered;

        S_arr.push(S);
        I_arr.push(I);
        R_arr.push(R);

        daySlider.value = 0;
        dayLabel.innerText = 0;
    }

    // 初始化点
    let points = [];
    for (let i = 0; i < N; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            status: i < initialI ? 'infected' : 'susceptible'
        });
    }

    // 绘制折线图
    function drawChart(tIndex) {
        const w = chartCanvas.width;
        const h = chartCanvas.height;
        const max = N;

        chartCtx.clearRect(0, 0, w, h);

        function plotLine(arr, color) {
            chartCtx.strokeStyle = color;
            chartCtx.beginPath();
            arr.forEach((val, idx) => {
                if (idx > tIndex) return; // 同步时间轴
                const x = (idx / days) * w;
                const y = h - (val / max) * h;
                if (idx === 0) chartCtx.moveTo(x, y);
                else chartCtx.lineTo(x, y);
            });
            chartCtx.stroke();
        }

        plotLine(S_arr, 'blue');
        plotLine(I_arr, 'red');
        plotLine(R_arr, 'green');
    }

       function drawLegend() {
        const startX = 10;  // 改到画布左上角
        const startY = 10;
        const legend = [
            { color: 'blue', text: 'Susceptible (S)' },
            { color: 'red', text: 'Infected (I)' },
            { color: 'green', text: 'Recovered (R)' }
        ];
        legend.forEach((item, idx) => {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(startX + 10, startY + idx * 25 + 5, 7, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.fillText(item.text, startX + 25, startY + idx * 25 + 10);
        });
    }

        function renderDay(day) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLegend();

            const Icount = Math.round(I_arr[day]);
            const Rcount = Math.round(R_arr[day]);

            points.forEach((p, i) => {
                if (i < Icount) p.status = 'infected';
                else if (i < Icount + Rcount) p.status = 'recovered';
                else p.status = 'susceptible';

                if (p.status === 'susceptible') ctx.fillStyle = 'blue';
                else if (p.status === 'infected') ctx.fillStyle = 'red';
                else ctx.fillStyle = 'green';

                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });

            drawChart(day);
    }


    drawLegend();

    // 动画
    let t = 0;
    const interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLegend();

        points.forEach(p => {
            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;

            if (p.x < 0) p.x = 0;
            if (p.x > canvas.width) p.x = canvas.width;
            if (p.y < 0) p.y = 0;
            if (p.y > canvas.height) p.y = canvas.height;

            if (p.status === 'susceptible') ctx.fillStyle = 'blue';
            else if (p.status === 'infected') ctx.fillStyle = 'red';
            else ctx.fillStyle = 'green';

            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        // 更新状态，保证和折线图同步
        const currentI = Math.round(I_arr[t]);
        const currentR = Math.round(R_arr[t]);
        for (let i = 0; i < N; i++) {
            if (i < currentI) points[i].status = 'infected';
            else if (i < currentI + currentR) points[i].status = 'recovered';
            else points[i].status = 'susceptible';
        }

        drawChart(t);

        t++;
        if (t >= days) clearInterval(interval);
    }, 200);

    daySlider.oninput = () => {
    const day = parseInt(daySlider.value);
    dayLabel.innerText = day;
    renderDay(day);
};

    let currentDay = 0;
    renderDay(0);

    const play = setInterval(() => {
        currentDay++;
        if (currentDay >= days) {
            clearInterval(play);
            return;
        }
        daySlider.value = currentDay;
        dayLabel.innerText = currentDay;
        renderDay(currentDay);
    }, 300);

    
});
