from rest_framework import generics, permissions, status, viewsets
from rest_framework.generics import *
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.core.exceptions import PermissionDenied
from .utils import generate_otp, send_otp
from rest_framework.decorators import action

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated


from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from .serializers import AdminLoginSerializer
from django.http import JsonResponse


@method_decorator(csrf_exempt, name='dispatch')
class RegisterVendorView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = VendorRegistrationSerializer
    permission_classes = []

class VerifyOTPView(generics.GenericAPIView):
    serializer_class = OTPVerificationSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        user = CustomUser.objects.filter(email=email, otp=otp).first()
        if user:
            user.otp = ''
            user.is_active = True  # Activate the user
            user.save()
            return Response({"detail": "OTP verified successfully."}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)


class VendorLoginView(TokenObtainPairView):
    """
    Endpoint for vendor login.
    """
    serializer_class = VendorLoginSerializer
    permission_classes = [AllowAny]


  # Ensures CSRF cookie is set
@method_decorator(csrf_protect, name='dispatch')       # Protects the view from CSRF attacks
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)

            if user is not None and user.is_staff:  # Check if user is an admin
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id,
                    'is_admin': user.is_staff,
                })
            return Response({'error': 'Invalid credentials or unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def set_csrf_token(request):
    response = JsonResponse({'detail': 'CSRF cookie set.'})
    response.set_cookie('csrftoken', request.META.get('CSRF_COOKIE', ''))
    return response

class UnapprovedVendorsView(generics.ListAPIView):
    """
    View to list all unapproved vendors.
    """
    serializer_class = VendorProfileViewSerializer
    permission_classes = [IsAuthenticated]  # Restrict access to admins only

    def get_queryset(self):
        
        return VendorProfile.objects


class VendorProfileView(RetrieveUpdateAPIView):
    """
    A view that allows the vendor to retrieve and update their profile.
    """
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get_object(self):
        """
        Override get_object to ensure the vendor can only access their own profile.
        """
        return VendorProfile.objects.get(user=self.request.user)

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to return the vendor's profile.
        """
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Handle PATCH requests to update the vendor's profile while ensuring `is_approved` is not editable.
        """
        validated_data = request.data.copy()
        validated_data.pop('is_approved', None)  # Remove `is_approved` from data
        serializer = self.get_serializer(self.get_object(), data=validated_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .models import VendorProfile
from .serializers import AdminVendorProfileSerializer

class AdminVendorManagementView(APIView):
    """
    View for admins to manage vendor profiles.
    """
    permission_classes = [IsAdminUser]  # Only admins can access this view

    def get(self, request, *args, **kwargs):
        """
        List all vendor profiles.
        """
        vendors = VendorProfile.objects.all()
        serializer = AdminVendorProfileSerializer(vendors, many=True)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        """
        Update a vendor profile (specifically the 'is_approved' field).
        """
        try:
            vendor_email = kwargs.get('email')  # Retrieve the email from URL kwargs
            vendor = VendorProfile.objects.get(user__email=vendor_email)
            if vendor.is_approved == "True":
                vendor.is_approved = "False"
            else:
                vendor.is_approved = "True"
             # Query using user__email
            serializer = AdminVendorProfileSerializer(vendor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except VendorProfile.DoesNotExist:
            return Response({"detail": "Vendor not found."}, status=status.HTTP_404_NOT_FOUND)

