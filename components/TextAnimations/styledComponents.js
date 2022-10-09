import styled from 'vue-styled-components'

const defaultHeadingProps = {
  y: Number,
  font: String,
  fontSize: String,
  fontColor: String,
  fontWeight: Number,
  minWidth: String,
}

const defaultParagraphProps = {
  y: Number,
  font: String,
}

export const DefaultHeading = styled('div', defaultHeadingProps)`
  width: fit-content;
  height: fit-content;
  padding: 5px 0;
  font-family: ${(props) => props.font};
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.fontColor};
  font-weight: ${(props) => props.fontWeight};
  display: flex;

  div {
    width: fit-content;
    height: fit-content;
    padding: 5px 0;
    min-width: ${(props) => props.minWidth};
    overflow: hidden;

    span {
      display: inline-block;
      transform: ${(props) => `translateY(${props.y}%)`};
    }
  }
`

export const DefaultParagraph = styled('p', defaultParagraphProps)`
  width: 100%;
  height: 100%;
  font-family: ${(props) => props.font};
  line-height: 1.3rem;

  div {
    overflow: hidden;

    span {
      display: inline-block;
      transform: ${(props) => `translateY(${props.y}%)`};
    }
  }
`
