import styled from 'vue-styled-components'

import { fonts, colors } from '../theme'

export const ContainerNextProject = styled.div`
  width: 100%;
  min-width: 100vw;
  height: 200px;
  position: relative;
`

export const ContainerText = styled.span`
  font-size: 5rem;
  font-family: ${fonts.titleFont};
  text-transform: uppercase;
  text-align: center;
  color: ${colors.white};
  display: block;
  width: fit-content;
  height: fit-content;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`
