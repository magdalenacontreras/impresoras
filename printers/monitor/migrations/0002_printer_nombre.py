# -*- coding: utf-8 -*-
# Generated by Django 1.11.26 on 2019-11-28 18:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='printer',
            name='nombre',
            field=models.CharField(default='', max_length=254),
        ),
    ]
