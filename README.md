# node-red-contrib-xl9535

Node-Red node for Raspberry Pi with XL9535 GPIO expander connected via I2C.<br>
(China clone from TCA9535).<br>
16 Channel IO Expander Relay: [Aliexpress](https://de.aliexpress.com/i/1005005883903139.html). <br>
## Node Features
- Each gpio pin (0-15) can be set as input or output
- Input can read actual state
- Output can activate high or low state

## Install

Install with Node-Red Palette Manager or run npm command:
```
cd ~/.node-red
npm install node-red-contrib-xl9535
```
## Usage

run raspi-config to enable I2C<br>
in nodes configuration choose correct pin number, I2C address 0x2x and Bus<br>
for input inject msg.payload = true/1 for high state and false/0 for low state<br>
for output inject any value to trigger reading<br>

![Usage](usage.gif)

## Tested on
- Raspberry Pi 4, with Raspberry VanPi OS on Host.
