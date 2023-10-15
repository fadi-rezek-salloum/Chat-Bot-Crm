import React,{useEffect,createContext,useContext,useState} from "react";



const StateContext = createContext();

export const ContextProvider = ({children})=>{
    const [activeMenu,setActiveMenu] = useState(false);
   
    const [activeMenuMobile,setActiveMenuMobile] = useState(false);

    const [screenSize,setScreenSize] = useState(undefined)



    const [departments, setDepartments] = useState([]);
    const [openconversation, setOpenconversation] = useState("0");

    
    return (<StateContext.Provider 
    value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        departments,
        setDepartments, 
        activeMenuMobile,
        setActiveMenuMobile
        }} >
        {children}

    </StateContext.Provider>)
}

export const useStateContext = () => useContext(StateContext);