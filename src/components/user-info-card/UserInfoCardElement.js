import styled from "styled-components";

const UserInfoCardElement = styled.div`
	display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 3.5rem;
    background-color: var(--body-secondary);

	img {
		width: 3.5rem;
		height: 3.5rem;
	}

	p {
		margin-top: 1rem;
	}

	.post-card {
		box-sizing: border-box;
		width: 100%;
		max-width: 40rem;
		padding: 1rem;
		background-color: var(--body);
		box-shadow: var(--box-shadow-cards);
		border-radius: 0.25rem;
	}
`;

export default UserInfoCardElement;