import contactModel from "../models/contact-model.js";

const addContact = async (req, res, next) => {
    try {
        const body = req.body;
        body.createdAt = Date.now();
        body.createdBy = req?.user?._id?.toString();
        body.modifiedAt = Date.now();
        body.modifiedBy = req?.user?._id?.toString();
        const newContact = await contactModel.create(body);

        res.status(201).json({
            message: "Details saved successfully",
            contact: newContact,
        });
    } catch (error) {
        console.log('error creating contact', error);
    }
}

const getContact = async (req, res, next) => {
    try {
        const response = await contactModel.find();
        if (response) {
            res.json({ contacts: response })
        }
    } catch (error) {
        error.status = 404;
        return next(error);
    }
}

const deleteContact = async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await contactModel.deleteOne({ _id: id });
        res.json({ message: 'contact deleted successfully', data: response })
    } catch (err) {
        error.status = 404;
        return next(error);
    }
}

export { addContact, getContact, deleteContact }