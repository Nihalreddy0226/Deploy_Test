from django.contrib import admin
from .models import (
    Category,
    SubCategory,
    Product,
    ProductImage,
    Attribute,
    AttributeValue,
    ProductVariant,
    ProductVarientImage,
)

# 1. Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'created_at', 'updated_at']
    search_fields = ['name']
    list_filter = ['created_at', 'updated_at']


# 2. SubCategory Admin
@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'category']
    search_fields = ['name', 'category__name']
    list_filter = ['category']


# 3. Product Images Inline
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


# 4. Product Attribute Values Inline
class AttributeValueInline(admin.TabularInline):
    model = AttributeValue
    extra = 1


# 5. Product Attribute Admin
@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'SubCategory']
    search_fields = ['name', 'SubCategory__name']
    list_filter = ['SubCategory']
    inlines = [AttributeValueInline]  # Inline for AttributeValues


# 6. Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'vendor',
        'category',
        'subcategory',
        'default_price',
        'discounted_price',
        'overall_stock',
        'created_at',
    ]
    search_fields = ['name', 'vendor__user__username', 'tags']
    list_filter = ['category', 'subcategory', 'created_at']
    inlines = [ProductImageInline]  # Inline for ProductImages


# 7. Product Variant Images Inline
class ProductVariantImageInline(admin.TabularInline):
    model = ProductVarientImage
    extra = 1


# 8. Product Variant Admin
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'product',
        'stock',
        'discounted_price_v',
        'original_price_v',
    ]
    search_fields = ['product__name']
    list_filter = ['product__category', 'product__subcategory']
    inlines = [ProductVariantImageInline]  # Inline for Variant Images
