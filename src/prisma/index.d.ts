import { PrismaClient } from '@prisma/client'

declare global {
  namespace PrismaClient {
    interface PrismaClient {
      projectPartnershipRequest: {
        create: (args: any) => Promise<any>;
        findMany: (args?: any) => Promise<any[]>;
        findUnique: (args: any) => Promise<any | null>;
      };
      partnershipAttachment: {
        createMany: (args: any) => Promise<any>;
        findMany: (args: any) => Promise<any[]>;
      };
      jobApplicationRequest: {
        create: (args: any) => Promise<any>;
        findMany: (args?: any) => Promise<any[]>;
        count: (args: any) => Promise<number>;
      };
      jobRole: {
        create: (args: any) => Promise<any>;
        findMany: (args?: any) => Promise<any[]>;
        findUnique: (args: any) => Promise<any | null>;
        update: (args: any) => Promise<any>;
        delete: (args: any) => Promise<any>;
      };
    }
  }
}
