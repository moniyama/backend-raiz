
function deleteProps(obj, props) {
  for (const prop of props) {
    (delete obj[prop]);
  }
}

function rearrangeOrdersObject(array) {
  return array.map(obj => {
    deleteProps(obj.dataValues, ["User"])
    obj.dataValues.Products.forEach(product => {
      product.dataValues.qtd = product.dataValues.ProductsOrders.dataValues.qtd
      deleteProps(product.dataValues,
        ["ProductsOrders", "image", "type", "sub_type", "createdAt", "updatedAt", "price"]
      )
    })
    return obj
  })
}

function rebuildObj (arr) {
  return arr.map(obj => {
    delete obj.dataValues.password
    return obj
  })
}

module.exports = {
  rearrangeOrdersObject,
  rebuildObj
}
