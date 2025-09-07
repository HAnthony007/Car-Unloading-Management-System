export type VehicleStatus = 'arrived' | 'stored' | 'delivered' | 'in_transit';
export type CustomsStatus = 'pending' | 'cleared' | 'hold';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  chassisNumber: string;
  color: string;
  origin: string;
  shipowner: string;
  arrivalDate: string; // ISO date
  zone: string;
  status: VehicleStatus;
  images?: string[];
  notes?: string;
  customsStatus?: CustomsStatus;
  estimatedDelivery?: string; // ISO date
}
