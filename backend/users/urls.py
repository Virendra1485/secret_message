from django.urls import path
from .views import UserSignUpView, PasswordResetView, MessageRetrieveAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView

urlpatterns = [
    path("sign-in/", TokenObtainPairView.as_view(), name="user-sign-in"),
    path("sign-up/", UserSignUpView.as_view(), name="user-sign-up"),
    path("sign-out/", TokenBlacklistView.as_view(), name="user-sign-out"),
    path("reset-my-password/", PasswordResetView.as_view(), name="password-reset"),
    path("secret-message/", MessageRetrieveAPIView.as_view(), name="message-retrieve"),
]
