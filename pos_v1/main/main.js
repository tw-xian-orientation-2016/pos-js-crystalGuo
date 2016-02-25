function splitBarcode(inputs) {
  var itemList = [];
  var barcodeInfo;
  var number;
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].length>10) {
      barcodeInfo = inputs[i].substring(0,10);
      number = parseInt(inputs[i].substring(11));
    }
    else {
      barcodeInfo = inputs[i];
      number = 1;
    }
    var item = {barcode:barcodeInfo,count:number};
    itemList.push(item);
  }
  return itemList;
}

function mergeBarcode(itemList) {
  var countedBarcode = [];
  var index = 0;
  countedBarcode[0] = itemList[0];
  for (var i=1;i<itemList.length;i++) {
    if(countedBarcode[index].barcode==itemList[i].barcode) {
      countedBarcode[index].count += itemList[i].count;
    }
    else{
      index ++;
      countedBarcode[index] = itemList[i];
    }
  }
  return countedBarcode;
}

function createCartItems(countedBarcode) {
  var allItems = loadAllItems();
  var cartItems = [];
  var index = 0;
  for(var i=0;i<allItems.length;i++) {
    if(allItems[i].barcode == countedBarcode[index].barcode) {
      cartItems[index] = {item:allItems[i],count:countedBarcode[index].count};
      index ++;
    }
  }
  return cartItems;
}
