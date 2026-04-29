from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    profile_picture = serializers.ImageField(required=False)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password', 'profile_picture')


class UserSerializer(BaseUserSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = (
            'id', 'email', 'name', 'first_name', 'last_name',
            'address', 'age', 'birthday', 'phone', 'bio',
            'profile_picture', 'profile_picture_url', 'date_joined'
        )
        read_only_fields = ('email', 'date_joined')

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None
