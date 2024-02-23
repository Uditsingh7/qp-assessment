import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';


class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public role!: 'Admin' | 'User';
    public createdAt!: Date;
    public updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('Admin', 'User'),
            allowNull: false,
            validate: {
                isIn: [['Admin', 'User']],
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps: true, // Enable timestamps
        underscored: true, // Use underscores instead of camelCase for automatically added attributes
    }
);

export default User;
