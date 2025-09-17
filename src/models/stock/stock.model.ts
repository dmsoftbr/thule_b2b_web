export class StockModel {
  branchId: string;
  warehouseId: string;
  localizationCode: string;
  productId: string;
  batchCode: string;
  batchExpiresAt?: Date | null;
  totalQuantity: number;
  allocatedQuantityInOrders: number;
  allocatedQuantityInProduction: number;

  constructor(
    branchId: string,
    warehouseId: string,
    localizationCode: string,
    productId: string,
    batchCode: string,
    batchExpiresAt: Date | null | undefined,
    totalQuantity: number,
    allocatedQuantityInOrders: number,
    allocatedQuantityInProduction: number
  ) {
    this.branchId = branchId;
    this.warehouseId = warehouseId;
    this.localizationCode = localizationCode;
    this.productId = productId;
    this.batchCode = batchCode;
    this.batchExpiresAt = batchExpiresAt;
    this.totalQuantity = totalQuantity;
    this.allocatedQuantityInOrders = allocatedQuantityInOrders;
    this.allocatedQuantityInProduction = allocatedQuantityInProduction;
  }

  get AvailQuantity() {
    return (
      this.totalQuantity -
      this.allocatedQuantityInOrders -
      this.allocatedQuantityInProduction
    );
  }
}
