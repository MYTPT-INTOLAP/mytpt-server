// const passValidation = require('./passwordValidation')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require('moment')

/** 
 * @param {string} value: bodyData validation function.
 */

const isValid = (value) => {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValids = (value) => {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "number") return true;
};

const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};

// All input data validation

/**
 * @param {string} value: bodyData
 */

const isValidRequest = (value) => {
    // if body empty
    if (!isValidRequestBody(value)) {
        return "Data is required";
    }
}


/**
 * @param {string} value: titleValue
 */

const isValidTitle = (value) => {
    if (!isValid(value)) {
        return ` Title is required and should be valid format like: Mr/Mrs/Miss`;
    }

    if (!["Mr", "Mrs", "Miss"].includes(value.trim())) {
        return ` Title must be provided from these values: Mr/Mrs/Miss`;
    }

}


/**
 * @param {string} value: nameValue
 */

const isValidFName = (value) => {

    if (!isValid(value)) {
        return `Please fill in all required field.`;
    }

    let regex = /^[a-zA-Z0-9() ]*$/

    if (!regex.test(value)) {
        return `Please ${value} should be in valid format`;
    }
}



/**
 * @param {string} value: nameValue
 */

const isValidName = (value) => {

    if (!isValid(value)) {
        return `Data is required`;
    }

    let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/

    if (!regex.test(value)) {
        return ` Please ${value} should be in valid format`;
    }
}

/**
 * @param {string} value: phoneValue
 */


const isValidPhone = (value) => {
    if (!isValid(value)) {
        return "Please fill in all required field.";
    }

    const regexForMobile = /^((0091)|(\+91)|0?)[6789]{1}\d{9}$/;
    if (!regexForMobile.test(value)) {
        return "Mobile should be of 10 digits.";
    }

}

/**
 * @param {string} value: emailValue
 */


const isValidEmail = (value) => {
    if (!isValid(value)) {
        return "Please fill in all required field.";
    }
    const regexForEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (!regexForEmail.test(value)) {
        return `${value} should be in valid format`;
    }
}

/**
 * @param {string} value: passwordValue
 */

const isValidpass = (value) => {
    if (!isValid(value)) {
        return "Please fill in password required field.";
    }
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
        return "Password must not contain Whitespaces.";
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
        return "Password must have at least one Uppercase Character.";
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
        return "Password must have at least one Lowercase Character.";
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
        return "Password must contain at least one Digit.";
    }

    const isContainsSymbol =
        /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
        return "Password must contain at least one Special Symbol.";
    }

    const isValidLength = /^.{8,15}$/;
    if (!isValidLength.test(value)) {
        return "Password must be 8-15 Characters Long.";
    }
}

/**
 * @param {string} value: addressValue
 */


const isValidAddress = (value) => {

    if (!isValidRequestBody(value)) {
        return "Please fill in address required field.";
    }

    if (typeof value.street != "string") {
        return "Street is name ";
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value.street)) {
        return "Invalid street name.";
    }

    if (!isValid(value.city)) {
        return "Please fill in city required fields.";
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value.city)) {
        return "City should be a letter.";
    }

    if (! /^\+?([1-9]{1})\)?([0-9]{5})$/.test(value.pincode)) {
        return "Invalid pin"
    }
}


/**
 * @param {string} value: titleValue & Excerpt
 */

const isValidNameData = (value) => {
    if (!isValid(value)) {
        return `Data is required and should be string.`;
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value)) {
        return `${value} should be a letter.`;
    }
}


/**
 * @param {string} value: emailValue
 */


const isValidISBNData = (value) => {
    if (!isValid(value)) {
        return "Please fill in ICBN required field.";
    }
    if (!value.trim().length > 0) {
        return "Please fill in ICBN required field.";
    }
    const regex = /^(?:ISBN(?:-1[03])?:?\ *((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX]))$/i
    if (!regex.test(value)) {
        return "Please ISBN number should be in valid format (like:- ISBN 1561616161)";
    }
}


/**
 * @param {string} value: Valid Rating
 */

const isValidRating = (value) => {
    if (!isValids(value)) {
        return "Please fill in rating required fields.";
    }

    if (value < 1 || 5 < value) {
        return "Rating must be between 1 and 5"
    }
}

/**
 * @param {string} value: passwordValue
 */

const isValidReleasedAt = (value) => {
    if (!isValid(value)) {
        return "Please fill in all required fields.";
    }
    let date = moment(value, 'YYYY-MM-DD', true).isValid()
    if (!date) {
        return "Please enter valid date";
    }
}


/**
 * @param {string} value: ArrayString
 */

const isValidArrString = (value) => {
    value.map(e => {
        const eMessage = isValidFName(e)
        if (eMessage) return eMessage;
    })
}

/**
 * @param {string} value: tasksValue
 */

const isValidTask = (value) => {
    value.map(e => {
        const massage = isValidName(e)
        if (massage) return massage
    })

}


/**
 * @param {string} value: rolesValue
 */

const isValidRole = (value) => {
    value.map(e => {
        const massage = isValidObjectId(e.owner)
        if (massage) return massage
    })

}


const isValidDomain = (data) => {
    data.map(e => {
        const massageDomain = isValidName(e.domain)
        if (massageDomain) return massageDomain

        const massage = isValidObjectId(e.owner)
        if (massage) return massage
    })
}


const isValidAdministration = (data) => {
    data.map(e => {
        const massageDomain = isValidName(e.statusReport)
        if (massageDomain) return massageDomain

        if (e.owner) {
            const massage = isValidObjectId(e.owner)
            if (massage) return massage
        }

    })
}



const isValiddurationType = (data) => {
    let enums = ["Minutes", "Hours", "As_needed"]
    let inc = enums.includes(data)
    if (!inc) {
        return 'Invalid input'
    }
}


const isValidrecurrenceType = (data) => {
    let enums = ["Day(s)", "Week(s)", "Month(s)", "Year(s)", "As_needed"]
    let inc = enums.includes(data)
    if (!inc) {
        return 'Invalid input'
    }
}



const isValidOwners = (data) => {
    if (data.type) {
        const massageDomain = isValidObjectId(data.type)
        if (massageDomain) return massageDomain
    }

    if (data.owner) {
        const massage = isValidObjectId(data.owner)
        if (massage) return massage
    }

    if (!data.type || !data.owner) {
        return 'Invalid input'
    }
}




/**
 * @param {string} value: objectId
 */

const isValidObjectId = (value) => {
    let regex = /^[0-9a-fA-F]{24}$/
    if (!regex.test(value)) {
        return `${value} is not valid`;
    }
}



const isValidOwnerType = (data) => {
    let arr = ['Single owner', 'Multiple owners']
    let inc = arr.includes(data)
    if (!inc) {
        return 'Input valid enum.'
    }
}


const isValideTags = (data) => {
    let { tags, userId } = data

    if (userId) {
        const userIdMessage = isValidObjectId(userId)
        if (userIdMessage) return userIdMessage;
    }
    console.log(data)
    if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            const tagsMessage = isValidFName(tags[i])
            if (tagsMessage) return tagsMessage;
        }
    }
}


module.exports = {
    isValidRequest, isValidFName, isValidTitle, isValidName, isValidPhone, isValidEmail, isValidpass, isValidAddress,
    isValidNameData, isValidISBNData, isValidRating, isValidReleasedAt, isValidArrString, isValidTask, isValidRole,
    isValidDomain, isValidAdministration, isValiddurationType, isValidrecurrenceType, isValidOwners, isValidObjectId,
    isValideTags, isValidOwnerType
}