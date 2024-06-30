# node-red-xl9535

Node-Red node für i2c IO Relais Erweiterung mit XL9535(China clone des TCA95535) Chip.<br>
Die Relais Karte habe ich mir bei [Aliexpress](https://de.aliexpress.com/i/1005005883903139.html) besorgt
und betreibe sie mit meinem VanPiCore von [PeKaWay](https://pekaway.de/collections/alle-produkte/products/van-pi-core-pcb).<br>

## Node Features
- Jeder IO Pin (0-15) kann als Ein- oder Ausgang verwendet werden
- Der Eingangsstatus der Eingangspins kann ausgelesen werden
- Die Ausgangspins können auf 0 oder 1 gesetzt werden.
- Busadresse 'xx' kann gesetzt werden (/dev/i2c-xx).
- Die Deviceadresse kann gesetzt werden 0x20 - 0x27 (je nach Adresspin A0 - A2).

## Install

Install with Node-Red Palette Manager or run npm command:
```
cd ~/.node-red
npm install @isky04/node-red-xl9535
```
## Usage

run raspi-config to enable I2C<br>
in nodes configuration choose correct pin number, I2C address 0x2x and Bus address(/dev/i2c-xx) <br>
for input inject msg.payload = true/1 for high state and false/0 for low state<br>
for output inject any value to trigger reading<br>

## Getestet mit
- Raspberry Pi4 mit VanPi OS 2.0.0.
- node-red 4.0.1

