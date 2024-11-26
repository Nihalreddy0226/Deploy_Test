from django.urls import path
from .views import *

# Instantiate the views
category_list = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
category_detail = CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

subcategory_list = SubCategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
subcategory_detail = SubCategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

product_list = ProductViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
product_detail = ProductViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

attribute_list = ProductAttributeViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

variant_list = ProductVariantViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

attribute_value_list = ProductAttributeValueViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
attribute_value_detail = ProductAttributeValueViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


urlpatterns = [
    
    path('categories/', category_list, name='category-list'),
    path('categories/<int:pk>/', category_detail, name='category-detail'),
    path('products/', product_list, name='product-list'),
    path('products/<int:pk>/', product_detail, name='product-detail'),
    path('products/<int:product_id>/attributes/', attribute_list, name='product-attribute-list'),
    path('products/<int:product_id>/variants/', variant_list, name='product-variant-list'),
    #path('products/<int:product_id>/images/', image_list, name='product-image-list'),
    path('products/<int:product_id>/images/', ProductImageUploadView.as_view(), name='product-image-upload'),
    path('variants/<int:variant_id>/images/', ProductVariantImageUploadView.as_view(), name='variant-image-upload'),
    path('attribute-values/', attribute_value_list, name='attribute-value-list'),
    path('attribute-values/<int:pk>/', attribute_value_detail, name='attribute-value-detail'),
    path('subcategories/', subcategory_list, name='subcategory-list'),
    path('subcategories/<int:pk>/', subcategory_detail, name='subcategory-detail'),
]
