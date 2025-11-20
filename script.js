const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const chartCanvas = document.getElementById('chartCanvas');
const chartCtx = chartCanvas.getContext('2d');

const runBtn = document.getElementById('run');

runBtn.addEventListener('click', () => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    // 生成一些随机点
    let points = [];
    for (let i = 0; i < 50; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            status: 'susceptible' // susceptible / infected / recovered
        });
    }

    // 让前5个点感染
    for (let i = 0; i < 5; i++) {
        points[i].status = 'infected';
    }

    // 简单动画
    let t = 0;
    const interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(p => {
            // 随机移动
            p.x += (Math.random() - 0.5) * 2;
            p.y += (Math.random() - 0.5) * 2;

            // 限制边界
            if(p.x < 0) p.x = 0;
            if(p.x > canvas.width) p.x = canvas.width;
            if(p.y < 0) p.y = 0;
            if(p.y > canvas.height) p.y = canvas.height;

            // 绘制
            if(p.status === 'susceptible') ctx.fillStyle = 'blue';
            else if(p.status === 'infected') ctx.fillStyle = 'red';
            else ctx.fillStyle = 'green';

            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        t++;
        if(t > 50) clearInterval(interval);
    }, 100);
});// JavaScript for SIR simulation will go here
