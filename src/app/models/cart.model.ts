import { ProductModelServer } from "./product.model";

export interface CartModelServer {
  total: Number;
  data: [
    {
      product: ProductModelServer;
      numInCart: any;
      info: String;
      shop: String;
    }
  ];
}

export interface CartModelPublic {
  total: Number;
  prodData: [
    {
      id: Number;
      incart: Number;
      info: String;
      shop: String;
    }
  ];
}
