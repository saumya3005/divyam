"use client";

import { useGetService } from "@/features/services/hooks/useServices";
import { Loader2, Calendar, MapPin, Users, CheckCircle2, ChevronLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookingForm } from "@/features/bookings/components/BookingForm";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  
  const { data: service, isLoading, error } = useGetService(id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookNow = () => {
    if (!user) {
      router.push("/login?redirect=/services/" + id);
      return;
    }
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col justify-center items-center p-6">
        <p className="text-red-400 text-xl mb-4">Failed to load service details.</p>
        <Link href="/services" className="text-brand-gold hover:underline flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/services" className="inline-flex items-center text-brand-gray hover:text-white transition-colors mb-8">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="w-full h-96 lg:h-128 rounded-3xl overflow-hidden border border-white/10">
              <img 
                src={service.images[0] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            {service.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {service.images.slice(1, 4).map((img, idx) => (
                  <div key={idx} className="h-24 md:h-32 rounded-xl overflow-hidden border border-white/10">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-sm font-medium mb-4">
                {service.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4">{service.title}</h1>
              <div className="text-3xl font-semibold text-brand-gold">
                ₹{service.price.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-brand-gray text-lg leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="p-3 bg-white/5 rounded-xl mr-4">
                  <Users className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Capacity</p>
                  <p className="font-medium text-white">Up to {service.maxGuests} Guests</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-3 bg-white/5 rounded-xl mr-4">
                  <Calendar className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Duration</p>
                  <p className="font-medium text-white">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-3 bg-white/5 rounded-xl mr-4">
                  <MapPin className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm text-brand-gray">Location</p>
                  <p className="font-medium text-white">{service.location}</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-medium text-white mb-4">What&apos;s Included</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-brand-gray">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <button 
                onClick={handleBookNow}
                className="w-full md:w-auto px-8 py-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark rounded-xl font-semibold text-lg transition-all flex items-center justify-center"
              >
                Book This Package
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isBookingModalOpen && (
          <BookingForm 
            onClose={() => setIsBookingModalOpen(false)}
            prefilledService={{
              _id: service._id,
              title: service.title,
              price: service.price
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
