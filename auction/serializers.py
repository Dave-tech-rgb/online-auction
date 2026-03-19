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
    # These read-only fields expose the @property methods to the frontend
    current_highest_bid = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = AuctionItem
        fields = [
            'id', 'title', 'description', 'starting_price', 
            'end_time', 'seller', 'current_highest_bid', 'is_expired', 'image'
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
        
        # Access the user making the request
        request = self.context.get('request')
        user = request.user if request else None

        # 1. Logic: Security - Users cannot bid on their own auction
        if user and item.seller == user:
            raise serializers.ValidationError({"item": "You cannot bid on your own auction."})

        # 2. Logic: Auction closes at specific time
        if item.is_expired:
            raise serializers.ValidationError({"item": "This auction has already closed."})

        # 3. Logic: Each new bid must be higher than the previous bid
        if amount <= item.current_highest_bid:
            raise serializers.ValidationError({
                "amount": f"Bid must be higher than the current highest bid of {item.current_highest_bid}."
            })

        return attrs