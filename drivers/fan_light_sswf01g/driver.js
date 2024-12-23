const Homey = require('homey');
const IkuuFanSpeedCluster = require('../../lib/IkuuFanSpeedCluster');
// const stringify = require('json-stringify-safe');
//"json-stringify-safe": "^5.0.1",

const SPEEDS = {
  off: 0,
  low: 1,
  medium: 2,
  high: 3,
  on: 4
};

function getSpeedValue(speedKey) {
  const key = speedKey.trim().toLowerCase(); // Clean and standardize the input
  if (key in SPEEDS) {
    return SPEEDS[key];
  } else {
    throw new Error("Invalid speed key"); // Handle unknown keys
  }
}

class Driver extends Homey.Driver {
  async onInit() {
    this.log('FanLightDriver has been initialized');
    this._fanOn = this.homey.flow.getDeviceTriggerCard("fan-on");
    this._fanOff = this.homey.flow.getDeviceTriggerCard("fan-off");

    const switchFanToAction = this.homey.flow.getActionCard('switch-fan-to');
    switchFanToAction.registerRunListener(async (args, state) => {
      await args.device.zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].writeAttributes({ speed: getSpeedValue(args.Speed) });
    });
  }

  triggerFanOn(device, tokens, state) {
    tokens = tokens || {};
    state = state || {};
    this._fanOn.trigger(device, tokens, state).catch(this.error);
  }

  triggerFanOff(device, tokens, state) {
    tokens = tokens || [];
    state = state || [];
    this._fanOff.trigger(device, tokens, state).catch(this.error);
  }
}

module.exports = Driver;