import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { User } from '../src/models/User';
import { Service } from '../src/models/Service';
import { Booking } from '../src/models/Booking';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/divyam';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data (except Admin users)...');
    await Service.deleteMany();
    await Booking.deleteMany();
    await User.deleteMany({ role: { $ne: 'admin' } });

    // Ensure we have an admin for test purposes if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (!adminExists) {
      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890',
      });
      console.log('Created default admin: admin@test.com');
    }

    // 1. Create 50 Customers
    console.log('Creating 50 customers...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password123',
        role: 'client',
        phone: faker.phone.number({ style: 'national' }),
      });
    }
    const createdUsers = await User.insertMany(users);

    // 2. Create 25 Premium Services
    console.log('Creating 25 services...');
    const serviceCategories = ['Wedding', 'Corporate', 'Birthday', 'Photography', 'Decoration', 'Catering', 'Concert', 'Exhibition'];
    const services = [];
    for (let i = 0; i < 25; i++) {
      services.push({
        title: faker.company.catchPhrase() + ' Event',
        description: faker.lorem.paragraphs(2),
        price: faker.number.int({ min: 5000, max: 100000 }),
        category: faker.helpers.arrayElement(serviceCategories),
        duration: faker.helpers.arrayElement(['2 hours', 'Half Day', 'Full Day', '2 Days', '1 Week']),
        maxGuests: faker.number.int({ min: 10, max: 1000 }),
        location: faker.location.city() + ' Convention Center',
        isActive: true,
        images: [
          faker.image.url({ width: 800, height: 600 }),
          faker.image.url({ width: 800, height: 600 })
        ],
        features: [
          faker.commerce.productAdjective() + ' catering',
          faker.commerce.productAdjective() + ' decor',
          'Dedicated Event Manager',
          'Audio/Visual Setup'
        ]
      });
    }
    const createdServices = await Service.insertMany(services);

    // 3. Create 100 Bookings
    console.log('Creating 100 bookings...');
    const bookings = [];
    const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];
    const paymentStatuses = ['Payment Pending', 'Payment Successful', 'Refunded'];
    
    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(createdUsers);
      const service = faker.helpers.arrayElement(createdServices);
      
      const bookingStatus = faker.helpers.arrayElement(statuses);
      let paymentStatus = faker.helpers.arrayElement(paymentStatuses);
      
      // Logic mapping
      if (bookingStatus === 'Completed' || bookingStatus === 'Confirmed') {
        paymentStatus = 'Payment Successful';
      }
      if (bookingStatus === 'Pending' && paymentStatus === 'Refunded') {
        paymentStatus = 'Payment Pending';
      }

      const bookingDate = faker.date.soon({ days: 180 });
      const createdDate = faker.date.recent({ days: 60 });
      
      bookings.push({
        userId: user._id,
        serviceId: service._id,
        customerName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        serviceType: service.title,
        bookingDate: bookingDate,
        bookingTime: faker.helpers.arrayElement(['09:00 AM', '02:00 PM', '06:00 PM', '08:00 PM']),
        guests: faker.number.int({ min: 1, max: service.maxGuests }),
        address: faker.location.streetAddress() + ', ' + faker.location.city(),
        notes: faker.lorem.sentence(),
        bookingStatus: bookingStatus,
        paymentStatus: paymentStatus,
        paymentId: paymentStatus === 'Payment Successful' ? `pay_mock_${faker.string.alphanumeric(10)}` : undefined,
        amount: service.price,
        createdAt: createdDate,
        updatedAt: createdDate,
      });
    }
    await Booking.insertMany(bookings);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
