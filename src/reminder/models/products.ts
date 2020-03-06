import { model, Schema, Document } from "mongoose";

export default model('Product', new Schema({

    storeName: {type: String},
    productName: {type: String},
    productType: {type: String},
    discountSearchString: {type: String},
    notAvailableSearchString: {type: String},
    isDiscount: {type: Boolean},
    isAvailable: {type: Boolean},
    fileName: {type: String}

}));
