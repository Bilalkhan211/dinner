document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Particle Canvas System (Gold Dust / Sparkles)
    // ----------------------------------------------------
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 60;
    const confettiList = [];
    const confettiColors = ['#e4c25a', '#c5a028', '#2ed573', '#ff4757', '#1e90ff', '#ff6b81', '#ffa502'];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.8 + 0.2;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.02 - 0.01;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.angle) * 0.2;
            this.angle += this.spinSpeed;
            this.opacity -= 0.001;

            if (this.y < -10 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#e4c25a'; // Accent Gold color
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#e4c25a';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class ConfettiParticle {
        constructor(x, y) {
            this.x = x || width / 2;
            this.y = y || height / 2;
            this.size = Math.random() * 8 + 6;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.speedY = Math.random() * -10 - 4;
            this.speedX = Math.random() * 12 - 6;
            this.gravity = 0.35;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.2 - 0.1;
            this.opacity = 1;
            this.decay = Math.random() * 0.012 + 0.008;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.opacity -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    window.triggerConfettiBurst = function(x, y) {
        for (let i = 0; i < 90; i++) {
            confettiList.push(new ConfettiParticle(x, y));
        }
    };

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw ambient gold sparkles
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw colorful confetti
        for (let i = confettiList.length - 1; i >= 0; i--) {
            const c = confettiList[i];
            c.update();
            c.draw();
            if (c.opacity <= 0 || c.y > height + 20) {
                confettiList.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ----------------------------------------------------
    // 2. Mouse Glow Card Effect
    // ----------------------------------------------------
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glow.style.setProperty('--x', `${x}px`);
            glow.style.setProperty('--y', `${y}px`);
        });
    });

    // ----------------------------------------------------
    // 3. Countdown Timer to 8:00 PM Tonight
    // ----------------------------------------------------
    // Today is June 20, 2026
    const targetDate = new Date('2026-06-20T20:00:00+05:00'); // 8:00 PM Local Time

    const hourEl = document.getElementById('hours');
    const minuteEl = document.getElementById('minutes');
    const secondEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            hourEl.textContent = '00';
            minuteEl.textContent = '00';
            secondEl.textContent = '00';
            const alertTitle = document.querySelector('.alert-content h3');
            const alertText = document.querySelector('.alert-content p');
            if (alertTitle) alertTitle.textContent = 'Welcome!';
            if (alertText) alertText.innerHTML = 'Dinner is in progress! Enjoy the beautiful evening with <strong>Ghani Khan</strong>!';
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        hourEl.textContent = String(hours).padStart(2, '0');
        minuteEl.textContent = String(minutes).padStart(2, '0');
        secondEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ----------------------------------------------------
    // 4. Web Audio Synthesizer (Zero-latency sound effects)
    // ----------------------------------------------------
    let audioContext = null;

    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playPopSound() {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.13);
        } catch (err) {
            console.log("Audio synthesis blocked or unsupported:", err);
        }
    }

    function playChimeSound() {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const playTone = (freq, delay, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
                
                gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + delay + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + duration);
            };
            
            // Joyful triple chime chord (C major triad arpeggio)
            playTone(523.25, 0, 0.4);   // C5
            playTone(659.25, 0.08, 0.45); // E5
            playTone(783.99, 0.16, 0.5);  // G5
        } catch (err) {
            console.log("Audio synthesis blocked or unsupported:", err);
        }
    }

    // ----------------------------------------------------
    // 5. Celebration, Confetti, and Emojis
    // ----------------------------------------------------
    const celebrateBtn = document.getElementById('confetti-trigger-btn');
    
    function spawnFloatingEmoji(emoji, x, y) {
        const el = document.createElement('div');
        el.className = 'floating-emoji';
        el.textContent = emoji;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        
        // Random horizontal drift velocity
        const vx = (Math.random() * 120 - 60);
        el.style.setProperty('--vx', `${vx}px`);
        
        document.body.appendChild(el);
        setTimeout(() => {
            el.remove();
        }, 1200);
    }

    celebrateBtn.addEventListener('click', (e) => {
        const rect = celebrateBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Burst 90 colorful particles
        if (window.triggerConfettiBurst) {
            window.triggerConfettiBurst(x, y);
        }
        
        // Spawn emojis
        const emojis = ['🎉', '✨', '❤️', '🌟', '🥳', '🙌'];
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const rx = x + (Math.random() * 100 - 50);
                const ry = y - 20;
                spawnFloatingEmoji(emojis[i], rx, ry);
            }, i * 60);
        }

        playChimeSound();
    });

    // ----------------------------------------------------
    // 6. Dinner Menu "Yum!" Voting System
    // ----------------------------------------------------
    const dishes = ['rice', 'chicken', 'surprise'];
    dishes.forEach(dish => {
        const key = `vote_${dish}`;
        const countEl = document.getElementById(`vote-${dish}`);
        
        // Load initial votes
        let votes = parseInt(localStorage.getItem(key)) || 0;
        countEl.textContent = votes;

        const card = document.querySelector(`.menu-item-card[data-dish="${dish}"]`);
        const voteBtn = card.querySelector('.yum-vote-btn');

        voteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            votes++;
            localStorage.setItem(key, votes);
            countEl.textContent = votes;
            
            const rect = voteBtn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Mini sparkle burst
            if (window.triggerConfettiBurst) {
                // Spawn 15 particles
                for (let i = 0; i < 15; i++) {
                    window.triggerConfettiBurst(x, y);
                }
            }

            if (dish === 'surprise') {
                spawnFloatingEmoji('🎁', x, y);
                if (Math.random() > 0.4) spawnFloatingEmoji('❓', x - 30, y);
                if (Math.random() > 0.4) spawnFloatingEmoji('✨', x + 30, y);
            } else {
                spawnFloatingEmoji('😋', x, y);
                if (Math.random() > 0.4) spawnFloatingEmoji('❤️', x - 30, y);
                if (Math.random() > 0.4) spawnFloatingEmoji('🔥', x + 30, y);
            }

            playPopSound();
        });
    });

    // ----------------------------------------------------
    // 7. Ambient Music & Atmosphere Control
    // ----------------------------------------------------
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const playIcon = musicBtn.querySelector('.icon-play');
    const pauseIcon = musicBtn.querySelector('.icon-pause');
    const musicText = musicBtn.querySelector('.music-text');
    const trackBtns = document.querySelectorAll('.music-option-btn');

    const tracks = {
        acoustic: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        ambient: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        chime: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
    };

    let activeTrack = 'acoustic';

    function syncTopMusicToggle() {
        if (!bgMusic.paused) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            musicText.textContent = 'Mute';
            musicBtn.style.background = 'var(--accent-color)';
            musicBtn.style.color = 'var(--primary-dark)';
            musicBtn.style.boxShadow = '0 4px 20px var(--accent-glow)';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            musicText.textContent = 'Play Atmosphere';
            musicBtn.style.background = 'rgba(12, 40, 27, 0.6)';
            musicBtn.style.color = 'var(--accent-color)';
            musicBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        }
    }

    trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            trackBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            
            const track = btn.getAttribute('data-track');
            activeTrack = track;
            
            // Swap audio source
            const wasPlaying = !bgMusic.paused;
            bgMusic.src = tracks[track];
            
            if (wasPlaying) {
                bgMusic.play().then(() => {
                    syncTopMusicToggle();
                }).catch(err => console.log(err));
            } else {
                // If it wasn't playing, start playing it now as a response to interaction!
                bgMusic.play().then(() => {
                    syncTopMusicToggle();
                }).catch(err => console.log(err));
            }
            playPopSound();
        });
    });

    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            // If src is empty (first play), load active track
            if (!bgMusic.src) {
                bgMusic.src = tracks[activeTrack];
            }
            bgMusic.play().then(() => {
                syncTopMusicToggle();
            }).catch(err => {
                console.error("Audio playback blocked or failed:", err);
            });
        } else {
            bgMusic.pause();
            syncTopMusicToggle();
        }
    });

    // ----------------------------------------------------
    // 8. Share Hub Message Builder
    // ----------------------------------------------------
    const templateSelect = document.getElementById('message-template');
    const previewEl = document.getElementById('message-preview');
    const copyBtn = document.getElementById('copy-btn');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    const invitationLink = window.location.href;

    const templates = {
        elegant: () => 
`🌟 *A Special Family Dinner Gathering* 🌟

Dear cousins, 
Tonight, our family gathers for a wonderful dinner and a warm evening together. We are exceptionally honored to welcome our special guest of honor, *Ghani Khan*.

📍 *Venue:* Family House
⏰ *Time:* Please arrive *before 8:00 PM* so we can begin together.

Kindly view the countdown, details, and tonight's feast menu here:
🔗 ${invitationLink}

Looking forward to seeing every single one of you!`,

        casual: () => 
`🔔 *Dinner Reminder for Tonight!* 👋

Hey cousins! Just a quick reminder about the dinner gathering tonight. 

Please make sure to arrive *before 8:00 PM* sharp! Our special guest *Ghani Khan* is joining us, and we want to start on time. 

Check the live countdown and see tonight's menu delights here:
🔗 ${invitationLink}

See you all very soon!`,

        excited: () => 
`🔥 *Cousins Dinner Gathering TONIGHT!* 🔥

Get ready for an amazing night of great food, family vibes, and a very special guest: *Ghani Khan* is joining our table tonight! 🙌

⏰ *Deadline:* Arrive *before 8:00 PM* sharp! 
Don't be late—we want to start together.

Check the live countdown and see what is cooking tonight:
🔗 ${invitationLink}

Can't wait! Let's make it epic!`
    };

    function updatePreview() {
        const theme = templateSelect.value;
        const msgText = templates[theme]();
        previewEl.textContent = msgText;
    }

    templateSelect.addEventListener('change', updatePreview);
    updatePreview(); // Initial load

    copyBtn.addEventListener('click', () => {
        const text = templates[templateSelect.value]();
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" class="btn-icon" width="18" height="18">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Copied!
            `;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
        playPopSound();
    });

    whatsappBtn.addEventListener('click', () => {
        const text = encodeURIComponent(templates[templateSelect.value]());
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        playPopSound();
    });
});
