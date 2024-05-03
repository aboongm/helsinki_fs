// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   name: String,
//   password: String,
//   blogs: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Blog",
//     },
//   ],
// });

// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (!user.isModified("passwordHash")) {
//     return next();
//   }
//   const saltRounds = 10;
//   user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
//   next();
// });

// userSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//     delete returnedObject.password;
//   },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;


const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User