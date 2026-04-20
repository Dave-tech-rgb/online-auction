from rest_framework import serializers
from auction.models import AuctionItem, Bid


class AuctionItemSerializer(serializers.ModelSerializer):
    current_highest_bid = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    winner = serializers.ReadOnlyField()
    seller_email = serializers.SerializerMethodField()

    class Meta:
        model = AuctionItem
        fields = [
            'id', 'title', 'description', 'starting_price',
            'end_time', 'seller', 'seller_email', 'current_highest_bid',
            'is_expired', 'winner', 'image'
        ]
        read_only_fields = ['seller']

    def get_seller_email(self, obj):
        return obj.seller.email if obj.seller else None


class BidSerializer(serializers.ModelSerializer):
    bidder_email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Bid
        fields = ['id', 'item', 'bidder', 'bidder_email', 'amount', 'timestamp']
        read_only_fields = ['bidder', 'timestamp']

    def get_bidder_email(self, obj):
        return obj.bidder.email if obj.bidder else None

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