import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import Dashboard_Card from "./Dashboard_Card";
import icon_department from "../../Assets/icon_department.svg";
import icon_agent from "../../Assets/icon_agent.svg";
import icon_total from "../../Assets/icon_total.svg";
import Icon_unread from "../../Assets/Icon_unread.svg";

import { ResponsiveLine } from "@nivo/line";

export default function Dashboard() {
  let baseUrl = process.env.REACT_APP_USERS_URL;
  const { authTokens } = useContext(AuthContext);
  let urlGetDashboard = `${baseUrl}dashboard`;
  const [dashboard,setDashboard]=useState([])

  const getDashboard = async () => {
    try {
    
      const response = await axios.get(urlGetDashboard, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
      console.log(response)
      if (response.status === 200) {
        // Sign-up successful
        setDashboard(response.data)
        
        const { monthly_messages } = response.data;
       
        const a = monthly_messages.map(entry => ({
          x: entry.date,
          y: entry.messages_count
        }));
   

        console.log(dataLine)
        setDataLine(a)
    
      }
    } catch (error) {
    
        console.log(error)
    
    
    
      
    }
    
    }



  useEffect(() => {

    getDashboard();
  }, []);
  const [dataLine, setDataLine] = useState([]);

  
  return (
    <div className="py-6 px-10 w-full gap-10   sm:mt-0 mt-24
    justify-center animate-slideup items-center flex flex-col  ">
    
    <div className="w-full flex flex-wrap justify-between items-center gap-3 ">
  <Dashboard_Card
    icon={icon_department}
    title="Departments"
    number={dashboard.departments_number}
  />
  <Dashboard_Card icon={icon_agent} title="Agents" number={dashboard.agents_number} />
  <Dashboard_Card icon={icon_total} title="Total messages" number={dashboard.messages_number} />
  <Dashboard_Card icon={Icon_unread} title="Unread messages" number={dashboard.unread_conversations_number} />
</div>

 <div className="w-[100%] sm:h-[57vh] justify-center items-center flex sm:flex-row flex-col gap-6">
        <div className=" rounded-2xl bg-white  drop-shadow-xl px-4 flex h-full flex-col w-[94%] ">
          <div className=" px-10 flex flex-col justify-start items-start w-full">
            <h1 className=" text-[25px] font-bold text-primary mt-2">
            Messages
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
