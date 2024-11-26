# Generated by Django 5.1.3 on 2024-11-25 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='primary_image',
            field=models.ImageField(blank=True, help_text='Main image for the product', null=True, upload_to='product_primary_images/'),
        ),
    ]
