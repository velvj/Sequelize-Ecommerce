module.exports = (sequelize, DataTypes) => {

  const coupon = sequelize.define('coupon', {
    couponID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    offerName: { type: DataTypes.STRING },
    couponCode: { type: DataTypes.STRING, unique: true },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    type: { type: DataTypes.STRING },
    value: { type: DataTypes.INTEGER },
    couponStatus: { type: DataTypes.BOOLEAN, default: true }
  }, {
    freezeTableName: true,
    timestamps: true
  })
  return coupon;
}