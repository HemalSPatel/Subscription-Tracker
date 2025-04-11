import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required."],
      trim: true,
      minLegnth: 2,
      maxLegnth: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required."],
      min: [0, "The subscription price must be greater than 0."],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR"], //can add more options to this if you want or remove this entirely if you are going to assume that the person is going to use a single currency
      required: [true, "Currency type is required."],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
    },
    category: {
      type: String,
      enum: [
        "Sports",
        "News",
        "Entertainment",
        "Lifestyle",
        "Technology",
        "Finance",
        "Politics",
        "Education",
        "Other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Canceled", "Expired"],
      default: "Active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past.",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date.",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // this is going to reference the user model that was already created
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

subscriptionSchema.pre("save", function (next) {
  //Auto-calculate the renewal date based on the start date and the renewal period
  if (!this.renewalDate) {
    const renewalPeriods = {
      Daily: 1,
      Weekly: 7,
      Monthly: 30, //might want to change this as every month will not have the same number of days (simple approach this is fine for now)
      Yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency],
    );
  }

  //Auto-update the status of the renew date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
