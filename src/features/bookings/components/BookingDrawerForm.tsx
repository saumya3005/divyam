import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useCreateBookingAdmin, useUpdateBookingAdmin, BookingType } from "../hooks/useBookings";
import { useGetServices } from "@/features/services/hooks/useServices";
import { toast } from "sonner";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Client Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Mobile Number must be 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  serviceType: z.string().min(1, "Event Type is required"),
  bookingDate: z.string().min(1, "Event Date is required"),
  bookingTime: z.string().optional(),
  address: z.string().min(1, "Venue is required"),
  guests: z.coerce.number().min(1, "Guest Count must be at least 1"),
  serviceId: z.string().min(1, "Package / Service is required"),
  amount: z.coerce.number().min(0, "Total Amount is required"),
  advanceAmount: z.coerce.number().min(0).optional(),
  bookingStatus: z.enum(["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"]),
  paymentStatus: z.enum(["Payment Pending", "Payment Successful", "Refunded"]),
  notes: z.string().optional(),
}).refine(data => (data.advanceAmount || 0) <= data.amount, {
  message: "Advance amount cannot exceed total amount",
  path: ["advanceAmount"]
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const EVENT_TYPES = [
  "Wedding", "Reception", "Birthday", "Corporate", "Engagement", "Haldi", "Anniversary", "Other"
];

interface BookingDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: BookingType | null;
  mode: "create" | "edit" | "view";
}

export function BookingDrawerForm({ isOpen, onClose, booking, mode }: BookingDrawerFormProps) {
  const { data: servicesData } = useGetServices();
  const services = servicesData || [];

  const createMutation = useCreateBookingAdmin();
  const updateMutation = useUpdateBookingAdmin();

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingStatus: "Pending",
      paymentStatus: "Payment Pending",
      bookingTime: "00:00",
      amount: 0,
      advanceAmount: 0,
      guests: 1,
    }
  });

  const amount = watch("amount") || 0;
  const advanceAmount = watch("advanceAmount") || 0;
  const remainingAmount = Math.max(0, amount - advanceAmount);

  useEffect(() => {
    if (isOpen) {
      if (booking && (mode === "edit" || mode === "view")) {
        reset({
          customerName: booking.customerName,
          phone: booking.phone,
          email: booking.email || "",
          serviceType: booking.serviceType,
          bookingDate: booking.bookingDate?.split("T")[0] || "",
          bookingTime: booking.bookingTime || "00:00",
          address: booking.address,
          guests: booking.guests || 1,
          serviceId: typeof booking.serviceId === 'object' ? booking.serviceId?._id : booking.serviceId || "",
          amount: booking.amount || 0,
          advanceAmount: booking.advanceAmount || 0,
          bookingStatus: booking.bookingStatus || "Pending",
          paymentStatus: booking.paymentStatus || "Payment Pending",
          notes: booking.notes || "",
        });
      } else {
        reset({
          customerName: "",
          phone: "",
          email: "",
          serviceType: "",
          bookingDate: "",
          bookingTime: "00:00",
          address: "",
          guests: 1,
          serviceId: "",
          bookingStatus: "Pending",
          paymentStatus: "Payment Pending",
          amount: 0,
          advanceAmount: 0,
          notes: "",
        });
      }
    }
  }, [booking, mode, reset, isOpen]);

  const onSubmit = async (data: BookingFormValues) => {
    if (mode === "view") return;

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Booking Created Successfully");
      } else if (mode === "edit" && booking) {
        await updateMutation.mutateAsync({ id: booking._id, data });
        toast.success("Booking Updated Successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const isReadOnly = mode === "view";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-brand-surface border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-brand-surface">
              <h2 className="text-xl font-semibold text-white">
                {mode === "create" ? "Add New Booking" : mode === "edit" ? "Edit Booking" : "View Booking"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-brand-gray hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
              <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Client Details Section */}
                <section>
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Client Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-gray mb-1">Client Name *</label>
                      <input
                        {...register("customerName")}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                        placeholder="Enter client name"
                      />
                      {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Mobile Number *</label>
                        <input
                          {...register("phone")}
                          disabled={isReadOnly}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                          placeholder="10 digit number"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Email</label>
                        <input
                          {...register("email")}
                          disabled={isReadOnly}
                          type="email"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                          placeholder="client@example.com"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Event Details Section */}
                <section>
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Event Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Event Type *</label>
                        <select
                          {...register("serviceType")}
                          disabled={isReadOnly}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 appearance-none"
                        >
                          <option value="" className="bg-brand-surface">Select Type</option>
                          {EVENT_TYPES.map(type => (
                            <option key={type} value={type} className="bg-brand-surface">{type}</option>
                          ))}
                        </select>
                        {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Event Date *</label>
                        <input
                          {...register("bookingDate")}
                          disabled={isReadOnly}
                          type="date"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 scheme-dark"
                        />
                        {errors.bookingDate && <p className="text-red-400 text-xs mt-1">{errors.bookingDate.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-gray mb-1">Venue *</label>
                      <input
                        {...register("address")}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                        placeholder="Full venue address"
                      />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-gray mb-1">Guest Count *</label>
                      <input
                        {...register("guests")}
                        disabled={isReadOnly}
                        type="number"
                        min="1"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                      />
                      {errors.guests && <p className="text-red-400 text-xs mt-1">{errors.guests.message}</p>}
                    </div>
                  </div>
                </section>

                {/* Booking Details Section */}
                <section>
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Booking Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-gray mb-1">Package / Service *</label>
                      <select
                        {...register("serviceId")}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 appearance-none"
                      >
                        <option value="" className="bg-brand-surface">Select Package</option>
                        {services.map((service: any) => (
                          <option key={service._id} value={service._id} className="bg-brand-surface">{service.title}</option>
                        ))}
                      </select>
                      {errors.serviceId && <p className="text-red-400 text-xs mt-1">{errors.serviceId.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Total Amount *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-brand-gray">₹</span>
                          <input
                            {...register("amount")}
                            disabled={isReadOnly}
                            type="number"
                            min="0"
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                          />
                        </div>
                        {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Advance *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-brand-gray">₹</span>
                          <input
                            {...register("advanceAmount")}
                            disabled={isReadOnly}
                            type="number"
                            min="0"
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                          />
                        </div>
                        {errors.advanceAmount && <p className="text-red-400 text-xs mt-1">{errors.advanceAmount.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Remaining</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-brand-gray">₹</span>
                          <input
                            value={remainingAmount}
                            disabled
                            className="w-full bg-black/40 border border-white/5 rounded-lg pl-8 pr-4 py-2 text-brand-gray cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Booking Status *</label>
                        <select
                          {...register("bookingStatus")}
                          disabled={isReadOnly}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 appearance-none"
                        >
                          <option value="Pending" className="bg-brand-surface text-yellow-400">Pending</option>
                          <option value="Confirmed" className="bg-brand-surface text-green-400">Confirmed</option>
                          <option value="Completed" className="bg-brand-surface text-blue-400">Completed</option>
                          <option value="Cancelled" className="bg-brand-surface text-red-400">Cancelled</option>
                          <option value="Rejected" className="bg-brand-surface text-red-400">Rejected</option>
                        </select>
                        {errors.bookingStatus && <p className="text-red-400 text-xs mt-1">{errors.bookingStatus.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray mb-1">Payment Status *</label>
                        <select
                          {...register("paymentStatus")}
                          disabled={isReadOnly}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 appearance-none"
                        >
                          <option value="Payment Pending" className="bg-brand-surface text-yellow-400">Pending</option>
                          <option value="Payment Successful" className="bg-brand-surface text-green-400">Paid</option>
                          <option value="Refunded" className="bg-brand-surface text-red-400">Refunded</option>
                        </select>
                        {errors.paymentStatus && <p className="text-red-400 text-xs mt-1">{errors.paymentStatus.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-gray mb-1">Notes</label>
                      <textarea
                        {...register("notes")}
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 resize-none"
                        placeholder="Any special requests or details..."
                      />
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 shrink-0 bg-black/20 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              
              {!isReadOnly && (
                <button
                  type="submit"
                  form="booking-form"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {mode === "create" ? "Save Booking" : "Update Booking"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
