const betaInput = document.getElementById("beta");
const gammaInput = document.getElementById("gamma");
const initialIInput = document.getElementById("initialI");

const animationCanvas = document.getElementById("animationCanvas");
const ctx = animationCanvas.getContext("2d");

const chartCanvas = document.getElementById("chartCanvas");
const chartCtx = chartCanvas.getContext("2d");

const runBtn = document.getElementById("run");

const EMOJI = {
    S: "🧍",
    I: "🦠",
    R: "🛡️"
};

const N = 40;
const DAYS = 60;
const RADIUS = 18;

let points = [];
let timer = null;

runBtn.onclick = () => {
    if (timer) clearInterval(timer);
    points = [];

    const beta = parseFloat(betaInput.value);
    const gamma = parseFloat(gammaInput.value);
    const initialI = parseInt(initialIInput.value);

    let S = N - initialI;
    let I = initialI;
    let R = 0;

    let S_arr = [S], I_arr = [I], R_arr = [R];

    for(let t=1; t<DAYS; t++){
        const newI = Math.min(beta*S*I/N, S);
        const newR = Math.min(gamma*I, I);
        S -= newI; I += newI-newR; R += newR;
        S_arr.push(S); I_arr.push(I); R_arr.push(R);
    }

    for(let i=0;i<N;i++){
        points.push({
            x: Math.random()*animationCanvas.width,
            y: Math.random()*animationCanvas.height,
            vx:(Math.random()-0.5)*7,
            vy:(Math.random()-0.5)*7,
            state:i<initialI?"I":"S"
        });
    }

    let t=0;
    timer = setInterval(()=>{
        ctx.clearRect(0,0,animationCanvas.width,animationCanvas.height);
        const curI = Math.round(I_arr[t]);
        const curR = Math.round(R_arr[t]);

        for(let i=0;i<N;i++){
            if(i<curI) points[i].state="I";
            else if(i<curI+curR) points[i].state="R";
            else points[i].state="S";
        }

        for(let p of points){
            p.x+=p.vx; p.y+=p.vy;
            if(p.x<RADIUS || p.x>animationCanvas.width-RADIUS) p.vx*=-1;
            if(p.y<RADIUS || p.y>animationCanvas.height-RADIUS) p.vy*=-1;
        }

        for(let i=0;i<points.length;i++){
            for(let j=i+1;j<points.length;j++){
                const dx=points[i].x-points[j].x;
                const dy=points[i].y-points[j].y;
                const dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<RADIUS*2){
                    [points[i].vx,points[j].vx]=[points[j].vx,points[i].vx];
                    [points[i].vy,points[j].vy]=[points[j].vy,points[i].vy];
                }
            }
        }

        for(let p of points){
            ctx.font="32px serif";
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillText(EMOJI[p.state],p.x,p.y);
        }

        drawChart(S_arr,I_arr,R_arr,t);
        t++;
        if(t>=DAYS) clearInterval(timer);
    },150);
}

function drawChart(S,I,R,t){
    chartCtx.clearRect(0,0,chartCanvas.width,chartCanvas.height);
    const max=N;
    const w=chartCanvas.width;
    const h=chartCanvas.height;
    function line(arr,color){
        chartCtx.strokeStyle=color;
        chartCtx.beginPath();
        arr.forEach((v,i)=>{
            if(i>t) return;
            const x=(i/DAYS)*w;
            const y=h-(v/max)*h;
            if(i===0) chartCtx.moveTo(x,y);
            else chartCtx.lineTo(x,y);
        });
        chartCtx.stroke();
    }
    line(S,"#3b82f6");
    line(I,"#ef4444");
    line(R,"#10b981");
}

// 导航点击跳转
document.querySelectorAll('.nav-menu button').forEach(btn=>{
    btn.addEventListener('click',()=>{
        const target = document.getElementById(btn.dataset.target);
        target.scrollIntoView({behavior:'smooth'});
    });
});

// 箭头点击滚动到下一页
document.querySelectorAll('.scroll-arrow').forEach((arrow,i)=>{
    arrow.addEventListener('click',()=>{
        const next = document.querySelectorAll('.page')[i+1];
        if(next) next.scrollIntoView({behavior:'smooth'});
    });
});

// 页面滚动显示 Thank You 动画
const thankYou = document.querySelector('.thankyou');
window.addEventListener('scroll',()=>{
    const rect = thankYou.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.8){
        thankYou.classList.add('visible');
    }
});
