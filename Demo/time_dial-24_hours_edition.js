const canvas24 = document.getElementById('24-hour-time-dial');
const ctx24 = canvas24.getContext('2d');

// Color settings (hexadecimal & alpha matching original Lua config)
const colors = {
    ubuntu_orange:  "#E95420",
    lilac:  "#c8a2c8",
    forest_green:  "#008822",
    bubblegum:  "#ffc1cc",
    silver:  "#A7A8A9",
    unity_purple:  "#762572",
    fedora_blue: "#3C6EB4",
    red_hat: "#EE0000",
    coal_black: "#0C0908",
    pikachu_yellow: "#F6CF57",
};

const settings = {
    month_mark: { hex: colors.ubuntu_orange, alpha: 0.7 },
    day_hour_hand: { hex: colors.fedora_blue, alpha: 0.7 },
    day_mark: { hex: colors.ubuntu_orange, alpha: 0.7 },
    day_modulo_1: { hex: colors.red_hat, alpha: 0.7 },
    day_modulo_234: { hex: colors.bubblegum, alpha: 0.1 },
    minute_sector: { hex: colors.forest_green, alpha: 0.1 },
    minute_sector_edge: { hex: colors.forest_green, alpha: 1.0 },
    hour_mark: { hex: colors.pikachu_yellow, alpha: 0.7 },
    year_background: { hex: colors.silver, alpha: 0.5 },
    night_hour_hand: { hex: colors.coal_black, alpha: 0.5 },
    day_modulo_560: { hex: colors.unity_purple, alpha: 0.5 },
    day_hour_sector: { hex: colors.fedora_blue, alpha: 0.1 },
    day_hour_sector_edge: { hex: colors.fedora_blue, alpha: 0.8 },
    solar_day: { hex: colors.bubblegum, alpha: 1 },
    solar_night: { hex: colors.coal_black, alpha: 1 },
};


function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawClock() {
    const w = canvas24.width;
    const h = canvas24.height;
    ctx24.clearRect(0, 0, w, h);

    // Clock settings
    const clock_size = h * 0.8;
    const radius = clock_size / 2;
    const xc = w / 2;
    const yc = h / 2;

    const now = new Date();
    const msecs = now.getMilliseconds();
    const secs = now.getSeconds();
    const mins = now.getMinutes();
    const hours_24 = now.getHours();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const date = now.getDate();

    // Calculate angles
    const seconds_angle = ((secs + msecs / 1000) / 60) * 2 * Math.PI;
    const minutes_angle = ((mins + secs / 60) / 60) * 2 * Math.PI;
    const hours_angle = (((hours_24 % 24) + mins / 60) / 24) * 2 * Math.PI;

    // -------------------------------------------------------------
    // 1. Year Background (Spiral Petal Bitmask)
    // -------------------------------------------------------------
    const year_length = radius / 2;
    const petal_angle_step = Math.PI / 6;

    for (let i = 0; i < 12; i++) {
        const petal_angle = i * petal_angle_step - (Math.PI / 2) + petal_angle_step + seconds_angle;
        const petal_start_angle = petal_angle + Math.PI;
        const yearx = xc + year_length * Math.cos(petal_angle);
        const yeary = yc + year_length * Math.sin(petal_angle);

        ctx24.beginPath();
        // Arc 1
        ctx24.arc(yearx, yeary, year_length, petal_start_angle, petal_angle, false);

        // Arc 2
        const next_start = petal_angle + petal_angle_step;
        ctx24.arc(xc, yc, radius, petal_angle, next_start, false);

        // Arc 3 (Counter-clockwise using cairo_arc_negative logic)
        const next_yearx = xc + year_length * Math.cos(next_start);
        const next_yeary = yc + year_length * Math.sin(next_start);
        ctx24.arc(next_yearx, next_yeary, year_length, next_start, next_start + Math.PI, true);

        ctx24.fillStyle = hexToRgba(settings.year_background.hex, settings.year_background.alpha);
        ctx24.strokeStyle = hexToRgba(settings.year_background.hex, settings.year_background.alpha);
        ctx24.lineWidth = 1;

        if (Math.floor(year / Math.pow(2, i)) % 2 === 1) {
            ctx24.fill();
        }
        ctx24.stroke();
    }

    // -------------------------------------------------------------
    // 2. Minute Sector (Glass Gradient Fill)
    // -------------------------------------------------------------
    const minute_length = radius;
    const start_angle = -Math.PI / 2;
    const end_angle = start_angle + minutes_angle;

    const glass_gradient = ctx24.createRadialGradient(xc, yc, 0, xc, yc, minute_length);
    glass_gradient.addColorStop(0, hexToRgba(settings.minute_sector.hex, settings.minute_sector.alpha));
    glass_gradient.addColorStop(1, hexToRgba(settings.minute_sector_edge.hex, settings.minute_sector_edge.alpha));

    ctx24.beginPath();
    ctx24.moveTo(xc, yc);
    ctx24.arc(xc, yc, minute_length, start_angle, end_angle, false);
    ctx24.closePath();
    ctx24.fillStyle = glass_gradient;
    ctx24.fill();

    // -------------------------------------------------------------
    // 3. 24-Hour Ring Sector
    // -------------------------------------------------------------
    const hours_24_outer_radius = radius;
    const hours_24_inner_radius = radius * 0.8;
    const end_angle_hr = start_angle + hours_angle;

    let glassGradientHr = ctx24.createRadialGradient(xc, yc, 0, xc, yc, hours_24_outer_radius);
    glassGradientHr.addColorStop(0, hexToRgba(settings.day_hour_sector.hex, settings.day_hour_sector.alpha));
    glassGradientHr.addColorStop(1, hexToRgba(settings.day_hour_sector_edge.hex, settings.day_hour_sector_edge.alpha));

    ctx24.beginPath();
    ctx24.arc(xc, yc, hours_24_outer_radius, start_angle, end_angle_hr, false);
    ctx24.arc(xc, yc, hours_24_inner_radius, end_angle_hr, start_angle, true);
    ctx24.closePath();
    ctx24.fillStyle = glassGradientHr;
    ctx24.fill();

    // -------------------------------------------------------------
    // 4. Hour Marks & Month Marks
    // -------------------------------------------------------------
    const month_mark = month * 2;

    for (let i = 1; i <= 24; i++) {
      const angle = (i / 24) * 2 * Math.PI;
      let mark_width, inner_radius;
      const outer_radius = radius

      if (i % 2 === 1) {
        mark_width = h * 0.01;
        inner_radius = radius * 0.9;
      } else {
        mark_width = h * 0.03;
        inner_radius = radius * 0.8;
      }

      let markColor;
      if (i <= month_mark && i % 2 === 0) {
        markColor = hexToRgba(settings.month_mark.hex, settings.hour_mark.alpha);
      } else if (i % 2 === 0) {
        markColor = hexToRgba(settings.hour_mark.hex, settings.hour_mark.alpha);
      } else if (i < 6 || i > 18) {
        markColor = hexToRgba(settings.solar_day.hex, settings.hour_mark.alpha);
      } else {
        markColor = hexToRgba(settings.solar_night.hex, settings.hour_mark.alpha);
      }

      ctx24.beginPath();
      ctx24.lineWidth = mark_width;
      ctx24.strokeStyle = markColor;
      ctx24.moveTo(xc + inner_radius * Math.sin(angle), yc - inner_radius * Math.cos(angle));
      ctx24.lineTo(xc + outer_radius * Math.sin(angle), yc - radius * Math.cos(angle));
      ctx24.stroke();
    }

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

        ctx24.beginPath();
        if (i % 7 === 1) {
            ctx24.fillStyle = hexToRgba(settings.day_modulo_1.hex, settings.day_mark.alpha);
        } else if (i % 7 === 2 || i % 7 === 3 || i % 7 === 4) {
            ctx24.fillStyle = hexToRgba(settings.day_modulo_234.hex, settings.day_mark.alpha);
        } else {
            ctx24.fillStyle = hexToRgba(settings.day_modulo_560.hex, settings.day_mark.alpha);
        }
        ctx24.arc(x, y, dot_radius, 0, 2 * Math.PI);
        ctx24.fill();
    }

    requestAnimationFrame(drawClock);
}

// Start render loop
drawClock();
