import React from "react";
import { Outlet } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WebsiteLayout() {
  return (
    <>
      <Header />

      <main className="min-h-[80vh]">
        <Outlet />
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919100015419"
        target="_blank"
        rel="noreferrer"
        className="
          fixed
          bottom-5
          right-5
          z-50
          flex
          items-center
          justify-center
          w-14
          h-14
          rounded-full
          bg-green-500
          text-white
          shadow-sm
          hover:shadow-green-600
          hover:bg-green-600
          transition
        "
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>

      <Footer />
    </>
  );
}
