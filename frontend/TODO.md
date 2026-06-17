# Prisma Migration Steps

- [ ] cd backend (if separate) or root
- [ ] npm install prisma @prisma/client
- [ ] Update .env DATABASE_URL with your PostgreSQL DB
- [ ] npx prisma generate
- [ ] npx prisma db push
- [ ] Update backend server.js to use PrismaClient instead of mongoose
- [ ] Migrate routes/models to Prisma queries
- [ ] Test endpoints

# Completed
- Created prisma/schema.prisma with User, Listing, Booking, CleaningRequest, ConstructionRequest models
- Created prisma/.env template
