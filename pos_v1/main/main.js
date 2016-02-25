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

function createPromotionItems(cartItems) {
  var promotions = loadPromotions();
  var promotionItems = [];
  for(var i=0;i<cartItems.length;i++) {
    var barcode = cartItems[i].item.barcode;
    if((barcode==promotions[0].barcodes[0]) || (barcode==promotions[0].barcodes[1]) || (barcode==promotions[0].barcodes[2])) {
      var promotionPrice = calculateBuyTwoGetOne(cartItems[i]);
      promotionItems[i] = {cartItem:cartItems[i],totalPrice:promotionPrice[0],savedPrice:promotionPrice[1]};
    }
    else {
      promotionItems[i] = {cartItem:cartItems[i],totalPrice:calculateNoBuyTwoGetOne(cartItems[i]),savedPrice:0.00};
    }
    // var barcodes = promotions[0].barcodes;
    // for(var j=0;j<(promotions[0].barcodes.length);j++) {
    //   if((barcode==promotions[0].barcodes[j])) {
    //     var promotionPrice = calculateBuyTwoGetOne(cartItems[i]);
    //     promotionItems[i] = {cartItem:cartItems[i],totalPrice:promotionPrice[0],savedPrice:promotionPrice[1]};
    //   }
    //   else {
    //     promotionItems[i] = {cartItem:cartItems[i],totalPrice:calculateNoBuyTwoGetOne(cartItems[i]),savedPrice:0.00};
    //   }
    // }
  }
  return promotionItems;
}

function calculateBuyTwoGetOne(cartItems) {
  var price = cartItems.item.price;
  var count = cartItems.count;
  var savedCount = Math.floor(count/3);
  var savedPrice = price*savedCount;
  var totalPrice = price*(count-savedCount);
  var promotinPrice = [totalPrice,savedPrice];
  return promotinPrice;
}

function calculateNoBuyTwoGetOne(cartItems) {
  var price = cartItems.item.price;
  var count = cartItems.count;
  var totalPrice = price*count;
  return totalPrice;
}
