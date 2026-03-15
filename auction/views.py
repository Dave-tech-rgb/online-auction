from rest_framework import viewsets, permissions, generics
from django.utils import timezone
from auction.models import AuctionItem, Bid
from auction.serializers import AuctionItemSerializer, BidSerializer

class AuctionItemViewSet(viewsets.ModelViewSet):
    """
    Endpoint to list active auctions and create new ones.
    """
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # List active auctions
        return AuctionItem.objects.filter(end_time__gt=timezone.now())

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class BidHistoryAPIView(generics.ListAPIView):
    """
    Endpoint to retrieve bid history for a specific item.
    """
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        return Bid.objects.filter(item_id=item_id).order_by('-amount')


class BidCreateAPIView(generics.CreateAPIView):
    """
    Endpoint to place a new bid.
    """
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(bidder=self.request.user)
