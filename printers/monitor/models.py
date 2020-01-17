# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Printer(models.Model):
    ip=models.GenericIPAddressField()
    nombre = models.CharField(default='', max_length=254)