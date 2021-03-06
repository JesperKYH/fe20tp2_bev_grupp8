import React,{ useEffect, useContext, useState } from 'react'
import { useSelector } from 'react-redux'

import SectionDataIndicator from '../../shared/card/section-data-indicator/SectionDataIndicator'
import StockCardSmall from '../../shared/card/stock-card-small/StockCardSmall';
import { ContentWrapper } from '../comp-hottest-stocks/CompHottestStocksElements';

import {
    fetchUsersOrgSnapshotArray
} from '../../shared/functions/firebase-functions';

import { FirebaseContext } from '../../firebase/context';
import FetchUserStocks from '../../../api/user-api-components/FetchUserStocks';


const CompRecentlyBoughtStock = () => {
    const user = JSON.parse(localStorage.getItem('authUser'));
    const firebase = useContext(FirebaseContext);
    const [stockData, setStockData] = useState(null);
    const FetchedStockList = useSelector(state => state.FetchedStockList)

    let LabelsArr = [<i className="fas fa-globe"></i>, 'name', '$', '% 24h ▾', <i className="fas fa-info"></i>];

    useEffect(() => {
        fetchUsersOrgSnapshotArray(firebase, user.organization, '/recentlyBought', setStockData)
    }, [])

    const findIndex = (item) => {
        let index = FetchedStockList[FetchedStockList.findIndex(x => x.symbol == item.symbol)]
        return index
    }
    return (
        <>
        <ContentWrapper>
            {!stockData ||!FetchedStockList.length > 0 ? null : (
                <>
                    <div>
                        <h4>
                            Recently bought
                        </h4>
                        <SectionDataIndicator LabelsArr={LabelsArr} />
                        {stockData.map((item, i) => {
                            return (
                                <StockCardSmall
                                    key={i}
                                    i={i}
                                    name={findIndex(item).symbol}
                                    shortname={findIndex(item).shortName}
                                    cost={findIndex(item).regularMarketPrice}
                                    percent={findIndex(item).regularMarketChangePercent}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </ContentWrapper>
        </>
    )
}

export default CompRecentlyBoughtStock
