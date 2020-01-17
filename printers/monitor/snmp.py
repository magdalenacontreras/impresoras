# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
#from pysnmp.hlapi import *
from pysnmp import hlapi

from subprocess import check_output
import random


debug_snmp = False


def m_get(oid, community='public', protocol='UDP', client='localhost', port=161, version='1', timeout=1, user=None,
          authkey=None, privkey=None,retries=1):
    errorIndication = None
    errorStatus = None
    errorIndex = None
    varBinds = None
    if debug_snmp:
        return [(0, 4)]

    if protocol == 'UDP':
        if version == '1':
            errorIndication, errorStatus, errorIndex, varBinds = next(getCmd(
                SnmpEngine(),
                CommunityData(community, mpModel=0),
                UdpTransportTarget((client, port), timeout=timeout,retries=retries),
                ContextData(),
                ObjectType(ObjectIdentity(oid))
            ))


        elif version == '2c':

            errorIndication, errorStatus, errorIndex, varBinds = next(
                getCmd(SnmpEngine(),
                       CommunityData(community),
                       UdpTransportTarget((client, port), timeout=timeout,retries=retries),
                       ContextData(),
                       ObjectType(ObjectIdentity(oid)))
            )
        elif version == '3':
            if privkey == None:
                errorIndication, errorStatus, errorIndex, varBinds = next(
                    getCmd(SnmpEngine(),
                           UsmUserData(user, authkey),
                           UdpTransportTarget((client, port), timeout=timeout,retries=retries),
                           ContextData(),
                           ObjectType(ObjectIdentity(oid)))
                )
            else:
                errorIndication, errorStatus, errorIndex, varBinds = next(
                    getCmd(SnmpEngine(),
                           UsmUserData(user, authkey, privkey),
                           UdpTransportTarget((client, port)),
                           ContextData(),
                           ObjectType(ObjectIdentity(oid)))
                )
    elif protocol == 'TCP':

        out = \
            check_output(['snmpget', '-v', version, '-c', community, 'TCP:' + client + ":" + str(port), oid]).split(
                " ")[3]
        return out

    if errorIndication:
        raise Exception(errorIndication)
    else:
        if errorStatus:
            raise Exception(
                '%s at %s' % (errorStatus.prettyPrint(), errorIndex and varBinds[int(errorIndex) - 1] or '?'))
        else:
            return varBinds


def m_set(oid, community='public', protocol='UDP', client='localhost', port=161, version='1', value=0, timeout=1,
          user=None, authkey=None, privkey=None,retries=1):
    errorIndication = None
    errorStatus = None
    errorIndex = None
    varBinds = None
    if debug_snmp:
        return
    if protocol == 'UDP':

        if version == '1':
            errorIndication, errorStatus, errorIndex, varBinds = next(
                setCmd(SnmpEngine(),
                       CommunityData(community, mpModel=0),
                       UdpTransportTarget((client, port), timeout=timeout,retries=retries),
                       ContextData(),
                       ObjectType(ObjectIdentity(oid), value))
            )

        elif version == '2c':
            errorIndication, errorStatus, errorIndex, varBinds = next(
                setCmd(SnmpEngine(),
                       CommunityData(community),
                       UdpTransportTarget((client, port),retries=retries,timeout=timeout),
                       ContextData(),
                       ObjectType(ObjectIdentity(oid), value))
            )
        elif version == '3':
            raise Exception("SNMPv3 SET UDP not implemented Yet")
    elif protocol == 'TCP':
        out = check_output(['snmpset', '-v', version, '-c', community, 'TCP:' + client + ":" + str(port), oid, type,
                            str(value)]).split(" ")[3]
        return out

    if errorIndication:
        raise Exception(errorIndication)
    else:
        if errorStatus:
            raise Exception(
                '%s at %s' % (errorStatus.prettyPrint(), errorIndex and varBinds[int(errorIndex) - 1] or '?'))
        else:
            return varBinds
def mm_get(oid, community='public', protocol='UDP', client='localhost', port=161, version='1', value=0, timeout=1,type="i"):
    logging.info(oid)
    if debug_snmp:
        return [(0, random.randint(0, 100))]
    try:
        if protocol=="TCP":
            out = check_output(['snmpget',  '-t',str(timeout),'-v', version, '-c', community, 'TCP:' + client + ":" + str(port), oid]).split(" ")
            return [[0,out[3].replace('"','')]]
        else:
            out= check_output(['snmpget', '-t',str(timeout),'-v', version, '-c', community,  client + ":" + str(port), oid]).split(" ")
            return [[0,out[3].replace('"','')]]
    except Exception as e:
        logging.exception(e)
        return [[0,-1]]

def mm_walk(oid, community='public', protocol='UDP', client='localhost', port=161, version='1', value=0, timeout=1,type="i"):
    if debug_snmp:
        return [(0, random.randint(0, 100))]
    try:
        if protocol=="TCP":
            out = check_output(['snmpwalk',  '-t',str(timeout),'-v', version, '-c', community, 'TCP:' + client + ":" + str(port), oid]).split("\n")
            return [[0,out[3]]]
        else:
            out= check_output(['snmpwalk', '-t',str(timeout),'-v', version, '-c', community,  client + ":" + str(port), oid]).split("\n")
            print(out)
            result=[]
            for l in out:
                if l:
                    r = l.split(" ")
                    if len(r)>=3:
                        print(r[3].replace('"',''))
                        result.append(r[3].replace('"',''))

            return result
    except Exception as e:
        logging.exception(e)
        return [-1]

