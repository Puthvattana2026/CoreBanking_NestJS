import { Currency } from "../enums/Currency";

export class TransferRequest {
  fromAccount: number;
  currencyType: Currency;
  fromCurrency?: Currency;
  amount: number;
  toCurrency?: Currency;
  toAccount: number;
}
