module.exports =(sequelize,DataTypes) =>{

    const Products = sequelize.define('Products',{
        productID:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,allowNull:false ,unique:true },
        productName: { type:DataTypes.STRING,allowNull:false  },
        brand: { type:DataTypes.STRING,allowNull:false  },
        model: { type:DataTypes.STRING,allowNull:false },
        category: { type:DataTypes.STRING,allowNull:false  },
        price: { type: DataTypes.INTEGER,allowNull:false  },
        date: { type: DataTypes.STRING,allowNull:false  },
        color: { type: DataTypes.STRING,allowNull:false  },
        qty: { type: DataTypes.STRING,allowNull:false  }
    },
        {
            freezeTableName: true,
            timestamps: true
        })
        
        // Products.associate = function(models) {
        //     Products.belongsTo(models.orders, {foreignKey: 'orderItems', as: 'product'})
        //   };
      
    return Products;
}
