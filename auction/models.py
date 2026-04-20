from django.db import models
from django.conf import settings
from django.utils import timezone
from typing import Any


class AuctionItem(models.Model):
    bids: Any

    title = models.CharField(max_length=255)
    description = models.TextField()
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    end_time = models.DateTimeField()
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='auctions')
    image = models.ImageField(upload_to='auction_images/', blank=True, null=True)

    @property
    def current_highest_bid(self):
        highest_bid = self.bids.order_by('-amount').first()
        return highest_bid.amount if highest_bid else self.starting_price

    @property
    def is_expired(self):
        return timezone.now() > self.end_time

    @property
    def winner(self):
        if self.is_expired:
            top_bid = self.bids.order_by('-amount').first()
            return top_bid.bidder.email if top_bid else None
        return None

    def __str__(self):
        return self.title


class Bid(models.Model):
    item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='placed_bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.email} bid {self.amount} on {self.item.title}"