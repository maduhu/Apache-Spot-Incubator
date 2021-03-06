// Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements; and to You under the Apache License, Version 2.0.

const SpotDispatcher = require('../../../js/dispatchers/SpotDispatcher');
const SpotConstants = require('../../../js/constants/SpotConstants');

const ObservableWithHeadersGraphQLStore = require('../../../js/stores/ObservableWithHeadersGraphQLStore');

const SRC_IP_VAR = 'srcIp';
const DST_IP_VAR = 'dstIp';
const TIME_VAR = 'tstart';

class DetailStore extends ObservableWithHeadersGraphQLStore {
    constructor() {
        super();

        this.headers = {
            tstart: 'Time',
            srcip: 'Source IP',
            dstip: 'Destination IP',
            sport: 'Source Port',
            dport: 'Destination Port',
            proto: 'Protocol',
            flags: 'Flags',
            tos: 'Type Of Service',
            ibytes: 'Input Bytes',
            ipkts: 'Input Packets',
            obytes:  'Output Bytes',
            opkts: 'Output Packets',
            rip: 'Router IP',
            input: 'Input iface',
            output: 'Output iface'
        };

        this.ITERATOR = ['tstart', 'srcip', 'dstip', 'sport', 'dport', 'proto', 'flags', 'tos', 'ibytes', 'ipkts', 'obytes', 'opkts', 'rip', 'input', 'output'];
    }

    getQuery() {
        return `
            query($tstart: SpotDatetimeType!, $srcIp: SpotIpType!, $dstIp: SpotIpType!) {
                flow {
                    edgeDetails(tstart: $tstart, srcIp: $srcIp, dstIp: $dstIp) {
                        tstart
                        srcip: srcIp
                        sport: srcPort
                        dstip: dstIp
                        dport: dstPort
                        proto: protocol
                        flags
                        tos
                        ipkts: inPkts
                        ibytes: inBytes
                        opkts: outPkts
                        obytes: outBytes
                        rip: routerIp
                        input: inIface
                        output: outIface
                    }
                }
            }
        `;
    }

    unboxData(data) {
        return data.flow.edgeDetails;
    }

    setSrcIp(ip) {
      this.setVariable(SRC_IP_VAR, ip);
    }

    setDstIp(ip) {
      this.setVariable(DST_IP_VAR, ip);
    }

    setTime(time) {
      this.setVariable(TIME_VAR, time);
    }
}

const ds = new DetailStore();

SpotDispatcher.register(function (action) {
  switch (action.actionType) {
    case SpotConstants.SELECT_THREAT:
      ds.setSrcIp(action.threat.srcIP);
      ds.setDstIp(action.threat.dstIP);
      ds.setTime(action.threat.tstart);
      break;
    case SpotConstants.UPDATE_DATE:
    case SpotConstants.RELOAD_SUSPICIOUS:
      ds.resetData();
      break;
    case SpotConstants.RELOAD_DETAILS:
      ds.sendQuery();
      break;
  }
});

module.exports = ds;
