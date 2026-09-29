# Time Dial

This repository contains the Conky configuration to display a "Time Dial" widget on your desktop.

The Time Dial is an abstract way to represent date and time inspired by Analog Clocks and Ubuntu Touch's Stat Circle.

There are 2 variants:
- the 12 hour edition, featured below on the left
- the 24 hour edition, featured below on the right

## Preview

<div id="preview" class="preview">
<img src="12-hours-edition/preview.png" width="40%" alt="12 Hour Edition">
<img src="24-hours-edition/preview.png" width="40%" alt="24 Hour Edition">
</div>

<div id="demo" class="preview">
<canvas id="12-hour-time-dial" width="400" height="400" class="avatar"></canvas>
<canvas id="24-hour-time-dial" width="400" height="400" class="avatar"></canvas>
</div>
<div id="github-btn">
  <a href="https://feishikong.github.io/Time-Dial">
    <img src="https://img.shields.io/badge/View_Demo-008822?style=for-the-badge" alt="View Demo">
  </a>
</div>
      
## Features
- Displays the current year as an abstract binary pattern
  - the petals encode the year using binary
- Highlights the hour marks to represent the current month
- Displays the current date as the number of dots around the dial
- Displays the current minute as a pie chart that progresses as the minutes pass
- the 24 hour edition displays the current hour as the outer ring that progresses as the hours pass.
- the 12 hour edition uses a clock hand to indicate the current hour.
  - clock hand changes color based on AM/PM
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
  ./start_12.sh # for the 12 hour edition
  ./start_24.sh # for the 24 hour edition
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
