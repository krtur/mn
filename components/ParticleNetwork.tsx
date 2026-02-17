import React, { useRef, useEffect } from 'react';

interface ParticleNetworkProps {
    className?: string; // Permitir estilização externa (ex: absolute inset-0)
    particleColor?: string; // Cor das partículas e linhas (padrão: roxo)
    particleCountDensity?: number; // Divisor para calcular quantidade (quanto menor, mais partículas)
    interactionRadius?: number; // Raio de interação do mouse
}

export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
    className = "fixed top-0 left-0 w-full h-full z-0",
    particleColor = 'rgba(139, 92, 246, 0.7)', // Purple-500/600-ish
    particleCountDensity = 9000,
    interactionRadius = 150
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePositionRef = useRef({ x: 0, y: 0 }); // Inicia em 0,0 ou centro

    useEffect(() => {
        // Inicializar posição do mouse no centro se não houver evento ainda
        mousePositionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const handleMouseMove = (event: MouseEvent) => {
            mousePositionRef.current = { x: event.clientX, y: event.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let signals: Signal[] = [];

        class Particle {
            x: number; y: number; size: number; baseSize: number; speedX: number; speedY: number;
            pulseSpeed: number; pulseOffset: number;

            constructor(x: number, y: number, size: number, speedX: number, speedY: number) {
                this.x = x; this.y = y;
                this.baseSize = size;
                this.size = size;
                this.speedX = speedX; this.speedY = speedY;
                this.pulseSpeed = 0.02 + Math.random() * 0.03;
                this.pulseOffset = Math.random() * Math.PI * 2;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fill();
            }

            update(time: number) {
                // Pulsing effect
                this.size = this.baseSize + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5;

                // Repulsão do mouse
                const dx = this.x - mousePositionRef.current.x;
                const dy = this.y - mousePositionRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < interactionRadius) {
                    const force = (interactionRadius - distance) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    const repulsionStrength = 3;
                    this.x += Math.cos(angle) * force * repulsionStrength;
                    this.y += Math.sin(angle) * force * repulsionStrength;
                }

                // Movimento original e colisão com as bordas
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

                this.x += this.speedX;
                this.y += this.speedY;
            }
        }

        class Signal {
            start: Particle;
            end: Particle;
            progress: number;
            speed: number;
            alive: boolean;

            constructor(start: Particle, end: Particle) {
                this.start = start;
                this.end = end;
                this.progress = 0;
                this.speed = 0.02 + Math.random() * 0.04; // Velocidade do sinal
                this.alive = true;
            }

            update() {
                this.progress += this.speed;
                if (this.progress >= 1) {
                    this.alive = false;
                }
            }

            draw() {
                if (!ctx || !this.alive) return;
                const x = this.start.x + (this.end.x - this.start.x) * this.progress;
                const y = this.start.y + (this.end.y - this.start.y) * this.progress;

                // Desenhar o "brilho" viajante
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            signals = [];
            const numberOfParticles = (canvas.width * canvas.height) / particleCountDensity;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 3 + 1.5; // Slightly adjusted size
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const speedX = Math.random() * 0.4 - 0.2;
                const speedY = Math.random() * 0.4 - 0.2;
                particles.push(new Particle(x, y, size, speedX, speedY));
            }
        };

        const connect = () => {
            if (!ctx) return;
            const maxDistanceSq = (canvas.width / 7) * (canvas.height / 7);

            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distanceSq = dx * dx + dy * dy;

                    if (distanceSq < maxDistanceSq) {
                        const opacity = 1 - (distanceSq / maxDistanceSq);

                        // Desenhar linha
                        const hasParen = particleColor.endsWith(')');
                        if (hasParen) {
                            ctx.strokeStyle = particleColor.replace(/[\d.]+\)$/g, `${opacity * 0.25})`);
                        } else {
                            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.25})`;
                        }

                        if (particleColor.startsWith('#')) {
                            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.25})`;
                        }

                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();

                        // Chance aleatória de criar um sinal viajante entre partículas conectadas
                        if (Math.random() < 0.0005) { // Ajuste a probabilidade conforme necessário
                            signals.push(new Signal(particles[a], particles[b]));
                        }
                        if (Math.random() < 0.0005) {
                            signals.push(new Signal(particles[b], particles[a]));
                        }
                    }
                }
            }
        };

        let time = 0;
        const animate = () => {
            if (!ctx) return;
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const particle of particles) {
                particle.update(time);
                particle.draw();
            }

            connect();

            // Update and draw signals
            for (let i = signals.length - 1; i >= 0; i--) {
                const signal = signals[i];
                signal.update();
                signal.draw();
                if (!signal.alive) {
                    signals.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Inicializa
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleColor, particleCountDensity, interactionRadius]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
};
