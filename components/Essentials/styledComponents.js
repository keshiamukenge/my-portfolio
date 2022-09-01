import styled from 'vue-styled-components'

import { colors, fonts } from '../../theme'

const footerLinkProps = {
	marginRight: Number,
}

const containerStyle = () => {
	return `
		width: 100vw;
		height: 50px;
		padding: 1rem 50px;
		display: flexx;
		justify-content: space-between;
		position: absolute;
		left: 0;
		right: 0;
		z-index: 999;
	`
}

export const ContainerHeader = styled.header`
	${containerStyle}
	top: 0;
`

export const ContainerFooter = styled.footer`
	${containerStyle}
	bottom: 0;
`

export const HeaderLink = styled.span`
	display: inline-block;
	color: ${colors.white};
	font-family: ${fonts.bodyFont};
	text-transform: uppercase;
`

export const FooterLink = styled('a', footerLinkProps)`
	color: ${colors.white};
	font-family: ${fonts.bodyFont};
	text-transform: uppercase;
	margin-right: ${props => props.marginRight}px;
	font-size: 0.8rem;
`

export const ContainerFooterLinks = styled.div`
	display: flex;
	width: fit-content;
	height: fit-content;
`

export const FooterText = styled.span`
	display: inline-block;
	color: ${colors.white};
	font-family: ${fonts.bodyFont};
	text-transform: uppercase;
	font-size: 0.8rem;
`