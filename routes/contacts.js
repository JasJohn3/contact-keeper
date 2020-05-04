const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/user");
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
  "/",
  [auth, [check("name", "Name is required!").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //pull our variables from the request.body using a destructuring method
    const { name, email, phone, type } = req.body;
    //Try Catch for error handling
    try {
      //Generate a new contact from the Contact.js Model
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      //Create a variable that stores our New Contact using the Save Method
      const contact = await newContact.save();
      //post the result to our Server.
      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put("/:id", (req, res) => {
  res.send("Update contact");
});

// @route   DELETE api/contacts/:id
// @desc    DELETE contact
//@access   Private
router.delete("/:id", (req, res) => {
  res.send("DELETE contact");
});

module.exports = router;
