# Generated by Django 3.2.6 on 2022-01-27 12:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_product_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='paymentMethode',
            new_name='paymentMethod',
        ),
    ]
