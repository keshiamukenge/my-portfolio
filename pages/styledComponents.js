import styled from 'vue-styled-components'

import { colors, fonts } from '../theme'

const SwitchButtonProps = {
	top: String
}

export const ContainerProjects = styled.div`
	width: 100vw;
	height: 100vh;
	padding: 10% 50px 5% 50px;
	position: relative;
`

export const ContainerProject = styled.div`
	width: 100%;
	height: 100%;
`

export const ImageElement = styled.img`
	width: 30%;
	height: 450px;
	object-fit: cover;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	opacity: 0;
`

export const ProjectTitle = styled.h2`
	width: fit-content;
	text-align: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`

export const SwitchButton = styled('span', SwitchButtonProps)`
	display: block;
	font-family: ${fonts.titleFont};
	font-size: 1.5rem;
	color: ${colors.white};
	position: absolute;
	top: ${props => props.top};
	left: 50%;
	transform: translate(-50%, -50%);

	&:hover {
		cursor: pointer;
	}
`

export const ContainerPagination = styled.div`
	display: flex;
	justify-content: space-between;
	width: fit-content;
	height: fit-content;
	position: absolute;
	top: 70%;
	left: 75%;
	transform: translate(-50%, -50%);
	align-items: center;
`

export const PaginationDivided = styled.span`
	display: block;
	width: 2rem;
	height: 0.5px;
	background-color: ${colors.white};
	margin: 0 1rem;
`

export const Pagination = styled.span`
	display: block;
	font-family: ${fonts.bodyFont};
	font-size: 1rem;
	color: ${colors.white};
	overflow: hidden;
	width: fit-content;
	height: fit-content;
`