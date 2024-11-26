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