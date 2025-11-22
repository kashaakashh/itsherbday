document.addEventListener("DOMContentLoaded", () => {
  console.log("Website loaded successfully 🌸");

  // ====== DOM ELEMENTS ======
  const startBtn = document.getElementById('startBtn');
  const journey = document.getElementById('journey');
  const journeyVideo = document.getElementById('journeyVideo');
  const afterVideo = document.getElementById('afterVideo');
  const lettersGrid = document.getElementById('lettersGrid');
  const letterModal = document.getElementById('letterModal');
  const letterInner = document.getElementById('letterInner');
  const closeModal = document.querySelector('.close');
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) bgMusic.volume = 0.2;
  const muteToggle = document.getElementById('muteToggle');
  const playFinal = document.getElementById('playFinal');
  const finalAudio = document.getElementById('finalAudio');
  const gate = document.getElementById('gate');
  const pwdInput = document.getElementById('pwd');
  const unlockBtn = document.getElementById('unlock');

  // ====== PASSWORD GATE ======
  if (unlockBtn && pwdInput && gate) {
    unlockBtn.addEventListener("click", () => {
      if (pwdInput.value === "2312") {
        gate.classList.add("fade-out");
        setTimeout(() => {
          gate.style.display = "none";
          const site = document.getElementById("site");
          if (site) site.classList.remove("hidden");
          if (bgMusic) bgMusic.play().catch(() => { });
        }, 1200);
      } else {
        alert("Try again! Hint: DDMM 😉");
      }
    });
  }

  function typeText(el, text, speed = 30) {
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i > text.length - 1) clearInterval(t);
    }, speed);
  }

  const tagEl = document.getElementById('typing');
  if (tagEl) typeText(tagEl, tagEl.textContent, 30);

  // ====== START JOURNEY ======
  if (startBtn && journey && journeyVideo) {
    startBtn.addEventListener("click", () => {
      runConfetti();
      const hero = document.querySelector(".hero");
      if (hero) hero.classList.add("hidden");
      journey.classList.remove("hidden");

      const memoryText = document.getElementById("memoryText");
      if (memoryText) {
        setTimeout(() => {
          memoryText.classList.add("hidden");
          setTimeout(() => {
            if (bgMusic) bgMusic.pause();
            journeyVideo.play().catch(() => { });
          }, 1000);
        }, 2000);
      }
    });

    journeyVideo.addEventListener("ended", () => {
      if (afterVideo) afterVideo.style.display = "block";
      if (bgMusic) bgMusic.play().catch(() => { });
    });
  }

  // ====== GENERATE LETTER CARDS ======
  if (lettersGrid) {
    try {
      for (let i = 1; i <= 24; i++) {
        const card = document.createElement("div");
        card.className = "letter-card";
        card.dataset.idx = i;
        card.innerHTML = `
          <div class="polaroid float">
            <img src="./letters/${i}.jpg" alt="letter ${i}" 
                 style="width:100%;height:100%;object-fit:cover;border-radius:6px">
          </div>
          <div style="margin-top:8px">Letter ${i}</div>`;
        lettersGrid.appendChild(card);
      }

      lettersGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".letter-card");
        if (!card) return;
        const idx = card.dataset.idx;

        if (!letterInner || !letterModal) return;

        // New HTML structure for the popup
        let contentHtml = `
          <div class="letter-header">
            <img src="./letters/${idx}.jpg" class="letter-thumbnail" onerror="this.style.display='none'">
            <div class="letter-title">Letter ${idx}</div>
          </div>
          <div class="letter-body">
        `;

        if (typeof lettersData !== 'undefined' && lettersData[idx]) {
          contentHtml += lettersData[idx].replace(/\n/g, '<br>');
        } else {
          contentHtml += "Letter content not found.";
        }

        contentHtml += `</div>`;
        letterInner.innerHTML = contentHtml;

        // Trigger animation
        letterModal.classList.add("active");

      });
    } catch (err) {
      console.error("Letters section issue:", err);
    }
  }

  // ====== LETTER MODAL CLOSE ======
  if (closeModal && letterModal && letterInner) {
    closeModal.addEventListener("click", () => {
      letterModal.classList.remove("active");
      setTimeout(() => { letterInner.innerHTML = ""; }, 300); // Clear after animation
    });

    letterModal.addEventListener("click", (e) => {
      if (e.target === letterModal) {
        letterModal.classList.remove("active");
        setTimeout(() => { letterInner.innerHTML = ""; }, 300);
      }
    });
  }

  // ====== MUTE TOGGLE ======
  if (muteToggle && bgMusic) {
    muteToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        muteToggle.textContent = "Mute";
      } else {
        bgMusic.pause();
        muteToggle.textContent = "Unmute";
      }
    });
  }
  // ====== HEART ANIMATION ======
  try {
    const canvas = document.getElementById('heartsCanvas');
    const ctx = canvas.getContext("2d");
    let hearts = [],
      w,
      h;

    function resizeCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createHeart() {
      return {
        x: random(0, w),
        y: random(0, h),
        size: random(6, 16),
        alpha: random(0.3, 0.8),
        speed: random(0.15, 0.4),
        drift: random(-0.3, 0.3),
        color: `rgba(255, ${random(100, 170)}, ${random(150, 210)}, 0.9)`,
      };
    }

    for (let i = 0; i < 60; i++) hearts.push(createHeart());

    function drawHeart(x, y, size, color, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 10, size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
      ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.restore();
    }

    function animateHearts() {
      ctx.clearRect(0, 0, w, h);
      hearts.forEach((hh) => {
        hh.y -= hh.speed;
        hh.x += hh.drift;
        if (hh.y < -10) {
          hh.x = random(0, w);
          hh.y = h + 10;
        }
        drawHeart(hh.x, hh.y, hh.size, hh.color, hh.alpha);
      });
      requestAnimationFrame(animateHearts);
    }

    animateHearts();
  } catch (err) {
    console.warn("Heart animation skipped:", err);
  }


  // ====== CONFETTI ======
  function runConfetti() {
    if (typeof gsap === "undefined") return;
    const num = 120;
    for (let i = 0; i < num; i++) {
      const el = document.createElement("div");
      el.style.position = "fixed";
      el.style.left = 50 + Math.random() * 50 + "%";
      el.style.top = "40%";
      el.style.width = "8px";
      el.style.height = "8px";
      el.style.background = "rgba(244,143,177,0.9)";
      el.style.borderRadius = "50%";
      el.style.zIndex = 9999;
      document.body.appendChild(el);
      gsap.to(el, {
        duration: 2 + Math.random() * 1.5,
        y: window.innerHeight,
        x: (Math.random() - 0.5) * 200,
        opacity: 0,
        ease: "power1.out",
        onComplete: () => el.remove(),
      });
    }
  }
});
