from rest_framework import serializers
from .models import User, SecretMessage


class UserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
            email=validated_data["email"]
        )
        return user


class PasswordResetSerializer(serializers.Serializer):
    # email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecretMessage
        fields = "__all__"
