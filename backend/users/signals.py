from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, SecretMessage


@receiver(post_save, sender=User)
def create_secret_message(sender, instance, created, **kwargs):
    if created:
        instance.message = SecretMessage.objects.create(
            name=instance.first_name + " " + instance.last_name,
            message="I scream, you scream, we all scream ice cream!"
        )
        instance.save()
