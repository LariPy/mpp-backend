const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')

// @desc Get all items
// @route GET /items
const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find().lean()
    if (!items?.length) {
        return res.status(400).json({ message: 'No items found'})
    }
    res.json(items)
})

// @desc Create new item
// @route POST /items
const createNewItem = asyncHandler(async (req, res) => {
    const { itemname } = req.body

    // Confirm data
    if (!itemname) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate
    const duplicate = await Item.findOne({ itemname }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate itemname' })
    }

    // Create and store new item
    const item = await Item.create(itemObject)

    if (item) { //created
        res.status(201).json({ message: `New item ${itemname} created`})
    } else {
        res.status(400).json({ message: 'Invalid data received'})
    }
})


/*
question: where does the id come from in update?
might have to check this id stuff in update and delete
*/


// @desc Update item
// @route PATCH /items
const updateItem = asyncHandler(async (req, res) => {
    const { id, itemname } = req.body

    // Confirm data
    if (!id || !itemname) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const item = await Item.findById(id).exec()

    if (!item) {
        return res.status(400).json({ message: 'Item not found' })
    }

    // Check for duplicate
    const duplicate = await Item.findOne({ itemname }).lean().exec()
    // Allow updates to the original item
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate itemname'})
    }

    item.itemname = itemname
    item.roles = roles
    item.active = active

    const updatedItem = await item.save()

    res.json({ message: `${updatedItem.itemname} updated`})
})

// @desc Delete item
// @route DELETE /items
const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Item ID required' })
    }

    const item = await Item.findById(id).exec()

    if (!item) {
        return res.status(400).json({ message: 'Item not found' })
    }

    const result = await item.deleteOne()

    const reply = `Itemname ${result.itemname} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllItems,
    createNewItem,
    updateItem,
    deleteItem
}