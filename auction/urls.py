from django.urls import path, include
from rest_framework.routers import DefaultRouter
from auction.views import AuctionItemViewSet, BidHistoryAPIView, BidCreateAPIView

router = DefaultRouter()
router.register(r'auctions', AuctionItemViewSet, basename='auction')

urlpatterns = [
    path('', include(router.urls)),
    path('auctions/<int:item_id>/bids/', BidHistoryAPIView.as_view(), name='bid-history'),
    path('bids/', BidCreateAPIView.as_view(), name='place-bid'),
]
