"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGetServices } from "@/features/services/hooks/useServices";
import { Loader2, Calendar, MapPin, Users, Star } from "lucide-react";
import { useState } from "react";

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { data: services, isLoading, error } = useGetServices();

  const categories = ["All", "Wedding", "Corporate", "Birthday", "Photography", "Decoration", "Catering", "Concert", "Exhibition"];

  const filteredServices = services?.filter(s => selectedCategory === "All" || s.category === selectedCategory) || [];

  return (
    <div className="min-h-screen bg-bg-base py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-light text-white mb-4"
          >
            Premium Event <span className="text-brand-gold font-medium">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-lg max-w-2xl mx-auto"
          >
            Discover our curated collection of luxury event packages designed to make your special moments unforgettable.
          </motion.p>
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20"
                  : "bg-brand-surface text-brand-gray border border-white/10 hover:border-brand-gold/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">
            Failed to load services. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-brand-surface rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.images[0] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80"} 
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-brand-gold border border-brand-gold/20">
                    {service.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center text-brand-gold text-sm font-medium">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      4.9
                    </div>
                  </div>
                  
                  <p className="text-brand-gray text-sm mb-6 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-brand-gray text-sm">
                      <Users className="w-4 h-4 mr-2 text-brand-gold/70" />
                      Up to {service.maxGuests}
                    </div>
                    <div className="flex items-center text-brand-gray text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-brand-gold/70" />
                      {service.duration}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div>
                      <span className="text-2xl font-semibold text-white">
                        ₹{service.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Link 
                      href={`/services/${service._id}`}
                      className="px-5 py-2.5 bg-white/5 hover:bg-brand-gold text-white hover:text-brand-dark rounded-xl text-sm font-medium transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-20 text-brand-gray">
            No services found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
