import React, { useEffect, useRef } from 'react';

const GenerativeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let p5Instance: any;

    // Import p5 dynamically to avoid SSR issues
    const setupP5 = async () => {
      try {
        // Use window.p5 since we're loading it from a CDN script tag
        const p5 = (window as any).p5;
        
        if (p5) {
          p5Instance = new p5((p: any) => {
            let particles: any[] = [];
            const particleCount = 100; // Increased for more visual density
            let noiseOffset = 0;
            let mouseX = 0;
            let mouseY = 0;
            let isScrolling = false;
            let scrollTimer: any = null;

            // Create a subtle color palette for elegant dark theme
            const colors = [
              p.color(70, 80, 120, 180),     // Subtle blue-purple
              p.color(40, 50, 80, 160),      // Dark blue
              p.color(60, 70, 100, 170),     // Navy blue
              p.color(80, 90, 140, 160),     // Steel blue
              p.color(100, 110, 160, 150),   // Light blue-purple
              p.color(30, 40, 70, 140),      // Very dark blue
              p.color(90, 100, 150, 130)     // Medium blue-gray
            ];

            // Background gradients - black with a touch of blue
            let gradientColors = {
              top: p.color(8, 10, 18),        // Nearly black with touch of blue
              bottom: p.color(12, 15, 25)     // Very dark blue-black
            };

            p.setup = () => {
              p.createCanvas(window.innerWidth, window.innerHeight);
              p.canvas.style.position = 'fixed';
              p.canvas.style.top = '0';
              p.canvas.style.left = '0';
              p.canvas.style.width = '100%';
              p.canvas.style.height = '100%';
              p.canvas.style.zIndex = '-1';
              p.blendMode(p.BLEND);
              
              // Create particles with more varied attributes for visual interest
              for (let i = 0; i < particleCount; i++) {
                particles.push({
                  x: p.random(p.width),
                  y: p.random(p.height),
                  size: p.random(1, 6),  // Smaller, more subtle particles
                  opacity: p.random(40, 150),  // Lower opacity for subtlety
                  speedX: p.random(-0.5, 0.5),
                  speedY: p.random(-0.5, 0.5),
                  noiseOffsetX: p.random(0, 1000),
                  noiseOffsetY: p.random(0, 1000),
                  color: colors[Math.floor(p.random(colors.length))],
                  pulseSpeed: p.random(0.01, 0.06),
                  pulseAmount: p.random(0.7, 1.5),
                  pulseCycle: p.random(0, Math.PI * 2),
                  connectRadius: p.random(80, 140) // Shorter connection radii for subtlety
                });
              }

              // Handle scroll events within p5
              window.addEventListener('scroll', () => {
                isScrolling = true;
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                  isScrolling = false;
                }, 200);
              });
            };

            p.draw = () => {
              // Draw gradient background
              drawGradientBackground();
              
              // Semi-transparent overlay to create trail effect for dark theme
              p.fill(10, 8, 20, 15);
              p.rect(0, 0, p.width, p.height);
              
              // Smoothly track mouse position 
              mouseX = p.lerp(mouseX, p.mouseX, 0.05);
              mouseY = p.lerp(mouseY, p.mouseY, 0.05);
              
              noiseOffset += 0.004;

              // Draw connections between nearby particles first (layering)
              drawConnections();
              
              // Update and draw particles
              updateAndDrawParticles();
              
              // Optional: add subtle floating gradients
              drawFloatingGradients();
            };
            
            // Function to draw smooth gradient background
            const drawGradientBackground = () => {
              for (let y = 0; y < p.height; y++) {
                const inter = p.map(y, 0, p.height, 0, 1);
                const c = p.lerpColor(gradientColors.top, gradientColors.bottom, inter);
                p.stroke(c);
                p.line(0, y, p.width, y);
              }
            };
            
            // Function to update and draw particles
            const updateAndDrawParticles = () => {
              for (let i = 0; i < particles.length; i++) {
                let particle = particles[i];
                
                // Add noise-based movement for organic flow
                let noiseX = p.noise(particle.noiseOffsetX + noiseOffset) * 2 - 1;
                let noiseY = p.noise(particle.noiseOffsetY + noiseOffset) * 2 - 1;
                
                // Move particle
                particle.x += particle.speedX + noiseX * 0.4;
                particle.y += particle.speedY + noiseY * 0.4;
                
                // Enhanced mouse interaction - particles are attracted to mouse
                if (!isScrolling) {
                  let d = p.dist(particle.x, particle.y, mouseX, mouseY);
                  if (d < 250) {
                    let forceDirectionX = (mouseX - particle.x);
                    let forceDirectionY = (mouseY - particle.y);
                    let force = (250 - d) / 8000;
                    particle.speedX += forceDirectionX * force;
                    particle.speedY += forceDirectionY * force;
                  }
                }
                
                // Apply friction
                particle.speedX *= 0.97;
                particle.speedY *= 0.97;
                
                // Wrap around edges (better than bouncing)
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Pulsing size effect
                particle.pulseCycle += particle.pulseSpeed;
                let pulseFactor = (p.sin(particle.pulseCycle) * particle.pulseAmount + 1) * 0.5;
                let finalSize = particle.size * pulseFactor;
                
                // Draw particle with enhanced glow effect
                p.noStroke();
                
                // Outer glow (larger, more transparent)
                let c = particle.color;
                p.fill(p.red(c), p.green(c), p.blue(c), 15);
                p.circle(particle.x, particle.y, finalSize * 3);
                
                // Middle glow
                p.fill(p.red(c), p.green(c), p.blue(c), 25);
                p.circle(particle.x, particle.y, finalSize * 2);
                
                // Core particle
                p.fill(p.red(c), p.green(c), p.blue(c), particle.opacity);
                p.circle(particle.x, particle.y, finalSize);
              }
            };
            
            // Function to draw connections between particles
            const drawConnections = () => {
              for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                  let p1 = particles[i];
                  let p2 = particles[j];
                  let d = p.dist(p1.x, p1.y, p2.x, p2.y);
                  let maxDist = Math.min(p1.connectRadius, p2.connectRadius);
                  
                  if (d < maxDist) {
                    // Calculate opacity based on distance (lower values for more subtlety)
                    let alpha = p.map(d, 0, maxDist, 25, 0);
                    
                    // Use gradient colors for connections based on particles' colors
                    let c1 = p1.color;
                    let c2 = p2.color;
                    
                    // Draw gradient line
                    let steps = 5;
                    for (let s = 0; s <= steps; s++) {
                      let t = s / steps;
                      let x = p.lerp(p1.x, p2.x, t);
                      let y = p.lerp(p1.y, p2.y, t);
                      let interColor = p.lerpColor(c1, c2, t);
                      
                      p.stroke(p.red(interColor), p.green(interColor), p.blue(interColor), alpha);
                      p.strokeWeight(p.map(d, 0, maxDist, 1.5, 0.2));
                      
                      if (s < steps) {
                        let nextX = p.lerp(p1.x, p2.x, (s+1)/steps);
                        let nextY = p.lerp(p1.y, p2.y, (s+1)/steps);
                        p.line(x, y, nextX, nextY);
                      }
                    }
                  }
                }
              }
            };
            
            // Draw subtle floating gradient shapes
            const drawFloatingGradients = () => {
              p.noStroke();
              // Draw 3-4 very subtle large gradient circles
              for (let i = 0; i < 4; i++) {
                let t = (p.frameCount * 0.001 + i * 0.2) % 1;
                let x = p.width * (0.2 + 0.6 * p.noise(i * 100 + t));
                let y = p.height * (0.2 + 0.6 * p.noise(i * 200 + t));
                let size = p.min(p.width, p.height) * (0.3 + 0.3 * p.sin(t * p.TWO_PI));
                
                // Very subtle gradient
                for (let r = size; r > 0; r -= 10) {
                  let alpha = p.map(r, 0, size, 6, 0);
                  let c = colors[i % colors.length];
                  p.fill(p.red(c), p.green(c), p.blue(c), alpha);
                  p.circle(x, y, r);
                }
              }
            };

            p.windowResized = () => {
              p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
          }, canvasRef.current);
        }
      } catch (error) {
        console.error("Error initializing p5:", error);
      }
    };

    setupP5();

    // Cleanup function
    return () => {
      if (p5Instance && p5Instance.remove) {
        p5Instance.remove();
      }
    };
  }, []);

  return <div id="p5Canvas" ref={canvasRef}></div>;
};

export default GenerativeBackground;
