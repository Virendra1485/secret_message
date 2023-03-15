from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, SecretMessage


class UserSignUpViewTestCase(APITestCase):
    def setUp(self):
        self.signUp_url = reverse("user-sign-up")

    def test_create_user(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "password123",
        }
        expected_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
        }
        response = self.client.post(self.signUp_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, expected_data)

    def test_signup_with_missing_data(self):
        data = {"username": "testuser", "password": "testpass123"}
        response = self.client.post(self.signUp_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_signup_with_existing_username(self):
        data = {
            "first_name": "testuser",
            "last_name": "testuser",
            "email": "testuser@example.com",
            "password": "testpass123",
        }
        self.client.post(self.signUp_url, data, format="json")
        response = self.client.post(self.signUp_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)


class SigninTestCase(APITestCase):
    def setUp(self):
        self.signin_url = reverse("user-sign-in")
        self.user = User.objects.create_user(
            first_name="testuser",
            last_name="name",
            email="testuser@example.com",
            password="testpass123",
        )

    def test_signin_with_valid_credentials(self):
        data = {"email": "testuser@example.com", "password": "testpass123"}
        response = self.client.post(self.signin_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_signin_with_invalid_credentials(self):
        data = {"email": "testuser@example.com", "password": "wrongpassword"}
        response = self.client.post(self.signin_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_signin_with_missing_credentials(self):
        data = {"email": "", "password": ""}
        response = self.client.post(self.signin_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)


class SignoutTestCase(APITestCase):
    def setUp(self):
        self.sign_out_url = reverse("user-sign-out")
        self.user = User.objects.create_user(
            first_name="testuser",
            last_name="name",
            email="testuser@example.com",
            password="testpass123",
        )
        self.access_token = self.client.post(
            reverse("user-sign-in"),
            {"email": "testuser@example.com", "password": "testpass123"},
            format="json",
        ).data["access"]
        self.refresh_token = self.client.post(
            reverse("user-sign-in"),
            {"email": "testuser@example.com", "password": "testpass123"},
            format="json",
        ).data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_sign_out(self):
        data = {"refresh": self.refresh_token}
        response = self.client.post(self.sign_out_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ResetPasswordTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            first_name="testuser",
            last_name="name",
            email="testuser@example.com",
            password="testpass123",
        )
        self.token = self.client.post(
            reverse("user-sign-in"),
            {"email": "testuser@example.com", "password": "testpass123"},
            format="json",
        ).data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_valid_password_reset(self):
        data = {
            # "email": "testuser@example.com",
            "password": "testpass123",
            "new_password": "newtestpass123",
        }

        response = self.client.post(reverse("password-reset"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User password set successfully")
        self.assertFalse(
            User.objects.get(email=self.user.email).check_password(data["password"])
        )
        self.assertTrue(
            User.objects.get(email=self.user.email).check_password(data["new_password"])
        )

    def test_invalid_password_reset(self):
        data = {
            "email": "invaliduser@example.com",
            "password": "testpass2123",
            "new_password": "newtestpass123",
        }

        response = self.client.post(reverse("password-reset"), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["message"], "Invalid Password")


class MessageRetrieveAPIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            first_name="first_name",
            last_name="last",
            email="testuser@example.com",
            password="testpass123",
        )
        self.secret_message = SecretMessage.objects.create(
            user=self.user,
            name=self.user.first_name + " " + self.user.last_name,
            message="I scream, you scream, we all scream ice cream!",
        )
        self.token = self.client.post(
            reverse("user-sign-in"),
            {"email": "testuser@example.com", "password": "testpass123"},
            format="json",
        ).data["access"]
        self.url = reverse("message-retrieve")

    def test_get_secret_message(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], self.secret_message.message)

    def test_unauthorized_user(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
