const Category = require('../models/category');

const categories = [
    'Electronics',
    'Vehicle',
    'Clothes',
    'Furniture',
    'Real Estate',
    'Services'
]


const createCategories = () => {
    const addCategories = () => {
        categories.forEach((category) => {
            const newCategory = new Category({
                name: category
            })
            newCategory.save()
        })
    }
    // check if categories already exists
    Category.find({}).then((data) => {
        if (data.length === 0) {
            addCategories()
        }
    })

}

module.exports = createCategories