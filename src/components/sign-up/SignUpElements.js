import styled from 'styled-components';

export const ContentWrapper = styled.div`
    .side-by-side {
		position: relative;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        user-select: none;

        .checkbox {
            appearance: none;
            position: absolute;
			padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
			border: none;
        }

        .checkbox:checked ~ svg > rect {
            fill: var(--clr-primary);
        }

        .checkbox:checked ~ svg > path {
            stroke-dashoffset: 0;
        }

        svg {
            width: 1.5rem;
            height: 1.5rem;

            rect {
                fill: transparent;
                stroke: var(--clr-primary);
                transition: fill 75ms linear;
            }

            path {
                stroke: var(--clr-almost-white);
                stroke-dasharray: 20;
                stroke-dashoffset: 20;
                transition: stroke-dashoffset 150ms linear;
            }
        }
    }

    .logo-lets {
        margin-top: 25px;
        width: 550px;

        @media screen and (max-width: 768px){
            width: 450px;
            height: 120px;
        }
        @media screen and (max-width: 460px){
            width: 280px;
            min-height: 65px;
        }

    }

    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 0.5rem;

    h1 {
        color: var(--primary);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
        max-width: 24rem;

        label {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            color: #383838;
            font-family: inherit;
            font-size: 0.8125rem;
            font-weight: 600;

            input {
                padding: 0.5rem 0.375rem 0.5rem 0;
                border: 0.09375rem solid #c8c8c8;
                border-radius: 0.25rem;
                outline: none;
                background: none;
                color: #383838;
                font-family: inherit;
                font-size: 0.8125rem;
                font-weight: 500;
                text-indent: 0.375rem;
                transition: border-color 125ms linear, box-shadow 125ms linear;

                &:hover {
                    border-color: var(--third);
                }

                &:focus {
                    border-color: var(--third);
                    box-shadow: 0 0 0 0.1875rem #ddeafd;
                }

                &:invalid {
                    border-color: #e68e8e;
                    box-shadow: 0 0 0 0.1875rem #fddddd;
                }

                &:invalid:not(:focus) {
                    border-color: #e68e8e;
                    box-shadow: none;
                }
            }
        }

        .label-part-of-org {
            color: ${props => props.partOfOrg ? '#383838' : 'grey'};
            transition: color 1s linear;
        }

        .part-of-org-wrapper {

            &:hover {
                border: ${props => props.partOfOrg ? '0.09375rem solid  #58D7AC' : '0.09375rem solid #c8c8c8'};
            }
            padding: 0.5rem 0.375rem 0.5rem 0;

            border-radius: 0.25rem;
            min-height: 16px;
            text-indent: ${props => props.partOfOrg ? '0.375rem' : '-10rem'};
            overflow: hidden;

            transition: all 1s ease-in-out;


            border: ${props => props.partOfOrg ? '0.09375rem solid  #58D7AC' : '0.09375rem solid #c8c8c8'};
            box-shadow: ${props => props.partOfOrg ? '0 0 0 0.1875rem  rgba(88, 215, 172, 0.2)' : 'none'};

        }

        button {
            padding: 0.5rem 0.75rem;
            border: none;
            border-radius: 0.25rem;
            outline: none;
            background-color: var(--primary);
            color: var(--body);
            font-family: inherit;
            font-size: 0.8125rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 125ms linear, box-shadow 125ms linear;

            &:hover {
                background-color: var(--primary-dark);
            }

            &:focus {
                box-shadow: 0 0 0 0.1875rem var(--third);
            }

            &:disabled {
                background-color: grey;
                cursor: initial;
            }
        }

        p {
            font-size: 0.8125rem;
            font-weight: 500;
            text-align: center;

            a {
                padding: 0.1875rem;
                border-radius: 0.25rem;
                outline: none;
                color: var(--primary);
                text-decoration: none;
                transition: box-shadow 125ms linear;

                &:hover {
                    text-decoration: underline;
                }

                &:focus {
                    box-shadow: 0 0 0 0.1875rem var(--third);
                }
            }
        }

        .error-message {
            padding: 0.625rem;
            border-left: 0.1875rem solid coral;
            /* border-radius: 0.25rem; */
            background-color: #ffd3c4;
            font-weight: 500;
        }
    }
`;
