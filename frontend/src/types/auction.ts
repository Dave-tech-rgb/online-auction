export interface AuctionItem {
  id: number;
  title: string;
  description: string;
  starting_price: string;
  end_time: string;
  seller: number;
  current_highest_bid: string;
  is_expired: boolean;
  winner: string | null;
  image?: string;
}

export interface Bid {
  id: number;
  item: number;
  bidder: number;
  bidder_username: string | null;
  amount: string;
  timestamp: string;
}