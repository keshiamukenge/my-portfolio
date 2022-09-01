import styled from 'vue-styled-components'

import { colors, fonts } from '../../theme'

export const MainContainer = styled.div`
	width: 100vw;
	height: 100vh;
	position: relative;
	background-color: ${colors.black};
	z-index: 99999999;
`

export const ContainerLoader = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: fit-content;
`

export const Content = styled.div`
	width: fit-content
	height: 85px;
	overflow: hidden;
	color: ${colors.white};
	display: flex;
`

export const Numbers = styled.ul`
	height: fit-content;
	width: fit-content
`

export const Number = styled.li`
	font-size: 4rem;
	font-family: ${fonts.titleFont};
	text-align: center;
	margin-bottom: 0.5rem;
`

export const Percent = styled.span`
	font-size: 4rem;
	font-family: ${fonts.titleFont};
`