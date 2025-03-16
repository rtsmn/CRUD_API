import { DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
    email: string;
    passwordHash: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

module.exports = (sequelize: any) => {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {} }
        }
    };
    
    return sequelize.define<Model<UserAttributes, UserCreationAttributes>>('User', attributes, options);
}