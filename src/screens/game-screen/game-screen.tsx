import React from "react"
import './game-screen.scss'
import { HexRow, ClickCheckResponse } from "../../hexagon/hexagon"

interface GameScreenState {
  rowNumberArrays: number[][]
  currentLevel: number
  lastAnswer: number
  allCorrect: boolean
  startingOdd: boolean
  flashContent: boolean
  flashTimeout: ReturnType<typeof setTimeout> | undefined
  remakeRowsTimeout: ReturnType<typeof setTimeout> | undefined
}

export default class GameScreen extends React.Component<{}, GameScreenState> {
  minLevel = 1
  maxLevel = 8
  maxRows = 3
  progressPerLevel = 0.5

  constructor(props: {}) {
    super(props)

    this.state = {
      rowNumberArrays: [],
      currentLevel: this.minLevel,
      lastAnswer: -1,
      allCorrect: false,
      startingOdd: true,
      flashContent: true,
      flashTimeout: undefined,
      remakeRowsTimeout: undefined
    }
  }

  componentDidMount() {
    this.remakeRows()
    document.body.addEventListener('keydown', this.debugControls.bind(this))
  }

  debugControls = (e:KeyboardEvent) => {
    e.preventDefault()
    
    if(e.code === 'KeyA') {
      e.preventDefault()
      
      this.setState(prevState => ({currentLevel: Math.max(this.minLevel, prevState.currentLevel - 1)}))
      this.remakeRows();
    } else if(e.code === 'KeyD') {
      e.preventDefault()
      
      this.setState(prevState => ({currentLevel: Math.min(this.maxLevel, prevState.currentLevel + 1)}))
      this.remakeRows();
    }
  }
  
  remakeRows = () => {
    const availableNumbers = Array.from(Array(Math.floor(this.state.currentLevel + 1)).keys())

    for(let i = availableNumbers.length; i > 0; i--) {
      const j = Math.floor(Math.random() * (i))
      const k = availableNumbers[i - 1]

      availableNumbers[i - 1] = availableNumbers[j]
      availableNumbers[j] = k
    }

    const rowNumberArrays : number[][] = Array.from({length: this.maxRows}, () => [])
    let insertChance = 1
    let index = 0

    availableNumbers.forEach( n => {
      let randomNum = Math.random()
      
      index = randomNum < insertChance ? index : (index + 1) % this.maxRows
      insertChance = randomNum < insertChance ? insertChance * 0.5 : 1
        
      rowNumberArrays[index].push(n)
    })

    if (this.state.flashTimeout) clearTimeout(this.state.flashTimeout)
    if (this.state.remakeRowsTimeout) clearTimeout(this.state.remakeRowsTimeout)

    this.setState({
      rowNumberArrays,
      startingOdd: Math.random() < 0.5,
      lastAnswer: -1,
      allCorrect: false,
      flashContent: true,
      flashTimeout: setTimeout(() => this.setState({flashContent: false, flashTimeout: undefined}), 500 + this.state.currentLevel * 100),
      remakeRowsTimeout: undefined
    })
  }

  clickCheck = (content?: number) => {
    console.log(content)
    if (content === undefined || content <= this.state.lastAnswer || this.state.remakeRowsTimeout || this.state.flashTimeout)
      return ClickCheckResponse.Null

    if (content === (this.state.lastAnswer + 1)) {
      console.log(content, this.state.currentLevel)
      if (content === Math.floor(this.state.currentLevel)) {
        console.log('complete!')
        this.setState(prevState => ({
          allCorrect: true,
          currentLevel: prevState.currentLevel + this.progressPerLevel,
          remakeRowsTimeout: setTimeout(this.remakeRows, 2000)
        }))
      } else {
        console.log('next!')
        this.setState({lastAnswer: content})
      }

      return ClickCheckResponse.Correct
    } else {
      console.log('failure!')
      this.setState({
        currentLevel: this.minLevel,
        remakeRowsTimeout: setTimeout(this.remakeRows, 2000)
      })
      
      return ClickCheckResponse.Incorrect
    }
  }

  render() {
    return (
      <div id="outer-container">
        {
          this.state.rowNumberArrays.map((rowNumbers, i) => (
            <HexRow numbers={rowNumbers} oddRow={this.state.startingOdd === !!(i % 2)} flashContent={this.state.flashContent} clickCheck={this.clickCheck} allCorrect={this.state.allCorrect} key={i}/>
          ))
        }
      </div>
    )
  }
}