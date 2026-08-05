import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { Booking } from "../models/Booking";
import { hashPassword } from "../services/hash.service";

dotenv.config({ path: ".env.local" });
dotenv.config();

const dummyServices = [
  {
    title: "Premium Wedding Package",
    description: "Complete wedding management including catering, decoration, and photography.",
    category: "Wedding",
    images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"],
    price: 15000,
    duration: "Full Day",
    location: "Various Locations",
    features: ["Catering for 500", "Premium Decoration", "2 Photographers", "Live Music"],
    maxGuests: 500
  },
  {
    title: "Corporate Conference Bundle",
    description: "Professional setup for corporate events and seminars.",
    category: "Corporate",
    images: ["https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop"],
    price: 8000,
    duration: "8 Hours",
    location: "Conference Centers",
    features: ["Projector & Audio Setup", "Lunch Buffet", "Seating Arrangement", "Registration Desk"],
    maxGuests: 300
  },
  {
    title: "Luxury Birthday Celebration",
    description: "Make your birthday special with our luxury event planning.",
    category: "Birthday",
    images: ["https://images.unsplash.com/photo-1530103862679-de609f480315?q=80&w=2070&auto=format&fit=crop"],
    price: 3000,
    duration: "5 Hours",
    location: "Banquet Halls",
    features: ["Themed Decoration", "Custom Cake", "DJ Setup", "Dinner"],
    maxGuests: 100
  },
  {
    title: "Professional Photography Session",
    description: "Capture your best moments with our professional photography team.",
    category: "Photography",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop"],
    price: 1500,
    duration: "4 Hours",
    location: "Studio or Outdoor",
    features: ["Unlimited Shots", "Color Correction", "Digital Album", "Drone Coverage"],
    maxGuests: 50
  },
  {
    title: "Elegant Floral Decoration",
    description: "Stunning floral arrangements for any occasion.",
    category: "Decoration",
    images: ["https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2070&auto=format&fit=crop"],
    price: 2500,
    duration: "Event Duration",
    location: "Any Venue",
    features: ["Stage Setup", "Table Centerpieces", "Entrance Arch", "Lighting"],
    maxGuests: 200
  },
  {
    title: "Gourmet Catering Service",
    description: "Delicious multi-cuisine catering for your guests.",
    category: "Catering",
    images: ["https://images.unsplash.com/photo-1555244162-803834f87a4d?q=80&w=2070&auto=format&fit=crop"],
    price: 5000,
    duration: "Event Duration",
    location: "Any Venue",
    features: ["3 Course Meal", "Live Counters", "Beverage Station", "Waitstaff"],
    maxGuests: 300
  },
  {
    title: "Live Concert Production",
    description: "Full-scale production for live concerts and shows.",
    category: "Concert",
    images: ["https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop"],
    price: 25000,
    duration: "6 Hours",
    location: "Auditoriums/Arenas",
    features: ["Stage Construction", "Sound System", "Lighting Rig", "Security"],
    maxGuests: 5000
  },
  {
    title: "Art Exhibition Setup",
    description: "Elegant gallery setup for displaying artwork.",
    category: "Exhibition",
    images: ["https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop"],
    price: 4000,
    duration: "Full Day",
    location: "Galleries",
    features: ["Display Panels", "Spotlighting", "Catalog Printing", "Reception Area"],
    maxGuests: 500
  },
  {
    title: "Intimate Anniversary Dinner",
    description: "A private, romantic setup for your special day.",
    category: "Wedding", // Using wedding category as it fits closest
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"],
    price: 1000,
    duration: "3 Hours",
    location: "Rooftop/Beach",
    features: ["Candlelight Dinner", "Private Butler", "Champagne", "Live Violinist"],
    maxGuests: 2
  },
  {
    title: "Team Building Retreat",
    description: "Engaging activities and setup for corporate teams.",
    category: "Corporate",
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop"],
    price: 6000,
    duration: "Full Day",
    location: "Resorts",
    features: ["Activity Facilitators", "Meals", "Transport", "Conference Room"],
    maxGuests: 100
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/divyam";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");

    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});

    console.log("👤 Creating admin and users...");
    const adminPassword = await hashPassword("admin123");
    const userPassword = await hashPassword("user123");

    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@divyam.com",
      password: adminPassword,
      role: "admin",
    });

    const customers = await User.insertMany(
      Array.from({ length: 10 }).map((_, i) => ({
        firstName: `Customer${i + 1}`,
        lastName: `Test${i + 1}`,
        email: `customer${i + 1}@test.com`,
        password: userPassword,
        role: "client",
      }))
    );

    console.log("📦 Creating services...");
    const services = await Service.insertMany(dummyServices);

    console.log("📅 Creating bookings...");
    const statuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"];
    const paymentStatuses = ["Payment Pending", "Payment Successful", "Refunded"];

    const bookings = [];
    for (let i = 0; i < 25; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const payStatus = status === "Completed" ? "Payment Successful" : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

      bookings.push({
        userId: customer._id,
        serviceId: service._id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: `+123456789${i.toString().padStart(2, '0')}`,
        serviceType: service.title,
        bookingDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in next 30 days
        bookingTime: "18:00",
        guests: Math.floor(Math.random() * service.maxGuests) + 1,
        address: "123 Event Street, City",
        notes: "Looking forward to it!",
        bookingStatus: status,
        paymentStatus: payStatus,
        amount: service.price,
        paymentId: payStatus === "Payment Successful" ? `mock_pay_${Date.now()}_${i}` : undefined,
      });
    }

    await Booking.insertMany(bookings);

    console.log("🎉 Seed successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDB();
