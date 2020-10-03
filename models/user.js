/* User model */
'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: /^\w{2,}$/
  },
	password: {
		type: String,
		required: true,
	},
  name: {
    first: {
      type: String,
      required: true,
      validator: /^[a-zA-Z-]{2,}$/  // does not work
    },
    last: {
      type: String,
      required: true,
      validator: /^[a-zA-Z-]{2,}$/  // does not work
    }
  },
  email: {
    type: String,
    minlength: 1,
    trim: true,
    unique: true,
    validate: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  address: {
    streetAddress: String,
    city: String,
    province: String,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    }
  },
  phoneNumber: {
    type: String,
    validate: /^([ ()+-]?[\w][ ()+-]?){10,12}$/
  },
  accessLevel: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  avatar: {
    type: String,
    default: "placeholder.png"
  },
  points: {
    type: Number,
    default: 0
  },
  bookmarked: [mongoose.ObjectId],
  chatRooms: [mongoose.ObjectId],
  achievements: {
    type: [Number],
    default: [0]
  }
});

// UserSchema.virtual('fullName').get(() => this.name.first + ' ' + this.name.last);
UserSchema.plugin(uniqueValidator);

// Middleware before saving user
UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	if (user.isModified("password")) { // ensure password is hashed only once
		// Salt and hash
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
})

// Static method for logging in a user
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this; // binds this to the User model

	return User.findOne({ username })  // find user by username and get only the password and id
    .then(user => {
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    })
}

const User = mongoose.model('User', UserSchema);
module.exports = { User };
