"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
const Customer_1 = require("./models/Customer");
const Event_1 = require("./models/Event");
const Booking_1 = require("./models/Booking");
const Service_1 = require("./models/Service");
const Notification_1 = require("./models/Notification");
const Employee_1 = require("./models/Employee");
const Inventory_1 = require("./models/Inventory");
const Approval_1 = require("./models/Approval");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
// ─── Helpers ──────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
// ─── Realistic Indian Data ────────────────────────────────────
const FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Ananya", "Diya", "Myra", "Sara", "Anika", "Aadhya", "Aaradhya", "Saanvi", "Riya", "Priya",
    "Rohan", "Karan", "Vikram", "Rahul", "Amit", "Neha", "Pooja", "Sneha", "Meera", "Kavya",
];
const LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Patel", "Singh", "Reddy", "Kumar", "Mehta", "Chopra", "Kapoor",
    "Agarwal", "Joshi", "Malhotra", "Chauhan", "Bhatia", "Rao", "Nair", "Pillai", "Das", "Saxena",
];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad"];
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", "West Bengal", "Rajasthan", "Uttar Pradesh", "Gujarat"];
const STREETS = ["MG Road", "Park Street", "Jubilee Hills", "Banjara Hills", "Connaught Place", "Brigade Road", "Linking Road", "Hill Road", "Station Road", "Ring Road"];
const INDUSTRIES = ["Hospitality", "IT Services", "Healthcare", "Education", "Real Estate", "FMCG", "Banking", "Manufacturing", "Retail", "Media"];
const VENUES = [
    "The Grand Ballroom, Taj Palace", "ITC Grand Chola Convention Hall", "Leela Palace Gardens",
    "Oberoi Banquet Hall", "JW Marriott Grand Lawn", "Hyatt Regency Crystal Room",
    "Radisson Blu Convention Center", "The LaLiT Great Room", "Shangri-La Grand Pavilion",
    "Four Seasons Terrace Garden", "Hotel Surya Mahal", "Royal Orchid Banquets",
];
const BOOKING_TIMES = ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "5:00 PM", "6:30 PM", "7:00 PM", "8:00 PM"];
const SERVICE_TYPES = ["Wedding", "Corporate", "Birthday", "Photography", "Decoration", "Catering", "Concert", "Exhibition"];
const EVENT_TITLES = [
    "Royal Wedding Celebration", "Golden Anniversary Gala", "Corporate Annual Summit",
    "Birthday Bash Extravaganza", "Engagement Ceremony", "Mehendi & Sangeet Night",
    "Product Launch Event", "Award Ceremony Night", "Charity Fundraiser Gala",
    "Tech Conference 2026", "Fashion Show Premier", "Music Festival Weekend",
    "Baby Shower Celebration", "Retirement Party", "New Year Grand Ball",
    "Holi Festival Event", "Diwali Corporate Dinner", "Christmas Carnival",
    "Cultural Night Show", "Alumni Reunion Meet",
];
const EVENT_DESCRIPTIONS = [
    "A grand celebration with premium decor, live entertainment, and world-class catering for an unforgettable experience.",
    "An elegant evening featuring curated performances, gourmet dining, and luxurious ambiance.",
    "A professionally managed corporate event with state-of-the-art AV, networking zones, and executive catering.",
    "A vibrant celebration with themed decor, entertainment, DJ, and customized cake arrangements.",
    "A beautiful ceremony with floral decor, traditional rituals setup, and premium photography coverage.",
    "A colorful evening of music, dance, and celebration with mehendi artists and live performances.",
    "A high-impact product launch with media setup, branding, stage design, and PR management.",
    "A prestigious ceremony recognizing excellence with red carpet, trophies, and celebrity hosting.",
    "An impactful fundraising evening with auctions, performances, and community engagement.",
    "A two-day technology conference with keynote speakers, workshops, and networking sessions.",
];
const DEPARTMENTS = ["Operations", "Creative", "Sales", "Technical", "Logistics", "Management", "Finance", "Marketing"];
const EMP_ROLES = [
    "Event Coordinator", "Decorator Lead", "Logistics Manager", "Client Relations Executive",
    "Sound Engineer", "Lighting Technician", "Catering Supervisor", "Stage Manager",
    "Photography Head", "Marketing Executive", "Finance Officer", "Fleet Coordinator",
    "Floral Designer", "Guest Relations", "Security Lead",
];
// ─── Connect ──────────────────────────────────────────────────
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};
// ─── Seed Admin ───────────────────────────────────────────────
const seedAdmin = async () => {
    const existing = await User_1.User.findOne({ email: "admin@divyam.com" });
    if (!existing) {
        const hashedPassword = await bcrypt_1.default.hash("admin123", 12);
        await User_1.User.create({
            firstName: "Super",
            lastName: "Admin",
            email: "admin@divyam.com",
            password: hashedPassword,
            role: "admin",
            phone: "+919876543210",
            isActive: true,
        });
        console.log("✅ Admin created (admin@divyam.com / admin123)");
    }
    else {
        console.log("⏭️  Admin already exists");
    }
};
// ─── Seed Services ────────────────────────────────────────────
const seedServices = async () => {
    const count = await Service_1.Service.countDocuments();
    if (count > 0)
        return console.log("⏭️  Services already exist (" + count + ")");
    const services = [
        { title: "Royal Wedding Planning", description: "End-to-end luxury wedding planning with premium decor, catering, and entertainment.", category: "Wedding", price: 500000, duration: "3 Months", location: "Pan India", maxGuests: 1000, images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"], features: ["Premium Decor", "Live Band", "Gourmet Catering", "Photography"] },
        { title: "Destination Wedding", description: "Complete destination wedding management including travel, accommodation, and celebrations.", category: "Wedding", price: 1500000, duration: "5 Days", location: "Udaipur / Goa / Jaipur", maxGuests: 500, images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80"], features: ["Travel Coordination", "Hotel Bookings", "Multi-day Setup"] },
        { title: "Corporate Summit Package", description: "Professional corporate event with AV setup, networking zones, and executive catering.", category: "Corporate", price: 200000, duration: "1 Day", location: "Convention Centers", maxGuests: 500, images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"], features: ["AV Setup", "Networking Zone", "Executive Lunch"] },
        { title: "Corporate Team Outing", description: "Fun team building activities with adventure sports, games, and outdoor dining.", category: "Corporate", price: 75000, duration: "1 Day", location: "Resorts", maxGuests: 200, images: ["https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80"], features: ["Team Games", "Adventure Sports", "BBQ Dinner"] },
        { title: "Birthday Extravaganza", description: "Complete birthday party management with themed decorations and entertainment.", category: "Birthday", price: 50000, duration: "1 Day", location: "Home / Venue", maxGuests: 100, images: ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"], features: ["Themed Decor", "DJ", "Custom Cake", "Games"] },
        { title: "Kids Birthday Special", description: "Fun-filled kids birthday with cartoon themes, magic shows, and bouncy castles.", category: "Birthday", price: 35000, duration: "4 Hours", location: "Home / Venue", maxGuests: 50, images: ["https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80"], features: ["Magic Show", "Bouncy Castle", "Face Painting"] },
        { title: "Premium Photography", description: "Candid and traditional photography with drone coverage and cinematic video.", category: "Photography", price: 80000, duration: "1 Day", location: "Anywhere", maxGuests: 0, images: ["https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80"], features: ["Drone Coverage", "Cinematic Video", "Photo Album"] },
        { title: "Grand Decoration Package", description: "Premium floral and thematic decoration for any occasion.", category: "Decoration", price: 150000, duration: "1 Day", location: "Anywhere", maxGuests: 0, images: ["https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=800&q=80"], features: ["Floral Arrangement", "Stage Design", "LED Lighting"] },
        { title: "Royal Catering Service", description: "Multi-cuisine gourmet catering with live counters and dessert stations.", category: "Catering", price: 120000, duration: "1 Day", location: "Anywhere", maxGuests: 500, images: ["https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"], features: ["Live Counters", "Multi-Cuisine", "Dessert Station"] },
        { title: "Concert & Live Show", description: "Complete concert management with sound, lighting, and artist coordination.", category: "Concert", price: 300000, duration: "1 Day", location: "Outdoor Venues", maxGuests: 2000, images: ["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"], features: ["Sound System", "Stage Setup", "Artist Management"] },
        { title: "Art & Trade Exhibition", description: "Professional exhibition setup with stalls, branding, and visitor management.", category: "Exhibition", price: 250000, duration: "3 Days", location: "Exhibition Halls", maxGuests: 5000, images: ["https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"], features: ["Stall Design", "Branding", "Visitor Tracking"] },
    ];
    await Service_1.Service.insertMany(services);
    console.log("✅ Services seeded (" + services.length + ")");
};
// ─── Seed Events ──────────────────────────────────────────────
const seedEvents = async () => {
    const count = await Event_1.Event.countDocuments();
    if (count > 0)
        return console.log("⏭️  Events already exist (" + count + ")");
    const types = ["wedding", "corporate", "party", "conference", "other"];
    const events = EVENT_TITLES.map((title, i) => ({
        title,
        description: EVENT_DESCRIPTIONS[i % EVENT_DESCRIPTIONS.length],
        eventType: types[i % types.length],
        capacity: randBetween(50, 2000),
        basePrice: randBetween(25000, 500000),
        amenities: ["Catering", "Decor", "Photography", "DJ", "Valet Parking", "Live Band"].slice(0, randBetween(2, 6)),
        status: i < 16 ? "published" : (i < 18 ? "draft" : "archived"),
    }));
    await Event_1.Event.insertMany(events);
    console.log("✅ Events seeded (" + events.length + ")");
};
// ─── Seed Customers ───────────────────────────────────────────
const seedCustomers = async () => {
    const count = await Customer_1.Customer.countDocuments();
    if (count > 0)
        return console.log("⏭️  Customers already exist (" + count + ")");
    const companyNames = [
        "Sharma Wedding House", "Verma Celebrations", "Gupta Events Co.", "Patel & Sons Hospitality",
        "Singh Royal Events", "Reddy Grand Functions", "Kumar Enterprises", "Mehta Group",
        "Chopra Productions", "Kapoor Family Trust", "Agarwal Industries", "Joshi Tech Solutions",
        "Malhotra Media Group", "Chauhan Builders", "Bhatia Traders", "Rao Pharma Ltd.",
        "Nair Associates", "Pillai Exports", "Das Consultancy", "Saxena Legal Services",
        "Sunrise Foundation", "Pinnacle Corp", "Heritage Events", "Urban Celebrations",
        "Metro Entertainment", "Star Productions", "Royal Catering Co.", "Elite Party Planners",
        "Grand Occasions", "Premier Events Hub",
    ];
    const customers = companyNames.map((name, i) => ({
        companyName: name,
        email: name.toLowerCase().replace(/[^a-z0-9]/g, "") + "@gmail.com",
        phone: `+919${randBetween(100000000, 999999999)}`,
        status: ["active", "inactive", "lead"][i % 3],
        industry: INDUSTRIES[i % INDUSTRIES.length],
        address: {
            street: `${randBetween(1, 200)}, ${STREETS[i % STREETS.length]}`,
            city: CITIES[i % CITIES.length],
            state: STATES[i % STATES.length],
            zipCode: `${randBetween(100000, 999999)}`,
            country: "India",
        },
        notes: i % 3 === 0 ? "VIP client — prioritize requests" : undefined,
    }));
    await Customer_1.Customer.insertMany(customers);
    console.log("✅ Customers seeded (" + customers.length + ")");
};
// ─── Seed Client Users for Bookings ───────────────────────────
const seedClientUsers = async () => {
    const count = await User_1.User.countDocuments({ role: "client" });
    if (count >= 10)
        return console.log("⏭️  Client users already exist (" + count + ")");
    const hashedPassword = await bcrypt_1.default.hash("Password@123", 12);
    const clients = Array.from({ length: 10 }).map((_, i) => ({
        firstName: FIRST_NAMES[i],
        lastName: LAST_NAMES[i],
        email: `${FIRST_NAMES[i].toLowerCase()}.${LAST_NAMES[i].toLowerCase()}@gmail.com`,
        password: hashedPassword,
        role: "client",
        phone: `+919${randBetween(100000000, 999999999)}`,
        isActive: true,
    }));
    // Only insert ones that don't exist
    for (const client of clients) {
        const exists = await User_1.User.findOne({ email: client.email });
        if (!exists)
            await User_1.User.create(client);
    }
    console.log("✅ Client users seeded");
};
// ─── Seed Bookings ────────────────────────────────────────────
const seedBookings = async () => {
    const count = await Booking_1.Booking.countDocuments();
    if (count > 0)
        return console.log("⏭️  Bookings already exist (" + count + ")");
    const users = await User_1.User.find({ role: "client" }).limit(10);
    const services = await Service_1.Service.find();
    if (users.length === 0 || services.length === 0) {
        return console.log("⚠️  Need client users and services before seeding bookings");
    }
    const customerNames = [
        "Aarav Sharma", "Vivaan Verma", "Aditya Gupta", "Vihaan Patel", "Arjun Singh",
        "Ananya Reddy", "Diya Kumar", "Myra Mehta", "Sara Chopra", "Anika Kapoor",
        "Rohan Agarwal", "Karan Joshi", "Vikram Malhotra", "Rahul Chauhan", "Amit Bhatia",
        "Neha Rao", "Pooja Nair", "Sneha Pillai", "Meera Das", "Kavya Saxena",
        "Ishaan Sharma", "Krishna Verma", "Riya Gupta", "Sai Patel", "Priya Singh",
        "Reyansh Reddy", "Ayaan Kumar", "Aadhya Mehta", "Aaradhya Chopra", "Saanvi Kapoor",
        "Rohit Verma", "Anjali Sharma", "Deepak Gupta", "Sunita Patel", "Manoj Singh",
        "Kavita Reddy", "Rajesh Kumar", "Suman Mehta", "Vandana Chopra", "Gaurav Kapoor",
    ];
    const bookingStatuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"];
    const paymentStatuses = ["Payment Pending", "Payment Successful", "Refunded"];
    const bookings = Array.from({ length: 40 }).map((_, i) => {
        const user = users[i % users.length];
        const service = services[i % services.length];
        const name = customerNames[i];
        const isPast = i < 25;
        const bookingDate = isPast ? daysAgo(randBetween(1, 90)) : daysFromNow(randBetween(1, 60));
        const bStatus = bookingStatuses[i % 5];
        // Completed bookings should have successful payments
        const pStatus = bStatus === "Completed" ? "Payment Successful" :
            bStatus === "Cancelled" ? "Refunded" :
                paymentStatuses[i % 3];
        return {
            userId: user._id,
            serviceId: service._id,
            customerName: name,
            email: name.toLowerCase().replace(/ /g, ".") + "@gmail.com",
            phone: `+919${randBetween(100000000, 999999999)}`,
            serviceType: service.category,
            bookingDate,
            bookingTime: pick(BOOKING_TIMES),
            guests: randBetween(20, 800),
            address: `${pick(VENUES)}, ${pick(CITIES)}`,
            notes: i % 4 === 0 ? "Special dietary requirements for 20 guests" : undefined,
            bookingStatus: bStatus,
            paymentStatus: pStatus,
            paymentId: pStatus === "Payment Successful" ? `PAY-${Date.now().toString(36).toUpperCase()}-${i}` : undefined,
            amount: randBetween(25000, 1500000),
        };
    });
    await Booking_1.Booking.insertMany(bookings);
    console.log("✅ Bookings seeded (" + bookings.length + ")");
};
// ─── Seed Employees ───────────────────────────────────────────
const seedEmployees = async () => {
    const count = await Employee_1.Employee.countDocuments();
    if (count > 0)
        return console.log("⏭️  Employees already exist (" + count + ")");
    const employees = EMP_ROLES.map((role, i) => ({
        firstName: FIRST_NAMES[i + 10] || FIRST_NAMES[i],
        lastName: LAST_NAMES[i + 5] || LAST_NAMES[i],
        department: DEPARTMENTS[i % DEPARTMENTS.length],
        phone: `+919${randBetween(100000000, 999999999)}`,
        email: `${(FIRST_NAMES[i + 10] || FIRST_NAMES[i]).toLowerCase()}.${(LAST_NAMES[i + 5] || LAST_NAMES[i]).toLowerCase()}@divyam.com`,
        salary: randBetween(25000, 85000),
        role,
        joiningDate: daysAgo(randBetween(30, 730)),
        status: ["Active", "Active", "Active", "Active", "On Leave", "Active", "Active", "Active", "Active", "Active", "On Leave", "Active", "Active", "Active", "Terminated"][i],
    }));
    await Employee_1.Employee.insertMany(employees);
    console.log("✅ Employees seeded (" + employees.length + ")");
};
// ─── Seed Inventory ───────────────────────────────────────────
const seedInventory = async () => {
    const count = await Inventory_1.Inventory.countDocuments();
    if (count > 0)
        return console.log("⏭️  Inventory already exist (" + count + ")");
    const items = [
        { name: "Gold Chiavari Chairs", category: "Furniture", quantity: 500, availableQuantity: 420, maintenanceStatus: "Good" },
        { name: "Round Tables (8-seater)", category: "Furniture", quantity: 120, availableQuantity: 105, maintenanceStatus: "Good" },
        { name: "Cocktail High Tables", category: "Furniture", quantity: 60, availableQuantity: 55, maintenanceStatus: "Good" },
        { name: "White Linen Tablecloths", category: "Linen", quantity: 200, availableQuantity: 180, maintenanceStatus: "Good" },
        { name: "LED Par Lights (RGBW)", category: "Lighting", quantity: 80, availableQuantity: 12, maintenanceStatus: "Needs Repair" },
        { name: "Moving Head Spotlights", category: "Lighting", quantity: 40, availableQuantity: 35, maintenanceStatus: "Good" },
        { name: "Fairy Light Curtains", category: "Lighting", quantity: 30, availableQuantity: 28, maintenanceStatus: "Good" },
        { name: "PA Speaker System (JBL)", category: "Audio", quantity: 10, availableQuantity: 8, maintenanceStatus: "Good" },
        { name: "Wireless Microphone Set", category: "Audio", quantity: 20, availableQuantity: 18, maintenanceStatus: "Good" },
        { name: "DJ Console Setup", category: "Audio", quantity: 5, availableQuantity: 4, maintenanceStatus: "Good" },
        { name: "Floral Arch Frame", category: "Decor", quantity: 8, availableQuantity: 0, maintenanceStatus: "In Maintenance" },
        { name: "Crystal Centerpieces", category: "Decor", quantity: 100, availableQuantity: 90, maintenanceStatus: "Good" },
        { name: "Stage Platform (Modular)", category: "Infrastructure", quantity: 15, availableQuantity: 12, maintenanceStatus: "Good" },
        { name: "Red Carpet Rolls (50ft)", category: "Decor", quantity: 10, availableQuantity: 9, maintenanceStatus: "Good" },
        { name: "4K LED Wall (12x8 ft)", category: "Electronics", quantity: 4, availableQuantity: 3, maintenanceStatus: "Good" },
        { name: "Projector Epson 5000L", category: "Electronics", quantity: 6, availableQuantity: 5, maintenanceStatus: "Good" },
        { name: "Generator 100KVA", category: "Power", quantity: 3, availableQuantity: 1, maintenanceStatus: "In Maintenance" },
        { name: "Generator 50KVA", category: "Power", quantity: 5, availableQuantity: 4, maintenanceStatus: "Good" },
        { name: "Chafing Dishes (Large)", category: "Catering", quantity: 50, availableQuantity: 45, maintenanceStatus: "Good" },
        { name: "Beverage Dispensers", category: "Catering", quantity: 20, availableQuantity: 18, maintenanceStatus: "Good" },
    ];
    await Inventory_1.Inventory.insertMany(items);
    console.log("✅ Inventory seeded (" + items.length + ")");
};
// ─── Seed Approvals ───────────────────────────────────────────
const seedApprovals = async () => {
    const count = await Approval_1.Approval.countDocuments();
    if (count > 0)
        return console.log("⏭️  Approvals already exist (" + count + ")");
    const items = [
        { type: "Booking", requesterName: "Aarav Sharma", description: "Royal Wedding Package — 500 guests at Taj Palace", status: "pending", requestedAt: daysAgo(1) },
        { type: "Refund", requesterName: "Vivaan Verma", description: "Refund request — Corporate Gala cancelled due to rescheduling", status: "pending", requestedAt: daysAgo(2) },
        { type: "Service", requesterName: "Priya Singh", description: "New service listing — DJ Night Premium with international artist", status: "approved", requestedAt: daysAgo(5), processedAt: daysAgo(3) },
        { type: "Booking", requesterName: "Sneha Pillai", description: "Birthday Premium — 150 guests at JW Marriott", status: "approved", requestedAt: daysAgo(7), processedAt: daysAgo(5) },
        { type: "Refund", requesterName: "Rahul Chauhan", description: "Partial refund — Venue change request from Oberoi to Leela", status: "rejected", requestedAt: daysAgo(10), processedAt: daysAgo(8) },
        { type: "Booking", requesterName: "Kapoor Family", description: "Golden Anniversary Special — 300 guests with live orchestra", status: "pending", requestedAt: daysAgo(0) },
        { type: "Service", requesterName: "Rohan Agarwal", description: "Add Drone Photography add-on to existing photography package", status: "pending", requestedAt: daysAgo(1) },
        { type: "Booking", requesterName: "Meera Das", description: "Engagement Ceremony — intimate gathering of 80 guests", status: "approved", requestedAt: daysAgo(4), processedAt: daysAgo(2) },
        { type: "Refund", requesterName: "Karan Joshi", description: "Full refund — Event postponed indefinitely due to personal reasons", status: "rejected", requestedAt: daysAgo(15), processedAt: daysAgo(12) },
        { type: "Booking", requesterName: "Ananya Reddy", description: "Corporate Annual Day — 400 employees at Hyatt Regency", status: "pending", requestedAt: daysAgo(0) },
        { type: "Service", requesterName: "Vikram Malhotra", description: "Update pricing for Premium Catering — inflation adjustment", status: "approved", requestedAt: daysAgo(8), processedAt: daysAgo(6) },
        { type: "Booking", requesterName: "Diya Kumar", description: "Baby Shower — 60 guests with floral theme at home", status: "pending", requestedAt: daysAgo(0) },
    ];
    await Approval_1.Approval.insertMany(items);
    console.log("✅ Approvals seeded (" + items.length + ")");
};
// ─── Seed Notifications ──────────────────────────────────────
const seedNotifications = async () => {
    const count = await Notification_1.Notification.countDocuments();
    if (count > 0)
        return console.log("⏭️  Notifications already exist (" + count + ")");
    const admin = await User_1.User.findOne({ role: "admin" });
    if (!admin)
        return console.log("⚠️  No admin user found for notifications");
    const notifications = [
        { type: "booking_created", title: "New Booking Received", message: "Aarav Sharma booked Royal Wedding Package for ₹5,00,000", link: "/admin/bookings" },
        { type: "payment_received", title: "Payment Confirmed", message: "Payment of ₹2,00,000 received from Vivaan Verma for Corporate Summit", link: "/admin/payments" },
        { type: "system_alert", title: "Inventory Running Low", message: "LED Par Lights stock is critically low (12 remaining). Reorder needed.", link: "/admin/inventory" },
        { type: "booking_created", title: "New Booking Received", message: "Ananya Reddy booked Birthday Extravaganza for ₹50,000", link: "/admin/bookings" },
        { type: "system_alert", title: "Generator Maintenance Due", message: "Generator 100KVA scheduled maintenance is overdue by 3 days", link: "/admin/inventory" },
        { type: "payment_received", title: "Advance Payment Received", message: "Advance of ₹1,50,000 received from Kapoor Family for Anniversary event", link: "/admin/payments" },
        { type: "task_assigned", title: "New Employee Onboarded", message: "Kavya Saxena has been added as Floral Designer in Creative department", link: "/admin/employees" },
        { type: "booking_created", title: "Booking Updated", message: "Sneha Pillai's booking status changed to Confirmed", link: "/admin/bookings" },
        { type: "system_alert", title: "Approval Pending", message: "5 approval requests are awaiting your review", link: "/admin/approvals" },
        { type: "payment_received", title: "Refund Processed", message: "Refund of ₹30,000 processed for Rahul Chauhan's venue change", link: "/admin/payments" },
        { type: "booking_created", title: "Event Tomorrow", message: "Reminder: Aditya Gupta's Corporate Summit is scheduled for tomorrow at ITC Grand", link: "/admin/bookings" },
        { type: "system_alert", title: "Floral Arch Unavailable", message: "All 8 Floral Arch Frames are currently in maintenance. No stock available.", link: "/admin/inventory" },
        { type: "task_assigned", title: "Task Assigned", message: "Stage setup task assigned to Vikram Malhotra for tomorrow's conference", link: "/admin/employees" },
        { type: "booking_created", title: "Booking Cancelled", message: "Karan Joshi cancelled the Corporate Team Outing booking", link: "/admin/bookings" },
        { type: "payment_received", title: "Full Payment Received", message: "Full payment of ₹3,50,000 received for Meera Das's Engagement Ceremony", link: "/admin/payments" },
    ];
    const docs = notifications.map((n, i) => ({
        ...n,
        recipient: admin._id,
        isRead: i > 7, // first 8 unread, rest read
        createdAt: daysAgo(i),
        updatedAt: daysAgo(i),
    }));
    await Notification_1.Notification.insertMany(docs);
    console.log("✅ Notifications seeded (" + docs.length + ")");
};
// ─── Main Runner ──────────────────────────────────────────────
const runSeeder = async () => {
    await connectDB();
    console.log("\n🌱 Starting database seeding...\n");
    await seedAdmin();
    await seedServices();
    await seedEvents();
    await seedCustomers();
    await seedClientUsers();
    await seedBookings();
    await seedEmployees();
    await seedInventory();
    await seedApprovals();
    await seedNotifications();
    console.log("\n🎉 Seeding complete!\n");
    // Print summary
    const counts = {
        Users: await User_1.User.countDocuments(),
        Customers: await Customer_1.Customer.countDocuments(),
        Services: await Service_1.Service.countDocuments(),
        Events: await Event_1.Event.countDocuments(),
        Bookings: await Booking_1.Booking.countDocuments(),
        Employees: await Employee_1.Employee.countDocuments(),
        Inventory: await Inventory_1.Inventory.countDocuments(),
        Approvals: await Approval_1.Approval.countDocuments(),
        Notifications: await Notification_1.Notification.countDocuments(),
    };
    console.log("📊 Collection Summary:");
    for (const [name, count] of Object.entries(counts)) {
        console.log(`   ${name}: ${count}`);
    }
    process.exit(0);
};
runSeeder();
