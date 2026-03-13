const Subscription = require('../models/Subscription');

exports.createSubscription = async (req, res) => {
  try {

    // Safely access files
    const idFile = req.files?.idFile ? req.files.idFile[0].path : null;
    const passportPhoto = req.files?.passportPhoto ? req.files.passportPhoto[0].path : null;
    const receiptFile = req.files?.receiptFile ? req.files.receiptFile[0].path : null;

    let personalInfo = {}, nextOfKin = {}, identification = {}, subscriptionDetails = {}, payment = {};
    
    try {
      personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : {};
      nextOfKin = req.body.nextOfKin ? JSON.parse(req.body.nextOfKin) : {};
      identification = req.body.identification ? JSON.parse(req.body.identification) : {};
      subscriptionDetails = req.body.subscriptionDetails ? JSON.parse(req.body.subscriptionDetails) : {};
      payment = req.body.payment ? JSON.parse(req.body.payment) : {};
    } catch (parseError) {
      return res.status(400).json({
        message: "Invalid JSON format in form fields",
        error: parseError.message
      });
    }

    console.log("personalInfo", personalInfo);
    console.log("nextOfKin", nextOfKin);
    console.log("identification", identification);
    console.log("subscriptionDetails", subscriptionDetails);
    console.log("payment", payment);

    const subscriptionData = {
      personalInfo: {
        ...personalInfo,
      },
      nextOfKin,
      identification: {
        ...identification,
        idFile,
        passportPhoto
      },
      subscriptionDetails,
      payment: {
        ...payment,
        receiptFile
      }
    };

    const newSubscription = new Subscription(subscriptionData);

    const savedSubscription = await newSubscription.save();

    return res.status(201).json({
      message: "Subscription created successfully",
      data: savedSubscription
    });

  } catch (error) {

    console.error(error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages
      });
    }

    return res.status(500).json({
      message: "Error creating subscription",
      error: "Internal server error"
    });

  }
};