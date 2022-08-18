import styled from 'vue-styled-components'

export const MainContainer = styled.main`
	width: 100vw;
	height: 100vh;
	position: relative;
	display: flex;
	flex-direction: column;
`

export const ContainerImage = styled.div`
	width: 100%;
	height: 50%;
`

export const ImageElement = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`

export const ContainerProjectInformations = styled.div`
	width: 100%;
	height: 50%;
	display: flex;
	padding: 0 1rem;
`

export const ProjectTitle = styled.h2`
	width: 40%;
	height: 100%;

	div {
		flex-wrap: wrap;
	}
`

export const ContainerProjectDescription = styled.div`
	display: flex;
	flex-direction: column;
	width: 60%;
	height: 100%;
	padding: 2rem;

	p{
		color: white;
	}
`