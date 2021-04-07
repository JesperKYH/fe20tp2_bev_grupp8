import React from 'react';
import StockCard from '../card/stock-card/StockCard';
import { ContentWrapper } from './CustomComponentsElements';
import SectionDataIndicator from '../card/section-data-indicator/SectionDataIndicator';

const RecommendationHome = ({ MockData }) => {
    let LabelsArr = ['symbol', 'price', 'change 24h'];
    return (
        <>
            <ContentWrapper>
                <h3>Recommendations</h3>
                <SectionDataIndicator LabelsArr={LabelsArr} />
                {MockData.finance.result[0].quotes.map((item, index) => {
                    return (
                        <StockCard
                            stocksList={MockData.finance.result[0].quotes}
                            key={index}
                            name={item.symbol}
                            cost={item.regularMarketPrice}
                            percent={item.regularMarketChangePercent}
                        />
                    );
                })}
            </ContentWrapper>
        </>
    );
};

export default RecommendationHome;