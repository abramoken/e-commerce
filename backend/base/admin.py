from django.contrib import admin
from .models import *
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ('_id', 'name', 'category')
    list_display_links = ('_id', 'name')
    list_filter = ('name', 'category')
    list_per_page = 25

class OrderAdmin(admin.ModelAdmin):
    list_display = ('_id', 'user', 'paymentMethod', 'isPaid', 'totalPrice', 'isDelivered', 'paidAt')
    list_display_links = ('_id', 'user')
    list_filter = ('user', 'isPaid', 'isDelivered', 'paidAt')
    list_per_page = 25

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('_id', 'product', 'user', 'name', 'rating')
    list_display_links = ('_id', 'user', 'name')
    list_filter = ('user', 'product', 'name')
    list_per_page = 25

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('_id', 'product', 'order', 'name', 'qty')
    list_display_links = ('_id', 'order', 'name')
    list_filter = ('product', 'name', 'qty')
    list_per_page = 25

class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('_id', 'order', 'address', 'country', 'city', 'shippingPrice')
    list_display_links = ('_id', 'order', 'country')
    list_filter = ('order', 'address', 'country', 'city')
    list_per_page = 25


admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)
