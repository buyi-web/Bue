
export function generateCode(envAttr){
  let code = ""
  for (const key in envAttr) {
    code += "let " + key + "=" + JSON.stringify(envAttr[key])+";"
  }
  return code
}
export function expressionIsTrue(expression, env){
  let bool = false
  let code = env
  code += "if(" + expression + "){bool = true;}";
  eval(code)
  return bool
}

