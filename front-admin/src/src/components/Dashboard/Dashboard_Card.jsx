import React from 'react'
import icon_balance from "../../assets/icon_balance.svg";

const Dashboard_Card = ({ icon, title, number }) => {
    return (
      <div className="rounded-2xl w-[48%] sm:w-[48%] md:w-[32%] lg:w-[24%] bg-white shadow-lg flex flex-col sm:flex-row sm:items-center p-5 py-6 gap-4">
      <img src={icon} alt="" />
      <div className="flex flex-col">
        <p className="text-base text-gray_color">{title}</p>
        <p className="text-3xl text-primary font-medium">{number}</p>
      </div>
    </div>
    );
  };

export default Dashboard_Card