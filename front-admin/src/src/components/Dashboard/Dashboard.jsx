import React from "react";
// import { ResponsiveAreaBump } from '@nivo/bump'
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { IoPersonOutline } from "react-icons/io5";
import mobile from "../../assets/logo.svg";
import { ResponsiveRadar } from "@nivo/radar";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { ResponsiveBullet } from "@nivo/bullet";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import {BsBoxSeam} from "react-icons/bs"
import Dashboard_Card from "./Dashboard_Card";
import icon_balance from "../../assets/icon_balance.svg";






export default function Dashboard() {
  let baseUrl = process.env.REACT_APP_PAYMENTS_URL;
  const { authTokens } = useContext(AuthContext);
  let urlGetDashboard = `${baseUrl}dashboard`;
  const [dashboard,setDashboard]=useState([])
  const [dataLine, setDataLine] = useState([]);

  const getDashboard = async () => {
    try {
    
      const response = await axios.get(urlGetDashboard, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
      console.log(response.data)
      if (response.status === 200) {
        // Sign-up successful
        setDashboard(response.data.data)
        
        const { monthly_payments } = response.data.data;

        const a = monthly_payments.map(entry => ({
          x: entry.date,
          y: entry.amount
        }));
   

        console.log(a)
        setDataLine(a)
        // Redirect or show success message
      }
    } catch (error) {
    
        console.log(error)
    
    
    
      
    }
    
    }








  useEffect(() => {

    getDashboard();
  }, []);


  return (
    <div className="py-6 px-10 w-full gap-6 justify-center items-center flex flex-col">
    

    <div className="w-full flex flex-wrap justify-between items-center gap-3">
  <Dashboard_Card
    icon={icon_balance}
    title="Balance"
    number= {dashboard.payment_amount}
  />
  <Dashboard_Card icon={icon_balance} title="Total messages" number={dashboard.messages_count} />
  <Dashboard_Card icon={icon_balance} title="Agents" number={dashboard.agents_count} />
  <Dashboard_Card icon={icon_balance} title="Owners" number={dashboard.owners_count} />
</div>


      <div className="w-full sm:h-[57vh] justify-center items-center flex sm:flex-row flex-col gap-6">
        <div className=" rounded-2xl bg-white  drop-shadow-xl px-4 flex h-full flex-col w-[94%] ">
          <div className=" px-10 flex flex-col justify-start items-start w-full">
            <h1 className=" text-[25px] font-bold text-gray-400 mt-2">
            Balance
            </h1>
          </div>
          {dataLine.length > 0 && 
          <ResponsiveLine
            data={[
              {
                id: "Total",
                color: "hsl(69, 70%, 50%)",
                data: dataLine,
              },
            ]}
            margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legendOffset: 36,
              legendPosition: "middle",
            }}
            // axisLeft={{
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     legend: 'count',
            //     legendOffset: -40,
            //     legendPosition: 'middle'
            // }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />}
        </div>
        
      </div>
    </div>
  );
}
