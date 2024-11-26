from django.contrib import admin
from .models import (
    Category,
    SubCategory,
    Product,
    ProductImage,
    ProductAttribute,
    ProductAttributeValue,
    ProductVariant,
    ProductVariantImage
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


# 4. Product Attributes Inline
class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 1


# 5. Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'vendor', 'category', 'subcategory', 'base_price', 'is_active', 'created_at']
    search_fields = ['name', 'vendor__user__username', 'tags']
    list_filter = ['category', 'subcategory', 'is_active', 'created_at']
    inlines = [ProductImageInline, ProductAttributeInline]  # Inline models for ProductImages and Attributes


# 6. Product Attribute Values Inline
class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 1


# 7. Product Attribute Admin
@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'product']
    search_fields = ['name', 'product__name']
    inlines = [ProductAttributeValueInline]


# 8. Product Variant Images Inline
class ProductVariantImageInline(admin.TabularInline):
    model = ProductVariantImage
    extra = 1


# 9. Product Variant Admin
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'sku', 'stock', 'price']
    search_fields = ['sku', 'product__name']
    list_filter = ['product']
    inlines = [ProductVariantImageInline]


# 10. Product Variant Image Admin
@admin.register(ProductVariantImage)
class ProductVariantImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'variant', 'alt_text', 'created_at']
    search_fields = ['variant__sku', 'alt_text']
