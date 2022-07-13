import React from "react";
import { Validators } from "@lemoncode/fonk";
import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import { rangeNumber } from "@lemoncode/fonk-range-number-validator";

const validationSchema = {
  field: {
    collectionName: [Validators.required.validator],
    symbol: [Validators.required.validator],
    intro: [Validators.required.validator],
    description: [Validators.required.validator],
    tokenLimit: [
      Validators.required.validator,
      {
        validator: rangeNumber.validator,
        customArgs: {
          min: {
            value: 1,
            inclusive: true,
          },
          max: {
            value: 10,
            inclusive: true,
          },
        },
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
