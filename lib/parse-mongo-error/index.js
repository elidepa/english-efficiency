module.exports = {
  parseErrorCode: (errMsg) => {
    const pattern = /E\d*/
    const code = errMsg.match(pattern)[0]

    return code
  }
}