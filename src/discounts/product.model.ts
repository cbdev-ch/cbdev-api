import { model, Schema, Document } from 'mongoose';

export const ProductSchema =  new Schema({
    category: {type: String},
    categoryDisplayName: {type: String},
    storeName: {type: String},
    productName: {type: String},
    productType: {type: String},
    discountSearchString: {type: String},
    notAvailableSearchString: {type: String},
    isDiscount: {type: Boolean},
    isAvailable: {type: Boolean},
    url: {type: String},
    active: {type: Boolean},
    updatedAt: {type: Date, default: Date.now}

}, { collection: 'Product' });

export interface Product extends Document {
    id: string;
    category: string;
    categoryDisplayName: string;
    storeName: string;
    productName: string;
    productType: string;
    discountSearchString: string;
    notAvailableSearchString: string;
    isDiscount: boolean;
    isAvailable: boolean;
    url: string;
    active: boolean;
    updatedAt: Date;
}