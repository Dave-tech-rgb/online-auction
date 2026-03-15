from rest_framework import serializers
from auction.models import AuctionItem, Bid

class AuctionItemSerializer(serializers.ModelSerializer):
    current_highest_bid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = AuctionItem
        fields = ['id', 'title', 'description', 'starting_price', 'end_time', 'seller', 'current_highest_bid', 'is_expired']
        read_only_fields = ['seller']

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['id', 'item', 'bidder', 'amount', 'timestamp']
        read_only_fields = ['bidder', 'timestamp']

    def validate(self, data):
        item = data.get('item')
        amount = data.get('amount')
        
        request = self.context.get('request')
        user = request.user if request else None

        if user and item.seller == user:
            raise serializers.ValidationError({"item": "You cannot bid on your own item."})

        if item.is_expired:
            raise serializers.ValidationError({"item": "This auction has already expired."})

        if amount <= item.current_highest_bid:
            raise serializers.ValidationError({"amount": "Bid amount must be strictly greater than the current highest bid or starting price."})

        return data
