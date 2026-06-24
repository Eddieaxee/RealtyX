# TypeScript Error Fixes - Task Progress

## Prisma Schema Updates Needed
- [ ] Add missing `Payout` model
- [ ] Add missing `MaintenanceRequest` model
- [ ] Add missing `PropertyTenant` model
- [ ] Update `Wallet` model with `address`, `isVerified`, `verifiedAt` fields
- [ ] Update `Distribution` model with `userId`, `amountUSD`, `amountNGN`, `distributedAt`, `payoutId` fields
- [ ] Update `Kyc` model with additional fields (nationality, ninNumber, riskLevel, etc.)

## API Route Fixes
- [ ] Fix app/api/auth/verify-signature/route.ts
- [ ] Fix app/api/capital-calls/route.ts
- [ ] Fix app/api/earnings/route.ts
- [ ] Fix app/api/compliance/submit/route.ts
- [ ] Fix app/api/kyc/submit/route.ts
- [ ] Fix app/api/payments/paystack/callback/route.ts
- [ ] Fix app/api/payments/withdraw/route.ts
- [ ] Fix app/api/properties/[id]/maintenance/route.ts
- [ ] Fix app/api/properties/[id]/tenants/route.ts
- [ ] Fix app/api/property-management/maintenance/route.ts
- [ ] Fix app/api/property-management/tenants/route.ts
- [ ] Fix app/api/search/route.ts
- [ ] Fix app/api/uploadthing/core.ts
- [ ] Fix app/api/wallet/verify/route.ts

## Component & Library Fixes
- [ ] Fix components/wallet/deposit-withdraw.tsx
- [ ] Fix lib/auth.ts
- [ ] Fix lib/currency.ts
- [ ] Fix lib/properties.ts
- [ ] Fix scripts/seed-admin.ts

## Verification
- [ ] Run `npx tsc --noEmit` to verify all errors are fixed