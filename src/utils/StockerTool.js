//formatDataForGoogleChart is use to change data format for google chart
export const formatDataForGoogleChart = (data, keyOrder) => {
    let title = keyOrder
    let formatData = data.map(e=>keyOrder.map(k=>e[k]))
    formatData.unshift(title)
    return formatData
}