(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function seed() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 3800);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height * 0.75,
        r:     Math.random() * 1.3 + 0.2,
        a:     Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,210,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); seed(); });
  resize(); seed();
  requestAnimationFrame(draw);
})();

(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let embers = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn() {
    return {
      x:    Math.random() * canvas.width,
      y:    canvas.height + 10,
      r:    Math.random() * 2 + 0.5,
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   -(Math.random() * 0.8 + 0.3),
      a:    Math.random() * 0.6 + 0.2,
      life: 1
    };
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.12) embers.push(spawn());
    embers = embers.filter(e => e.life > 0);
    embers.forEach(e => {
      e.x    += e.vx;
      e.y    += e.vy;
      e.life -= 0.003;
      const alpha = e.a * e.life;
      /* colour shifts from gold → rose as the ember rises */
      const r = Math.round(201 + (139 - 201) * (1 - e.life));
      const g = Math.round(148 + ( 34 - 148) * (1 - e.life));
      const b = Math.round( 58 + ( 82 -  58) * (1 - e.life));
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(tick);
})();
