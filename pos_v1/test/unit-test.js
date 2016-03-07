describe('pos', function() {
  var allItems;
  var inputs;

  beforeEach(function() {
    allItems = loadAllItems();
    inputs = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
  });

  it('should split and merge barcode', function() {
    var result = [{ barcode: 'ITEM000001', count: 5 },{ barcode: 'ITEM000003', count: 2 },{ barcode: 'ITEM000005', count: 3 }];
    var itemList = splitBarcode(inputs);
    var countedBarcode = mergeBarcode(itemList);
    expect(result).toEqual(countedBarcode);
  });

  it('should create cartItems', function() {
    var result = [{item:allItems[1],count:5},{item:allItems[3],count:2},{item:allItems[5],count:3}];
    var itemList = splitBarcode(inputs);
    var countedBarcode = mergeBarcode(itemList);
    var cartItems = createCartItems(countedBarcode);
    expect(result).toEqual(cartItems);
  });

  it('should create itemList that contains promotion', function() {
    var itemList = splitBarcode(inputs);
    var countedBarcode = mergeBarcode(itemList);
    var cartItems = createCartItems(countedBarcode);
    var promotionItems = createPromotionItems(cartItems);
    var result = [{cartItem:cartItems[0],totalPrice:12.00,savedPrice:3.00},
                  {cartItem:cartItems[1],totalPrice:30.00,savedPrice:0.00},
                  {cartItem:cartItems[2],totalPrice:9.00,savedPrice:4.50}];
    expect(result).toEqual(promotionItems);
  });

  it('should create receiptItems', function() {
    var itemList = splitBarcode(inputs);
    var countedBarcode = mergeBarcode(itemList);
    var cartItems = createCartItems(countedBarcode);
    var promotionItems = createPromotionItems(cartItems);
    var receiptItems = createReceiptItems(promotionItems);
    var result = {promotionItem:promotionItems,finalPrice:51.00,finalSavedPrice:7.50};
    expect(result).toEqual(receiptItems);
  });
});
