import styled from 'vue-styled-components'

import { colors, fonts } from '../theme'

const projectTypeProps = {
  top: String,
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
  width: 30%;
  text-align: center;
  position: absolute;
  top: 35%;
  left: 25%;
  transform: translate(-50%, -50%);

  div {
    flex-wrap: wrap;
  }
`

export const ProjectType = styled('span', projectTypeProps)`
  display: block;
  font-family: ${fonts.bodyFont};
  font-size: 1.5rem;
  color: ${colors.white};
  position: absolute;
  top: ${(props) => props.top};
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
  top: 78%;
  left: 75%;
  transform: translate(-50%, -50%);
  align-items: center;
`

export const Pagination = styled.span`
  display: block;
  font-family: ${fonts.bodyFont};
  font-size: 1rem;
  color: ${colors.white};
  overflow: hidden;
  width: fit-content;
  height: fit-content;

  div {
    div {
      padding: 0 !important;
    }
  }
`

export const AboutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`

export const AboutContainerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
  width: 60%;
  height: fit-content;
`

export const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const AboutTitle = styled.h2`
  margin-right: 5rem;
`

export const ContainerAboutSection = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 1rem 0;
`

export const ContainerAboutText = styled.p`
  margin: 1rem 0;
`

export const AboutSpan = styled.span`
  font-family: ${fonts.bodyFont};
  font-size: 1rem;
  color: ${colors.white};
  display: block;

  div {
    div {
      padding: 0 !important;
    }
  }
`

export const AboutSubtitle = styled.h3`
  height: fit-content;

  div {
    div {
      padding: 0 !important;
    }
  }
`
