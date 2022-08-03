import styled from 'styled-components'
import colors from '../../config/colors'

export const CtaButton = styled.button`
	background: ${colors.orange};
	color: ${colors.darkgray};
	padding: 0.5em 1em;
	font-weight: bold;
	font-size:1rem;
	outline:none;
	border-radius:.25em;
	margin: 1em;
	transition: 250ms box-shadow;
	border:3px solid rgba(0,0,0,0);
	/* box-shadow: 0px 0px 4px rgba(0, 0, 0, 0); */
	cursor: pointer;
	transform:translateY(-1px);
	&:hover {
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
	}
	&:focus, &:active {
		border: 3px solid lightblue;
	}
	.icon {
		font-size:2rem;
		line-height:0;
		display:inline-block;
		transform:translateY(.125em);
	}
`

export const CtaLink = styled.a`
	background: ${colors.orange};
	color: ${colors.darkgray};
	padding: 0.5em 1em;
	border-radius: 0.25em;
	font-weight: bold;
	margin: 2em 0;
	display: inline-block;
	transition: 250ms box-shadow;
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0);
	border:3px solid rgba(0,0,0,0);
	&:hover {
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
	}
`

export const QuietCtaLink = styled(CtaLink)`
	background: none;
	color: ${colors.skyblue};
	border: 1px solid ${colors.skyblue};
`
