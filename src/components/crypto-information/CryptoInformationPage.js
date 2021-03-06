import React, { useState, useEffect, useContext, useCallback } from 'react';
// import LineChart from '../charts/InfopageLinechart';
import axios from 'axios';
//import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CryptoChart from './crypto-chart/CryptoChart';

//import { setFollowingCrypto } from '../../redux/actions'; //remove?
//import { useDispatch } from 'react-redux'; //remove?
import ContentWrapper from '../shared/wrappers/ContentWrapper';
import {
    MainWrapper,
    DescriptionWrapper,
} from './CryptoInformationPageElements';
import { FirebaseContext } from '../firebase/context';
//import { WatchStockButton } from '../stock-infomation/StockInfromationElements' //remove?

//let following = []; // remove?

const CryptoInformationPage = ({ symbol }) => {
    const [checked, setChecked] = useState(false); //remove?
    //const dispatch = useDispatch();//remove?
    //const chosenCrypto = useSelector((state) => state.ChosenCrypto);//remove?
    //const followingArr = useSelector((state) => state.FollowingCrypto); //remove?
    const [cryptoData, setCryptoData] = useState({});
    //const [cryptoIncludes, setCryptoIncludes] = useState(false)//remove?

    const [descClicked, setDescClicked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [didMount, setDidMount] = useState(false);
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('authUser'));

    const firebase = useContext(FirebaseContext);
    //let itIncludes = false; //remove?
    // https://api.coingecko.com/api/v3/coins/bitcoin?localization=true&tickers=true&market_data=true&developer_data=true&sparkline=true

    useEffect(() => {
        setDidMount(true);
        (async () => {
            await axios
                .get(
                    `https://api.coingecko.com/api/v3/coins/${id.toLowerCase().trim()}?localization=true&tickers=true&market_data=true&developer_data=true&sparkline=true`
                )
                .then((response) => {
                    setCryptoData(response.data);
                    setLoading(false);
                    checkIfFollowed(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        })();

        return () => {
            setDidMount(false);
        };
    }, [didMount, id]);
    //, checkIfFollowed, id  //changed! checkedIfFollowed loop it forever

    const checkIfFollowed = useCallback(
        (cryptoList) => {
            if (!cryptoData) return;
            let cryptos = [];
            firebase
                .user(user.uid)
                .child('/followingCrypto')
                .once('value', (snapshot) => {
                    const data = snapshot.val();
                    console.log('Crypto name is: ', cryptoList.name);
                    for (const key in data) {
                        cryptos.push({ ...data[key] });
                    }
                    for (let i = 0; i < cryptos.length; i++) {
                        if (cryptos[i].name == cryptoList.name) {
                            setChecked(true);
                            return;
                        } else {
                            console.log('It does not include');
                            setChecked(false);
                        }
                    }
                });
        },
        [checked, cryptoData, firebase, user.uid]
    );
    //checked, cryptoData, firebase, user.uid

    const onFollow = () => {
        checkIfFollowed(cryptoData);
        console.log(checked);

        if (checked == true) {
            console.log('Hit kommer vi');
            console.log(cryptoData.id)
            firebase
                .user(user.uid)
                .child(`/followingCrypto/${cryptoData.name}`)
                .remove();
            if (user.organization) {
                firebase
                    .organization(user.organization)
                    .child(
                        `/users/${user.uid}/followingCrypto/${cryptoData.name}`
                    )
                    .remove();
            }
        } else {
            firebase
                .user(user.uid)
                .child('/followingCrypto')
                .update({
                    [cryptoData.name]: {
                        symbol: cryptoData.symbol,
                        regularMarketPrice: cryptoData.market_data.current_price
                            .usd
                            ? cryptoData.market_data.current_price.usd.toLocaleString()
                            : '20',
                        regularMarketChangePercent: cryptoData.market_data.price_change_percentage_24h.toFixed(
                            2
                        ),
                        id: cryptoData.id,
                        name: cryptoData.name,
                        image: cryptoData.image.small,
                    },
                });

            if (user.organization) {
                firebase
                    .organization(user.organization)
                    .child(`/users/${user.uid}/followingCrypto`)
                    .update({
                        [cryptoData.name]: {
                            symbol: cryptoData.symbol,
                            regularMarketPrice: cryptoData.market_data
                                .current_price.usd
                                ? cryptoData.market_data.current_price.usd.toLocaleString()
                                : '20',
                            regularMarketChangePercent: cryptoData.market_data.price_change_percentage_24h.toFixed(
                                2
                            ),
                            name: cryptoData.name,
                            image: cryptoData.image.small,
                        },
                    });
            }
        }
        setChecked(!checked);
    };

    const onChange = () => {
        setChecked((prevState) => !prevState); //changed!
    };

    function createMarkup() {
        return { __html: cryptoData.description.en };
    }

    return (
        <ContentWrapper>
            {loading ? (
                <p>Loading...</p>
            ) : (
            <MainWrapper>
                <CryptoChart
                    id={cryptoData ? cryptoData.id : 'bitcoin'}
                    img={cryptoData ? cryptoData.image.large : ''}
                    name={cryptoData ? cryptoData.name : ''}
                    onFollow={onFollow}
                    onChange={onChange}
                    checked={checked}
                    symbol={cryptoData.symbol}
                />
                <div className="information-wrapper">
                    <p>
                        Current Price:{' '}
                        {cryptoData.market_data.current_price.usd
                        ? cryptoData.market_data.current_price.usd.toLocaleString()
                        : ''}
                        $
                    </p>

                    <p>
                        {' '}
                        Total Volume:{' '}
                        {cryptoData.market_data.total_volume.usd
                        ? cryptoData.market_data.total_volume.usd.toLocaleString()
                        : ''}{' '}
                    </p>

                    <p>
                    {' '}
                        Price Change 24h:{' '}
                        {cryptoData.market_data.price_change_percentage_24h.toFixed(
                        2
                        )}
                        %{' '}
                    </p>

                    <p>
                        {' '}
                        Total Supply:{' '}
                        {cryptoData.market_data.total_supply
                        ? cryptoData.market_data.total_supply.toLocaleString()
                        : 0}
                    </p>

                    <p>
                        {' '}
                        Market Cap Rank:{' '}
                        {cryptoData.market_data.market_cap_rank}
                    </p>

                    <h2>About {cryptoData.name}</h2>
                    <DescriptionWrapper
                        onClick={() => setDescClicked(!descClicked)}
                        descClicked={descClicked}
                        dangerouslySetInnerHTML={createMarkup()}
                    ></DescriptionWrapper>
                </div>
            </MainWrapper>
            )}
        </ContentWrapper>
    );
};

export default CryptoInformationPage;
