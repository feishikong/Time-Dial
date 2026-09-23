const canvas = document.getElementById('analogClock');
const ctx = canvas.getContext('2d');

// Color settings (hexadecimal & alpha matching original Lua config)
const settings = {
    ubuntu_orange: { hex: "#E95420", alpha: 0.7 },
    lilac: { hex: "#c8a2c8", alpha: 0.7 },
    forest_green: { hex: "#008822", alpha: 0.1 },
    forest_green_edge: { hex: "#008822", alpha: 1.0 },
    bubblegum: { hex: "#ffc1cc", alpha: 0.1 },
    bubblegum_edge: { hex: "#ffc1cc", alpha: 1.0 },
    silver: { hex: "#A7A8A9", alpha: 0.1 },
    silver_edge: { hex: "#A7A8A9", alpha: 1.0 },
    unity_purple: { hex: "#762572", alpha: 0.5 },
};

function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawClock() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Clock settings
    const clock_size = h * 0.8;
    const radius = clock_size / 2;
    const xc = w / 2;
    const yc = h / 2;

    const now = new Date();
    const secs = now.getSeconds();
    const mins = now.getMinutes();
    const hours_24 = now.getHours();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const date = now.getDate();

    // Calculate angles
    const minutes_angle = ((mins + secs / 60) / 60) * 2 * Math.PI;
    const hours_angle = (((hours_24 % 12) + mins / 60) / 12) * 2 * Math.PI;

    // -------------------------------------------------------------
    // 1. Year Background (Spiral Petal Bitmask)
    // -------------------------------------------------------------
    const year_length = radius / 2;
    const petal_angle_step = Math.PI / 6;

    for (let i = 0; i < 12; i++) {
        const petal_angle = i * petal_angle_step - (Math.PI / 2) + petal_angle_step;
        const petal_start_angle = petal_angle + Math.PI;
        const yearx = xc + year_length * Math.cos(petal_angle);
        const yeary = yc + year_length * Math.sin(petal_angle);

        ctx.beginPath();
        // Arc 1
        ctx.arc(yearx, yeary, year_length, petal_start_angle, petal_angle, false);

        // Arc 2
        const next_start = petal_angle + petal_angle_step;
        ctx.arc(xc, yc, radius, petal_angle, next_start, false);

        // Arc 3 (Counter-clockwise using cairo_arc_negative logic)
        const next_yearx = xc + year_length * Math.cos(next_start);
        const next_yeary = yc + year_length * Math.sin(next_start);
        ctx.arc(next_yearx, next_yeary, year_length, next_start, next_start + Math.PI, true);

        ctx.fillStyle = hexToRgba(settings.silver.hex, settings.unity_purple.alpha);
        ctx.strokeStyle = hexToRgba(settings.silver.hex, settings.unity_purple.alpha);
        ctx.lineWidth = 1;

        if (Math.floor(year / Math.pow(2, i)) % 2 === 1) {
            ctx.fill();
        }
        ctx.stroke();
    }

    // -------------------------------------------------------------
    // 2. Minute Sector (Glass Gradient Fill)
    // -------------------------------------------------------------
    const minute_length = radius;
    const start_angle = -Math.PI / 2;
    const end_angle = start_angle + minutes_angle;

    const glass_gradient = ctx.createRadialGradient(xc, yc, 0, xc, yc, minute_length);
    glass_gradient.addColorStop(0, hexToRgba(settings.forest_green.hex, settings.forest_green.alpha));
    glass_gradient.addColorStop(1, hexToRgba(settings.forest_green_edge.hex, settings.forest_green_edge.alpha));

    ctx.beginPath();
    ctx.moveTo(xc, yc);
    ctx.arc(xc, yc, minute_length, start_angle, end_angle, false);
    ctx.closePath();
    ctx.fillStyle = glass_gradient;
    ctx.fill();

    // -------------------------------------------------------------
    // 3. Hour Marks & Month Marks
    // -------------------------------------------------------------
    const inner_radius = radius * 0.8;
    const outer_radius = radius;
    const mark_width = h * 0.03;
    const month_mark = month * 5;

    for (let i = 1; i <= 60; i++) {
        const angle = (i / 60) * 2 * Math.PI;
        if (i % 5 === 0) {
            ctx.beginPath();
            if (i <= month_mark) {
                ctx.strokeStyle = hexToRgba(settings.ubuntu_orange.hex, settings.ubuntu_orange.alpha);
            } else {
                ctx.strokeStyle = hexToRgba(settings.unity_purple.hex, settings.ubuntu_orange.alpha);
            }
            ctx.lineWidth = mark_width;
            ctx.moveTo(xc + inner_radius * Math.sin(angle), yc - inner_radius * Math.cos(angle));
            ctx.lineTo(xc + outer_radius * Math.sin(angle), yc - outer_radius * Math.cos(angle));
            ctx.stroke();
        }
    }

    // -------------------------------------------------------------
    // 4. Hour Hand
    // -------------------------------------------------------------
    const hour_length = radius * 0.4;
    const hour_width = h * 0.03;
    const glow_length = radius * 0.42;
    const glow_width = h * 0.04;
    ctx.beginPath();
    if(hours_24 < 12)
        ctx.strokeStyle = hexToRgba(settings.unity_purple.hex, settings.ubuntu_orange.alpha);
    else
        ctx.strokeStyle = hexToRgba(settings.ubuntu_orange.hex, settings.ubuntu_orange.alpha);
    ctx.lineWidth = glow_width;
    ctx.moveTo(xc, yc);
    ctx.lineTo(xc + glow_length * Math.sin(hours_angle), yc - glow_length * Math.cos(hours_angle));
    ctx.stroke();
    ctx.beginPath();
    if(hours_24 < 12)
        ctx.strokeStyle = hexToRgba(settings.ubuntu_orange.hex, settings.ubuntu_orange.alpha);
    else
        ctx.strokeStyle = hexToRgba(settings.unity_purple.hex, settings.ubuntu_orange.alpha);
    ctx.lineWidth = hour_width;
    ctx.moveTo(xc, yc);
    ctx.lineTo(xc + hour_length * Math.sin(hours_angle), yc - hour_length * Math.cos(hours_angle));
    ctx.stroke();

    // -------------------------------------------------------------
    // 5. Date Dots Indicator Ring
    // -------------------------------------------------------------
    const dot_radius = h * 0.03;
    const ring_radius = radius * 1.1;
    const angle_step = (2 * Math.PI) / date;
    const start_angle_date = (Math.PI / 2) + angle_step;

    for (let i = 1; i <= date; i++) {
        const angle = (i * angle_step) - start_angle_date;
        const x = xc + ring_radius * Math.cos(angle);
        const y = yc + ring_radius * Math.sin(angle);

        ctx.beginPath();
        if (i % 7 === 1) {
            ctx.fillStyle = hexToRgba(settings.ubuntu_orange.hex, settings.ubuntu_orange.alpha);
        } else if (i % 7 === 0 || i % 7 === 3 || i % 7 === 5) {
            ctx.fillStyle = hexToRgba(settings.forest_green.hex, settings.ubuntu_orange.alpha);
        } else {
            ctx.fillStyle = hexToRgba(settings.unity_purple.hex, settings.ubuntu_orange.alpha);
        }
        ctx.arc(x, y, dot_radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    requestAnimationFrame(drawClock);
}

// Start render loop
drawClock();
