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

  it('should count barcode', function() {
    var result = [{ barcode: 'ITEM000001', count: 5 },{ barcode: 'ITEM000003', count: 2 },{ barcode: 'ITEM000005', count: 3 }];
    var itemList = splitBarcode(inputs);
    var countedBarcode = mergeBarcode(itemList);
    expect(result).toEqual(countedBarcode);
  });
});
