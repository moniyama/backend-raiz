const error = (code, message) => {
  return {
    code, message
  }
}

const toMinutes = (time) => time * 1000 * 60;

module.exports = { error, toMinutes }