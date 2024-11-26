from django.db import models
from users.models import *
# Create your models here.
# Abishek Test

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('category', 'name')

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class Product(models.Model):
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='products', to_field='user')

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.TextField(blank=True, null=True, help_text="Comma-separated tags")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_tags(self):
        if self.tags:
            return [tag.strip() for tag in self.tags.split(",")]
        return []

    def __str__(self):
        return self.name

import os
from PIL import Image

def product_image_upload_path(instance, filename):
    vendor_name = instance.product.vendor.user.username
    product_name = instance.product.name.replace(" ", "_")
    return os.path.join(vendor_name, product_name, "image.webp")

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_image_upload_path)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.convert_image_to_webp()

    def convert_image_to_webp(self):
        image_path = self.image.path
        webp_path = os.path.splitext(image_path)[0] + ".webp"
        with Image.open(image_path) as img:
            img = img.convert("RGB")
            img.save(webp_path, "webp", quality=85)
        self.image.name = os.path.splitext(self.image.name)[0] + ".webp"
        super().save(update_fields=["image"])


class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='attributes')
    name = models.CharField(max_length=100)


class ProductAttributeValue(models.Model):
    attribute = models.ForeignKey(ProductAttribute, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=100)


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    attributes = models.ManyToManyField(ProductAttributeValue, related_name='variants')


def product_variant_image_upload_path(instance, filename):
    vendor_name = instance.variant.product.vendor.user.username
    product_name = instance.variant.product.name.replace(" ", "_")
    variant_name = "-".join([value.value for value in instance.variant.attributes.all()]).replace(" ", "_")
    return os.path.join(vendor_name, product_name, variant_name, "image.webp")

class ProductVariantImage(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_variant_image_upload_path)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.convert_image_to_webp()

    def convert_image_to_webp(self):
        image_path = self.image.path
        webp_path = os.path.splitext(image_path)[0] + ".webp"
        with Image.open(image_path) as img:
            img = img.convert("RGB")
            img.save(webp_path, "webp", quality=85)
        self.image.name = os.path.splitext(self.image.name)[0] + ".webp"
        super().save(update_fields=["image"])


