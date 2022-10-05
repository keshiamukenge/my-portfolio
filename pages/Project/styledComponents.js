import styled from 'vue-styled-components'

import { colors, fonts } from '../../theme'

export const PageContainer = styled.div`
  width: 100%;
  min-width: 100vw;
  min-height: 100vh;
  height: fit-content;
  padding-top: 72vh;
  opacity: 0;
`

export const MainContainer = styled.div`
	width: 100vw;
	height: auto;
	display: flex;
	flex-direction: column;
	background-color: ${colors.black};
	z-index: 2;
	position: relative;
`

export const ContainerImage = styled.div`
  width: 100%;
  height: 50%;
`

export const ImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
`

export const ContainerImageWebsite = styled.div`
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
  margin: 3rem 2rem 0 0;
  padding: 0 4rem;
`

export const ContainerProjectInformationsContent = styled.div`
  width: 100%;
  height: fit-content;
  margin-bottom: 10rem;
`

export const ContainerProjectInformationsSection = styled.div`
  width: 100%;
  height: auto;
  padding: 4rem 15rem;
`

export const ContainerProjectInformations = styled.div`
  width: 80%;
  height: fit-content;
  margin-bottom: 3rem;
  padding: 0 4rem;
`

export const ProjectTitle = styled.h2`
  width: fit-content;
  height: fit-content;
`

export const ContainerProjectDescription = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;

  p {
    color: white;
  }
`

export const Subtitle = styled.h3`
  height: fit-content;
  margin-bottom: 0.3rem;

  div {
    div {
      padding: 0 !important;
    }
  }
`

export const SpanElement = styled.span`
  display: block;
  font-family: ${fonts.bodyFont};
  text-transform: uppercase;
  font-size: 0.8rem;
  color: ${colors.white};
  margin-bottom: 0.3rem;

  div {
    padding: 0 !important;

    div {
      padding: 0 !important;
    }
  }
`

export const Informations = styled.p`
  width: 100%;
`

export const ContainerSpanElement = styled.div`
  width: fit-content;
  height: fit-content;
  padding-top: 1rem;
`

export const ContainerProjectInformationsIntroduction = styled.div`
  width: 100%;
  margin-bottom: 4rem;
`
