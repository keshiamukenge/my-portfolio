import styled from 'vue-styled-components'

import { colors, fonts } from '../../theme'

const windowHeight = window.innerHeight + window.innerHeight * 0.73

export const PageContainer = styled.main`
  width: 100%;
  height: auto;
  min-width: 100vw;
  min-height: 100vh;
  margin: auto;
  position: fixed;
`

export const MainContainer = styled.main`
	width: 100vw;
	height: ${windowHeight}px};
	margin-top: 100vh;
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

  &:hover {
    cursor: pointer;
  }
`

export const ContainerImageWebsite = styled.div`
  width: 70%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem 2rem 0 0;
  position: relative;
`

export const ImageWebsiteLink = styled.a`
  width: 100%;
  height: 100%;
`

export const ViewSiteText = styled.span`
  font-family: ${fonts.bodyFont};
  text-transform: uppercase;
  display: block;
  font-size: 1rem;
  color: ${colors.white};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  z-index: 9;

  div {
    margin: auto;
    padding: 0;

    .containerCharacter1 {
      min-width: 9px !important;
    }
  }
`

export const ContainerProjectInformationsContent = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
`

export const ContainerProjectInformationsSection = styled.div`
  width: 100%;
  height: 100%;
  padding: 4rem 50px 2rem 20px;
`

export const ContainerProjectInformations = styled.div`
  width: 80%;
  height: fit-content;
  margin-bottom: 2rem;
`

export const ProjectTitle = styled.h2`
  width: fit-content;
  max-width: 80%;
  height: fit-content;
  margin-left: 1rem;

  div {
    flex-wrap: wrap;
  }
`

export const ContainerProjectDescription = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  padding-left: 5rem;

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
  display: flex;
  width: 90%;
  margin-bottom: 4rem;
  margin-left: 1rem;
  align-items: center;
  justify-content: space-between;
`
