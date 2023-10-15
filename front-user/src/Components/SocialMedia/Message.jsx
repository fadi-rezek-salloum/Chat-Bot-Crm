import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Message = ({ message }) => {

const date = new Date(message.created_at);
const heure = date.getHours().toString().padStart(2, "0");
const minute = date.getMinutes().toString().padStart(2, "0");
const time = `${heure}:${minute}`;
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`flex  ${message.from_customer && "flex  flex-row-reverse"}`}
    > 
      
      <div
       className=
       {`flex flex-col justify-center   py-2 px-4
       rounded-xl 
       max-w-[60%]

        ${message.from_customer  ? " text-white  bg-primary" : 'bg-white' }`}>
        <p class="w-full break-words text-left text-sm ">{message.message}</p>
        <p className="text-xs w-full  text-right">{time}</p>
      </div>
    </div>
  );
};

export default Message;