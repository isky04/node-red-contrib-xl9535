module.exports = function (RED) {
    const i2c = require('i2c-bus');

    const INP_PORT0_REG  = 0x0;
    const OUTP_PORT0_REG = 0x2;
    const POL_INV0_REG   = 0x4;
    const CONF_PORT0_REG = 0x6;

    const INP_PORT1_REG  = 0x1;
    const OUTP_PORT1_REG = 0x3;
    const POL_INV1_REG   = 0x5;
    const CONF_PORT1_REG = 0x7;

    function setTrue(node) {
        node.status({ fill: "green", shape: "dot", text: "true" })
    }

    function setFalse(node) {
        node.status({ fill: "green", shape: "dot", text: "false" });
    }

    function setWrongProperties(node) {
        node.status({ fill: "red", shape: "ring", text: "Wrong properties" });
    }

    function setOk(node) {
        node.status({ fill: "yellow", shape: "dot", text: "OK" });
    }

    function setWrongPayload(node) {
        node.status({ fill: "red", shape: "ring", text: "Wrong payload" });
    }
    function checkStatus(state) {
        return state.pin >= 0 && state.pin <= 15 && state.bus >= 0 && state.bus <= 22
    }

    function setStatus(node) {
        if (checkStatus(node)) setOk(node)
        else setWrongProperties(node)
    }

    function setNode(config, node) {
        RED.nodes.createNode(node, config);
        node.pin = parseInt(config.pin)
        node.bus = parseInt(config.bus)
        node.address = parseInt(config.address, 16)
    }

    function GPIORead(config) {

        setNode(config, this)

        setStatus(this)

        this.on('input', function (msg)
         {
            if (checkStatus(this))
             {
                const i2cX = i2c.openSync(this.bus);
                if (this.pin <= 7)
                {
                  //read actual config
                  config = i2cX.readByteSync(this.address, CONF_PORT0_REG);
                  config |= (1 << this.pin);
                  i2cX.writeByteSync(this.address, CONF_PORT0_REG, config);

                  //read actual input
                  let input = i2cX.readByteSync(this.address, INP_PORT0_REG);
                  if ((input & (1 << this.pin)) > 0)
                  {
                      msg.payload = true;
                      setTrue(this)
                  }
                  else
                  {
                    msg.payload = false;
                    setFalse(this)
                  }
                }
                else
                {
                  //read actual config
                  config = i2cX.readByteSync(this.address, CONF_PORT1_REG);
                  config |= (1 << this.pin);
                  i2cX.writeByteSync(this.address, CONF_PORT1_REG, config);

                  //read actual input
                  let input = i2cX.readByteSync(this.address, INP_PORT1_REG);
                  if ((input & (1 << this.pin)) > 0)
                  {
                      msg.payload = true;
                      setTrue(this)
                  }
                  else
                  {
                    msg.payload = false;
                    setFalse(this)
                  }
                }
            }

                  this.send(msg);
                  }
                  else
                  {
                     setWrongProperties(this)
                  }

        });
    }
    RED.nodes.registerType("GPIO Read", GPIORead);

    function GPIOWrite(config)
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
                if (this.pin <= 7)
                {
                // read actual config
                config = i2cX.readByteSync(this.address, CONF_PORT0_REG);
                config &= ~(1 << this.pin);
                i2cX.writeByteSync(this.address, CONF_PORT0_REG, config);

                //read actual output
                let output = i2cX.readByteSync(this.address, OUTP_PORT0_REG);

                if (msg.payload === true || msg.payload === 1)
                 {
                    output |= (1 << this.pin);
                    setTrue(this)
                 }
                 else if (msg.payload === false || msg.payload === 0)
                 {
                    output &= ~(1 << this.pin);
                    setFalse(this)
                 }
               }
               else
              {
                // read actual config
                config = i2cX.readByteSync(this.address, CONF_PORT1_REG);
                config &= ~(1 << this.pin);
                i2cX.writeByteSync(this.address, CONF_PORT1_REG, config);

                //read actual output
                let output = i2cX.readByteSync(this.address, OUTP_PORT1_REG);

                if (msg.payload === true || msg.payload === 1)
                 {
                    output |= (1 << this.pin);
                    setTrue(this)
                 }
                 else if (msg.payload === false || msg.payload === 0)
                 {
                    output &= ~(1 << this.pin);
                    setFalse(this)
                 }
               }


                else
                {
                    setWrongPayload(this)
                }
                //write new output
                i2cX.writeByteSync(this.address, OUTP_PORT0_REG, output);
            } else {
                setWrongProperties(this)
            }
        });
    }
    RED.nodes.registerType("GPIO Write", GPIOWrite);
}
