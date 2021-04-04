import styled from 'styled-components';

export const MainWrapper = styled.main`
    flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;

    & > section {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--box-shadow-cards);
        background: var(--body);
    }

    .wallet-wrapper {
        padding: 0.5rem 0.375rem 0.5rem 0.1rem;
        border: 0.09375rem solid #c8c8c8;
        border-radius: 0.25rem;
        color: #383838;
        font-family: inherit;
        font-size: 0.9125rem;
        font-weight: 500;
        text-indent: 0.375rem;
    }

    .brokage-wrapper {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.1rem;
        border-bottom: dashed 1px #c8c8c8;
    }

    .stock-overview-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        height: 120px;
    }

    h2 {
        margin: 0;
    }

    .buttonWrapper {
        /*    border: 1px solid black; */
        /*        height: 8%; */
        width: 100%;
        display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
        justify-content: space-around;
    }

    .amountWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 8px;

        span:nth-child(2) {
            font-weight: bold;
            font-size: 1.6rem;
            transition: all 0.6s linear;
        }
    }
`;
