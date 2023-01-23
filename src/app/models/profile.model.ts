export interface Address {
  billing_address: String;
  landmark: String;
}

export interface profile {
  id: Number;
  email: String;
  address: Address;
  phone: String;
  full_name: String;
}

export interface apiResponse {
  code: Number;
  data: profile;
  message: String;
}
