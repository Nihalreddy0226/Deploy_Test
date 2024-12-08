from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    # Include the category name for better readability
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = SubCategory
        fields = '__all__'


class AttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)

    class Meta:
        model = AttributeValue
        fields = '__all__'


class AttributeSerializer(serializers.ModelSerializer):
    values = AttributeValueSerializer(many=True, read_only=True)  # Nested serialization for AttributeValues
    subcategory_name = serializers.CharField(source='SubCategory.name', read_only=True)

    class Meta:
        model = Attribute
        fields = '__all__'



class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)  # Nested images for product
    required_attributes = serializers.SerializerMethodField()  # Add a method to include detailed attributes

    class Meta:
        model = Product
        exclude = ['vendor']

    def get_required_attributes(self, obj):
        """
        Fetch detailed information about required attributes and their values.
        """
        attributes = obj.required_attributes.all()
        return [
            {
                "id": attribute.id,
                "name": attribute.name,
                "values": [
                    {"id": value.id, "value": value.value}
                    for value in attribute.values.all()
                ],
            }
            for attribute in attributes
        ]

    def validate(self, data):
        # Ensure 'required_attributes' field is not empty
        if not data.get('required_attributes'):
            raise serializers.ValidationError({
                'required_attributes': 'This field is required and cannot be empty.'
            })
        return data



class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image']

    def create(self, validated_data):
        # Save the original image and convert it to webp format
        image_field = validated_data['image']
        validated_data['image'] = convert_image_to_web_format(image_field)
        return super().create(validated_data)

class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=AttributeValue.objects.all(),
        write_only=True
    )

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'attributes', 'stock', 'discounted_price_v', 'original_price_v']

    def validate(self, data):
        product = data.get('product')
        attributes = data.get('attributes')

        # 1. Check if `attributes` is provided
        if not attributes:
            raise serializers.ValidationError({
                'attributes': 'This field is required and cannot be empty.'
            })

        # 2. Ensure attribute values belong to the required attributes of the product
        required_attributes = product.required_attributes.all()
        required_attribute_ids = {attr.id for attr in required_attributes}

        for attr_value in attributes:
            if attr_value.attribute.id not in required_attribute_ids:
                raise serializers.ValidationError({
                    'attributes': f"Attribute value '{attr_value.value}' does not belong to the required attributes for this product."
                })

        # 3. Ensure attribute values do not overlap
        seen_attributes = set()
        for attr_value in attributes:
            if attr_value.attribute.id in seen_attributes:
                raise serializers.ValidationError({
                    'attributes': f"Duplicate attribute values are not allowed: {attr_value.value}"
                })
            seen_attributes.add(attr_value.attribute.id)

        return data

    def create(self, validated_data):
        # Extract product and attributes
        product = validated_data['product']
        attributes = validated_data.pop('attributes')
        stock = validated_data['stock']

        # Check if a variant with the same product and attributes already exists
        existing_variant = ProductVariant.objects.filter(
            product=product,
            attributes__in=attributes
        ).annotate(attr_count=models.Count('attributes')).filter(attr_count=len(attributes)).first()

        if existing_variant:
            # Update the existing variant's stock and prices
            existing_variant.stock += stock
            existing_variant.discounted_price_v = validated_data.get('discounted_price_v', existing_variant.discounted_price_v)
            existing_variant.original_price_v = validated_data.get('original_price_v', existing_variant.original_price_v)
            existing_variant.save()

            # Update product stock
            product.overall_stock += stock
            product.save()

            return existing_variant

        # Create a new variant if no existing one is found
        product_variant = ProductVariant.objects.create(**validated_data)
        product_variant.attributes.set(attributes)

        # Update product stock
        product.overall_stock += stock
        product.save()

        return product_variant
    
class ProductVarientImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVarientImage
        fields = ['id', 'productVarient', 'image_v']

    def create(self, validated_data):
        # Convert the uploaded image to webp format
        image_field = validated_data.pop('image_v')
        webp_image = convert_image_to_web_format(image_field)
        validated_data['image_v'] = webp_image
        return super().create(validated_data)
