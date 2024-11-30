from rest_framework import viewsets, status
from .models import *
from rest_framework.views import APIView
from .serializers import *
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Categories.
    Supports listing, creating, updating, and deleting categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SubCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing SubCategories.
    Supports listing, creating, updating, and deleting subcategories.
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]  # Remove AllowAny for production
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        """
        Automatically assign the vendor based on the authenticated user.
        """
        vendor = self.request.user.vendorprofile  # Ensure the user has a VendorProfile
        serializer.save(vendor=vendor)

class ProductAttributeViewSet(viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer
    permission_classes = [AllowAny]      #remove AllowAny for production


class ProductAttributeValueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing ProductAttributeValues.
    Supports listing, creating, retrieving, updating, and deleting attribute values.
    """
    queryset = ProductAttributeValue.objects.all()
    serializer_class = ProductAttributeValueSerializer
    permission_classes = [AllowAny]

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [AllowAny]      #remove AllowAny for production

# =========================================================================================================
# Add bulk image upload functionality for ProductImages NIhal Changed

class ProductImageUploadView(APIView):
    def get(self, request, product_id):
        """
        Retrieve all images associated with a specific product.
        """
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        images = ProductImage.objects.filter(product=product)
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        """
        Handle bulk upload of images for a specific product.
        """
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        files = request.FILES.getlist('images')
        if not files:
            return Response({"error": "No images were uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        created_images = []
        for file in files:
            product_image = ProductImage.objects.create(
                product=product,
                image=file,
                alt_text=request.data.get('alt_text', '')
            )
            created_images.append(product_image)

        serializer = ProductImageSerializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class ProductVariantImageUploadView(APIView):
    def get(self, request, variant_id):
        """
        Retrieve all images associated with a specific product variant.
        """
        try:
            variant = ProductVariant.objects.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found."}, status=status.HTTP_404_NOT_FOUND)

        images = ProductVariantImage.objects.filter(variant=variant)
        serializer = ProductVariantImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, variant_id):
        """
        Handle bulk upload of images for a specific product variant.
        """
        try:
            variant = ProductVariant.objects.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found."}, status=status.HTTP_404_NOT_FOUND)

        files = request.FILES.getlist('images')
        if not files:
            return Response({"error": "No images were uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        created_images = []
        for file in files:
            variant_image = ProductVariantImage.objects.create(
                variant=variant,
                image=file,
                alt_text=request.data.get('alt_text', '')
            )
            created_images.append(variant_image)

        serializer = ProductVariantImageSerializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Till here NIhal Changed
# =========================================================================================================


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.prefetch_related('attribute_values').all()
    serializer_class = ProductVariantSerializer

class ProductVariantImageViewSet(viewsets.ModelViewSet):
    queryset = ProductVariantImage.objects.all()
    serializer_class = ProductVariantImageSerializer



########################################################################################################################################

from django.shortcuts import get_object_or_404


class AttributeListCreateView(APIView):
    """
    Handles listing all attributes for a product and creating a new attribute.
    """
    def get(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        attributes = ProductAttribute.objects.filter(product_id=product_id)
        serializer = AttributeSerializer(attributes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        data = request.data
        data['product'] = product_id
        serializer = AttributeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AttributeDetailView(APIView):
    """
    Handles retrieving, updating, and deleting a specific attribute.
    """
    def get(self, request, *args, **kwargs):
        attribute = get_object_or_404(ProductAttribute, pk=kwargs.get('attribute_id'))
        serializer = AttributeSerializer(attribute)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        attribute = get_object_or_404(ProductAttribute, pk=kwargs.get('attribute_id'))
        serializer = AttributeSerializer(attribute, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        attribute = get_object_or_404(ProductAttribute, pk=kwargs.get('attribute_id'))
        attribute.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AttributeValueListCreateView(APIView):
    """
    Handles listing all values for an attribute and creating a new attribute value.
    """
    def get(self, request, *args, **kwargs):
        attribute_id = kwargs.get('attribute_id')
        values = ProductAttributeValue.objects.filter(attribute_id=attribute_id)
        serializer = AttributeValueSerializer(values, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        attribute_id = kwargs.get('attribute_id')
        data = request.data
        data['attribute'] = attribute_id
        serializer = AttributeValueSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AttributeValueDetailView(APIView):
    """
    Handles retrieving, updating, and deleting a specific attribute value.
    """
    def get(self, request, *args, **kwargs):
        value = get_object_or_404(ProductAttributeValue, pk=kwargs.get('value_id'))
        serializer = AttributeValueSerializer(value)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        value = get_object_or_404(ProductAttributeValue, pk=kwargs.get('value_id'))
        serializer = AttributeValueSerializer(value, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        value = get_object_or_404(ProductAttributeValue, pk=kwargs.get('value_id'))
        value.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductVariantListCreateView(APIView):
    """
    Handles listing and creating product variants.
    """
    def get(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        print(f"Fetching variants for product_id: {product_id}")
        variants = ProductVariant.objects.filter(product_id=product_id).prefetch_related('attributes')  # Correct field
        print(f"Found variants: {variants}")
        serializer = ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        serializer = ProductVariantSerializer(data=request.data)
        if serializer.is_valid():
            variant = serializer.save()
            return Response(ProductVariantSerializer(variant).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProductVariantDetailView(APIView):
    """
    Handles retrieving, updating, and deleting a specific product variant.
    """
    def get(self, request, *args, **kwargs):
        variant = get_object_or_404(ProductVariant, pk=kwargs.get('variant_id'))
        serializer = ProductVariantSerializer(variant)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        variant = get_object_or_404(ProductVariant, pk=kwargs.get('variant_id'))
        serializer = ProductVariantSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        variant = get_object_or_404(ProductVariant, pk=kwargs.get('variant_id'))
        variant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductVariantImageListCreateView(APIView):
    def get(self, request, *args, **kwargs):
        variant_id = kwargs.get('variant_id')
        images = ProductVariantImage.objects.filter(variant_id=variant_id)
        serializer = ProductVariantImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ProductVariantImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProductVariantListView(APIView):
    """
    Handles listing and creating product variants.
    """
    def get(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        print(f"Fetching variants for product_id: {product_id}")
        variants = ProductVariant.objects.filter(product_id=product_id)  # Correct field
        print(f"Found variants: {variants}")
        serializer = ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)


class ProductVariantListView(APIView):
    """
    Handles listing and creating product variants.
    """
    def get(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        print(f"Fetching variants for product_id: {product_id}")
        variants = ProductVariant.objects.filter(product_id=product_id)  # Correct field
        print(f"Found variants: {variants}")
        serializer = ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)


class ProductVariantImageListCreateView(APIView):
    """
    Handles listing and creating images for a product variant.
    """
    def get(self, request, *args, **kwargs):
        variant_id = kwargs.get('variant_id')
        images = ProductVariantImage.objects.filter(variant_id=variant_id)
        serializer = ProductVariantImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        variant_id = kwargs.get('variant_id')
        data = request.data
        data['variant'] = variant_id
        serializer = ProductVariantImageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        image_id = kwargs.get('image_id')  # Extract the image ID from the URL
        image = get_object_or_404(ProductVariantImage, pk=image_id)
        
        # Delete the associated file from storage
        if image.image:
            image.image.delete(save=False)  # Deletes the file but not the DB record
        
        # Delete the database record
        image.delete()
        return Response({"message": "Image deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
from django.db.models import Q

class ProductListByTagsView(APIView):
    """
    Handles listing products based on tags.
    """
    def get(self, request, *args, **kwargs):
        tags = request.query_params.getlist('tags')  # Extract 'tags' as a list from query params
        if not tags:
            return Response({"error": "Please provide at least one tag."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter products based on tags
        # Check if any of the provided tags exist in the product's tags
        query = Q()
        for tag in tags:
            query |= Q(tags__icontains=tag)

        products = Product.objects.filter(query, is_active=True).distinct()  # Only active products
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)