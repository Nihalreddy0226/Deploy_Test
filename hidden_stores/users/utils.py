from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib import colors
from io import BytesIO
from django.core.mail import EmailMessage
import random
from django.core.mail import send_mail
import logging

logger = logging.getLogger(__name__)

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp(email, otp):
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}'
    from_email = 'mybookings@bookmyaffair.com'
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)