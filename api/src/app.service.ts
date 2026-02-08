import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'Adonis Health API',
      version: '1.0.0',
      description: 'Premium Men\'s Health & Executive Wellness Platform',
      status: 'running',
      endpoints: {
        auth: '/auth',
        patients: '/patients',
        quotes: '/quotes',
        labOrders: '/lab-orders',
        labs: '/labs',
        concierge: '/concierge',
      },
      documentation: 'See /docs for API documentation',
    };
  }
}
