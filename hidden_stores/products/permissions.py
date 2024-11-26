from rest_framework.permissions import BasePermission

class IsAuthenticatedAndApprovedVendor(BasePermission):
    """
    Custom permission to check if the user is authenticated, is a vendor, 
    and their VendorProfile is approved.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a vendor
        if not (request.user and request.user.is_authenticated and request.user.is_vendor):
            return False

        # Check if the user has an associated VendorProfile and is approved
        try:
            return request.user.vendorprofile.is_approved
        except AttributeError:
            return False  # Return False if VendorProfile does not exist
