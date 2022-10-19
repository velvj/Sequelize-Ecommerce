module.exports = (sequelize, DataTypes) => {

    const orders = sequelize.define('orders', {
        customerID:{type:DataTypes.INTEGER},
       productID: { type: DataTypes.JSON },
        shippingAddress:{
            type: DataTypes.JSON
        }
        ,
        totalAmount: { type: DataTypes.INTEGER },
        created: { type: DataTypes.STRING },
        couponID: { type: DataTypes.INTEGER }
    }, {
        freezeTableName: true,
        timestamps: true
    });
    // orders.associate = function(models) {
    //     orders.hasOne(models.user, {as: 'customer'}),
    //     orders.hasOne(models.Products, {as: 'product'})

    //   };
    // orders.associate = function (models) {
	// 	orders.hasOne(models.Products, {
	// 		foreignKey: 'productID',
	// 		as: 'product'
	// 	});
	// };

    orders.associate = function (models) {

        orders.hasMany(models.Products, {
            foreignKey: 'productID',
            sourceKey:'productID',
            as: 'linkDetails'
        }),
        orders.hasMany(models.user, {
            foreignKey: 'customerID',
            sourceKey:'customerID',
            as: 'customer'
        })
        ,
        orders.hasMany(models.coupon, {
            foreignKey: 'couponID',
            sourceKey:'couponID',
            as: 'coupons'
        })
	};

    return orders;
}
