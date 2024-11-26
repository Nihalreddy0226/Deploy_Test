from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models
import os

class CustomUser(AbstractUser):
    is_vendor = models.BooleanField(default=False)
    username = models.CharField(max_length=150, unique=False)
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    


class CustomerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)


class VendorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    is_approved = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15,  default="**********",  null=True)
    store_address = models.TextField( default="**********",  null=True)
    store_name=models.CharField( default="**********",  null=True)

    bank_account_holder_name = models.CharField(max_length=100, default="**********",  null=True)
    bank_account_number = models.CharField(max_length=20, default="**********",  null=True)
    ifsc_code = models.CharField(max_length=11, default="**********",  null=True)
    bank_name = models.CharField(max_length=50, default="**********",  null=True)
    id_proof_image = models.ImageField(upload_to='id_proofs/',default="**********",  null=True)

    def get_upload_path(instance, filename):
        """
        Generates a path for the image upload based on the vendor's email.
        """
        email_folder = instance.vendor.user.email
        return os.path.join( email_folder,'id_proofs', filename)




