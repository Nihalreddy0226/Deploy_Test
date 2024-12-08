from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'attributes', AttributeViewSet)
router.register(r'attribute-values', AttributeValueViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-variants', ProductVariantViewSet)



urlpatterns = [
    
    path('', include(router.urls)),




    # subcategories based on categories
    path('subcategoriesByCategory/<int:category_id>/', SubCategoryViewSetByCategory.as_view({'get': 'list'}), name='subcategory-by-category'),

    #attributes based on subcategories
    path('subcategories/<int:subcategory_id>/attributes/', AttributeListView.as_view(), name='attribute-list'),

    # values based on attributes
    path('attributevalueByattribute/<int:attribute_id>/', AttributeValueViewSetByAttribute.as_view({'get': 'list'}), name='attributeValue-by-attribute'),
    
    # producr images
    path('products/<int:product_id>/images/', ProductImageView.as_view(), name='product-images-list-create'),

    path('product-images/<int:image_id>/', ProductImageView.as_view(), name='product-image-detail'),
    # product variants images
    path('variants/<int:variant_id>/images/', ProductVarientImageView.as_view(), name='variant-images-list-create'),
    path('variant-images/<int:image_id>/', ProductVarientImageView.as_view(), name='variant-image-detail'),


]
#search based
#public urls
#search product