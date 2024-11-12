import React from 'react'
import { ClipLoader } from "react-spinners";


export const Loading = ({tipo}) => {
    console.log(tipo)
        if(tipo=="tab"){
        return (
            <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                <ClipLoader color={"#123abc"} loading={true} size={80} />
            </div>
            </>
        );
        } 
        if(tipo=="all"){
            return (
                <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <ClipLoader color={"#123abc"} loading={true} size={100} />
                </div>
                </>
            );
        }  
        if(tipo=="Ticket"){
            return (
                <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
                <ClipLoader color={"#123abc"} loading={true} size={50} />
                </div>
                </>
            );
        }  
    
}
