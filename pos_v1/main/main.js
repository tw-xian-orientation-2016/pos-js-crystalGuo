function printReceipt(inputs) {
  var itemList = splitBarcode(inputs) ;
  var countedBarcode = mergeBarcode(itemList) ;
  var cartItems = createCartItems(countedBarcode) ;
  var promotionItems = createPromotionItems(cartItems) ;
  var receiptItems = createReceiptItems(promotionItems) ;
  var receipt = createReceipt(receiptItems) ;
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
  var countedBarcodes = [] ;
  var index = 0 ;
  countedBarcodes[0] = itemList[0] ;
  for ( var i = 1 ; i < itemList.length ; i++ ) {
    if( countedBarcodes[index].barcode === itemList[i].barcode ) {
      countedBarcodes[index].count += itemList[i].count ;
    }
    else{
      index ++ ;
      countedBarcodes[index] = itemList[i] ;
    }
  }
  return countedBarcodes ;
}

function createCartItems(countedBarcodes) {
  var cartItems = [] ;

   countedBarcodes.forEach( function(countedBarcode) {
     var item = getItem(countedBarcode) ;
     cartItems.push( {item:item , count:countedBarcode.count} ) ;
   } ) ;

   return cartItems ;
}

function getItem(countedBarcode) {
  var allItems = loadAllItems() ;

  for ( var i = 0 ; i < allItems.length ; i++ ) {
    if ( countedBarcode.barcode === allItems[i].barcode ) {
      return allItems[i] ;
    }
  }
}

function createPromotionItems(cartItems) {
  var promotionItems = [] ;

  cartItems.forEach( function(cartItem) {
   var type = getPromotionType(cartItem) ;
    if ( type === 'BUY_TWO_GET_ONE_FREE' ) {
      var savedPrice = Math.floor( cartItem.count/3 ) * cartItem.item.price ;
    } else {
      var savedPrice = 0.00 ;
    }
    var totalPrice = cartItem.count * cartItem.item.price - savedPrice ;

    promotionItems.push( { cartItem:cartItem , totalPrice:totalPrice , savedPrice:savedPrice } ) ;
  } ) ;

  return promotionItems ;
}

function getPromotionType(cartItem) {
  var promotions = loadPromotions();
  for ( var i = 0 ; i < promotions.length ; i++ ) {
    for ( var j = 0 ; j < promotions[i].barcodes.length ; j++ ) {
      if ( promotions[i].barcodes[j] === cartItem.barcode) {
        return promotions[i].type ;
      }
    }
  }
}


function createReceiptItems(promotionItems) {
  var receiptItems = [];
  var totalPrice = 0.00;
  var savedPrice = 0.00;
  for(var i=0;i<promotionItems.length;i++) {
    totalPrice += promotionItems[i].totalPrice;
    savedPrice += promotionItems[i].savedPrice;
  }
  receiptItems = { promotionItem:promotionItems , finalPrice:totalPrice , finalSavedPrice:savedPrice };
  return receiptItems ;
}

function createReceipt(receiptItems) {
  var receipt = '***<没钱赚商店>收据***\n' ;
  var promotionItems = receiptItems.promotionItem ;
  for( var i = 0 ; i < promotionItems.length ; i++ ) {
    var cartItem = promotionItems[i].cartItem ;
    var item = cartItem.item ;
    receipt +=
      ( '名称：' + item.name + '，数量：' + cartItem.count + item.unit +
        '，单价：' + item.price.toFixed(2) + '(元)，小计：' +
        promotionItems[i].totalPrice.toFixed(2) + '(元)\n' ) ;
  }
  shoppingInfo += ('----------------------\n' +
    '总计：'+ receiptItems.finalPrice.toFixed(2) + '(元)\n' +
    '节省：'+ receiptItems.finalSavedPrice.toFixed(2) + '(元)\n' +
    '**********************') ;
  return receipt ;
}
