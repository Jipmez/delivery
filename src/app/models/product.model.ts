export interface Shop {
  id: Number;
  picture: String;
  name: String;
}

export interface Category {
  id: Number;
  choice: String;
}

export interface ProductModelServer {
  shop: Shop[];
  id: Number;
  title: String;
  category: String;
  description: String;
  discount_price: String;
  price: Number;
  quantity: any;
  picture: String;
}

export interface serverResponse {
  count: number;
  next: String;
  previous: String;
  results: ProductModelServer[];
}
