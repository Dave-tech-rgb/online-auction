from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class AuctionItem(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    end_time = models.DateTimeField()
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auctions')

    @property
    def current_highest_bid(self):
        highest_bid = self.bids.order_by('-amount').first()
        return highest_bid.amount if highest_bid else self.starting_price

    @property
    def is_expired(self):
        return timezone.now() > self.end_time

    def __str__(self):
        return self.title

class Bid(models.Model):
    item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.username} bid {self.amount} on {self.item.title}"
