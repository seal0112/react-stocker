// import dayjs from 'dayjs'

// formatDataForGoogleChart is use to change data format for google chart
export const formatDataForGoogleChart = (data, keyOrder) => {
  const titles = typeof keyOrder[0] === 'object'
    ? keyOrder.map(key => key.title)
    : keyOrder
  const formatData = data.map(e => keyOrder.map(k => parseToFloat(k, e)))
  formatData.unshift(titles)
  return formatData
}

const parseToFloat = (key, data) => {
  if ('transferToFloat' in key && key.transferToFloat) {
    return parseFloat(data[key.title])
  }
  return data[key.title]
}

export const getToken = () =>
  localStorage.getItem('access')

// export const verifyJWTExpireTime = () => {
//   const accessToken = getToken()
//   if (!accessToken) {
//     return false
//   }
//   const decoded = JSON.parse(atob(accessToken.split('.')[1]))
//   const currentTime = dayjs().add(10, 'minute').unix()
//   return decoded.exp > currentTime
// }

// debounce is use to delay the function call
export const debounce = (func, delayTime = 500) => {
  let timer
  return function (...args) {
    const context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      func.apply(context, args)
    }, delayTime)
  }
}
