from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *
from .utils import generate_otp, send_otp


class VendorRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for vendor registration.
    """


    class Meta:
        model = CustomUser
        fields = [
             'email', 'password', 'username'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Create a new vendor user and associated vendor profile.
        """
        user_data = {
            
            'email': validated_data['email'],
            'is_vendor': True,
            'username':validated_data['username']
        }
        user = CustomUser(**user_data)
        user.set_password(validated_data['password'])
        user.is_active = False  # User is inactive until OTP verification
        otp = generate_otp()
        user.otp = otp  # Generate OTP
        user.save() 

        VendorProfile.objects.create(
            user=user,

        )

        # Send OTP
        send_otp(user.email, otp)
        return user


class OTPVerificationSerializer(serializers.Serializer):
    """
    Serializer for OTP verification.
    """
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class VendorLoginSerializer(TokenObtainPairSerializer):
    """
    Serializer for vendor login, inheriting from TokenObtainPairSerializer.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Custom claims to include `is_vendor` field in the token if necessary
        token['is_vendor'] = user.is_vendor
        return token

    def validate(self, attrs):
        # Check if the email and password are correct
        data = super().validate(attrs)
        
        # Ensure the user is a vendor
        if not self.user.is_vendor:
            raise serializers.ValidationError("Only vendors are allowed to log in.")
        
        # Ensure the vendor is active (i.e., account activated via OTP)
        if not self.user.is_active:
            raise serializers.ValidationError("Account is inactive. Please verify your OTP.")

        return data

class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = [
            
            
            'is_approved',
            'phone_number',
            'store_address',
            'store_name',
            'bank_account_holder_name',
            'bank_account_number',
            'ifsc_code',
            'bank_name',
            'id_proof_image'
        ]
        read_only_fields = ['is_approved']  # Make 'is_approved' field read-only


class VendorProfileViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = [
            
            
            'is_approved',
            'phone_number',
            'store_address',
            'store_name',
            'bank_account_holder_name',
            'bank_account_number',
            'ifsc_code',
            'bank_name',
            'id_proof_image'
        ]
        read_only_fields = ['phone_number',
            'store_address',
            'store_name',
            'bank_account_holder_name',
            'bank_account_number',
            'ifsc_code',
            'bank_name',
            'id_proof_image'
        

        ]  # Make 'is_approved' field read-only


from rest_framework import serializers
from .models import VendorProfile

class AdminVendorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True) 
     # User email is always read-only

    class Meta:
        model = VendorProfile
        fields = [
            'email',
            'is_approved',
            'phone_number',
            'store_address',
            'store_name',
            'bank_account_holder_name',
            'bank_account_number',
            'ifsc_code',
            'bank_name',
            'id_proof_image',
        ]
        extra_kwargs = {
            'phone_number': {'read_only': True},
            'store_address': {'read_only': True},
            'store_name': {'read_only': True},
            'bank_account_holder_name': {'read_only': True},
            'bank_account_number': {'read_only': True},
            'ifsc_code': {'read_only': True},
            'bank_name': {'read_only': True},
            'id_proof_image': {'read_only': True},
        }


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for customer registration.
    """
    
    phone_number = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password','phone_number' ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Create a new customer user and associated customer profile.
        """
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'is_vendor': False,
        }
        user = CustomUser(**user_data)
        user.set_password(validated_data['password'])
        user.is_active = False  # User is inactive until OTP verification
        otp = generate_otp()
        user.otp = otp  # Generate OTP
        user.save()

        CustomerProfile.objects.create(
            user=user,
            phone_number = validated_data['phone_number']
            
        )

        # Send OTP
        send_otp(user.email, otp)
        return user


class CustomerTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token obtain pair serializer for customers.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['is_customer'] = not user.is_vendor
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'is_customer': not self.user.is_vendor})
        return data

