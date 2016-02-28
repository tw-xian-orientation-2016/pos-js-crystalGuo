function printReceipt(inputs) {
  var itemList = splitBarcode(inputs) ;
  var countedBarcode = mergeBarcode(itemList) ;
  var cartItems = createCartItems(countedBarcode) ;
  var promotionItems = createPromotionItems(cartItems) ;
  var receiptItems = createReceiptItems(promotionItems) ;
  var shoppingInfo = createShoppingInfo(receiptItems) ;
  console.log(shoppingInfo) ;
}

function splitBarcode(tags) {
  var itemList = [] ;
  tags.forEach(function(tag) {
      var barcodeArr = tag.split('-') ;
      var barcode = barcodeArr[0] ;
      var count = barcodeArr[1] ? parseFloat(barcodeArr[1]) : 1 ;
      itemList.push( { barcode: barcode,count: count} ) ;
    }) ;
    return itemList ;
  }

function mergeBarcode(itemList) {
  var countedBarcode = [] ;
  var index = 0 ;
  countedBarcode[0] = itemList[0] ;
  for ( var i = 1 ; i < itemList.length ; i++ ) {
    if(countedBarcode[index].barcode == itemList[i].barcode) {
      countedBarcode[index].count += itemList[i].count ;
    }
    else{
      index ++ ;
      countedBarcode[index] = itemList[i] ;
    }
  }
  return countedBarcode ;
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

function createReceiptItems(promotionItems) {
  var receiptItems = [];
  var totalPrice = 0.00;
  var savedPrice = 0.00;
  for(var i=0;i<promotionItems.length;i++) {
    totalPrice += promotionItems[i].totalPrice;
    savedPrice += promotionItems[i].savedPrice;
  }
  receiptItems = {promotionItem:promotionItems,finalPrice:totalPrice,finalSavedPrice:savedPrice};
  return receiptItems;
}

function createShoppingInfo(receiptItems) {
  var shoppingInfo = '***<没钱赚商店>收据***\n';
  var promotionItems = receiptItems.promotionItem;
  for(var i=0;i<promotionItems.length;i++) {
    var cartItem = promotionItems[i].cartItem;
    var item = cartItem.item;
    shoppingInfo +=
      ('名称：' + item.name + '，数量：' +
      cartItem.count + item.unit +
        '，单价：' + item.price.toFixed(2) + '(元)，小计：' +
        promotionItems[i].totalPrice.toFixed(2) + '(元)\n');
  }
  shoppingInfo += ('----------------------\n' +
    '总计：'+ receiptItems.finalPrice.toFixed(2) + '(元)\n' +
    '节省：'+ receiptItems.finalSavedPrice.toFixed(2) + '(元)\n' +
    '**********************');
  return shoppingInfo;
}
