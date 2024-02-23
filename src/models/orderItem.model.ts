import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize'; 

class OrderItem extends Model {
    public id!: number;
    public orderId!: number;
    public itemId!: number;
    public quantity!: number;
    public price!: number;
    public totalPrice!: number;
}

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Order',
                key: 'id'
            }
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'GroceryItem',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1 
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
    },
    {
        sequelize,
        tableName: 'order_item',
        schema: 'grocery_booking_schema',
        timestamps: true,
        modelName: 'OrderItem', 
        underscored: true, // Use underscores instead of camelCase for automatically added attributes
    }
);

export default OrderItem;
