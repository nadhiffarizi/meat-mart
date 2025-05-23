const { v4: uuidv4 } = require('uuid');
export function uuid(length = 10) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += uuidv4().replace(/-/g, '');
  }
  return result;
}
