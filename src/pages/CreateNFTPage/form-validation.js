import React from "react";
import { Validators } from "@lemoncode/fonk";
import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import { rangeNumber } from "@lemoncode/fonk-range-number-validator";

const validationSchema = {
  field: {
    price: [Validators.required.validator],
    name: [Validators.required.validator],
    description: [Validators.required.validator],
    royaltyFee: [
      Validators.required.validator,
      {
        validator: rangeNumber.validator,
        customArgs: {
          min: {
            value: 1,
            inclusive: true,
          },
          max: {
            value: 50,
            inclusive: true,
          },
        },
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
