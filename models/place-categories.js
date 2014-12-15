module.exports = function (PlaceCategories) {
	PlaceCategories.get = function (cb) {
		var self = this;
		self.find(cb);
		// this.dataSource.connector.db.collection('placeCategories').insert([{
		// 	x: "1",
		// }, {
		// 	x: "2"
		// }])
	}

	PlaceCategories.getSubCategory = function (categoryId, parentCategoryIds, cb) {
		this.find(cb);
	}
};