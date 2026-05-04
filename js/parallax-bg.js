document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'parallax-bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    // Determine color scheme based on page
    const isAvancado = window.location.pathname.includes('avancado');
    // For intermediario: secondary color #5ac8fa
    // For avancado: error color #ff453a
    const particleBaseColor = isAvancado ? '255, 69, 58' : '90, 200, 250';
    
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 0.6 + 0.2; // depth for parallax (0.2 to 0.8)
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        draw(ctx, scrollOffset, mouseX, mouseY) {
            // Apply parallax based on depth (z)
            // mouse center offset
            const mx = (mouseX - width/2) * this.z * 0.05;
            const my = (mouseY - height/2) * this.z * 0.05;
            // scroll offset
            const sy = scrollOffset * this.z * 0.3;
            
            let drawX = this.x - mx;
            let drawY = this.y - sy - my;
            
            // wrap around for infinite scroll effect
            drawY = drawY % height;
            if (drawY < 0) drawY += height;
            
            drawX = drawX % width;
            if (drawX < 0) drawX += width;
            
            ctx.beginPath();
            ctx.arc(drawX, drawY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleBaseColor}, ${0.4 + this.z * 0.2})`;
            ctx.fill();
            
            return {x: drawX, y: drawY, z: this.z};
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    let scrollY = window.scrollY;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetScrollY = scrollY;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });
    
    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // smooth interpolation
        scrollY += (targetScrollY - scrollY) * 0.1;
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        const drawnParticles = [];
        
        particles.forEach(p => {
            p.update();
            drawnParticles.push(p.draw(ctx, scrollY, mouseX, mouseY));
        });
        
        // draw connections
        ctx.lineWidth = 0.5;
        for (let i = 0; i < drawnParticles.length; i++) {
            for (let j = i + 1; j < drawnParticles.length; j++) {
                const dx = drawnParticles[i].x - drawnParticles[j].x;
                const dy = drawnParticles[i].y - drawnParticles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 130) {
                    const avgZ = (drawnParticles[i].z + drawnParticles[j].z) / 2;
                    const opacity = (1 - dist / 130) * 0.25 * avgZ;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${particleBaseColor}, ${opacity.toFixed(3)})`;
                    ctx.moveTo(drawnParticles[i].x, drawnParticles[i].y);
                    ctx.lineTo(drawnParticles[j].x, drawnParticles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
