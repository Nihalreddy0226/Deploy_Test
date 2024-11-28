from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

class SubCategorySerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category')

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'description', 'category_id']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProductAttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttributeValue
        fields = ['id', 'attribute', 'value']

class ProductAttributeSerializer(serializers.ModelSerializer):
    values = ProductAttributeValueSerializer(many=True, read_only=True)

    class Meta:
        model = ProductAttribute
        fields = ['id', 'product', 'name', 'values']



class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ['id', 'variant', 'image', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = ProductAttributeValueSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'sku', 'price', 'stock', 'attributes', 'images']

        read_only_fields = ['id', 'images']


class ProductImage2Serializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="Upload multiple images at once"
    )

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'images', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        product = validated_data.get('product')

        # Create multiple ProductImage instances
        product_images = []
        for image in images:
            product_images.append(ProductImage(product=product, image=image, alt_text=validated_data.get('alt_text', '')))
        return ProductImage.objects.bulk_create(product_images)
    

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImage2Serializer(many=True, write_only=True, required=False)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category')
    subcategory_id = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), source='subcategory')
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category_id', 'subcategory_id',
            'name', 'description', 'base_price', 'tags', 'is_active',
            'created_at', 'updated_at', 'images', 'variants'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'variants']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        product = Product.objects.create(**validated_data)

        # Handle image uploads
        for image_data in images_data:
            image_files = image_data.pop('images', [])
            for image_file in image_files:
                ProductImage.objects.create(product=product, image=image_file, **image_data)

        return product

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category')
    subcategory_id = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), source='subcategory')
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category_id', 'subcategory_id',
            'name', 'description', 'base_price', 'tags', 'is_active',
            'created_at', 'updated_at', 'images', 'variants'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'images', ' variants']


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttributeValue
        fields = ['id', 'attribute', 'value']

class ProductAttributeSerializer(serializers.ModelSerializer):
    values = ProductAttributeValueSerializer(many=True, read_only=True)

    class Meta:
        model = ProductAttribute
        fields = ['id', 'product', 'name', 'values']

class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ['id', 'variant', 'image', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = ProductAttributeValueSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'sku', 'price', 'stock', 'attributes', 'images']

        read_only_fields = ['id', 'images']

# =========================================================================================================
#NIhal changed here

"""class ProductImageSerializer(serializers.ModelSerializer):                   
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="Upload multiple images at once"
    )

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'images', 'alt_text', 'created_at']

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        product = validated_data.get('product')

        # Create multiple ProductImage instances
        product_images = []
        for image in images:
            product_images.append(ProductImage(product=product, image=image, alt_text=validated_data.get('alt_text', '')))
        return ProductImage.objects.bulk_create(product_images)
"""

# Till Here!!!!
# =========================================================================================================

from .models import ProductVariantImage
from rest_framework import serializers

class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ['id', 'variant', 'image', 'alt_text', 'created_at']



class ProductVariantSerializer(serializers.ModelSerializer):
    attribute_values = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProductAttributeValue.objects.all()
    )

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'attribute_values', 'price', 'stock', 'is_active', 'created_at', 'updated_at']

#############################################################################################################################################################

from rest_framework import serializers

class AttributeSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product')

    class Meta:
        model = ProductAttribute
        fields = ['id', 'name', 'product_id']
        read_only_fields = ['id']

class AttributeValueSerializer(serializers.ModelSerializer):
    attribute_id = serializers.PrimaryKeyRelatedField(queryset=ProductAttribute.objects.all(), source='attribute')

    class Meta:
        model = ProductAttributeValue
        fields = ['id', 'value', 'attribute_id']
        read_only_fields = ['id']


class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProductAttributeValue.objects.all(),
        help_text="List of attribute values for this variant"
    )
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product')

    class Meta:
        model = ProductVariant
        fields = ['id', 'product_id', 'sku', 'stock', 'price', 'attributes']
        read_only_fields = ['id']

    def validate(self, data):
        product = data['product']
        attributes = data['attributes']

        # Step 1: Ensure all attributes belong to the same product
        for attribute_value in attributes:
            if attribute_value.attribute.product != product:
                raise serializers.ValidationError(
                    f"Attribute value '{attribute_value.value}' does not belong to the specified product."
                )

        # Step 2: Ensure attributes represent unique product attributes
        unique_attributes = set()
        for attribute_value in attributes:
            if attribute_value.attribute.id in unique_attributes:
                raise serializers.ValidationError(
                    f"Duplicate attribute detected: '{attribute_value.attribute.name}'."
                )
            unique_attributes.add(attribute_value.attribute.id)

        return data

    def create(self, validated_data):
        attributes = validated_data.pop('attributes')
        product = validated_data['product']

        # Check if an exact variant with these attributes exists
        existing_variants = ProductVariant.objects.filter(product=product)
        for variant in existing_variants:
            # Check if the attributes match exactly
            variant_attributes = set(variant.attributes.all())
            if variant_attributes == set(attributes):
                # If an exact match is found, update the stock
                variant.stock += validated_data.get('stock', 0)
                variant.save()
                return variant

        # If no exact match is found, create a new variant
        variant = ProductVariant.objects.create(**validated_data)
        variant.attributes.set(attributes)
        return variant


class ProductVariantImageSerializer(serializers.ModelSerializer):
    variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), source='variant')

    class Meta:
        model = ProductVariantImage
        fields = ['id', 'variant_id', 'image', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']



class ProductVariantlistSerializer(serializers.ModelSerializer):
    attributes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProductAttributeValue.objects.all(),
        help_text="List of attribute values for this variant"
    )
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product')

    class Meta:
        model = ProductVariant
        fields = ['id', 'product_id', 'sku', 'stock', 'price', 'attributes']
        read_only_fields = ['id']

