from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import generics, status

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on Categories
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]



class SubCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on SubCategories
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# To pull subcategories based on categories

class SubCategoryViewSetByCategory(viewsets.ModelViewSet):
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Override the default queryset to filter subcategories by category.
        """
        category_id = self.kwargs.get('category_id')  # Get category_id from URL
        return SubCategory.objects.filter(category__id=category_id)


class AttributeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on Attributes
    """
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AttributeValueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on AttributeValues
    """
    queryset = AttributeValue.objects.all()
    serializer_class = AttributeValueSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]



class AttributeValueViewSetByAttribute(viewsets.ModelViewSet):
    """
    ViewSet to retrieve AttributeValue based on Attribute ID.
    """
    serializer_class = AttributeValueSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Override the default queryset to filter AttributeValue by attribute ID.
        """
        attribute_id = self.kwargs.get('attribute_id')  # Get attribute_id from the URL
        return AttributeValue.objects.filter(attribute__id=attribute_id)
    
# attributes based on sub categories

class AttributeListView(APIView):
    def get(self, request, subcategory_id):
        try:
            subcategory = SubCategory.objects.get(id=subcategory_id)
            attributes = subcategory.attributes.all()  # Using related_name defined in the model
            serializer = AttributeSerializer(attributes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SubCategory.DoesNotExist:
            return Response({"error": "SubCategory not found"}, status=status.HTTP_404_NOT_FOUND)

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet to perform CRUD operations on Products
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


    def perform_create(self, serializer):
        """
        Automatically set the vendor from the logged-in user
        """
        serializer.save(vendor=self.request.user.vendorprofile)


class ProductImageView(APIView):
    def get(self, request, product_id=None, image_id=None):
        """
        Retrieve all images for a product or a specific image.
        """
        if image_id:
            try:
                image = ProductImage.objects.get(id=image_id)
            except ProductImage.DoesNotExist:
                raise NotFound({"error": "Image not found"})
            serializer = ProductImageSerializer(image)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif product_id:
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise NotFound({"error": "Product not found"})
            images = product.images.all()
            serializer = ProductImageSerializer(images, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Provide either product_id or image_id"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, product_id):
        """
        Upload multiple images for a specific product.
        """
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        images = request.FILES.getlist('images')
        if not images:
            return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_images = []
        for image in images:
            data = {'product': product.id, 'image': convert_image_to_web_format(image)}
            serializer = ProductImageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                uploaded_images.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"uploaded_images": uploaded_images}, status=status.HTTP_201_CREATED)

    def put(self, request, image_id):
        """
        Update an existing product image.
        """
        try:
            image = ProductImage.objects.get(id=image_id)
        except ProductImage.DoesNotExist:
            raise NotFound({"error": "Image not found"})

        new_image = request.FILES.get('image')
        if new_image:
            validated_data = {'image': convert_image_to_web_format(new_image)}
            serializer = ProductImageSerializer(image, data=validated_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, image_id):
        """
        Delete a specific product image.
        """
        try:
            image = ProductImage.objects.get(id=image_id)
            image.delete()
            return Response({"message": "Image deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            raise NotFound({"error": "Image not found"})


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage product variants.
    """
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductVarientImageView(APIView):
    def get(self, request, variant_id=None, image_id=None):
        """
        Retrieve all images for a product variant or a specific image.
        """
        if image_id:
            try:
                image = ProductVarientImage.objects.get(id=image_id)
            except ProductVarientImage.DoesNotExist:
                raise NotFound({"error": "Image not found"})
            serializer = ProductVarientImageSerializer(image)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif variant_id:
            try:
                variant = ProductVariant.objects.get(id=variant_id)
            except ProductVariant.DoesNotExist:
                raise NotFound({"error": "Variant not found"})
            images = variant.varient_image.all()
            serializer = ProductVarientImageSerializer(images, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Provide either variant_id or image_id"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, variant_id):
        """
        Upload multiple images for a product variant.
        """
        try:
            variant = ProductVariant.objects.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        images = request.FILES.getlist('images')
        if not images:
            return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_images = []
        for image in images:
            data = {'productVarient': variant.id, 'image_v': convert_image_to_web_format(image)}
            serializer = ProductVarientImageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                uploaded_images.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"uploaded_images": uploaded_images}, status=status.HTTP_201_CREATED)

    def put(self, request, image_id):
        """
        Update a specific product variant image.
        """
        try:
            image = ProductVarientImage.objects.get(id=image_id)
        except ProductVarientImage.DoesNotExist:
            raise NotFound({"error": "Image not found"})

        new_image = request.FILES.get('image_v')
        if new_image:
            validated_data = {'image_v': convert_image_to_web_format(new_image)}
            serializer = ProductVarientImageSerializer(image, data=validated_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, image_id):
        """
        Delete a specific product variant image.
        """
        try:
            image = ProductVarientImage.objects.get(id=image_id)
            image.delete()
            return Response({"message": "Image deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProductVarientImage.DoesNotExist:
            raise NotFound({"error": "Image not found"})