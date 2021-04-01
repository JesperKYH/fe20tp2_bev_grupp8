import React, { useEffect, useContext, useState } from 'react';
// import StockCard from '../shared/card/stock-card/StockCard';
import { ContentWrapper } from './HomeElements';
// import Recommendations from '../../api/recommendations/Recommendations';
import Following from '../shared/homepage-custom-sections/FollowingHome';
import RecommendationHome from '../shared/homepage-custom-sections/RecommendationHome';
import PortfolioOverview from '../shared/card/portfolio-overview/PortfolioOverviewCard';
// import Mock from '../../api/Mock/Mock.json';
import MockData from '../../api/Mock/MockData.json';
// import MockGetTickers from '../../api/Mock/MockGetTickers.json';
import News from '../shared/homepage-custom-sections/NewsCardSection';
import MockNewsList from '../../api/Mock/MockNewsList.json';
import { withAuthorization } from '../session'; //must be logged in to see content

//import { useSelector } from 'react-redux';
/* import firebase from 'firebase' */
import { FirebaseContext } from '../firebase/context';
import { setFollowing, setCurrency } from '../../redux/actions';
import { useDispatch } from 'react-redux';

const Home = () => {
    // const stocksList = useSelector((state) => state.RecommendationReducer);
    /*     const following = useSelector((state) => state.Following); */
    const [totalCurrency, setTotalCurrency] = useState(0);
    //const followingCrypto = useSelector((state) => state.FollowingCrypto); //remove?
    // const Currency = useSelector((state) => state.Currency);
    const firebase = useContext(FirebaseContext);
    const [followingArr, setFollowingArr] = useState([]);
    const [followingArrCrypto, setFollowingArrCrypto] = useState([]);
    const dispatch = useDispatch();
    const [didMount, setDidMount] = useState(false);
    // let array = MockGetTickers.finance.result[0].quotes;
    const user = JSON.parse(localStorage.getItem('authUser'));

    const getFollowInfo = (dir, arr) => {
        firebase.user(user.uid).child(dir).once('value', (snapshot) => {
            let data = snapshot.val()
            for (const key in data) {
                arr.push({ ...data[key] });
            }
            return arr;
        })
    }

    useEffect(() => {
        setDidMount(true);
        let followingStocksList = [];
        let followingCryptoList = [];
        let currencyData;
        getFollowInfo('/followingStocks', followingStocksList)
        getFollowInfo('/followingCrypto', followingCryptoList)
        console.log(followingCryptoList)
        setFollowingArr(followingStocksList)
        setFollowingArrCrypto(followingCryptoList)

        firebase.user(user.uid).child('/currency').once('value', (snapshot) => {
            currencyData = snapshot.val();
            if (currencyData == null) {
                return;
            }
            setTotalCurrency(currencyData.currency);
            dispatch(setCurrency(currencyData)); //behöver
        })
        return () => {
            setDidMount(false);
        };
    }, [didMount, dispatch, firebase, user.uid]); //changed!


    return (
        <>
            <ContentWrapper>
                <PortfolioOverview
                    total={totalCurrency.toLocaleString()}
                    difference={0}
                    percent={0}
                />

                <News array={MockNewsList.items.result.slice(0, 1)} />

                <Following array={followingArr} cryptoList={followingArrCrypto} />
                <RecommendationHome MockData={MockData}  />
            </ContentWrapper>
            {/* <Recommendations /> */}
        </>
    );
};

const condition = (authUser) => !!authUser; //if logged in is not true, send user to sign in page

export default withAuthorization(condition)(Home); //check to see if you are signed in
