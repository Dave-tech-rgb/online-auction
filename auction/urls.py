from django.urls import path
from auction.views import (
    AuctionItemListCreateView,
    AuctionItemDetailView,
    BidHistoryAPIView,
    BidCreateAPIView
)

urlpatterns = [
    path('auctions/', AuctionItemListCreateView.as_view(), name='auction-list-create'),
    path('auctions/<int:pk>/', AuctionItemDetailView.as_view(), name='auction-detail'),
    path('auctions/<int:item_id>/bids/', BidHistoryAPIView.as_view(), name='bid-history'),
    path('bids/', BidCreateAPIView.as_view(), name='place-bid'),
]