import React, { useState, useEffect, useContext } from 'react';
// import LineChart from '../charts/InfopageLinechart';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

import { setFollowingCrypto } from '../../redux/actions';
import { useDispatch } from 'react-redux';

import { ContentWrapper } from './CryptoInformationPageElements';
import { FirebaseContext } from '../firebase/context'

let following = [];

const CryptoInformationPage = () => {
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch();
    const chosenCrypto = useSelector((state) => state.ChosenCrypto);
    const followingArr = useSelector((state) => state.FollowingCrypto);

    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        if (followingArr.includes(chosenCrypto[0])) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, []);

    const user = JSON.parse(localStorage.getItem('authUser'))

    const updateUser = (userId) => {
        firebase.db.ref('users/' + userId + "/followingStocks").set({
            followingArr
        });
    }

    const onFollow = () => {
        if (followingArr.includes(chosenCrypto[0])) {
            let name = chosenCrypto[0].symbol;
            setChecked(false);
            let index = followingArr.findIndex((x) => x.symbol === name);
            followingArr.splice(index, 1);
            dispatch(setFollowingCrypto(followingArr));
            updateUser(user.uid)
        } else {
            following.push(chosenCrypto[0]);
            dispatch(setFollowingCrypto(following));
            setChecked(true);
            updateUser(user.uid)
        }
    };
    const onChange = (e) => {
        setChecked(!checked);
    };

    return (
        <ContentWrapper>
            {chosenCrypto.map((item, index) => {
                return (
                    <div key={index}>
                        <h1>{item.name}</h1>
                        <div className="imgWrapper">
                            <img src={item.image} alt='logo of the crypto'/>
                        </div>
                        <div className="followWrapper">
                        <label> FOLLOW {/* <span>FOLLOW</span> */}</label>
                        <input
                                type="checkbox"
                                onClick={onFollow}
                                checked={checked}
                                onChange={onChange}
                            />
                        </div>
                        <p>Current Price: {item.current_price}$</p>
                        <p>
                            Total Volume: {item.total_volume.toLocaleString()}
                        </p>
                        <p>
                            Price Change 24h:{' '}
                            {item.price_change_percentage_24h.toFixed(2)}%
                        </p>
                        <p>
                            Total Supply:{' '}
                            {item.total_supply
                                ? item.total_supply.toLocaleString()
                                : 0}
                        </p>
                        <p>Market Cap Rank: {item.market_cap_rank}</p>
                    </div>
                );
            })}
        </ContentWrapper>
    );
};

export default CryptoInformationPage;
