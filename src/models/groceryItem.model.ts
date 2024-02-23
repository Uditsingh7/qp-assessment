import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize'; 

class GroceryItem extends Model { 
    public id!: number;
    public name!: string;
    public price!: number;
    public quantity!: number;
}

GroceryItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'grocery_items', 
        schema: 'grocery_booking_schema', 
        timestamps: true,
    }
);

export default GroceryItem;
