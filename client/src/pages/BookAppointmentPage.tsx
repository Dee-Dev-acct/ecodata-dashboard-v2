import BookAppointment from "@/components/BookAppointment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookAppointmentPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <BookAppointment />
      </div>
      <Footer />
    </>
  );
}