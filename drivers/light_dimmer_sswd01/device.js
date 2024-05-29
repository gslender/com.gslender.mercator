'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { Cluster, debug } = require('zigbee-clusters');
const TuyaSpecificCluster = require('../../lib/TuyaSpecificCluster');
const TuyaSpecificClusterDevice = require("../../lib/TuyaSpecificClusterDevice");

Cluster.addCluster(TuyaSpecificCluster);

class LightDimmerDevice extends TuyaSpecificClusterDevice {

  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });

    this.log('LightDimmerDevice has been initialized');

    // this.printNode();
    // debug(true);

    await zclNode.endpoints[1].clusters.basic.readAttributes(['manufacturerName', 'zclVersion', 'appVersion', 'modelId', 'powerSource', 'attributeReportingStatus'])
    .catch(err => {
        this.error('Error when reading device attributes ', err);
    });

    this.registerCapabilityListener('onoff', async value => {
      this.log('onoff: ', value);
      await this.writeBool(1, value);
    });

    this.registerCapabilityListener('dim', async value => {
        this.log("brightness: ", value * 1000);
        await this.writeData32(2, value * 1000);
    });
  }

  onDeleted() {
    this.log('LightDimmerDevice removed');
  }
}

module.exports = LightDimmerDevice;
