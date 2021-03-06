import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import LineChart from '../charts/InfopageLinechart';
import 'firebase/database';
import { FirebaseContext } from '../firebase/context';
import BackButton from '../shared/button/back-button/BackButton';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../shared/wrappers/ContentWrapper';
import {
    MainWrapper,
    WatchStockButton,
    TradeBtns,
} from './StockInfromationElements';

const StockInformationPage = () => {
    const [checked, setChecked] = useState(false);

    const [stockData, setStockData] = useState({});
    const [loading, setLoading] = useState(true);
    const [didMount, setDidMount] = useState(false);
    const [stockIncludes, setStockIncludes] = useState(false);

    const firebase = useContext(FirebaseContext);
    const { id } = useParams();

    const user = JSON.parse(localStorage.getItem('authUser'));

    const checkIfFollowed = useCallback(() => {
        let stocks = [];
        firebase
            .user(user.uid)
            .child('/followingStocks')
            .once('value', (snapshot) => {
                const data = snapshot.val();

                for (const key in data) {
                    stocks.push({ ...data[key] });
                }
                //*Vi kör bara 'test' i DB
                stocks.forEach((item) => {
                    if (item.symbol === id) {
                        setStockIncludes(true);
                        setChecked(true);
                        return;
                    } else {
                        setStockIncludes(false);
                        setChecked(false);
                    }
                });
            });
    }, [firebase, user.uid]);

    useEffect(() => {
        setDidMount(true);
        checkIfFollowed();

        const options = {
            method: 'GET',
            url:
                'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary',
            params: { symbol: id, region: 'US' },
            headers: {
                'x-rapidapi-key':
                    '70d9b752c8mshe5814dbaa3e86c2p180291jsn0d7793015c2f',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            },
        };

        (async () => {
            await axios
                .request(options)
                .then((response) => {
                    console.log(response.data);
                    setStockData(response.data);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.error(error);
                });
        })();

        return () => {
            setDidMount(false);
        };
    }, [didMount, user.uid, firebase, checkIfFollowed]);

    //*When you follow a stock
    const onFollow = () => {
        checkIfFollowed();

        if (stockIncludes === true) {
            firebase.user(user.uid).child(`/followingStocks/${id}`).remove();
            if (user.organization) {
                firebase
                    .organization(user.organization)
                    .child(`/users/${user.uid}/followingStocks/${id}`)
                    .remove();
                setChecked(false);
            }
        } else {
            firebase
                .user(user.uid)
                .child('/followingStocks')
                .update({
                    [id]: {
                        symbol: id,
                        regularMarketPrice:
                            stockData.financialData.currentPrice,
                        regularMarketChangePercent:
                            stockData.price.regularMarketChangePercent.fmt,
                        shortName: stockData.quoteType.shortName,
                    },
                });
            if (user.organization) {
                firebase
                    .organization(user.organization)
                    .child(`/users/${user.uid}/followingStocks`)
                    .update({
                        [id]: {
                            symbol: id,
                            regularMarketPrice:
                                stockData.financialData.currentPrice,
                            regularMarketChangePercent:
                                stockData.price.regularMarketChangePercent.fmt,
                            shortName: stockData.quoteType.shortName,
                        },
                    });
            }

            setChecked(true);
        }
    };

    const onChange = () => setChecked(!checked);

    return (
        <ContentWrapper>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <MainWrapper>
                    <div className="demo-wrapper">

                    <BackButton />
                            <h1>
                                {stockData.quoteType.shortName
                                    ? stockData.quoteType.shortName
                                    : stockData.quoteType.longName}
                            </h1>
                            <div className="chart-container">
                                <div className="chart-topbar-wrapper">
                                    <TradeBtns to={`/trade/${stockData.symbol}`}>
                                        TRADE
                                    </TradeBtns>
                                    <WatchStockButton
                                        title={checked ? 'Remove from watchlist' : 'Add to watchlist' }
                                            eyecolor={
                                                checked
                                                    ? 'var(--clr-primary)'
                                                    : 'var(--body-fourth)'
                                            }
                                            onClick={onFollow}
                                            onChange={onChange}
                                        >
                                        <i className="far fa-eye"></i>
                                    </WatchStockButton>
                                </div>
                                <div className="chart-wrapper">
                                <LineChart />
                                </div>
                            </div>
                            <div className="info-container">
                                <p>{stockData.symbol}</p>
                                <p>
                                    {/* Det fanns ingen .fmt i slutet */}
                                    {/*  Market price: {stockData.financialData.currentPrice.fmt} */}
                                    Market price: {stockData.price.regularMarketPrice.raw}$
                                </p>
                                {/* <p>
                                    Reg market change:{' '}
                                    {item.regularMarketChange
                                        ? item.regularMarketChange.toFixed(2)
                                        : 200}
                                    %
                                </p> */}
                                <p>
                                    Market change percent:
                                    {stockData.price.regularMarketChangePercent.raw
                                        ? stockData.price.regularMarketChangePercent
                                            .fmt
                                        : 2}
                                </p>
                                <article>
                                    <input type="checkbox" id="expanded"/>
                                    <label htmlFor="expanded" role="button">
                                        <p>
                                            {stockData.summaryProfile.longBusinessSummary}
                                        </p>
                                    </label>
                                </article>
                            </div>
                        </div>
                </MainWrapper>
            )}
        </ContentWrapper>
    );
};

export default StockInformationPage;
