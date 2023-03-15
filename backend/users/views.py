from django.contrib.auth import logout
from rest_framework.generics import CreateAPIView, RetrieveAPIView, get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import status
from rest_framework import generics
from .serializers import (
    UserSignUpSerializer,
    PasswordResetSerializer,
    MessageSerializer,
)
from .models import User, SecretMessage


# Create your views here.


class UserSignUpView(CreateAPIView):
    serializer_class = UserSignUpSerializer
    permission_classes = (AllowAny,)


class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=request.user.email)
            except User.DoesNotExist:
                return Response(
                    {"message": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
            if user.check_password(serializer.validated_data["password"]):
                user.set_password(serializer.validated_data["new_password"])
                logout(request)
                user.save()
                return Response(
                    {"message": "User password set successfully"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"message": "Invalid Password"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MessageRetrieveAPIView(RetrieveAPIView):
    queryset = SecretMessage.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, user=self.request.user)
