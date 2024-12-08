from django.db import models
from users.models import *
# Create your models here.
# Abishek Test  4040404044040

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



class Attribute(models.Model):
    SubCategory = models.ForeignKey(SubCategory, on_delete = models.CASCADE, related_name='attributes')
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=255)
      # Initial stock set to 0

    def __str__(self):
        return f"{self.attribute.name}: {self.value} (Stock: {self.stock_quantity})"

    





import os
from uuid import uuid4
from PIL import Image

def get_product_image_upload_path(instance, filename):
    # Extract the extension from the original filename
    extension = 'webp'  # Always use webp as the output format
    # Create a new filename based on product name and a unique identifier
    new_filename = f"{uuid4().hex[:8]}.{extension}"
    # Constructs the upload path as product_images/<vendor_name>/<product_name>/<new_filename>
    return os.path.join('product_images', instance.product.vendor.username, instance.product.name, new_filename)

# Utility function to convert uploaded images to web format
def convert_image_to_web_format(image_field):
    with Image.open(image_field) as img:
        web_image = img.convert('RGB')  # Ensure RGB for webp format
        converted_image_path = f"{image_field.name.split('.')[0]}.webp"
        web_image.save(converted_image_path, format='WEBP')
        return converted_image_path


class Product(models.Model):
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='products', to_field='user')
    tags = models.TextField(blank=True, null=True, help_text="Comma-separated tags")
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, related_name='products')
    default_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    overall_stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    required_attributes = models.ManyToManyField('Attribute', related_name='products')
    
    

    def __str__(self):
        return self.name
    

   
# Product Model
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=get_product_image_upload_path)





def get_product_varient_image_upload_path(instance, filename):
    # Extract the extension from the original filename
    extension = 'webp'  # Force the webp format
    # Create a unique filename
    new_filename = f"{uuid4().hex[:8]}.{extension}"
    # Construct the upload path: product_images/<vendor_name>/<product_name>/<product_id>/<new_filename>
    vendor_name = instance.productVarient.product.vendor.user.username
    product_name = instance.productVarient.product.name
    product_id = instance.productVarient.product.id
    return os.path.join('product_images', vendor_name, product_name, str(product_id), new_filename)


# Utility function to convert uploaded images to web format
from io import BytesIO
from django.core.files.base import ContentFile
from PIL import Image
import os
from uuid import uuid4

def convert_image_to_web_format(image_field):
    # Open the uploaded image
    try:
        with Image.open(image_field) as img:
            img = img.convert('RGB')  # Ensure compatibility with webp format
            
            # Create a new filename
            new_filename = f"{uuid4().hex[:8]}.webp"
            
            # Save the image into a BytesIO object
            image_io = BytesIO()
            img.save(image_io, format='WEBP')

            # Return a ContentFile object for the webp image
            return ContentFile(image_io.getvalue(), name=new_filename)
    except Exception as e:
        raise ValueError(f"Failed to convert image to webp: {str(e)}")


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    attributes = models.ManyToManyField(AttributeValue)
    stock = models.PositiveIntegerField(default=0)
    discounted_price_v = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    original_price_v = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} - {'/'.join([str(attr) for attr in self.attributes.all()])}"

class ProductVarientImage(models.Model):
    productVarient = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='varient_image')
    image_v = models.ImageField(upload_to=get_product_varient_image_upload_path)


