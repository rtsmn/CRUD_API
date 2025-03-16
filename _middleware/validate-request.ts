import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

export const validateRequest = (req: Request, next: NextFunction, schema: Schema): void => {
    const options: { abortEarly: boolean; allowUnknown: boolean; stripUnknown: boolean } = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map((x) => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
};