# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http.response import JsonResponse
from django.shortcuts import render
from monitor.models import Printer
from monitor.snmp import mm_walk, mm_get
import json

oids = {
    'niveles': 'iso.3.6.1.2.1.43.11.1.1.9',
    'total': 'iso.3.6.1.2.1.43.11.1.1.8',
    'nombre_cartuchos': 'iso.3.6.1.2.1.43.11.1.1.6',
    'colores': 'iso.3.6.1.2.1.43.12.1.1.4.1',
    'bandejas': 'iso.3.6.1.2.1.43.8.2.1.18',
    'capacidad_actual': '1.3.6.1.2.1.43.8.2.1.10',
    'capacidad_maxima': '1.3.6.1.2.1.43.8.2.1.9',
    'modelo': 'iso.3.6.1.2.1.25.3.2.1.3.1',
    'serie': '1.3.6.1.2.1.43.5.1.1.17'

}

def home(request):

    return render(request,'index.html')

def info(request):
    cad = {}
    printers = Printer.objects.all()
    for p in printers:
        printer = p.ip
        try:
            total = mm_walk(oids['total'], client=printer, version='2c')
            #print("/////////////////////total %s" % total)
            niveles = mm_walk(oids['niveles'], client=printer, version='2c')
            #print("/////////////////////niveles %s" % niveles)
            nombre_cartuchos = mm_walk(oids['nombre_cartuchos'], client=printer, version='2c')
            #print("////////////////////nombre cartuchos %s" % nombre_cartuchos)
            colores = mm_walk(oids['colores'], client=printer, version='2c')
            #print("////////////////////colores %s" % colores)
            bandejas = mm_walk(oids['bandejas'], client=printer, version='2c')
            #print("////////////////////bandejas %s" % bandejas)
            capacidad_actual = mm_walk(oids['capacidad_actual'], client=printer, version='2c')
            #print("///////////////////capacidad_actual %s" % capacidad_actual)
            capacidad_maxima = mm_walk(oids['capacidad_maxima'], client=printer, version='2c')
            #print("///////////////////capacidad_maxima %s" % capacidad_maxima)
            modelo = mm_get(oids['modelo'], client=printer, version='2c')[0][1]
            #print("///////////////////modelo %s" % modelo)
            serie = mm_get(oids['serie'], client=printer, version='2c')[0][1]
            #print("//////////////////serie %s" % serie)
            cad[printer] = {'nombre': p.nombre, 'total': total, 'niveles': niveles, 'nombre_cartuchos': nombre_cartuchos, 'colores': colores,
                        'bandejas': bandejas, 'capacidad_actual': capacidad_actual,
                        'capacidad_maxima': capacidad_maxima,
                        'modelo': modelo, 'serie': serie,'ip':printer,'id':p.pk}
        except:
            print("-------------------------------------------------------No funciono ")
        print("--------------------------------------------------------------------")
        print(JsonResponse(cad))
        print("######################################################################")
    return JsonResponse(cad)
