import React from 'react'

import { BackButtonElement } from './BackButtonElements'

const BackButton = () => {
    const backPrevPage = () => {
        window.history.back();
    }
    return (
        <BackButtonElement onClick={backPrevPage}>
            <i className="fas fa-arrow-left"></i>
        </BackButtonElement>
    )
}

export default BackButton
