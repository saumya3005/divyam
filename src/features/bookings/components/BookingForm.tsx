"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBooking, useCreateOrder, useVerifyPayment } from "../hooks/useBookings";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const bookingSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  serviceType: z.string().min(1, "Service type is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
  guests: z.number().min(1, "Must have at least 1 guest"),
  address: z.string().min(5, "Address is required"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({ 
  onClose,
  prefilledService 
}: { 
  onClose: () => void;
  prefilledService?: { _id: string; title: string; price: number };
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 1,
      serviceType: prefilledService?.title || "",
    }
  });

  const createBooking = useCreateBooking();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const onSubmit = async (data: BookingFormValues) => {
    try {
      // 1. Create Booking
      const amount = prefilledService?.price || 5000; 
      const booking = await createBooking.mutateAsync({
        ...data,
        amount,
        serviceId: prefilledService?._id,
      });

      // 2. Create Payment Order
      const orderData = await createOrder.mutateAsync({ amount, bookingId: booking._id });

      // 3. Load Razorpay SDK dynamically
      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadScript();

      if (!res || !window.Razorpay) {
        // Graceful fallback to mock payment
        toast.error("Razorpay SDK failed to load. Falling back to Mock Payment...");
        await verifyPayment.mutateAsync({
          bookingId: booking._id,
          mock: true
        });
        toast.success("Booking created and mock payment successful!");
        onClose();
        return;
      }

      // 4. Open Razorpay Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkey", 
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Divyam Events",
        description: `Booking for ${data.serviceType}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });
            toast.success("Payment successful!");
            onClose();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: data.customerName,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: "#F5D061" // brand-gold
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-surface border border-white/5 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Create New Booking</h2>
          <button onClick={onClose} className="text-brand-gray hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Customer Name</label>
                <input 
                  {...register("customerName")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Email</label>
                <input 
                  type="email"
                  {...register("email")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Phone Number</label>
                <input 
                  {...register("phone")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Service Type</label>
                {prefilledService ? (
                  <input 
                    readOnly
                    {...register("serviceType")}
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-white/70 cursor-not-allowed"
                  />
                ) : (
                  <select 
                    {...register("serviceType")}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                  >
                    <option value="">Select Service</option>
                    <option value="Conference">Conference</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Party">Party</option>
                  </select>
                )}
                {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Booking Date</label>
                <input 
                  type="date"
                  {...register("bookingDate")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.bookingDate && <p className="text-red-400 text-xs mt-1">{errors.bookingDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Booking Time</label>
                <input 
                  type="time"
                  {...register("bookingTime")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.bookingTime && <p className="text-red-400 text-xs mt-1">{errors.bookingTime.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Number of Guests</label>
                <input 
                  type="number"
                  {...register("guests", { valueAsNumber: true })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.guests && <p className="text-red-400 text-xs mt-1">{errors.guests.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-1">Address</label>
                <input 
                  {...register("address")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-gray mb-1">Special Requirements (Notes)</label>
              <textarea 
                {...register("notes")}
                rows={3}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/20">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-sm text-brand-gray hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="booking-form"
            disabled={createBooking.isPending || createOrder.isPending || verifyPayment.isPending}
            className="bg-brand-gold text-brand-dark px-6 py-2 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {(createBooking.isPending || createOrder.isPending || verifyPayment.isPending) && <Loader2 size={16} className="animate-spin" />}
            Confirm & Pay ₹{prefilledService ? prefilledService.price.toLocaleString("en-IN") : "5,000"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
