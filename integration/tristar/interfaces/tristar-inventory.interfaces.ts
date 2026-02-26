export interface Inventory {
  data: Data;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string[];
  deleted_at: string[];
  deleted_by_id: string[];
}

export interface Data {
  id: string;
  provider_id: string;
  stock_status: string;
  stock_status_text: string;
  items: Items;
}

export interface Items {
  type: string;
  items: Item[];
}

export interface Item {
  id: string;
  inventory_id: string;
  quantity: string;
  declared_quantity: string;
  reserved_quantity: string;
  created_at: string;
  updated_at: string;
}
