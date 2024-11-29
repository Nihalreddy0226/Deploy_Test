from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    # User Registration Paths
    path('register/vendor/', RegisterVendorView.as_view(), name='register-vendor'), #1
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'), #2
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),#2.1
    path('vendor/login', VendorLoginView.as_view(), name='vendor-login'), #3
    path('vendors-list/', UnapprovedVendorsView.as_view(), name='vendor-list'), 
    path('admin/vendors/', AdminVendorManagementView.as_view(), name='admin-vendor-list'),
    path('admin/vendors/<str:email>/', AdminVendorManagementView.as_view(), name='admin-vendor-update'),
    path('set-csrf-token/', set_csrf_token, name='set_csrf_token'),
    path('csrf/', csrf),
    path('vendor/profile/', VendorProfileView.as_view(), name='vendor-profile-update'), #4
]
