import React from 'react'
import BackButton from '../shared/button/back-button/BackButton'
import {ContentWrapper} from './PageNotFoundElements'

const error = () => {
    return (
        <ContentWrapper>
            <BackButton />
            <div>
            <h1>Ooops, something went wrong... Sorry. This page probably does not exist! Soooo.. How are you today?</h1>
            <h3>(404 error)</h3>
            </div>

        </ContentWrapper>
    )
}

export default error
