 const beamCanvas = document.getElementById('beamCanvas');
    const beamCtx = beamCanvas.getContext('2d');
    const graphCanvas = document.getElementById('graphCanvas');
    const graphCtx = graphCanvas.getContext('2d');

    const w0 = 1e-3;
    const wavelength = 632.8e-9;
    const zR = Math.PI * w0 * w0 / wavelength;
    const steps = 500;

    const sizes = [];
    const zValues = [];
    for (let i = 0; i <= steps; i++) {
      const z = i * 5 * zR / steps;
      sizes.push(w0 * Math.sqrt(1 + (z/zR)**2));
      zValues.push(z * 1e3); // mm
    }

    function drawAxes() {
      graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      graphCtx.strokeStyle = '#555';
      graphCtx.lineWidth = 1;
      graphCtx.beginPath();
      graphCtx.moveTo(40, graphCanvas.height - 40);
      graphCtx.lineTo(graphCanvas.width - 20, graphCanvas.height - 40);
      graphCtx.moveTo(40, 20);
      graphCtx.lineTo(40, graphCanvas.height - 40);
      graphCtx.stroke();
      graphCtx.fillStyle = '#aaa';
      graphCtx.fillText('z (mm)', graphCanvas.width/2, graphCanvas.height - 10);
      graphCtx.save();
      graphCtx.translate(10, graphCanvas.height/2);
      graphCtx.rotate(-Math.PI/2);
      graphCtx.fillText('w(z) ×1e3 (mm)', 0, 0);
      graphCtx.restore();
    }

    function drawGraph(idx) {
      drawAxes();
      graphCtx.strokeStyle = '#0fc';
      graphCtx.lineWidth = 2;
      graphCtx.beginPath();
      for (let i = 0; i <= idx; i++) {
        const x = 40 + (graphCanvas.width - 60) * (i / steps);
        const y = graphCanvas.height - 40 - (graphCanvas.height - 60) * ((sizes[i]*1e3) / ((sizes[steps]*1e3)));
        if (i === 0) graphCtx.moveTo(x, y);
        else graphCtx.lineTo(x, y);
      }
      graphCtx.stroke();

      // Draw current value dot
      const x = 40 + (graphCanvas.width - 60) * (idx / steps);
      const y = graphCanvas.height - 40 - (graphCanvas.height - 60) * ((sizes[idx]*1e3) / ((sizes[steps]*1e3)));
      graphCtx.fillStyle = 'red';
      graphCtx.beginPath();
      graphCtx.arc(x, y, 4, 0, 2*Math.PI);
      graphCtx.fill();
    }

    function drawBeam(i) {
      const size = beamCanvas.width;
      const w = sizes[i];
      const scale = size / (6 * sizes[steps]);
      const center = size / 2;
      const radius = w * scale;

      beamCtx.clearRect(0, 0, size, size);
      const grad = beamCtx.createRadialGradient(center, center, 0, center, center, radius);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.5, 'rgba(0,200,255,0.7)');
      grad.addColorStop(1, 'rgba(0,0,50,0)');

      beamCtx.fillStyle = grad;
      beamCtx.fillRect(center - radius, center - radius, radius*2, radius*2);
    }

    const slider = document.getElementById('slider');
    const speedSlider = document.getElementById('speedSlider');
    const zValueLabel = document.getElementById('zValue');
    const wValueLabel = document.getElementById('wValue');
    const pauseBtn = document.getElementById('pauseBtn');

    slider.addEventListener('input', () => updateFrame(+slider.value));

    let idx = 0;
    let isPaused = false;

    function updateFrame(i) {
      idx = i;
      drawBeam(idx);
      drawGraph(idx);
      zValueLabel.textContent = zValues[idx].toFixed(1);
      wValueLabel.textContent = (sizes[idx] * 1e3).toFixed(4);
    }

    function animate() {
      if (!isPaused) {
        const speed = +speedSlider.value;
        idx = (idx + speed) % (steps + 1);
        slider.value = idx;
        updateFrame(idx);
      }
      requestAnimationFrame(animate);
    }

    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? 'Play' : 'Pause';
    });

    drawAxes();
    updateFrame(0);
    animate();