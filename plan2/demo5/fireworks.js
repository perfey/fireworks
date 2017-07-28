window.fireworks = function(options) {
    if (!options || !options.dom) {
        return;
    }
    var hasBg = false;
    if (options.bgImgDom || options.bgSrc) {
        hasBg = true;
    }
    options.bg = options.bg || (hasBg ? 'rgba(255, 255, 255, 0)' : '#000');
    var canvas = document.createElement('canvas');
    canvas.id = 'fireworksField';
    var canvasWidth = options.dom.clientWidth,
    canvasHeight = options.dom.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width  = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    if (!canvas || !canvas.getContext){
        return;
    }
    var ctx = canvas.getContext('2d');
    var imgElement;
    if (hasBg) {
        if (options.bgImgDom) {
            imgElement = options.bgImgDom;
        } else {
            imgElement = new Image();
            imgElement.src = options.bgSrc;
        }
        imgElement.onload = function () {
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        };
    }
    
    // init
    ctx.fillStyle = options.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // objects
    var listFire = [];
    var listFirework = [];
    var fireNumber = 8;
    var center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    var range = 100;
    for (var i = 0; i < fireNumber; i++) {
        var fire = {
            x: Math.random() * range / 2 - range / 4 + center.x,
            y: Math.random() * range * 2 + canvas.height,
            size: Math.random() + 0.5,
            fill: '#fd1',
            vx: Math.random() - 0.5,
            vy: -(Math.random() + 4),
            ax: Math.random() * 0.02 - 0.01,
            far: Math.random() * range + (center.y - range)
        };
        fire.base = {
            x: fire.x,
            y: fire.y,
            vx: fire.vx
        };
        //
        listFire.push(fire);
    }

    function randColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var color = 'rgb($r, $g, $b)';
        color = color.replace('$r', r);
        color = color.replace('$g', g);
        color = color.replace('$b', b);
        return color;
    }

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    (function loop() {
        setTimeout(function() {//为了让速率不至于太快
            requestAnimationFrame(loop);
            update();
            draw();
        }, 30)
    })();

    function update() {
        for (var i = 0; i < listFire.length; i++) {
            var fire = listFire[i];
            //
            if (fire.y <= fire.far) {
                // case add firework
                var color = randColor();
                for (var i = 0; i < fireNumber * 5; i++) {
                    var firework = {
                        x: fire.x,
                        y: fire.y,
                        size: Math.random() + 1.5,
                        fill: color,
                        vx: Math.random() * 5 - 2.5,
                        vy: Math.random() * -5 + 1.5,
                        ay: 0.05,
                        alpha: 1,
                        life: Math.round(Math.random() * range / 2) + range / 2
                    };
                    firework.base = {
                        life: firework.life,
                        size: firework.size
                    };
                    listFirework.push(firework);
                }
                // reset
                fire.y = fire.base.y;
                fire.x = fire.base.x;
                fire.vx = fire.base.vx;
                fire.ax = Math.random() * 0.02 - 0.01;
            }
            //
            fire.x += fire.vx;
            fire.y += fire.vy;
            fire.vx += fire.ax;
        }

        for (var i = listFirework.length - 1; i >= 0; i--) {
            var firework = listFirework[i];
            if (firework) {
                firework.x += firework.vx;
                firework.y += firework.vy;
                firework.vy += firework.ay;
                firework.alpha = firework.life / firework.base.life;
                firework.size = firework.alpha * firework.base.size;
                firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
                //
                firework.life--;
                if (firework.life <= 0) {
                    listFirework.splice(i, 1);
                }
            }
        }
    }

    function draw() {
        if (canvasWidth != options.dom.clientWidth) {
            canvas.width = canvasWidth = options.dom.clientWidth;
            canvas.style.width  = canvasWidth + 'px';
        }
        if (canvasHeight != options.dom.clientHeight) {
            canvas.height = canvasHeight = options.dom.clientHeight;
            canvas.style.height = canvasHeight + 'px';
        }
        // clear
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = options.bg;
        if (hasBg) {
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // re-draw
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 1;
        for (var i = 0; i < listFire.length; i++) {
            var fire = listFire[i];
            ctx.beginPath();
            ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = fire.fill;
            ctx.fill();
        }

        for (var i = 0; i < listFirework.length; i++) {
            var firework = listFirework[i];
            ctx.globalAlpha = firework.alpha;
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = firework.fill;
            ctx.fill();
        }
    }
    options.dom.appendChild(canvas);
}
