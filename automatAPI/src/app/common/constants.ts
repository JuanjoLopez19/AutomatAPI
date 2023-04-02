export const functionNamePythonRegex = new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$")

export const functionNameJSRegex = new RegExp("^[a-zA-Z_$][0-9a-zA-Z_$]*$")

export const endpointRegex = new RegExp("^[a-zA-Z_/][a-zA-Z0-9_]*$")

export const hostRegex = new RegExp("^(([0-9])|([1-9][0-9])|(1([0-9]{2}))|(2[0-4][0-9])|(25[0-5]))((\.(([0-9])|([1-9][0-9])|(1([0-9]{2}))|(2[0-4][0-9])|(25[0-5]))){3})$")
