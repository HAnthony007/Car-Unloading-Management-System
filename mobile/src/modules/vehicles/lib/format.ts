import { CustomsStatus, VehicleStatus } from '../types';

// Badge variant union reused from ui/Badge (warning, info, success, error, neutral)
export type BadgeVariant = 'warning' | 'info' | 'success' | 'error' | 'neutral';

export const getStatusColor = (status: VehicleStatus): BadgeVariant => {
  switch (status) {
    case 'arrived':
      return 'warning';
    case 'stored':
      return 'success';
    case 'delivered':
      return 'neutral';
    case 'in_transit':
      return 'info';
    default:
      return 'neutral';
  }
};

export const getStatusText = (status: VehicleStatus): string => {
  switch (status) {
    case 'arrived':
      return 'Arrivé';
    case 'stored':
      return 'Stocké';
    case 'delivered':
      return 'Livré';
    case 'in_transit':
      return 'En transit';
    default:
      return 'Inconnu';
  }
};

export const getCustomsStatusColor = (status: CustomsStatus): BadgeVariant => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'cleared':
      return 'success';
    case 'hold':
      return 'error';
    default:
      return 'neutral';
  }
};

export const getCustomsStatusText = (status: CustomsStatus): string => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'cleared':
      return 'Dédouané';
    case 'hold':
      return 'Bloqué';
    default:
      return 'Inconnu';
  }
};
