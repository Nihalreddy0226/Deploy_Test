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

product_variant_list = ProductVariantViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
product_variant_detail = ProductVariantViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

product_variant_image_list = ProductVariantImageViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
product_variant_image_detail = ProductVariantImageViewSet.as_view({
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
    path('product-variants/', product_variant_list, name='product-variant-list'),
    path('product-variants/<int:pk>/', product_variant_detail, name='product-variant-detail'),

    # Product Variant Image URLs
    path('product-variant-images/', product_variant_image_list, name='product-variant-image-list'),
    path('product-variant-images/<int:pk>/', product_variant_image_detail, name='product-variant-image-detail'),



    # Attribute URLs
    path('products/<int:product_id>/attributes2/', AttributeListCreateView.as_view(), name='attribute-list-create'),
    path('attributes/<int:attribute_id>/', AttributeDetailView.as_view(), name='attribute-detail'),

    # Attribute Value URLs
    path('attributes/<int:attribute_id>/values/', AttributeValueListCreateView.as_view(), name='attribute-value-list-create'),
    path('values/<int:value_id>/', AttributeValueDetailView.as_view(), name='attribute-value-detail'),

    # Product Variant URLs
    path('products/<int:product_id>/variants/', ProductVariantListCreateView.as_view(), name='variant-list-create'),
    path('variants/<int:variant_id>/', ProductVariantDetailView.as_view(), name='variant-detail'),

    # Product Variant Image URLs
    path('variants/<int:variant_id>/images/', ProductVariantImageListCreateView.as_view(), name='variant-image-list-create'),

    # product variant list
    path('variants/list/<int:product_id>/', ProductVariantListView.as_view(), name = 'variant-list')
]
