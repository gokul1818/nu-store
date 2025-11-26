import { useEffect, useState } from "react";
import { BiSolidOffer } from "react-icons/bi";
import { GiDress } from "react-icons/gi";
import { IoBagCheckOutline, IoCartOutline } from "react-icons/io5";
import { LiaTshirtSolid } from "react-icons/lia";
import Nueloot from "../assets/Nueloot.png";

export default function AppLoader() {
  const icons = [
    <LiaTshirtSolid size={40} />,
    <GiDress size={40} />,
    <BiSolidOffer size={40} />,
    <IoCartOutline size={40} />,
    <IoBagCheckOutline size={40} />,
  ];
  const texts = ["Nueloot"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-4xl animate-bounce text-primary">{icons[index]}</div>
      <div className="flex space-x-2 text-2xl">
        <img src={Nueloot} alt="Logo" className="h-12 w-auto" />
      </div>
    </div>
  );
}
