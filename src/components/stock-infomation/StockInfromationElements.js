import styled from "styled-components"

export const ContentWrapper = styled.div`
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: var --body;

    h1 {
        text-align: center;
        margin: 8px;
    }

    p {
        border: 2px solid var(--primary);
        border-radius: 4px;
        padding: 16px;
        margin: 8px;
        font-size: 1.2rem;
        height: 0;
        display: flex;
        align-items: center;
        
    }
`