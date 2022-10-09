import styled from 'vue-styled-components'

import { colors } from '../../theme'

const containerProjectInformationsProps = {
  gridColumn: String,
}

export const PageContainer = styled.div`
  width: 100%;
  min-width: 100vw;
  min-height: 100vh;
  height: fit-content;
  opacity: 0;
`

export const MainContainer = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  z-index: 0;
  position: relative;
`

export const Background = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: ${colors.black};
  top: 0;
  left: 0;
  z-index: -1;
  bottom: 0;
  right: 0;
`

export const ContainerImageIntroWebsite = styled.div`
  width: 100vw;
  height: 100vh;
  opacity: 0;
`

export const ImageIntroWebsite = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const ContainerImage = styled.div`
  width: 100%;
  height: auto;
`

export const ImageElement = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  opacity: 0;
  margin-bottom: 6rem;
`

export const ContainerImageWebsite = styled.div`
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
  margin: 3rem 2rem 0 0;
`

export const ContainerProjectInformationsContent = styled.div`
  width: 100%;
  height: fit-content;
  margin-bottom: 10rem;
`

export const ContainerProjectInformationsSection = styled.div`
  width: 100%;
  height: auto;
  padding: 4rem 20rem;
`

export const ContainerProjectInformations = styled(
  'div',
  containerProjectInformationsProps
)`
  width: 100%;
  height: fit-content;
  margin-bottom: 2rem;
  grid-column: ${(props) => props.gridColumn};
`

export const ProjectTitle = styled.h2`
  width: fit-content;
  height: fit-content;
`

export const ContainerProjectDescription = styled.div`
  display: grid;
  grid-template-columns: 20% 20% 20% 40%;
  grid-template-rows: auto;
  grid-gap: 2rem;
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

export const Informations = styled.p`
  width: 100%;
`

export const ContainerProjectInformationsIntroduction = styled.div`
  width: 100%;
  margin-bottom: 4rem;
`
