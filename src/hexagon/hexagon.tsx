import React from "react";
import './hexagon.scss';

export enum ClickCheckResponse {
  Correct,
  Incorrect,
  Null
}

interface HexRowProps {
  oddRow: boolean
  numbers: number[]
  allCorrect: boolean
  flashContent?: boolean
  clickCheck(content?: number): ClickCheckResponse
}

export class HexRow extends React.Component<HexRowProps> {
  clickCheck = (content?: number) => {
    if (this.props.allCorrect) return ClickCheckResponse.Correct

    if (this.props.clickCheck)
      return this.props.clickCheck(content)

    return ClickCheckResponse.Incorrect
  }

  render = () => {
    const requiresPadding = this.props.oddRow === !!(this.props.numbers.length % 2)

    return !!(this.props.numbers.length) && (
      <div className={`hex-row-container ${!(this.props.numbers[0] % 2) ? 'reverse-direction ' : ''} ${this.props.allCorrect ? 'all-correct ' : ''}`}>
        {requiresPadding && <Hexagon isPadding={true}/>}
        {this.props.numbers.map(v => <Hexagon content={v} flashContent={this.props.flashContent} key={v} clickCheck={this.clickCheck}/>)}
      </div>
    )
  }
}

interface HexagonProps {
  content?: number
  flashContent?: boolean
  isPadding?: boolean
  clickCheck?(content?: number): ClickCheckResponse
}

interface HexagonState {
  clicked: boolean
  wrong: boolean
}

export default class Hexagon extends React.Component<HexagonProps, HexagonState> {
  constructor(props: HexagonProps) {
    super(props)

    this.state = {clicked: false, wrong: false}
  }

  componentDidUpdate(prevProps: HexagonProps) {
    if (prevProps.flashContent !== this.props.flashContent)
      this.setState({clicked: false, wrong: false})
  }

  onClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (this.props.flashContent || this.state.wrong) return

    this.setState({clicked: true, wrong: !!(this.props.clickCheck && this.props.clickCheck(this.props.content) === ClickCheckResponse.Incorrect)})
  }

  // adapted from Marvin Tsu's work
  // https://codepen.io/mooyxu/pen/MpVZaG
  render = () => {
    return (
      <div className={`hex-container ${(this.props.isPadding ? 'padding-hex ':'') + (this.state.clicked ? 'clicked-hex ':'') + (this.state.wrong ? 'wrong-hex ':'')}`}>
        <div className="outer-hex">
          <div className="inner-hex">
            <div className="inner-hex" onClick={this.onClick}>
              <p id="content">{(this.props.flashContent || this.state.clicked) && this.props.content}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
