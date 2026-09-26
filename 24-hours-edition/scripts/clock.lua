-- time-dial
-- by @fuseteam
-- 2026

-- Save as ~/.conky/clock.lua or another location and call in .conkyrc

-- === Required Cairo Modules ===
require 'cairo'
-- Attempt to safely require the 'cairo_xlib' module
local status, cairo_xlib = pcall(require, 'cairo_xlib')

if not status then
    -- If not found, fall back to a dummy table
    -- Redirects unknown keys to the global namespace (_G)
    -- Allows use of global Cairo functions like cairo_xlib_surface_create
    cairo_xlib = setmetatable({}, {
        __index = function(_, key)
            return _G[key]
        end
    })
end

-- Function to convert hexadecimal color to RGBA
local function hex_to_rgba(hex, default_alpha)
    hex = hex:gsub("#", "") -- Remove # if present
    local r = tonumber(hex:sub(1, 2), 16) / 255
    local g = tonumber(hex:sub(3, 4), 16) / 255
    local b = tonumber(hex:sub(5, 6), 16) / 255
    local a = default_alpha or 1 -- Use default_alpha if no alpha is specified
    if #hex == 8 then
        a = tonumber(hex:sub(7, 8), 16) / 255 -- Support 8-digit hex (RRGGBBAA)
    end
    return r, g, b, a
end

-- Color settings (hexadecimal colors, e.g. #FFFFFF for white)
local colors = {
    ubuntu_orange = "#E95420",
    unity_purple = "#762572",
    forest_green = "#008822",
    silver = "#A7A8A9",
    bubblegum = "#FFC1CC",
    fedora_blue = "#3C6EB4",
    red_hat = "#EE0000",
    coal_black = "#0C0908",
    pikachu_yellow = "F6CF57",
}
local settings = {
    month_mark = {hex = colors.ubuntu_orange, alpha = 0.7},   -- Month marks
    day_hour_hand = {hex = colors.red_hat, alpha = 1},   -- Day Hour hand
    day_mark = {hex = colors.ured_hat, alpha = 0.7},   -- Day marks
    day_modulo_1 = {hex = colors.red_hat, alpha = 0.7},   -- Day marks modulo 1
    day_modulo_234 = {hex = colors.bubblegum, alpha = 0.1},   -- Day marks modulo 2, 3 and 4
    minute_sector = {hex = colors.forest_green, alpha = 0.1},   -- Minute sector
    minute_sector_edge = {hex = colors.forest_green, alpha = 1},  -- Minute Sector Edge
    hour_mark = {hex = colors.pikachu_yellow, alpha = 0.7},   -- Hour marks
    year_background = {hex = colors.silver, alpha = 0.5},   -- Year background
    night_hour_hand = {hex = colors.fedora_blue, alpha = 1},   -- Night Hour hand
    day_modulo_560 = {hex = colors.unity_purple, alpha = 0.5},   -- Day marks modulo 5, 6 and 0
    solar_day = {hex = colors.bubblegum, alpha = 1},
    day_hour_sector = {hex = colors.fedora_blue, alpha = 0.1},   -- Minute sector
    day_hour_sector_edge = {hex = colors.fedora_blue, alpha = 0.8},  -- Minute Sector Edge
    solar_night = {hex = colors.coal_black, alpha = 1},
    night_hour_sector = {hex = colors.coal_black, alpha = 0.1},   -- Minute sector
    night_hour_sector_edge = {hex = colors.coal_black, alpha = 1},  -- Minute Sector Edge
}

function conky_analog_clock()
    -- Check if Conky is active
    if conky_window == nil then return end

    -- Create Cairo surface and context
    local w = conky_window.width
    local h = conky_window.height
    local cs = cairo_xlib_surface_create(conky_window.display, conky_window.drawable, conky_window.visual, w, h)
    local cr = cairo_create(cs)

    -- Clock settings
    local clock_size = h * 0.8 -- Diameter of the clock (height = 180px)
    local radius = clock_size / 2
    local xc = w / 2 -- X-coordinate of center (middle of the canvas)
    local yc = h / 2

    -- Get time
    local secs = os.date("%S")
    local mins = os.date("%M")
    local hours_24 = os.date("%H") -- 24-hour format for calculations

    -- Calculate angles (in radians)
    local minutes_angle = ((mins + secs / 60) / 60) * 2 * math.pi
    local hours_angle = ((hours_24 % 12 + mins / 60) / 12) * 2 * math.pi
    local hours24_angle = ((hours_24 + mins / 60) / 24) * 2 * math.pi

    -- Year Background
    local year_length = radius / 2
    local year = os.date("%Y")

    for i = 0, 23 do
       r, g, b, a = hex_to_rgba(settings.year_background.hex, settings.year_background.alpha)
       cairo_set_source_rgba(cr, r, g, b, a)
       local petal_angle_step = math.pi / 12
       local petal_angle = i * petal_angle_step - (math.pi / 2) + petal_angle_step
       local petal_start_angle = petal_angle + math.pi
       local yearx = xc + year_length * math.cos(petal_angle)
       local yeary = yc + year_length * math.sin(petal_angle)
       cairo_arc(cr, yearx, yeary, year_length, petal_start_angle, petal_angle)
       local next_start = petal_angle + petal_angle_step
       cairo_arc(cr, xc, yc, radius, petal_angle, next_start)
       local next_yearx = xc + year_length * math.cos(next_start)
       local next_yeary = yc + year_length * math.sin(next_start)
       cairo_arc_negative(cr, next_yearx, next_yeary, year_length, next_start, next_start + math.pi)
	   if math.floor(year / (2 ^ i)) % 2 == 1 then
	           cairo_fill(cr)
	   end
	   cairo_stroke(cr)
    end

    -- Minute Sector
     local minute_length = radius
     local start_angle = -math.pi / 2
     local end_angle = start_angle + minutes_angle
     local glass_gradient = cairo_pattern_create_radial(xc, yc, 0, xc, yc, minute_length)
     r, g, b, a = hex_to_rgba(settings.minute_sector.hex, settings.minute_sector.alpha)
     cairo_pattern_add_color_stop_rgba(glass_gradient, 0, r, g, b, a)
     r, g, b, a = hex_to_rgba(settings.minute_sector_edge.hex, settings.minute_sector_edge.alpha)
     cairo_pattern_add_color_stop_rgba(glass_gradient, 1, r, g, b, a)
     cairo_set_source(cr, glass_gradient)
     cairo_move_to(cr, xc, yc)
     cairo_arc(cr, xc, yc, minute_length, start_angle, end_angle)
     cairo_close_path(cr)
     cairo_fill(cr)
     cairo_pattern_destroy(glass_gradient)

    -- Hour Sector
     local hours_24_outer_radius = radius
     local hours_24_inner_radius = radius * 0.8
     local start_angle = - math.pi / 2
     local end_angle = start_angle + hours24_angle
     local glass_gradient = cairo_pattern_create_radial(xc, yc, 0, xc, yc, hours_24_outer_radius)
     r, g, b, a = hex_to_rgba(settings.day_hour_sector.hex, settings.day_hour_sector.alpha)
     cairo_pattern_add_color_stop_rgba(glass_gradient, 0, r, g, b, a)
     r, g, b, a = hex_to_rgba(settings.day_hour_sector_edge.hex, settings.day_hour_sector_edge.alpha)
     cairo_pattern_add_color_stop_rgba(glass_gradient, 1, r, g, b, a)
     cairo_set_source(cr, glass_gradient)
     cairo_move_to(cr, xc, yc)
     cairo_arc(cr, xc, yc, hours_24_outer_radius, start_angle, end_angle)
     cairo_arc_negative(cr, xc, yc, hours_24_inner_radius, end_angle, start_angle)
     cairo_close_path(cr)
     cairo_fill(cr)
     cairo_pattern_destroy(glass_gradient)

      local inner_radius = radius * 0.8
      local outer_radius = radius
      local mark_width = h * 0.03
      local month = os.date("%m")
      local month_mark = month * 2

      -- Hour marks
      for i = 1, 24 do
	      local angle = (i / 24) * 2 * math.pi
              -- Hour mark (every 5 minutes, so 12 hours)
	      if (i % 2 == 1) then
	              mark_width = h * 0.01
	              inner_radius = radius * 0.9
	      else
	              mark_width = h * 0.03
	              inner_radius = radius * 0.8
	      end
              -- Month marks
	      if (i <= month_mark and i % 2 == 0) then
		      r, g, b, a = hex_to_rgba(settings.month_mark.hex, settings.hour_mark.alpha)
	      -- Hour marks
	      elseif (i % 2 == 0) then
		      r, g, b, a = hex_to_rgba(settings.hour_mark.hex, settings.hour_mark.alpha)
	      elseif (i < 6 or i > 18) then
	              r, g, b, a = hex_to_rgba(settings.solar_day.hex, settings.hour_mark.alpha)
	      else
	              r, g, b, a = hex_to_rgba(settings.solar_night.hex, settings.hour_mark.alpha)
	      end
              cairo_set_source_rgba(cr, r, g, b, a)
              cairo_set_line_width(cr, mark_width)
              cairo_move_to(cr, xc + inner_radius * math.sin(angle), yc - inner_radius * math.cos(angle))
              cairo_line_to(cr, xc + outer_radius * math.sin(angle), yc - outer_radius * math.cos(angle))
              cairo_stroke(cr)
      end

      -- date indicators
      local dot_radius = h * 0.03
      local ring_radius = radius * 1.1
      local date = os.date("%d")
      local angle_step = (2 * math.pi) / date
      local start_angle = (math.pi / 2) + angle_step

      for i = 1, date do
	      local angle = (i * angle_step) - start_angle

	      local x = xc + ring_radius * math.cos(angle)
	      local y = yc + ring_radius * math.sin(angle)

	      if i % 7 == 1 then
		      r, g, b, a = hex_to_rgba(settings.day_modulo_1.hex, settings.day_mark.alpha)
	      elseif i % 7 == 2 or i % 7 == 3 or i % 7 == 4 then
		      r, g, b, a = hex_to_rgba(settings.day_modulo_234.hex, settings.day_mark.alpha)
	      else
		      r, g, b, a = hex_to_rgba(settings.day_modulo_560.hex, settings.day_mark.alpha)
	      end
	      cairo_set_source_rgba(cr, r, g, b , a)
	      cairo_arc(cr, x, y, dot_radius, 0, 2 * math.pi)
	      cairo_fill(cr)
      end

    -- Clean up
    cairo_destroy(cr)
    cairo_surface_destroy(cs)
    return ""
end

function conky_main()
    conky_analog_clock()
end
