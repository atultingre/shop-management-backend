// this middleware validates the data our requirement are matching or not
const validate = (schema) => async (req, res, next) => {
  try {
    // getting the user data and parse that data with zod matching out requirement or not
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
  } catch (err) {
    // if data does not matched the requirements then message will display the error we destructure that data
    // const message = err.errors[0].message;
    // console.log(message);
    // res.status(400).json({ message: message });

    const status = 422;
    const message = "Fill the input properly";
    const extraDetails = err.issues.map((curElem) => curElem.message);

    const error = {
      status,
      message,
      extraDetails,
    };

    next(error);
  }
};

module.exports = validate;
