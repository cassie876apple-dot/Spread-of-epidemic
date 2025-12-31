    const max = N;
    const w = chartCanvas.width;
    const h = chartCanvas.height;

    // grid
    chartCtx.strokeStyle = "rgba(0,0,0,0.05)";
    for (let i = 0; i <= 5; i++) {
        const y = (i / 5) * h;
        chartCtx.beginPath();
        chartCtx.moveTo(0, y);
        chartCtx.lineTo(w, y);
        chartCtx.stroke();
    }

    function line(arr, color) {
        chartCtx.strokeStyle = color;
        chartCtx.lineWidth = 3;
        chartCtx.lineCap = "round";
        chartCtx.beginPath();
        arr.forEach((v, i) => {
            if (i > t) return;
            const x = (i / DAYS) * w;
            const y = h - (v / max) * h;
            if (i === 0) chartCtx.moveTo(x, y);
            else chartCtx.lineTo(x, y);
        });
        chartCtx.stroke();
    }

    line(S, COLORS.S);
    line(I, COLORS.I);
    line(R, COLORS.R);
}

/* ---------- Navigation ---------- */
document.querySelectorAll('.nav-menu button').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelectorAll('.scroll-arrow').forEach((arrow, i) => {
    arrow.addEventListener('click', () => {
        const next = document.querySelectorAll('.page')[i + 1];
        if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ---------- Thank You ---------- */
const thankYou = document.querySelector('.thankyou');
window.addEventListener('scroll', () => {
    if (thankYou) {
    window.addEventListener('scroll', () => {
        const rect = thankYou.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            thankYou.classList.add('visible');
        }
    });
}

});
