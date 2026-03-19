from rest_framework import serializers
from auction.models import AuctionItem, Bid
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class AuctionItemSerializer(serializers.ModelSerializer):
    current_highest_bid = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    winner = serializers.ReadOnlyField()                  

    class Meta:
        model = AuctionItem
        fields = [
            'id', 'title', 'description', 'starting_price',
            'end_time', 'seller', 'current_highest_bid',
            'is_expired', 'winner', 'image'               
        ]
        read_only_fields = ['seller']

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['id', 'item', 'bidder', 'amount', 'timestamp']
        read_only_fields = ['bidder', 'timestamp']

    def validate(self, attrs):
        item = attrs.get('item')
        amount = attrs.get('amount')

        request = self.context.get('request')
        user = request.user if request else None

        if user and item.seller == user:
            raise serializers.ValidationError({"item": "You cannot bid on your own auction."})

        if item.is_expired:
            raise serializers.ValidationError({"item": "This auction has already closed."})

        if amount <= item.current_highest_bid:
            raise serializers.ValidationError({
                "amount": f"Bid must be higher than the current highest bid of {item.current_highest_bid}."
            })

        return attrs