/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  AfterSelector: 2,
  InsideSelector: 3,
  AfterPropertyName: 4,
  AfterPropertyNameAfterColon: 5,
  AfterPropertyValue: 6,
  InsideBlockComment: 7,
  InsidePseudoSelector: 8,
  InsideAttributeSelector: 9,
  AfterQuery: 10,
  InsideRound: 11,
  AfterQueryWithRules: 12,
  InsideLineComment: 5,
}

/**
 * @enum number
 */
export const TokenType = {
  None: 0,
  Text: 1,
  VariableName: 2,
  Keyword: 3,
  Whitespace: 4,
  Comment: 885,
  String: 886,
}

export const TokenMap = {
  [TokenType.Text]: 'Text',
  [TokenType.VariableName]: 'VariableName',
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.Comment]: 'Comment',
  [TokenType.String]: 'String',
}

export const initialLineState = {
  state: 1,
  tokens: [],
}

const RE_WHITESPACE = /^ +/
const RE_ANYTHING = /^.*/
const RE_KEYWORD =
  /^(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)\b/
const RE_LINE_COMMENT_START = /^#/

export const hasArrayReturnValue = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_KEYWORD))) {
          token = TokenType.Keyword
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT_START))) {
          token = TokenType.Comment
          state = State.InsideLineComment
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      case State.InsideLineComment:
        if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      default:
        console.log({ state, line })
        throw new Error('no')
    }
    index += next[0].length
    tokens.push({
      type: token,
      length: next[0].length,
    })
  }
  if (state === State.InsideLineComment) {
    state = State.TopLevelContent
  }
  return {
    state,
    tokens,
  }
}

tokenizeLine(`RUN bash -c "echo hello world"`, initialLineState) //?
