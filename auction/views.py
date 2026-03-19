from rest_framework import permissions, generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.query import QuerySet
from auction.models import AuctionItem, Bid
from auction.serializers import AuctionItemSerializer, BidSerializer, UserSerializer

class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class AuctionItemListCreateView(generics.ListCreateAPIView):
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self) -> QuerySet:
        return AuctionItem.objects.filter(end_time__gt=timezone.now())

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class AuctionItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = AuctionItem.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seller != request.user:
            return Response({'error': 'Only the seller can delete this auction.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class BidHistoryAPIView(generics.ListAPIView):
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self) -> QuerySet:
        item_id = self.kwargs.get('item_id')
        return Bid.objects.filter(item_id=item_id).order_by('-amount')

class BidCreateAPIView(generics.CreateAPIView):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(bidder=self.request.user)