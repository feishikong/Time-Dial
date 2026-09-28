# Time Dial

This repository contains the Conky configuration to display a "Time Dial" widget on your desktop.

The Time Dial is an abstract way to represent date and time inspired by Analog Clocks and Ubuntu Touch's Stat Circle.

## Preview

<div id="preview">
<img src="12-hours-edition/preview.png" width="400" alt="12 Hour Edition">
<img src="24-hours-edition/preview.png" width="400" alt="24 Hour Edition">
</div>

## Demo
<canvas id="24-hour-time-dial" width="100" height="100" class="avatar"></canvas>
<canvas id="24-hour-time-dial" width="100" height="100" class="avatar"></canvas>
<style>
  .github-btn {
  display: inline-block;
  background: #008822;
  color: #19192b;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
</style>
  <a id="github-btn" href="https://github.com/feishikong/time-dial" class="github-btn">
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:middle; margin-right:8px;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View Demo
        </a>
      
## Features

- Displays the current year as an abstract binary pattern:
- Highlights the hour marks to represent the current month
- Displays the current date as the number of dots around the dial
- Uses a clock hand to indicate the current hour
  - clock hand changes color based on AM/PM
- Displays the current minute as a pie chart that progresses as the minutes pass
- Colors for each element fully customizable:
- Lightweight and efficient, built using Lua and Cairo.

## Getting Started

### Prerequisites

Ensure you have Conky installed on your system. If not, install it using the following instructions based on your distro:

- **Ubuntu/Debian**: `sudo apt install conky-all`
- **Fedora**: `sudo dnf install conky`
- **Arch**: `sudo pacman -S conky-cairo`

Additionally, ensure Lua and Cairo libraries are available on your system.

### Installation

- Clone this repository:
  ```bash
  git clone https://github.com/feishikong/Time-Dial.git
  cd Time-Dial
  ./start.sh
  ```

### Customization

#### Calendar Appearance

The appearance can be customized by editing the `clock.lua` script. Search for the "settings" array.

---

## Contributing

Feel free to fork this repository and make your own modifications.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Work derived from [Analog Clock & Calendar Conky created by Wim66](https://github.com/wim66/Analog-Clock-Calendar).
