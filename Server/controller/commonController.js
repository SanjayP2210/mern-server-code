import { v2 as cloudinary } from 'cloudinary';

const getAll = (Model, controllerName) => async (req, res, next,) => {
    try {
        const docs = await Model.find();
        console.log('Model', Model)
        res.status(200).send({ [controllerName]: docs });
    } catch (error) {
        res.status(500).send(error);
    }
}

const getOne = (Model, controllerName) => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }
        res.status(200).send({ [controllerName]: doc });
    } catch (error) {
        res.status(500).send(error);
    }
}

const postRequest = (Model, controllerName) => async (req, res, next) => {
    console.log('controllerName', controllerName)
    const model = new Model(req.body);
    model.createdAt = Date.now();
    model.createdBy = req?.user?._id?.toString();
    model.modifiedAt = Date.now();
    model.modifiedBy = req?.user?._id?.toString();
    const response = await model.save(req.body);

    try {
        res.json({
            message: `${controllerName} added successfully`, [controllerName]: response
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const patchRequest = (Model, controllerName) => async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = Object.keys(Model.schema.paths);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }

        updates.forEach((update) => doc[update] = req.body[update]);
        await doc.save();
        res.send(doc);
    } catch (error) {
        res.status(400).send(error);
    }
}

const putRequest = (Model, controllerName) => async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = Object.keys(Model.schema.paths);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }

        updates.forEach((update) => doc[update] = req.body[update]);
        await doc.save();
        res.send(doc);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteRequest = (Model, controllerName) => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).send();
        }
        res.send(doc);
    } catch (error) {
        res.status(500).send(error);
    }
}

const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: "users",
        // width: 150,
        // crop: 'scale',
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, {
            options,
            transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};

const deleteImage = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};


const handleImageUpload = async (req, res, image, public_id) => {
    try {
        if (!image.startsWith("https://res.cloudinary.com")) {
            if (public_id != null && public_id !== 'null') {
                await deleteImage(public_id);
            }

            const result = await uploadImage(image);
            if (result) {
                return {
                    public_id: result?.public_id,
                    url: result?.secure_url,
                };
            } else {
                return req?.file?.filename || image[0];
            }
        }
    } catch (error) {
        console.log("err while upload image in update user", error);
    }
}

export {
    postRequest,
    getAll,
    getOne,
    putRequest,
    patchRequest,
    deleteRequest,
    uploadImage,
    deleteImage,
    handleImageUpload
}