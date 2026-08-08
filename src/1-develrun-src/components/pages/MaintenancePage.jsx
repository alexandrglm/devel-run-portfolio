
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import ThreeBackground from '../shaders/ShaderBg'

import ShaderBackground from '../shaders/ShaderBg'




const MaintenancePage = () => {

    const { status } = useSelector(state => state.app)

    const  [ modalAbierto, setModalAbierto ] = useState(false)
    const  [ modalOnegaiAbierto, setOnegaiModalAbierto ] = useState(false)


    const openModal = () =>{

        setModalAbierto(true)

    }
    const closeModal = () =>{

        setModalAbierto(false)

    }
    const openOnegaiModal = () =>{

        setOnegaiModalAbierto(true)

    }
    const closeOnegaiModal = () =>{

        setOnegaiModalAbierto(false)

    }

    return (

        <div className="maintenance-page">
            <ShaderBackground />

            <div className="maintenance-content">
                <div className="maintenance-header">
                
                    <h1>!Server Under Maintenance</h1>
                    <p style={{ WebkitTextStroke: "1px black" }}>{status.message}</p>


                    <div className="status-info">
                
                    
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default MaintenancePage
