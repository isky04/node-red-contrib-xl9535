module.exports = function (RED) 
{
  const i2c = require('i2c-bus');

  const INP_PORT0_REG  = 0x0;
  const OUTP_PORT0_REG = 0x2;
  const POL_INV0_REG   = 0x4;
  const CONF_PORT0_REG = 0x6;

  const INP_PORT1_REG  = 0x1;
  const OUTP_PORT1_REG = 0x3;
  const POL_INV1_REG   = 0x5;
  const CONF_PORT1_REG = 0x7;

  function setTrue(node)
  {
    node.status({ fill: "green", shape: "dot", text: "true" })
  }

  function setFalse(node)
  {
    node.status({ fill: "green", shape: "dot", text: "false" });
  }

  function setWrongProperties(node)
  {
    node.status({ fill: "red", shape: "ring", text: "Wrong properties" });
  }

  function setOk(node)
  {
    node.status({ fill: "yellow", shape: "dot", text: "OK" });
  }

  function setWrongPayload(node)
  {
    node.status({ fill: "red", shape: "ring", text: "Wrong payload" });
  }
  function checkStatus(state)
  {
    return state.pin >= 1 && state.pin <= 16 && state.bus >= 0 && state.bus <= 29
  }

  function setStatus(node)
  {
    if (checkStatus(node)) setOk(node)
    else setWrongProperties(node)
  }

  function setNode(config, node)
  {
    RED.nodes.createNode(node, config);
    node.pin = parseInt(config.pin)
    node.bus = parseInt(config.bus)
    node.address = parseInt(config.address, 16)
  }

  function iOExtRead(config) 
  {
    setNode(config, this)
    setStatus(this)

    this.on('input', function (msg)
            {
              if (checkStatus(this))
              {
                const i2cX = i2c.openSync(this.bus);
                if (this.pin <= 8)
                {
                  //read actual config
                  config = i2cX.readByteSync(this.address, CONF_PORT0_REG);
                  config |= (1 << this.pin - 1);
                  i2cX.writeByteSync(this.address, CONF_PORT0_REG, config);

                  //read actual input
                  let input = i2cX.readByteSync(this.address, INP_PORT0_REG);
                  if ((input & (1 << this.pin -1)) > 0)
                  {
                    msg.payload = true;
                    setTrue(this)
                  }
                  else
                  {
                    msg.payload = false;
                    setFalse(this)
                  }
                  this.send(msg);
                }
                else if (this.pin <= 16 && this.pin > 8)
                {
                  //read actual config
                  config = i2cX.readByteSync(this.address, CONF_PORT1_REG);
                  config |= (1 << this.pin - 9);
                  i2cX.writeByteSync(this.address, CONF_PORT1_REG, config);

                  //read actual input
                  let input = i2cX.readByteSync(this.address, INP_PORT1_REG);
                  if ((input & (1 << this.pin - 9)) > 0)
                  {
                    msg.payload = true;
                    setTrue(this)
                  }
                  else
                  {
                    msg.payload = false;
                    setFalse(this)
                  }
                  this.send(msg);
                }
              }
              else
              {
                setWrongProperties(this)
              }
            });
  }
  RED.nodes.registerType("i2c IO Read", iOExtRead);

  function iOExtWrite(config)
  {
    setNode(config, this)
    setStatus(this)

    this.on('input', function (msg)
            {
              if (checkStatus(this))
              {
                if (msg.payload === "true") msg.payload = true;
                if (msg.payload === "false") msg.payload = false;

                const i2cX = i2c.openSync(this.bus);
                if (this.pin <= 8)
                {
                  // read actual config
                  config = i2cX.readByteSync(this.address, CONF_PORT0_REG);
                  config &= ~(1 << this.pin - 1);
                  i2cX.writeByteSync(this.address, CONF_PORT0_REG, config);

                  //read actual output
                  let output = i2cX.readByteSync(this.address, OUTP_PORT0_REG);

                  if (msg.payload === true || msg.payload === 1)
                  {
                    output |= (1 << this.pin - 1);
                    setTrue(this)
                  }
                  else if (msg.payload === false || msg.payload === 0)
                  {
                    output &= ~(1 << this.pin - 1);
                    setFalse(this)
                  }
                  //write new output
                  i2cX.writeByteSync(this.address, OUTP_PORT0_REG, output);
                }
                else if (this.pin <= 16 && this.pin > 8)
                {
                  // read actual config
                  config = i2cX.readByteSync(this.address, CONF_PORT1_REG);
                  config &= ~(1 << this.pin -9);
                  i2cX.writeByteSync(this.address, CONF_PORT1_REG, config);

                  //read actual output
                  let output = i2cX.readByteSync(this.address, OUTP_PORT1_REG);

                  if (msg.payload === true || msg.payload === 1)
                  {
                    output |= (1 << this.pin - 9);
                    setTrue(this)
                  }
                  else if (msg.payload === false || msg.payload === 0)
                  {
                    output &= ~(1 << this.pin - 9);
                    setFalse(this)
                  }
                  //write new output
                  i2cX.writeByteSync(this.address, OUTP_PORT1_REG, output);
                }
                else
                {
                  setWrongPayload(this)
                }
              }
              else 
              {
                setWrongProperties(this)
              }
            });
  }
  RED.nodes.registerType("i2c IO Write", iOExtWrite);
}
